import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IOpalFinesAccountDefendantDetailsConsolidatedAccounts } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-consolidated-accounts.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';

@Component({
  selector: 'app-fines-acc-defendant-details-consolidated-accounts-tab',
  imports: [],
  templateUrl: './fines-acc-defendant-details-consolidated-accounts-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsConsolidatedAccountsTabComponent {
  @Input({ required: true }) public tabData!: IOpalFinesAccountDefendantDetailsConsolidatedAccounts;
  @Input() public style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
}
