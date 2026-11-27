import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { IFinesAccSummaryTabsContentStyles } from '../../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountMajorCreditorAtAGlance } from '../../../services/opal-fines-service/interfaces/opal-fines-account-major-creditor-at-a-glance.interface';
@Component({
  selector: 'app-fines-acc-major-creditor-details-at-a-glance-tab',
  imports: [MojBadgeComponent, FinesNotProvidedComponent],
  templateUrl: './fines-acc-major-creditor-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMajorCreditorDetailsAtAGlanceTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountMajorCreditorAtAGlance;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Input() centralFund: boolean = false;

  /**
   * Returns populated address lines, preserving the Central Fund postcode exclusion.
   */
  public get addressLines(): string[] {
    const address = this.tabData.major_creditor.address;
    return [
      address?.line_1,
      address?.line_2,
      address?.line_3,
      this.centralFund ? null : address?.postcode?.toUpperCase(),
    ].filter((line): line is string => !!line?.trim());
  }
}
