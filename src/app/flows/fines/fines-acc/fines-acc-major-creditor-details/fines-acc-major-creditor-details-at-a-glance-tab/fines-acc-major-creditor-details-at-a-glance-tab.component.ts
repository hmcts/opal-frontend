import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesAccSummaryTabsContentStyles } from '../../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../../constants/fines-acc-debtor-types.constant';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { IOpalFinesAccountMajorCreditorAtAGlance } from '../../../services/opal-fines-service/interfaces/opal-fines-account-major-creditor-at-a-glance.interface';
@Component({
  selector: 'app-fines-acc-major-creditor-details-at-a-glance-tab',
  imports: [UpperCasePipe, MojBadgeComponent, DateFormatPipe],
  templateUrl: './fines-acc-major-creditor-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMajorCreditorDetailsAtAGlanceTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountMajorCreditorAtAGlance;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  public readonly debtorTypes = FINES_ACC_DEBTOR_TYPES;
}
