import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-govuk-header-navigation-item',
  imports: [],
  templateUrl: './govuk-header-navigation-item.component.html',
  styleUrl: './govuk-header-navigation-item.component.scss',
})
export class GovukHeaderNavigationItemComponent {
  @Output() public actionClick = new EventEmitter<boolean>();

  /**
   * Handles the click event for the action button.
   * @param event - The click event.
   */
  handleClick(event: Event): void {
    event.preventDefault();
    this.actionClick.emit(true);
  }
}
