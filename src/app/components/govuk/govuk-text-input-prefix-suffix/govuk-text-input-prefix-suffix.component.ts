import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-govuk-text-input-prefix-suffix',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-text-input-prefix-suffix.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTextInputPrefixSuffixComponent {
  private _control!: FormControl;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) errors: string | null = null;

  @Input({ required: false }) prefixText!: string;
  @Input({ required: false }) suffixText!: string;

  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  get getControl() {
    return this._control;
  }
}
