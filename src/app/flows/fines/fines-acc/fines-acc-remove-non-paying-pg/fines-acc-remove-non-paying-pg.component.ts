import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS } from '../fines-acc-defendant-details/constants/fines-acc-defendant-details-tabs-keys.constant';
import { type TFinesAccDefendantDetailsTabKey } from '../fines-acc-defendant-details/types/fines-acc-defendant-details-tab-key.type';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_REMOVE_NON_PAYING_PG_SUCCESS_MESSAGE } from './constants/fines-acc-remove-non-paying-pg-success-message.constant';

@Component({
  selector: 'app-fines-acc-remove-non-paying-pg',
  templateUrl: './fines-acc-remove-non-paying-pg.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GovukCancelLinkComponent, GovukHeadingWithCaptionComponent],
})
export class FinesAccRemoveNonPayingPgComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly opalFinesService = inject(OpalFines);

  public readonly pageTitle =
    this.route.snapshot.data['title'] ?? 'Are you sure you want to remove the parent or guardian details?';
  public readonly accountIdentifier = `${this.finesAccStore.getAccountNumber()} – ${this.finesAccStore.party_name() ?? ''}`;

  /**
   * Navigates to the defendant details page with the supplied tab fragment selected.
   */
  private navigateToDefendantDetailsPage(fragment: TFinesAccDefendantDetailsTabKey): void {
    this.router.navigate([`../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`], {
      relativeTo: this.route,
      fragment,
    });
  }

  /**
   * Navigates back to the Parent or guardian tab without removing the parent/guardian.
   */
  public navigateToParentGuardianTab(): void {
    this.navigateToDefendantDetailsPage(FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS['parent-or-guardian']);
  }

  /**
   * Removes the non-paying parent/guardian party from the account.
   */
  public handleRemoveParentGuardianDetails(): void {
    const accountId = this.finesAccStore.account_id();
    const parentGuardianPartyId = this.finesAccStore.pg_party_id();
    const businessUnitId = this.finesAccStore.business_unit_id();
    const version = this.finesAccStore.base_version();

    if (!accountId || !parentGuardianPartyId || !businessUnitId || !version) {
      this.navigateToParentGuardianTab();
      return;
    }

    const payload = {
      party_details: {
        party_id: parentGuardianPartyId,
      },
    };

    this.opalFinesService
      .deleteDefendantAccountParty(accountId, parentGuardianPartyId, payload, version, businessUnitId)
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => {
        this.opalFinesService.clearAccountDetailsCache();
        this.finesAccStore.setSuccessMessage(FINES_ACC_REMOVE_NON_PAYING_PG_SUCCESS_MESSAGE);
        this.navigateToDefendantDetailsPage(FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS.defendant);
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
