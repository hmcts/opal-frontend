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
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesMacContactDetailsFieldErrors } from '../interfaces/fines-mac-contact-details-field-errors.interface';
import { IFinesMacContactDetailsForm } from '../interfaces/fines-mac-contact-details-form.interface';
import { FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-contact-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { optionalPhoneNumberValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-telephone';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { EMAIL_ADDRESS_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';

//regex pattern validators for the form controls
const EMAIL_ADDRESS_PATTERN_VALIDATOR = patternValidator(EMAIL_ADDRESS_PATTERN, 'emailPattern');

@Component({
  selector: 'app-fines-mac-contact-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
    GovukTextInputComponent,
  ],
  templateUrl: './fines-mac-contact-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacContactDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacContactDetailsForm>();
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;
  public readonly defendantTypeKeys = FINES_MAC_DEFENDANT_TYPES_KEYS;

  @Input() public defendantType!: string;
  override fieldErrors: IFinesMacContactDetailsFieldErrors = FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the contact details form with the necessary form controls.
   */
  private setupContactDetailsForm(): void {
    this.form = new FormGroup({
      fm_contact_details_email_address_1: new FormControl(null, [
        optionalMaxLengthValidator(76),
        EMAIL_ADDRESS_PATTERN_VALIDATOR,
      ]),
      fm_contact_details_email_address_2: new FormControl(null, [
        optionalMaxLengthValidator(76),
        EMAIL_ADDRESS_PATTERN_VALIDATOR,
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
    const { formData } = this.finesMacStore.contactDetails();
    this.setupContactDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialContactDetailsSetup();
    super.ngOnInit();
  }
}
