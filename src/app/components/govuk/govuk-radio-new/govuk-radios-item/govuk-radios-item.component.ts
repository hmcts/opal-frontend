import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-govuk-radios-item, [app-govuk-radios-item]',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-radios-item.component.html',
  styleUrl: './govuk-radios-item.component.scss',
})
export class GovukRadiosItemComponent {
  private _control!: FormControl;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: true }) inputValue!: string;
  @Input({ required: false }) ariaControls!: string;

  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  @HostBinding('class') class = 'govuk-radios__item';

  get getControl() {
    return this._control;
  }
}
