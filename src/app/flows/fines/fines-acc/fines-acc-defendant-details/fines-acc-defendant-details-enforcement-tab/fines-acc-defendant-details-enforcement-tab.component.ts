import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import {
  GovukSummaryCardListComponent,
  GovukSummaryCardActionComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { GovukDetailsComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-details';
import { FINES_ACC_ENF_ACTION_DENIED_ACCOUNT_STATUS_MAP } from '../../fines-acc-enf-action-denied/constants/fines-acc-enf-action-denied-account-status-map.constant';
@Component({
  selector: 'app-fines-acc-defendant-details-enforcement-tab',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryCardActionComponent,
    MojBadgeComponent,
    FinesNotProvidedComponent,
    DatePipe,
    TitleCasePipe,
    GovukTagComponent,
    GovukDetailsComponent,
  ],
  templateUrl: './fines-acc-defendant-details-enforcement-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsEnforcementTab {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantDetailsEnforcementTabRefData;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Input() isCompanyAccount: boolean = false;
  @Input() hasAccountMaintenancePermission: boolean = false;
  @Input() hasEnterEnforcementPermission: boolean = false;
  @Input({ required: true }) accountStatusCode!: string;
  @Output() addEnforcementAction = new EventEmitter<string | null>();
  @Output() addEnforcementOverride = new EventEmitter<void>();
  @Output() changeEnforcementOverride = new EventEmitter<void>();
  @Output() removeEnforcementOverride = new EventEmitter<void>();
  @Output() changeEnforcementCourt = new EventEmitter<void>();
  @Output() changeCollectionOrder = new EventEmitter<boolean>();

  /**
   * Normalises next permitted action ids from the enforcement status payload.
   */
  private getNextPermittedActions(): string[] {
    return (
      this.tabData.next_enforcement_action_data
        ?.split(',')
        .map((actionId) => actionId.trim())
        .filter(Boolean) ?? []
    );
  }

  /**
   * Computes the denied reason for adding an enforcement action.
   */
  private getAddEnforcementActionDeniedType(): string | null {
    const invalidAccountStatuses = Object.keys(FINES_ACC_ENF_ACTION_DENIED_ACCOUNT_STATUS_MAP);
    const lastEnforcementActionId = this.tabData.last_enforcement_action?.enforcement_action.result_id ?? null;
    const nextPermittedActions = this.getNextPermittedActions();

    if (!this.hasEnterEnforcementPermission) {
      return 'permission';
    }

    if (invalidAccountStatuses.includes(this.accountStatusCode)) {
      return 'account-status';
    }

    if (lastEnforcementActionId === 'NOENF') {
      return 'enforcement-hold';
    }

    if (this.tabData.last_enforcement_action && nextPermittedActions.length === 0) {
      return 'no-next-actions';
    }

    return null;
  }

  /**
   * Emits the denied type for add enforcement action so the parent can route.
   */
  public handleAddEnforcementAction(event: Event): void {
    event.preventDefault();
    this.addEnforcementAction.emit(this.getAddEnforcementActionDeniedType());
  }

  /**
   * Emits an event to add an enforcement override if the user has the necessary permissions and there is no existing enforcement override result.
   * @returns void
   */
  public handleAddEnforcementOverride(event: Event): void {
    event.preventDefault();
    this.addEnforcementOverride.emit();
  }

  /**
   * Emits an event to change an enforcement override if the user has the necessary permissions and there is an existing enforcement override result.
   * @returns void
   */
  public handleChangeEnforcementOverride(): void {
    this.changeEnforcementOverride.emit();
  }

  /**
   * Emits a request to navigate to the change enforcement court page.
   */
  public handleChangeEnforcementCourt(): void {
    this.changeEnforcementCourt.emit();
  }

  /**
   * Emits a request to navigate to the remove enforcement override page.
   */
  public handleRemoveEnforcementOverride(): void {
    this.removeEnforcementOverride.emit();
  }

  /**
   * Emits an event to change the collection order status.
   */
  public handleChangeCollectionOrder(): void {
    this.changeCollectionOrder.emit(this.tabData.enforcement_overview.collection_order?.collection_order_flag ?? false);
  }
}
