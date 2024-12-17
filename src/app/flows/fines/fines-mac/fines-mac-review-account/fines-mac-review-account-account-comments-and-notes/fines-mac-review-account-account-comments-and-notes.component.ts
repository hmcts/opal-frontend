import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IFinesMacAccountCommentsNotesState } from '../../fines-mac-account-comments-notes/interfaces/fines-mac-account-comments-notes-state.interface';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { FinesMacReviewAccountDefaultValues } from '../enums/fines-mac-review-account-default-values.enum';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { FinesMacReviewAccountNotProvidedComponent } from '../fines-mac-review-account-not-provided/fines-mac-review-account-not-provided.component';

@Component({
  selector: 'app-fines-mac-review-account-account-comments-and-notes',
  standalone: true,
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
    FinesMacReviewAccountNotProvidedComponent,
  ],
  templateUrl: './fines-mac-review-account-account-comments-and-notes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountAccountCommentsAndNotesComponent {
  @Input({ required: true }) public accountCommentsAndNotes!: IFinesMacAccountCommentsNotesState;
  @Input({ required: false }) public isReadOnly = false;
  @Output() public emitChangeAccountCommentsAndNotesDetails = new EventEmitter<void>();

  public readonly defaultValues = FinesMacReviewAccountDefaultValues;

  /**
   * Emits an event to indicate that account comments and notes needs changed.
   * This method triggers the `emitChangeAccountCommentsAndNotesDetails` event emitter.
   */
  public changeAccountCommentsAndNotesDetails(): void {
    this.emitChangeAccountCommentsAndNotesDetails.emit();
  }
}
