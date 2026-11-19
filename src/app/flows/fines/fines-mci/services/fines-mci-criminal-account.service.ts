import { inject, Injectable } from '@angular/core';
import { defer, EMPTY, forkJoin, map, Observable } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IFinesMciCriminalAccount } from '../interfaces/fines-mci-criminal-account.interface';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { FinesMciStore } from '../stores/fines-mci.store';

@Injectable({ providedIn: 'root' })
export class FinesMciCriminalAccountService {
  private readonly opalFines = inject(OpalFines);
  private readonly store = inject(FinesMciStore);

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
