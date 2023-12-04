import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-govuk-radios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-radios.component.html',
  styleUrl: './govuk-radios.component.scss',
})
export class GovukRadiosComponent {
  private _control!: FormControl;
  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHintId!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;

  @Input({ required: true }) radioInputs!: any[];
  @Input({ required: false }) radioClasses!: string;

  @Input({ required: true }) set control(abstractControl: AbstractControl) {
    this._control = abstractControl as FormControl;
  }

  get getControl() {
    return this._control;
  }
}
