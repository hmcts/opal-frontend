import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GovukTextInputComponent,
  GovukButtonComponent,
  GovukErrorSummaryComponent,
  FormBaseComponent,
  GovukCancelLinkComponent,
} from '@components';
import {
  MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FIELD_ERROR,
  MANUAL_ACCOUNT_CREATION_NESTED_ROUTES,
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors, IManualAccountCreationEmployerDetailsForm } from '@interfaces';
import {
  optionalMaxLengthValidator,
  optionalEmailAddressValidator,
  optionalPhoneNumberValidator,
  specialCharactersValidator,
} from 'src/app/validators';

@Component({
  selector: 'app-employer-details-form',
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
  templateUrl: './employer-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationEmployerDetailsForm>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public nestedRouteButtonText!: string;

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FIELD_ERROR;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupEmployerDetailsForm(): void {
    this.form = new FormGroup({
      employerName: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
      employeeReference: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      employerEmailAddress: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      employerTelephone: new FormControl(null, [optionalMaxLengthValidator(20), optionalPhoneNumberValidator()]),
      employerAddress1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      employerAddress2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employerAddress3: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employerAddress4: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employerAddress5: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employerPostcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Retrieves the nested route based on the defendant type and sets the nested route button text accordingly.
   */
  private getNestedRoute(): void {
    const { defendantType } = this.macStateService.manualAccountCreation.accountDetails;
    if (defendantType) {
      const nestedRoute = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES[defendantType]?.['employerDetails'];
      switch (nestedRoute) {
        case ManualAccountCreationRoutes.personalDetails:
          this.nestedRouteButtonText = 'Add personal details';
          break;
        case ManualAccountCreationRoutes.offenceDetails:
          this.nestedRouteButtonText = 'Add offence details';
          break;
        default:
          this.nestedRouteButtonText = '';
          break;
      }
    }
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
    this.setupEmployerDetailsForm();
    this.setInitialErrorMessages();
    this.getNestedRoute();
    this.rePopulateForm(this.macStateService.manualAccountCreation.employerDetails);
    super.ngOnInit();
  }
}
