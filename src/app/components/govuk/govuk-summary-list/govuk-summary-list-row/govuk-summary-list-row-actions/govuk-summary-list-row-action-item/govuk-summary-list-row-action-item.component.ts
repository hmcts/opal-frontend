import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-govuk-summary-list-row-action-item, [app-govuk-summary-list-row-action-item]',

  imports: [],
  templateUrl: './govuk-summary-list-row-action-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListRowActionItemComponent {
  @Input({ required: true }) actionName!: string;
  @Input({ required: true }) actionId!: string;
  @Output() public linkClick = new EventEmitter<string>();

  @HostBinding('class') hostClass = 'govuk-summary-list__actions-list-item govuk-link-colour';

  /**
   * Handles the click event for the action button.
   * @param event - The click event.
   */
  public handleActionClick(event: Event, linkClicked: string): void {
    event.preventDefault();
    this.linkClick.emit(linkClicked);
  }
}
