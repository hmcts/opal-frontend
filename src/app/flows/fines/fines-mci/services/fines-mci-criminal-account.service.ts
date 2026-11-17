import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';
import { inject, Injectable } from '@angular/core';
import { defer, EMPTY, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IFinesMciCriminalAccount } from '../interfaces/fines-mci-criminal-account.interface';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { FinesMciStore } from '../stores/fines-mci.store';

@Injectable({ providedIn: 'root' })
export class FinesMciCriminalAccountService {
  private readonly opalFines = inject(OpalFines);
  private readonly store = inject(FinesMciStore);
  private readonly globalStore = inject(GlobalStore);

  /** Resolves and loads a master without replacing the child until both detail requests succeed. */
  public loadMasterAccountDetails(child: IFinesMciCriminalAccount): Observable<IOpalFinesAccountDefendantAtAGlance> {
    if (child.defendant_account_id === null) return EMPTY;
    return this.opalFines.getDefendantAccountMaster(child.defendant_account_id).pipe(
      switchMap((response) => {
        const id = response?.defendant_account_id;
        if (
          id === null ||
          id === undefined ||
          String(id) === String(child.defendant_account_id) ||
          !/^\d+$/.test(String(id)) ||
          (typeof id === 'number' && !Number.isSafeInteger(id))
        ) {
          // HTTP 200 responses bypass the interceptor's error path; use the existing global banner pattern.
          this.globalStore.setBannerError({
            ...GLOBAL_ERROR_STATE,
            error: true,
            title: 'There was a problem',
            message: 'You can try again. If the problem persists, contact the service desk.',
          });
          throw new Error('Invalid master account response');
        }
        this.opalFines.clearCache('defendantAccountAtAGlanceCache$');
        return forkJoin({
          atAGlance: this.opalFines.getDefendantAccountAtAGlance(id),
          header: this.opalFines.getDefendantAccountHeadingData(id),
        }).pipe(
          switchMap(({ atAGlance, header }) => {
            if (this.store.selectedCriminalAccount() !== child) return EMPTY;
            const party = atAGlance.party_details;
            const person = party.individual_details;
            const company = party.organisation_details;
            this.store.setSelectedCriminalAccount({
              defendant_account_id: id,
              account_number: atAGlance.account_number,
              organisation_flag: party.organisation_flag,
              organisation: party.organisation_flag,
              organisation_name: company?.organisation_name ?? null,
              defendant_title: person?.title ?? null,
              defendant_firstnames: person?.forenames ?? null,
              defendant_surname: person?.surname ?? null,
              birth_date: person?.date_of_birth ?? null,
              national_insurance_number: person?.national_insurance_number ?? null,
              aliases: null,
              address_line_1: atAGlance.address?.address_line_1 ?? null,
              postcode: atAGlance.address?.postcode ?? null,
              business_unit_id: header.business_unit_summary.business_unit_id,
              business_unit_name: header.business_unit_summary.business_unit_name,
              prosecutor_case_reference: header.prosecutor_case_reference,
              last_enforcement_action:
                atAGlance.enforcement_status?.last_enforcement_action?.last_enforcement_action_id ?? null,
              account_balance: atAGlance.account_balance ?? header.payment_state_summary.account_balance,
              parent_guardian_surname: null,
              parent_guardian_firstnames: null,
              has_collection_order: header.collection_order,
            });
            this.store.setSelectedCriminalAccountAtAGlance(atAGlance);
            this.store.setSelectedCriminalAccountHeader(header);
            return of(atAGlance);
          }),
        );
      }),
    );
  }

  /**
   * On subscription, selects the account and fetches fresh at-a-glance and header data in parallel.
   * Stores both responses only if this account is still selected when both requests complete.
   *
   * @param account The search result selected for the next payment page.
   * @returns The at-a-glance response after both requests complete, or an empty observable for a null ID.
   * Request errors propagate to the caller.
   */
  public loadSelectedAccountDetails(
    account: IFinesMciCriminalAccount,
  ): Observable<IOpalFinesAccountDefendantAtAGlance> {
    return defer(() => {
      if (account.defendant_account_id === null) {
        return EMPTY;
      }

      this.store.setSelectedCriminalAccount(account);
      // The shared at-a-glance cache is not keyed by account ID.
      this.opalFines.clearCache('defendantAccountAtAGlanceCache$');
      return forkJoin({
        atAGlance: this.opalFines.getDefendantAccountAtAGlance(account.defendant_account_id),
        header: this.opalFines.getDefendantAccountHeadingData(account.defendant_account_id),
      }).pipe(
        map(({ atAGlance, header }) => {
          if (this.store.selectedCriminalAccount() === account) {
            this.store.setSelectedCriminalAccountAtAGlance(atAGlance);
            this.store.setSelectedCriminalAccountHeader(header);
          }
          return atAGlance;
        }),
      );
    });
  }
}
