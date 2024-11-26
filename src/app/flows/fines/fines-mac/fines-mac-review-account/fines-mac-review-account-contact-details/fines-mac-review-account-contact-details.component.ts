import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacContactDetailsState } from '../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FinesMacReviewAccountDefaultValues } from '../enums/fines-mac-review-account-default-values.enum';

@Component({
  selector: 'app-fines-mac-review-account-contact-details',
  standalone: true,
  imports: [GovukSummaryCardListComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-review-account-contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountContactDetailsComponent {
  @Input({ required: true }) public contactDetails!: IFinesMacContactDetailsState;

  public finesMacStatus = FINES_MAC_STATUS;
  public defaultValues = FinesMacReviewAccountDefaultValues;
}
