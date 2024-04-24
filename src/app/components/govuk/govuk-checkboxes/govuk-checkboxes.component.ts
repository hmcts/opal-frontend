import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IGovUkCheckboxInput } from '@interfaces';

@Component({
  selector: 'app-govuk-checkboxes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-checkboxes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCheckboxesComponent {
  private _group!: FormGroup;
  public toggleConditional: { [key: string]: boolean } = {};

  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;

  @Input({ required: true }) set group(abstractControl: AbstractControl | null) {
    this._group = abstractControl as FormGroup;
  }
  @Input({ required: true }) checkboxInputs!: IGovUkCheckboxInput[];
  @Input({ required: false }) checkboxClasses!: string;
  get getGroup() {
    return this._group;
  }

  /**
   * Toggles the conditional state of the input with the specified ID.
   * If the input is currently conditional, it will be toggled to non-conditional.
   * If the input is currently non-conditional, it will be toggled to conditional.
   * @param inputId - The ID of the input to toggle.
   */
  public handleToggleConditional(inputId: string): void {
    this.toggleConditional[inputId] = !this.toggleConditional[inputId];
  }
}
