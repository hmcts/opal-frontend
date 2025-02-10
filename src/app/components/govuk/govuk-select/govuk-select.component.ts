import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IGovUkSelectOptions } from '@components/govuk/govuk-select/interfaces/govuk-select-options.interface';

@Component({
  selector: 'app-govuk-select',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSelectComponent {
  private _control!: FormControl;

  @Input({ required: true }) labelText!: string;

  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) selectId!: string;
  @Input({ required: true }) selectName!: string;
  @Input({ required: false }) selectClasses!: string;
  @Input({ required: false }) selectHint!: string;
  @Input({ required: false }) errors: string | null = null;
  @Input({ required: true }) options!: IGovUkSelectOptions[];
  @Input({ required: true }) set control(abstractControl: AbstractControl) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  get getControl() {
    return this._control;
  }
}
