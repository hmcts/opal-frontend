import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-govuk-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-text-input.component.html',
  styleUrl: './govuk-text-input.component.scss',
})
export class GovukTextInputComponent {
  private _control!: FormControl;

  get getControl() {
    return this._control;
  }

  @Input({ required: true }) labelText!: string;
  @Input({ required: true }) labelFor!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: true }) set control(val: AbstractControl) {
    this._control = val as FormControl;
  }
}
