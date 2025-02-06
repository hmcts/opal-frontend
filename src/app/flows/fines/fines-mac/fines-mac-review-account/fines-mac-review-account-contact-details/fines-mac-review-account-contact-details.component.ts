import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacContactDetailsState } from '../../fines-mac-contact-details/interfaces/fines-mac-contact-details-state.interface';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { FinesMacReviewAccountNotProvidedComponent } from '../fines-mac-review-account-not-provided/fines-mac-review-account-not-provided.component';
import { FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES } from '../constants/fines-mac-review-account-default-values.constant';

@Component({
  selector: 'app-fines-mac-review-account-contact-details',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
    FinesMacReviewAccountNotProvidedComponent,
  ],
  templateUrl: './fines-mac-review-account-contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountContactDetailsComponent {
  @Input({ required: true }) public contactDetails!: IFinesMacContactDetailsState;
  @Output() public emitChangeContactDetails = new EventEmitter<void>();

  public readonly finesMacStatus = FINES_MAC_STATUS;
  public readonly defaultValues = FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES;

  /**
   * Emits an event to indicate that contact details needs changed.
   * This method triggers the `emitChangeContactDetails` event emitter.
   */
  public changeContactDetails(): void {
    this.emitChangeContactDetails.emit();
  }
}
