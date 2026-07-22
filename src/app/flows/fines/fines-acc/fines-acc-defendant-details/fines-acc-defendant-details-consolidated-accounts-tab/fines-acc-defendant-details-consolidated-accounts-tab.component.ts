import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { IOpalFinesAccountDefendantDetailsConsolidatedAccounts } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-consolidated-accounts.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../routing/constants/fines-acc-routing-paths.constant';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';

@Component({
  selector: 'app-fines-acc-defendant-details-consolidated-accounts-tab',
  imports: [CustomHorizontalScrollPaneComponent, DateFormatPipe, RouterLink, UpperCasePipe],
  templateUrl: './fines-acc-defendant-details-consolidated-accounts-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsConsolidatedAccountsTabComponent {
  protected readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  @Input({ required: true }) public tabData!: IOpalFinesAccountDefendantDetailsConsolidatedAccounts;
  @Input() public style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;

  /**
   * Builds the route to a child account's at-a-glance view.
   *
   * @param accountId - The child defendant account id.
   * @returns The router link commands for the defendant account details page.
   */
  public getAccountRouterLink(accountId: number): Array<string | number> {
    return [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.root,
      accountId,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
    ];
  }
}
