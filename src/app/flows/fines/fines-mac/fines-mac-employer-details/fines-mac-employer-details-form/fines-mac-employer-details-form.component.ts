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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';

import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { IFinesMacEmployerDetailsForm } from '../interfaces/fines-mac-employer-details-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';

import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalEmailAddressValidator } from '@validators/optional-valid-email-address/optional-valid-email-address.validator';
import { optionalPhoneNumberValidator } from '@validators/optional-valid-telephone/optional-valid-telephone.validator';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';
import { FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-employer-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';

import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_TELEPHONE_NUMBER as F_M_EMPLOYER_DETAILS_EMPLOYER_TELEPHONE_NUMBER } from '../constants/controls/fines-mac-employer-details-controls-employer-telephone-number';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_EMAIL_ADDRESS as F_M_EMPLOYER_DETAILS_EMPLOYER_EMAIL_ADDRESS } from '../constants/controls/fines-mac-employer-details-controls-employer-email-address';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_FIVE as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_FIVE } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-five';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_FOUR as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_FOUR } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-four';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_THREE as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_THREE } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-three';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_TWO as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_TWO } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-two';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_POSTCODE as F_M_EMPLOYER_DETAILS_EMPLOYER_POSTCODE } from '../constants/controls/fines-mac-employer-details-controls-employer-postcode';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_ONE as F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_ONE } from '../constants/controls/fines-mac-employer-details-controls-employer-address-line-one';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_REFERENCE as F_M_EMPLOYER_DETAILS_EMPLOYER_REFERENCE } from '../constants/controls/fines-mac-employer-details-controls-employer-reference';
import { FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_COMPANY_NAME as F_M_EMPLOYER_DETAILS_EMPLOYER_COMPANY_NAME } from '../constants/controls/fines-mac-employer-details-controls-employer-company-name';

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
export class FinesMacEmployerDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacEmployerDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors = FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS;

  public employerDetailsTelephoneNumber = F_M_EMPLOYER_DETAILS_EMPLOYER_TELEPHONE_NUMBER;
  public employerDetailsEmailAddress = F_M_EMPLOYER_DETAILS_EMPLOYER_EMAIL_ADDRESS;
  public employerDetailsAddressLineFive = F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_FIVE;
  public employerDetailsAddressLineFour = F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_FOUR;
  public employerDetailsAddressLineThree = F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_THREE;
  public employerDetailsAddressLineTwo = F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_TWO;
  public employerDetailsPostcode = F_M_EMPLOYER_DETAILS_EMPLOYER_POSTCODE;
  public employerDetailsAddressLineOne = F_M_EMPLOYER_DETAILS_EMPLOYER_ADDRESS_LINE_ONE;
  public employerDetailsEmployerReference = F_M_EMPLOYER_DETAILS_EMPLOYER_REFERENCE;
  public employerDetailsEmployerCompanyName = F_M_EMPLOYER_DETAILS_EMPLOYER_COMPANY_NAME;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupEmployerDetailsForm(): void {
    this.form = new FormGroup({
      [this.employerDetailsEmployerCompanyName.controlName]: this.createFormControl(
        this.employerDetailsEmployerCompanyName.validators,
      ),
      [this.employerDetailsEmployerReference.controlName]: this.createFormControl(
        this.employerDetailsEmployerReference.validators,
      ),
      [this.employerDetailsEmailAddress.controlName]: this.createFormControl(
        this.employerDetailsEmailAddress.validators,
      ),
      [this.employerDetailsTelephoneNumber.controlName]: this.createFormControl(
        this.employerDetailsTelephoneNumber.validators,
      ),
      [this.employerDetailsAddressLineOne.controlName]: this.createFormControl(
        this.employerDetailsAddressLineOne.validators,
      ),
      [this.employerDetailsAddressLineTwo.controlName]: this.createFormControl(
        this.employerDetailsAddressLineTwo.validators,
      ),
      [this.employerDetailsAddressLineThree.controlName]: this.createFormControl(
        this.employerDetailsAddressLineThree.validators,
      ),
      [this.employerDetailsAddressLineFour.controlName]: this.createFormControl(
        this.employerDetailsAddressLineFour.validators,
      ),
      [this.employerDetailsAddressLineFive.controlName]: this.createFormControl(
        this.employerDetailsAddressLineFive.validators,
      ),
      [this.employerDetailsPostcode.controlName]: this.createFormControl(this.employerDetailsPostcode.validators),
    });
  }

  /**
   * Performs the initial setup for the employer details form.
   * This method sets up the employer details form, initializes error messages,
   * and repopulates the form with the initial values.
   */
  private initialEmployerDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.employerDetails;
    this.setupEmployerDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialEmployerDetailsSetup();
    super.ngOnInit();
  }
}
