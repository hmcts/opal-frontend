import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-govuk-cancel-link',
  standalone: true,
  imports: [],
  templateUrl: './govuk-cancel-link.component.html',
  styleUrl: './govuk-cancel-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCancelLinkComponent {
  @Output() linkClickEvent = new EventEmitter<boolean>();

  /**
   * Handles the button click event.
   */
  public handleClick(): void {
    this.linkClickEvent.emit(true);
  }
}
