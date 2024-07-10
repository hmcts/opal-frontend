import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  FormBaseComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
  ScotgovDatePickerComponent,
} from '@components';
import {
  ADDRESS_LINE_ONE_FIELD_ERRORS,
  ADDRESS_LINE_THREE_FIELD_ERRORS,
  ADDRESS_LINE_TWO_FIELD_ERRORS,
  DATE_OF_BIRTH_FIELD_ERRORS,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_FIELD_ERROR,
  NATIONAL_INSURANCE_FIELD_ERRORS,
  POST_CODE_FIELD_ERRORS,
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors, IManualAccountCreationParentGuardianForm } from '@interfaces';
import { DateTime } from 'luxon';
import {
  optionalMaxLengthValidator,
  dateOfBirthValidator,
  optionalValidDateValidator,
  nationalInsuranceNumberValidator,
  specialCharactersValidator,
  alphabeticalTextValidator,
} from 'src/app/validators';

@Component({
  selector: 'app-parent-guardian-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    ScotgovDatePickerComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './parent-guardian-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentGuardianDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationParentGuardianForm>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  override fieldErrors: IFieldErrors = {
    ...MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_FIELD_ERROR,
    ...DATE_OF_BIRTH_FIELD_ERRORS,
    ...NATIONAL_INSURANCE_FIELD_ERRORS,
    ...ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...POST_CODE_FIELD_ERRORS,
  };

  public yesterday: string = DateTime.now().minus({ days: 1 }).setLocale('en-gb').toLocaleString();

  /**
   * Sets up the parent/guardian details form with the necessary form controls.
   */
  private setupParentGuardianDetailsForm(): void {
    this.form = new FormGroup({
      fullName: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      dateOfBirth: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      nationalInsuranceNumber: new FormControl(null, [nationalInsuranceNumberValidator()]),
      addressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      addressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      addressLine3: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   * @returns void
   */
  public handleFormSubmit(event: SubmitEvent): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      const continueFlow = event.submitter ? event.submitter.className.includes('continue-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, continueFlow: continueFlow });
    }
  }

  public override ngOnInit(): void {
    this.setupParentGuardianDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.parentGuardianDetails);
    super.ngOnInit();
  }
}
