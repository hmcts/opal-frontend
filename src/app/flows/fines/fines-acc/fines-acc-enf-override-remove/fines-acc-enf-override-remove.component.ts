import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT } from '../fines-acc-enf-override-add-change/constants/fines-acc-enf-override-add-change-form-default.constant';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_SUCCESS_MESSAGES } from '../fines-acc-enf-override-add-change/constants/fines-acc-enf-override-add-change-success-messages.constant';

@Component({
  selector: 'app-fines-acc-enf-override-remove',
  templateUrl: './fines-acc-enf-override-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GovukHeadingWithCaptionComponent, GovukCancelLinkComponent],
})
export class FinesAccEnfOverrideRemoveComponent implements OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly finesAccPayloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  public accountNumber = this.finesAccStore.getAccountNumber() ?? '';
  public partyName = this.finesAccStore.party_name() ?? '';
  public pageTitle: string = this.route.snapshot.data['title'] ?? '';

  /**
   * Gets the current enforcement override result from the route data, if available.
   */
  public get enforcementOverride() {
    return (this.route.snapshot.data['enforcementStatus'] as IOpalFinesAccountDefendantDetailsEnforcementTabRefData)
      ?.enforcement_override?.enforcement_override_result;
  }

  /**
   * Navigates to the defendant details page with the 'enforcement' fragment to display the enforcement tab.
   */
  public navigateToDefendantDetailsPage(): void {
    this.router.navigate([`../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`], {
      relativeTo: this.route,
      fragment: 'enforcement',
    });
  }

  /**
   * Handles the removal of the enforcement override.
   */
  public handleFinesEnfOverrideRemove(): void {
    const payload = this.finesAccPayloadService.buildEnforcementOverrideFormPayload(
      FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT,
    );
    this.opalFinesService
      .patchDefendantAccount(
        this.finesAccStore.account_id()!,
        payload,
        this.finesAccStore.base_version()!,
        this.finesAccStore.business_unit_id()!,
      )
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(() => {
        this.finesAccStore.setSuccessMessage(FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_SUCCESS_MESSAGES.remove);
        this.navigateToDefendantDetailsPage();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
