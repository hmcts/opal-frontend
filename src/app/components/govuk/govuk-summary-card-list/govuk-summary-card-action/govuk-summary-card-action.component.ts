import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-govuk-summary-card-action',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './govuk-summary-card-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryCardActionComponent {
  @Input({ required: true }) actions!: { text: string; route: string }[];
  @Input({ required: true }) cardTitle!: string;
  @Output() clickEvent = new EventEmitter<string>();

  /**
   * Handles click events, prevents default behavior, and emits a route.
   *
   * @param {Event} event - The DOM event triggered by the user action.
   * @param {string} route - The route to be emitted when the event is triggered.
   */
  public onClick(event: Event, route: string): void {
    event.preventDefault();
    this.clickEvent.emit(route);
  }
}
