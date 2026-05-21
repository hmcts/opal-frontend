import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { UpperCasePipe } from '@angular/common';
import { IOpalFinesAccountMinorCreditorCreditor } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-fines-acc-minor-creditor-details-creditor-tab',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    UpperCasePipe,
    RouterLink,
  ],
  templateUrl: './fines-acc-minor-creditor-details-creditor-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsCreditorTab {
  @Input({ required: true }) tabData!: IOpalFinesAccountMinorCreditorCreditor;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Input() hasAccountMaintenancePermission: boolean = false;
  @Input() hasAccountMaintenancePermissionInBU: boolean = false;
  @Input() hasViewCreditorBacsPermission: boolean = false;

  /**
   * This method determines the target URL for the "Change" link based on the user's permissions.
   *
   * If the user has account maintenance permission in the business unit, the link will navigate to the amend page for minor creditor details.
   * If the user does not have the necessary permission, the link will navigate to an access denied page.
   *
   * @returns A string representing the target URL for the "Change" link.
   */
  public changeCreditorDetailsLink(): string {
    if (this.hasAccountMaintenancePermissionInBU) {
      return `../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.amend}`;
    } else {
      return '/access-denied';
    }
  }
}
