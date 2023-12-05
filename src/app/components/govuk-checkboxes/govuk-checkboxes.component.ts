import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IGovUkCheckboxesData } from '@interfaces';

@Component({
  selector: 'app-govuk-checkboxes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-checkboxes.component.html',
  styleUrl: './govuk-checkboxes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCheckboxesComponent {
  private _group!: FormGroup;

  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHintId!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;

  @Input({ required: true }) set group(abstractControl: AbstractControl | null) {
    this._group = abstractControl as FormGroup;
  }
  @Input({ required: true }) checkboxInputs!: IGovUkCheckboxesData[];
  @Input({ required: false }) checkboxClasses!: string;
  get getGroup() {
    return this._group;
  }
}
