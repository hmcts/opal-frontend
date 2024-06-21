import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GovukTextInputComponent,
  GovukButtonComponent,
  GovukErrorSummaryComponent,
  FormBaseComponent,
  GovukBackLinkComponent,
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
    GovukBackLinkComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './employer-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationEmployerDetailsState>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FIELD_ERROR;
  override stateModel = this.stateService.manualAccountCreation.employerDetails;

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
   * Repopulates the form data with either the snapshot form data or the regular form data,
   * depending on whether there are unsaved changes.
   */
  private repopulateSnapshotFormData(): void {
    const { snapshotFormData, formData } = this.stateService.manualAccountCreation.employerDetails;
    if (this.stateUnsavedChanges) {
      this.rePopulateForm(snapshotFormData, true);
    } else {
      this.rePopulateForm(formData);
    }
  }

  /**
   * Sets the state of unsaved changes based on the snapshot form data.
   */
  private setStateUnsavedChanges(): void {
    const { snapshotFormData } = this.stateService.manualAccountCreation.employerDetails;
    this.stateUnsavedChanges = !!snapshotFormData.employerName;
    this.unsavedChanges.emit(this.stateUnsavedChanges);
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({
        formData: this.form.value,
        snapshotFormData: {} as any,
      });
    }
  }

  public override ngOnInit(): void {
    this.setupEmployerDetailsForm();
    this.setInitialErrorMessages();
    this.setStateUnsavedChanges();
    this.repopulateSnapshotFormData();
    super.ngOnInit();
  }
}
