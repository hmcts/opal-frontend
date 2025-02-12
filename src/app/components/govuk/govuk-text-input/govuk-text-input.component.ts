import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-govuk-text-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTextInputComponent {
  private _control!: FormControl;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) hintText!: string;
  @Input({ required: false }) hintHtml!: boolean;
  @Input({ required: false }) inputMode: string = 'text';
  @Input({ required: false }) errors: string | null = null;
  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  get getControl() {
    return this._control;
  }
}
