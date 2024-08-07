import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBaseComponent } from '@components/abstract';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import { IFinesMacEmployerDetailsForm } from '../../interfaces';
import { FinesMacRoutes } from '../../enums';
import { FINES_MAC_NESTED_ROUTES } from '../../constants/fines-mac-nested-routes';
import { FINES_MAC_EMPLOYER_DETAILS_FIELD_ERROR } from '../../constants';
import { IFieldErrors } from '@interfaces';
import {
  optionalMaxLengthValidator,
  optionalEmailAddressValidator,
  optionalPhoneNumberValidator,
  specialCharactersValidator,
} from '@validators';

@Component({
  selector: 'app-fines-mac-employer-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-employer-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacEmployerDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() private formSubmit = new EventEmitter<IFinesMacEmployerDetailsForm>();

  public readonly finesMacRoutes = FinesMacRoutes;
  public readonly finesMacNestedRoutes = FINES_MAC_NESTED_ROUTES;

  override fieldErrors: IFieldErrors = FINES_MAC_EMPLOYER_DETAILS_FIELD_ERROR;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupEmployerDetailsForm(): void {
    this.form = new FormGroup({
      EmployerCompanyName: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
      EmployerReference: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      EmployerEmailAddress: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      EmployerTelephoneNumber: new FormControl(null, [optionalMaxLengthValidator(20), optionalPhoneNumberValidator()]),
      EmployerAddressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      EmployerAddressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      EmployerAddressLine3: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      EmployerAddressLine4: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      EmployerAddressLine5: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      EmployerPostcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Performs the initial setup for the employer details form.
   * This method sets up the employer details form, initializes error messages,
   * and repopulates the form with the initial values.
   */
  private initialSetup(): void {
    this.setupEmployerDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.finesService.finesMacState.employerDetails);
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
