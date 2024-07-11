import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CustomAddressBlockComponent,
  CustomDateOfBirthComponent,
  CustomNationalInsuranceNumberComponent,
  FormBaseComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components';
import {
  ADDRESS_LINE_ONE_FIELD_ERRORS,
  ADDRESS_LINE_TWO_FIELD_ERRORS,
  CUSTOM_ADDRESS_FIELD_IDS,
  DATE_OF_BIRTH_FIELD_ERRORS,
  MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_FIELD_ERROR,
  NATIONAL_INSURANCE_FIELD_ERRORS,
  POST_CODE_FIELD_ERRORS,
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors, IManualAccountCreationParentGuardianDetailsState } from '@interfaces';
import {
  optionalMaxLengthValidator,
  dateOfBirthValidator,
  optionalValidDateValidator,
  nationalInsuranceNumberValidator,
  specialCharactersValidator,
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
    GovukCancelLinkComponent,
    CustomAddressBlockComponent,
    CustomNationalInsuranceNumberComponent,
    CustomDateOfBirthComponent,
  ],
  templateUrl: './parent-guardian-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentGuardianDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationParentGuardianDetailsState>();

  public readonly customAddressFieldIds = CUSTOM_ADDRESS_FIELD_IDS;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  override fieldErrors: IFieldErrors = {
    ...MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_FIELD_ERROR,
    ...DATE_OF_BIRTH_FIELD_ERRORS,
    ...NATIONAL_INSURANCE_FIELD_ERRORS,
    ...ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...POST_CODE_FIELD_ERRORS,
  };

  /**
   * Sets up the parent/guardian details form with the necessary form controls.
   */
  private setupParentGuardianDetailsForm(): void {
    this.form = new FormGroup({
      fullName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      dateOfBirth: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      nationalInsuranceNumber: new FormControl(null, [nationalInsuranceNumberValidator()]),
      addressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      addressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit(this.form.value);
    }
  }

  public override ngOnInit(): void {
    this.customAddressFieldIds.addressLineThreeFieldId = null;
    this.setupParentGuardianDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.parentGuardianDetails);
    super.ngOnInit();
  }
}
