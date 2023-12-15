import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-govuk-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-button.component.html',
  styleUrls: ['./govuk-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukButtonComponent {
  @Input({ required: true }) buttonId!: string;
  @Input({ required: false }) type = 'button';
  @Input({ required: false }) buttonClasses!: string;

  @Output() buttonClickEvent = new EventEmitter<boolean>();

  public handleButtonClick(): void {
    this.buttonClickEvent.emit(true);
  }
}
