import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IGovUkDateInput } from '@interfaces/components/govuk';

@Component({
  selector: 'app-govuk-date-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukDateInputComponent {
  private _group!: FormGroup;

  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;

  @Input({ required: false }) errorDay: string | null = null;
  @Input({ required: false }) errorMonth: string | null = null;
  @Input({ required: false }) errorYear: string | null = null;

  @Input({ required: true }) dateInputs!: IGovUkDateInput;
  @Input({ required: true }) set group(abstractControl: AbstractControl | null) {
    this._group = abstractControl as FormGroup;
  }

  get getGroup() {
    return this._group;
  }
}
