import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  GovukTableComponent,
  GovukTableHeadingComponent,
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import { IOpalFinesAlternatePaymentReference } from '@services/fines/opal-fines-service/interfaces/opal-fines-alternate-payment-reference.interface';
import {
  canChangeAlternatePaymentReference,
  canRemoveAlternatePaymentReference,
  formatAlternatePaymentReferenceDate,
} from './fines-acc-alternate-payment-reference.utils';

@Component({
  selector: 'app-fines-acc-alternate-payment-reference-table',
  imports: [
    RouterLink,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
  ],
  templateUrl: './fines-acc-alternate-payment-reference-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccAlternatePaymentReferenceTableComponent {
  @Input({ required: true }) public references!: IOpalFinesAlternatePaymentReference[];
  @Input({ required: true }) public tableId!: string;
  @Input() public showActions = true;
  public readonly canChange = canChangeAlternatePaymentReference;
  public readonly canRemove = canRemoveAlternatePaymentReference;
  public readonly formatDate = formatAlternatePaymentReferenceDate;
}
