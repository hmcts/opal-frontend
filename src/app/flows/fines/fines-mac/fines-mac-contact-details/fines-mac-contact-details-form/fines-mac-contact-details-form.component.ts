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
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalEmailAddressValidator } from '@validators/optional-valid-email-address/optional-valid-email-address.validator';
import { optionalPhoneNumberValidator } from '@validators/optional-valid-telephone/optional-valid-telephone.validator';
import { IFinesMacContactDetailsFieldErrors } from '../interfaces/fines-mac-contact-details-field-errors.interface';
import { IFinesMacContactDetailsForm } from '../interfaces/fines-mac-contact-details-form.interface';

import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-contact-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';

@Component({
  selector: 'app-fines-mac-contact-details-form',

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
export class FinesMacContactDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacContactDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IFinesMacContactDetailsFieldErrors = FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the contact details form with the necessary form controls.
   */
  private setupContactDetailsForm(): void {
    this.form = new FormGroup({
      fm_contact_details_email_address_1: new FormControl(null, [
        optionalMaxLengthValidator(76),
        optionalEmailAddressValidator(),
      ]),
      fm_contact_details_email_address_2: new FormControl(null, [
        optionalMaxLengthValidator(76),
        optionalEmailAddressValidator(),
      ]),
      fm_contact_details_telephone_number_mobile: new FormControl(null, [
        optionalMaxLengthValidator(35),
        optionalPhoneNumberValidator(),
      ]),
      fm_contact_details_telephone_number_home: new FormControl(null, [
        optionalMaxLengthValidator(35),
        optionalPhoneNumberValidator(),
      ]),
      fm_contact_details_telephone_number_business: new FormControl(null, [
        optionalMaxLengthValidator(35),
        optionalPhoneNumberValidator(),
      ]),
    });
  }

  /**
   * Performs the initial setup for the fines-mac-contact-details-form component.
   * This method sets up the contact details form, initializes error messages, and populates the form with data.
   */
  private initialContactDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.contactDetails;
    this.setupContactDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialContactDetailsSetup();
    super.ngOnInit();
  }
}
