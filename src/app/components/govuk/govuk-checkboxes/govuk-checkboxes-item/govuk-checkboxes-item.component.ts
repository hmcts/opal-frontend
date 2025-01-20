import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-govuk-checkboxes-item, [app-govuk-checkboxes-item]',

  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-checkboxes-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCheckboxesItemComponent {
  private _control!: FormControl;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) ariaControls!: string;

  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  @HostBinding('class') class = 'govuk-checkboxes__item';

  get getControl() {
    return this._control;
  }
}
