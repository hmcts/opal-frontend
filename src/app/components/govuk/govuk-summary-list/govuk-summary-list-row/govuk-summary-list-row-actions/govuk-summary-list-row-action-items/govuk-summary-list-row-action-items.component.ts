import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-govuk-summary-list-row-action-items',
  standalone: true,
  imports: [],
  templateUrl: './govuk-summary-list-row-action-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListRowActionItemsComponent {
  @Input({ required: true }) actions!: string[];
  @Output() public linkClick = new EventEmitter<string>();

  /**
   * Handles the click event for the action button.
   * @param event - The click event.
   */
  public handleActionClick(event: Event, linkClicked: string): void {
    event.preventDefault();
    this.linkClick.emit(linkClicked);
  }
}
