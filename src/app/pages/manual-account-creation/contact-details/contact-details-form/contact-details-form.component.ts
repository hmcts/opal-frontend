import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationContactDetailsForm>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public nestedRouteButtonText!: string;

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
   * Retrieves the nested route based on the defendant type and sets the nested route button text accordingly.
   */
  private getNestedRoute(): void {
    const { defendantType } = this.macStateService.manualAccountCreation.accountDetails;
    if (defendantType) {
      const nestedRoute = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES[defendantType]?.['contactDetails'];
      switch (nestedRoute) {
        case ManualAccountCreationRoutes.employerDetails:
          this.nestedRouteButtonText = 'Add employer details';
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
    this.getNestedRoute();
    this.rePopulateForm(this.macStateService.manualAccountCreation.contactDetails);
    super.ngOnInit();
  }
}
