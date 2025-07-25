import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FinesMacOffenceDetailsReviewComponent } from '../../fines-mac-offence-details/fines-mac-offence-details-review/fines-mac-offence-details-review.component';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import { CommonModule } from '@angular/common';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';

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
  @Input({ required: false }) public isReadOnly = false;
  @Input({ required: true }) public results!: IOpalFinesResultsRefData;
  @Input({ required: true }) public majorCreditors!: IOpalFinesMajorCreditorRefData;
  @Output() public emitChangeOffenceDetails = new EventEmitter<void>();

  /**
   * Emits an event to indicate that offence details needs changed.
   * This method triggers the `emitChangeOffenceDetails` event emitter.
   */
  public changeOffenceDetails(): void {
    this.emitChangeOffenceDetails.emit();
  }
}
