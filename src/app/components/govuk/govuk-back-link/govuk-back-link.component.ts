import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-govuk-back-link',
  imports: [],
  templateUrl: './govuk-back-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukBackLinkComponent {
  @Output() clickEvent = new EventEmitter<Event>();

  /**
   * Handles the back navigation for the component by emitting an event.
   * This method prevents the default action of the event.
   *
   * @param {Event} event - The event object representing the user's action.
   */
  public onBack(event: Event): void {
    event.preventDefault();
    this.clickEvent.emit(event);
  }
}
