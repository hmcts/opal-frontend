import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  GovukBackLinkComponent,
  GovukButtonComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukErrorSummaryComponent,
  GovukSelectComponent,
  GovukTextInputComponent,
  ScotgovDatePickerComponent,
} from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IFormControlErrorMessage, IFormErrorSummaryMessage } from '@interfaces';
import { IManualAccountCreationPersonalDetailsState } from 'src/app/interfaces/manual-account-creation-personal-details-state.interface';

@Component({
  selector: 'app-personal-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukBackLinkComponent,
    GovukErrorSummaryComponent,
    ScotgovDatePickerComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukSelectComponent,
  ],
  templateUrl: './personal-details-form.component.html',
})
export class PersonalDetailsFormComponent implements OnInit {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationPersonalDetailsState>();
  @Output() protected unsavedChanges = new EventEmitter<boolean>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  private readonly router = inject(Router);
  public form!: FormGroup;
  public formSubmitted!: boolean;
  public formControlErrorMessages!: IFormControlErrorMessage;
  public formErrorSummaryMessage!: IFormErrorSummaryMessage[];

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null),
      firstNames: new FormControl(null),
      lastName: new FormControl(null),
      addAlias: new FormControl(null),
      aliases: new FormGroup({
        firstNames1: new FormControl(null),
        lastName1: new FormControl(null),
      }),
      dateOfBirth: new FormControl(null),
      nationalInsuranceNumber: new FormControl(null),
      addressLine1: new FormControl(null),
      addressLine2: new FormControl(null),
      addressLine3: new FormControl(null),
      postcode: new FormControl(null),
      makeOfCar: new FormControl(null),
      registrationNumber: new FormControl(null),
    });
  }

  /**
   * Checks whether the form has been touched and submitted
   *
   * @returns boolean
   */
  protected hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.formSubmitted;
  }

  /**
   * Handles back and navigates to the manual account creation page.
   */
  public handleBack(route: string): void {
    this.unsavedChanges.emit(this.hasUnsavedChanges());
    this.router.navigate([route]);
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    //this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit(this.form.value);
    }
  }

  /**
   * Handles the scroll of the component error from the summary
   *
   * @param fieldId - Field id of the component
   */
  public scrollTo(fieldId: string): void {
    this['scroll'](fieldId);
  }

  /**
   * Scrolls to the label of the component and focuses on the field id
   *
   * @param fieldId - Field id of the component
   */
  private scroll(fieldId: string): void {
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
      const labelTarget =
        document.querySelector(`label[for=${fieldId}]`) ||
        document.querySelector(`#${fieldId} .govuk-fieldset__legend`) ||
        document.querySelector(`label[for=${fieldId}-autocomplete]`);
      if (labelTarget) {
        labelTarget.scrollIntoView({ behavior: 'smooth' });
      }
      fieldElement.focus();
    }
  }

  ngOnInit(): void {
    this.setupPersonalDetailsForm();
  }
}
