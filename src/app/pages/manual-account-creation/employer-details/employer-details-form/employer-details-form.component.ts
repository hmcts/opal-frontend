import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GovukTextInputComponent,
  GovukButtonComponent,
  GovukErrorSummaryComponent,
  FormBaseComponent,
  GovukCancelLinkComponent,
} from '@components';
import { MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FIELD_ERROR } from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationEmployerDetailsState, IFieldErrors } from '@interfaces';
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
  ],
  templateUrl: './employer-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationEmployerDetailsState>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

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
    this.setupEmployerDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.employerDetails);
    super.ngOnInit();
  }
}
