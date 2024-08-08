import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import { IFieldErrors } from '@interfaces';
import { FormBaseComponent } from '@components/abstract';
import { optionalMaxLengthValidator, optionalEmailAddressValidator, optionalPhoneNumberValidator } from '@validators';
import { IFinesMacContactDetailsForm } from '@interfaces/fines/mac';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FINES_MAC_NESTED_ROUTES, FINES_MAC_CONTACT_DETAILS_FIELD_ERROR } from '@constants/fines/mac';
import { FinesService } from '@services/fines';

@Component({
  selector: 'app-fines-mac-contact-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-contact-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacContactDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() private formSubmit = new EventEmitter<IFinesMacContactDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly finesMacRoutes = FinesMacRoutes;
  protected readonly finesMacNestedRoutes = FINES_MAC_NESTED_ROUTES;

  override fieldErrors: IFieldErrors = FINES_MAC_CONTACT_DETAILS_FIELD_ERROR;

  /**
   * Sets up the contact details form with the necessary form controls.
   */
  private setupContactDetailsForm(): void {
    this.form = new FormGroup({
      EmailAddress1: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      EmailAddress2: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      TelephoneNumberMobile: new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
      TelephoneNumberHome: new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
      TelephoneNumberBusiness: new FormControl(null, [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()]),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-contact-details-form component.
   * This method sets up the contact details form, initializes error messages, and populates the form with data.
   */
  private initialSetup(): void {
    this.setupContactDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.finesService.finesMacState.contactDetails);
  }

  /**
   * Handles the form submission event.
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
