import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UtilsService } from '@services';

@Component({
  selector: 'app-govuk-summary-list-row',
  standalone: true,
  imports: [],
  templateUrl: './govuk-summary-list-row.component.html',
  styleUrl: './govuk-summary-list-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListRowComponent {
  private readonly utilService = inject(UtilsService);
  public _summaryListRowId!: string;

  @Output() public actionClick = new EventEmitter<boolean>();
  @Input() public actionEnabled = false;

  @Input({ required: true }) summaryListId!: string;
  @Input({ required: true }) set summaryListRowId(summaryListRowId: string) {
    this._summaryListRowId = this.utilService.upperCaseFirstLetter(summaryListRowId);
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
