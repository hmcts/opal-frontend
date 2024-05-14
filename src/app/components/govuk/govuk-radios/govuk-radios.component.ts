import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IGovUkRadioInput } from '@interfaces';

@Component({
  selector: 'app-govuk-radios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-radios.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukRadiosComponent {
  private _group!: FormGroup;

  public toggleConditional: { [key: string]: boolean } = {};

  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;

  @Input({ required: false }) legendHint!: string;

  @Input({ required: true }) radioInputs!: IGovUkRadioInput[];
  @Input({ required: false }) radioClasses!: string;
  @Input({ required: false }) errors: string | null = null;

  @Input({ required: true }) set group(abstractControl: AbstractControl | null) {
    this._group = abstractControl as FormGroup;
  }

  get getGroup() {
    return this._group;
  }

  /**
   * Handles the toggle of a conditional input based on the selected radio button.
   * @param inputId - The ID of the input to toggle.
   */
  public handleToggleConditional(inputId: string): void {
    // Because there can only be one radio selected at a time, reset.
    this.toggleConditional = {};
    this.toggleConditional[inputId] = true;
  }
}
