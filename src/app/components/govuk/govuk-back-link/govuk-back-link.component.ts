import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-govuk-back-link',
  standalone: true,
  imports: [],
  templateUrl: './govuk-back-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukBackLinkComponent {
  /**
   * Handles the back navigation for the component.
   * This method prevents the default action of the event and navigates back in the browser history.
   *
   * @param {Event} event - The event object representing the user's action.
   */
  public onBack(event: Event): void {
    event.preventDefault();
    window.history.back();
  }
}
