import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBaseComponent } from '@components/abstract';
import {
  FINES_MAC_ADDRESS_LINE_ONE_FIELD_ERRORS,
  FINES_MAC_ADDRESS_LINE_THREE_FIELD_ERRORS,
  FINES_MAC_ADDRESS_LINE_TWO_FIELD_ERRORS,
  FINES_MAC_ADDRESS_FIELD_IDS,
  FINES_MAC_DATE_OF_BIRTH_FIELD_ERRORS,
  FINES_MAC_NATIONAL_INSURANCE_FIELD_ERRORS,
  FINES_MAC_POSTCODE_FIELD_ERRORS,
} from '@constants/components/fine/mac';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import {
  FinesMacAddressBlockComponent,
  FinesMacDateOfBirthComponent,
  FinesMacNationalInsuranceNumberComponent,
} from '@components/fines/mac';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  alphabeticalTextValidator,
  optionalValidDateValidator,
  dateOfBirthValidator,
  nationalInsuranceNumberValidator,
  specialCharactersValidator,
  optionalMaxLengthValidator,
} from '@validators';
import { IFinesMacParentGuardianDetailsForm } from '@interfaces/fines/mac';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FINES_MAC__PARENT_GUARDIAN_DETAILS_FIELD_ERROR } from '@constants/fines/mac';
import { FinesService } from '@services/fines';
import { IAbstractFieldErrors } from '@interfaces/components/abstract';

@Component({
  selector: 'app-fines-mac-parent-guardian-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
    FinesMacAddressBlockComponent,
    FinesMacNationalInsuranceNumberComponent,
    FinesMacDateOfBirthComponent,
  ],
  templateUrl: './fines-mac-parent-guardian-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacParentGuardianDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IFinesMacParentGuardianDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly customAddressFieldIds = FINES_MAC_ADDRESS_FIELD_IDS;
  protected readonly finesMacRoutes = FinesMacRoutes;

  override fieldErrors: IAbstractFieldErrors = {
    ...FINES_MAC__PARENT_GUARDIAN_DETAILS_FIELD_ERROR,
    ...FINES_MAC_DATE_OF_BIRTH_FIELD_ERRORS,
    ...FINES_MAC_NATIONAL_INSURANCE_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...FINES_MAC_POSTCODE_FIELD_ERRORS,
  };

  /**
   * Sets up the parent/guardian details form with the necessary form controls.
   */
  private setupParentGuardianDetailsForm(): void {
    this.form = new FormGroup({
      FullName: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      DOB: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      NationalInsuranceNumber: new FormControl(null, [nationalInsuranceNumberValidator()]),
      AddressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      AddressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      AddressLine3: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      Postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-parent-guardian-details-form component.
   * This method sets up the parent guardian details form, initializes error messages,
   * and repopulates the form with the previously entered data.
   */
  private initialSetup(): void {
    this.setupParentGuardianDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.finesService.finesMacState.parentGuardianDetails);
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
      const nestedFlow = event.submitter ? event.submitter.className.includes('nested-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, nestedFlow: nestedFlow });
    }
  }

  public override ngOnInit(): void {
    this.initialSetup();
    super.ngOnInit();
  }
}
