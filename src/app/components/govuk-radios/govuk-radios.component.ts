import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IGovUkRadioData } from '@interfaces';

@Component({
  selector: 'app-govuk-radios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-radios.component.html',
  styleUrl: './govuk-radios.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukRadiosComponent {
  private _group!: FormGroup;

  @Input({ required: true }) fieldSetId!: string;

  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHintId!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;

  @Input({ required: true }) radioInputs!: IGovUkRadioData[];
  @Input({ required: false }) radioClasses!: string;

  @Input({ required: true }) set group(abstractControl: AbstractControl | null) {
    this._group = abstractControl as FormGroup;
  }

  get getGroup() {
    return this._group;
  }
}
