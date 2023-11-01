import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
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
  public buttonClassSig = signal('govuk-button');

  @Input({ required: true }) id!: string;
  @Input() type = 'button';
  @Input() set buttonStyle(val: keyof typeof GovukButtonClasses) {
    this.buttonClassSig.update((buttonClass) => `${buttonClass} ${GovukButtonClasses[val]} govuk-!-margin-bottom-0`);
  }
}
