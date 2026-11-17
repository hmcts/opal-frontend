import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IFinesMciCreateTillPaymentSummaryRow } from './interfaces/fines-mci-create-till-payment-summary-row.interface';

@Component({
  selector: 'app-fines-mci-create-till-payment-summary',
  imports: [GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mci-create-till-payment-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillPaymentSummaryComponent {
  @Input({ required: true }) public title = '';
  @Input({ required: true }) public summaryId = '';
  @Input({ required: true }) public rows: IFinesMciCreateTillPaymentSummaryRow[] = [];
}
