import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { SignalFormControlAdapter } from '../../forms/signal-forms/signal-form-control.adapter';

@Component({
  selector: 'app-signal-govuk-text-area',
  standalone: true,
  imports: [GovukTextAreaComponent],
  template: `
    <opal-lib-govuk-text-area
      [labelText]="labelText"
      [labelClasses]="labelClasses"
      [hintText]="hintText"
      [inputId]="inputId"
      [inputName]="inputName"
      [inputClasses]="inputClasses"
      [inputMode]="inputMode"
      [control]="control?.formControl"
      [characterCountEnabled]="characterCountEnabled"
      [maxCharacterLimit]="maxCharacterLimit"
      [rows]="rows"
      [errors]="errors"
    ></opal-lib-govuk-text-area>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalGovukTextAreaComponent {
  @Input({ required: true }) labelText!: string;
  @Input() labelClasses = '';
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input() inputClasses = '';
  @Input() hintText = '';
  @Input() inputMode = 'text';
  @Input() characterCountEnabled = false;
  @Input() maxCharacterLimit?: number;
  @Input() rows?: number;
  @Input() errors: string | null = null;
  @Input({ required: true }) control!: SignalFormControlAdapter<string | null>;
}
