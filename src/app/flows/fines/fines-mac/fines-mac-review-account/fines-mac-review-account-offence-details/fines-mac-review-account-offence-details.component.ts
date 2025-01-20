import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FinesMacOffenceDetailsReviewComponent } from '../../fines-mac-offence-details/fines-mac-offence-details-review/fines-mac-offence-details-review.component';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { CommonModule } from '@angular/common';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';

@Component({
  selector: 'app-fines-mac-review-account-offence-details',

  imports: [
    CommonModule,
    FinesMacOffenceDetailsReviewComponent,
    GovukSummaryCardListComponent,
    FinesMacReviewAccountChangeLinkComponent,
  ],
  templateUrl: './fines-mac-review-account-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountOffenceDetailsComponent {
  @Output() public emitChangeOffenceDetails = new EventEmitter<void>();

  /**
   * Emits an event to indicate that offence details needs changed.
   * This method triggers the `emitChangeOffenceDetails` event emitter.
   */
  public changeOffenceDetails(): void {
    this.emitChangeOffenceDetails.emit();
  }
}
