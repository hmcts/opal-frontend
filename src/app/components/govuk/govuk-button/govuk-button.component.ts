import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-govuk-button',

  imports: [CommonModule],
  templateUrl: './govuk-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukButtonComponent {
  @Input({ required: true }) buttonId!: string;
  @Input({ required: false }) type = 'button';
  @Input({ required: false }) buttonClasses!: string;

  @Output() buttonClickEvent = new EventEmitter<boolean>();

  /**
   * Handles the button click event.
   */
  public handleButtonClick(): void {
    this.buttonClickEvent.emit(true);
  }
}
