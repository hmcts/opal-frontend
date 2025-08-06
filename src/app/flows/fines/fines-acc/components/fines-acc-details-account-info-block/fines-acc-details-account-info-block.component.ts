import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CustomSummaryMetricBarComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar';
import { CustomSummaryMetricBarItemComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item';
import { CustomSummaryMetricBarItemLabelComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-label';
import { CustomSummaryMetricBarItemValueComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-value';
import { IOpalFinesDefendantAccountHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-account-header.interface';

@Component({
  selector: 'app-fines-acc-details-account-info-block',
  imports: [
    CustomSummaryMetricBarComponent,
    CustomSummaryMetricBarItemComponent,
    CustomSummaryMetricBarItemLabelComponent,
    CustomSummaryMetricBarItemValueComponent,
  ],
  templateUrl: './fines-acc-details-account-info-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDetailsAccountInfoBlockComponent {
  @Input() accountData!: IOpalFinesDefendantAccountHeader;
  @Input() convertToMonetaryString!: (value: number) => string;
}
