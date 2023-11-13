import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovukButtonClasses } from '@enums';

@Component({
  selector: 'app-govuk-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './govuk-button.component.html',
  styleUrls: ['./govuk-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukButtonComponent {
  public buttonClassSig: WritableSignal<string> = signal(GovukButtonClasses.default);

  @Input({ required: true }) id!: string;
  @Input() type = 'button';
  @Input({ required: true }) set buttonStyle(style: keyof typeof GovukButtonClasses) {
    const classToSet =
      style === 'default'
        ? `${GovukButtonClasses[style]}`
        : `${GovukButtonClasses.default} ${GovukButtonClasses[style]}`;

    this.buttonClassSig.set(`${classToSet} govuk-!-margin-bottom-0`);
  }

  @Output() buttonClickEvent = new EventEmitter<boolean>();

  public handleButtonClick(): void {
    this.buttonClickEvent.emit(true);
  }
}
