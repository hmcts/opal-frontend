import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { GovukSummaryCardActionComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-action/govuk-summary-card-action.component';

@Component({
  selector: 'app-fines-mac-review-account-change-link',

  imports: [GovukSummaryCardActionComponent],
  templateUrl: './fines-mac-review-account-change-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountChangeLinkComponent {
  @Output() public emitChange = new EventEmitter<void>();

  /**
   * Emits a change event to notify listeners that the data has changed.
   * This method triggers the `emitChange` event emitter.
   */
  public changeData(): void {
    this.emitChange.emit();
  }
}
