import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-govuk-text-area',

  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-text-area.component.html',
  styles: ``,
})
export class GovukTextAreaComponent {
  private _control!: FormControl;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) hintText!: string;
  @Input({ required: false }) inputMode: string = 'text';
  @Input({ required: false }) errors: string | null = null;
  @Input({ required: false }) rows: number = 5;
  @Input({ required: false }) characterCountEnabled: boolean = false;
  @Input({ required: false }) maxCharacterLimit: number = 500;
  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  get getControl() {
    return this._control;
  }

  get remainingCharacterCount() {
    return this.maxCharacterLimit - (this._control.value?.length ?? 0);
  }
}
