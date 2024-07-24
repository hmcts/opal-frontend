import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormBaseComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components';
import { MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_FIELD_ERROR, MANUAL_ACCOUNT_CREATION_NESTED_ROUTES } from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors, IManualAccountCreationContactDetailsForm } from '@interfaces';
import {
  optionalMaxLengthValidator,
  optionalEmailAddressValidator,
  optionalPhoneNumberValidator,
} from 'src/app/validators';

@Component({
  selector: 'app-contact-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './contact-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationContactDetailsForm>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly manualAccountCreationNestedRoutes = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES;

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_FIELD_ERROR;

  /**
   * Sets up the contact details form with the necessary form controls.
   */
  private setupContactDetailsForm(): void {
    this.form = new FormGroup({
      primaryEmailAddress: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      secondaryEmailAddress: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      mobileTelephoneNumber: new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
      homeTelephoneNumber: new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
      workTelephoneNumber: new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
    });
  }

  /**
   * Handles the form submission event.
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
    this.setupContactDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.contactDetails);
    super.ngOnInit();
  }
}
