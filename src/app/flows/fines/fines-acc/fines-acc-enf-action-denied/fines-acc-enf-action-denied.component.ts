import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_ENF_ACTION_DENIED_ACCOUNT_STATUS_MAP } from './constants/fines-acc-enf-action-denied-account-status-map.constant';
import { FINES_ACC_ENF_ACTION_DENIED_MESSAGES } from './constants/fines-acc-enf-action-denied-messages.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_DENIED_TYPES } from './constants/fines-acc-enf-action-denied-types.constant';

@Component({
  selector: 'app-fines-acc-enf-action-denied',
  imports: [GovukHeadingWithCaptionComponent, GovukCancelLinkComponent],
  templateUrl: './fines-acc-enf-action-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccEnfActionDeniedComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly accountStore = inject(FinesAccountStore);
  public readonly deniedType = this.route.snapshot.paramMap.get('type');
  public readonly deniedTypes = FINES_ACC_ENF_ACTION_DENIED_TYPES;
  public readonly heading = FINES_ACC_ENF_ACTION_DENIED_MESSAGES.heading;
  public readonly messages = FINES_ACC_ENF_ACTION_DENIED_MESSAGES;
  public readonly defendantAccountHeadingData: IOpalFinesAccountDefendantDetailsHeader =
    this.route.snapshot.data['defendantAccountHeadingData'];
  public readonly enforcementStatus: IOpalFinesAccountDefendantDetailsEnforcementTabRefData =
    this.route.snapshot.data['enforcementStatus'];
  public readonly accountStatusCode = this.defendantAccountHeadingData.account_status_reference
    .account_status_code as keyof typeof FINES_ACC_ENF_ACTION_DENIED_ACCOUNT_STATUS_MAP;
  public readonly accountStatus =
    FINES_ACC_ENF_ACTION_DENIED_ACCOUNT_STATUS_MAP[this.accountStatusCode] ??
    this.defendantAccountHeadingData.account_status_reference.account_status_display_name;
  public readonly lastEnforcementAction = this.enforcementStatus.last_enforcement_action
    ? `${this.enforcementStatus.last_enforcement_action.enforcement_action.result_title} (${this.enforcementStatus.last_enforcement_action.enforcement_action.result_id})`
    : null;

  /**
   * Navigates back to the account summary details page, preserving the enforcement tab fragment.
   */
  public navigateBackToAccountSummary(event?: Event): void {
    event?.preventDefault();
    this.router.navigate([`../../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`], {
      relativeTo: this.route,
      fragment: 'enforcement',
    });
  }
}
