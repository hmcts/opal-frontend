import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-govuk-summary-list-row',
  standalone: true,
  imports: [],
  templateUrl: './govuk-summary-list-row.component.html',
  styleUrl: './govuk-summary-list-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListRowComponent {
  public _summaryListId!: string;
  public _summaryListRowId!: string;

  @Output() public actionClick = new EventEmitter<boolean>();
  @Input() public actionEnabled = false;

  @Input({ required: true }) set summaryListRowId(summaryListRowId: string) {
    this._summaryListRowId = summaryListRowId.charAt(0).toUpperCase() + summaryListRowId.slice(1);
  }

  @Input({ required: true }) set summaryListId(summaryListId: string) {
    this._summaryListId = summaryListId.charAt(0).toUpperCase() + summaryListId.slice(1);
  }

  /**
   * Handles the click event for the action button.
   * @param event - The click event.
   */
  public handleActionClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.actionClick.emit(true);
  }
}
