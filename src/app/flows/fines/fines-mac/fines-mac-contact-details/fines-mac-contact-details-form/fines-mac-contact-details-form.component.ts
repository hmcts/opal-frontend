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

import { IFinesMacContactDetailsFieldErrors } from '../interfaces/fines-mac-contact-details-field-errors.interface';
import { IFinesMacContactDetailsForm } from '../interfaces/fines-mac-contact-details-form.interface';

import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-contact-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';

import { FINES_MAC_CONTACT_DETAILS_CONTROLS_EMAIL_ADDRESS_ONE as FM_C_D_EMAIL_ADDRESS_ONE } from '../constants/controls/fines-mac-contact-details-controls-email-address-one';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_EMAIL_ADDRESS_TWO as FM_C_D_EMAIL_ADDRESS_TWO } from '../constants/controls/fines-mac-contact-details-controls-email-address-2';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_MOBILE as FM_C_D_TELEPHONE_NUMBER_MOBILE } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-mobile';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_HOME as FM_C_D_TELEPHONE_NUMBER_HOME } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-home';
import { FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_BUSINESS as FM_C_D_TELEPHONE_NUMBER_BUSINESS } from '../constants/controls/fines-mac-contact-details-controls-telephone-number-business';

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
export class FinesMacContactDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacContactDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors = FINES_MAC_CONTACT_DETAILS_FIELD_ERRORS;

  public contactDetailsEmailAddressOne = FM_C_D_EMAIL_ADDRESS_ONE;
  public contactDetailsEmailAddressTwo = FM_C_D_EMAIL_ADDRESS_TWO;
  public contactDetailsTelephoneNumberMobile = FM_C_D_TELEPHONE_NUMBER_MOBILE;
  public contactDetailsTelephoneNumberHome = FM_C_D_TELEPHONE_NUMBER_HOME;
  public contactDetailsTelephoneNumberBusiness = FM_C_D_TELEPHONE_NUMBER_BUSINESS;

  /**
   * Sets up the contact details form with the necessary form controls.
   */
  private setupContactDetailsForm(): void {
    this.form = new FormGroup({
      [this.contactDetailsEmailAddressOne.controlName]: this.createFormControl(
        this.contactDetailsEmailAddressOne.validators,
      ),
      [this.contactDetailsEmailAddressTwo.controlName]: this.createFormControl(
        this.contactDetailsEmailAddressTwo.validators,
      ),
      [this.contactDetailsTelephoneNumberMobile.controlName]: this.createFormControl(
        this.contactDetailsTelephoneNumberMobile.validators,
      ),
      [this.contactDetailsTelephoneNumberHome.controlName]: this.createFormControl(
        this.contactDetailsTelephoneNumberHome.validators,
      ),
      [this.contactDetailsTelephoneNumberBusiness.controlName]: this.createFormControl(
        this.contactDetailsTelephoneNumberBusiness.validators,
      ),
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
