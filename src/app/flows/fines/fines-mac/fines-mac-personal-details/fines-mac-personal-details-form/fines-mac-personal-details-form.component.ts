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
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormAliasBaseComponent } from '@components/abstract/abstract-form-alias-base/abstract-form-alias-base';
import { FinesMacAddressBlockComponent } from '../../components/fines-mac-address-block/fines-mac-address-block.component';
import { FinesMacDateOfBirthComponent } from '../../components/fines-mac-date-of-birth/fines-mac-date-of-birth.component';
import { FinesMacNameAliasComponent } from '../../components/fines-mac-name-alias/fines-mac-name-alias.component';
import { FinesMacNameComponent } from '../../components/fines-mac-name/fines-mac-name.component';
import { FinesMacNationalInsuranceNumberComponent } from '../../components/fines-mac-national-insurance-number/fines-mac-national-insurance-number.component';
import { FinesMacVehicleDetailsComponent } from '../../components/fines-mac-vehicle-details/fines-mac-vehicle-details.component';

import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukSelectComponent } from '@components/govuk/govuk-select/govuk-select.component';

import { IFinesMacPersonalDetailsDefendantTypes } from '../interfaces/fines-mac-personal-details-defendant-types.interface';
import { IFinesMacPersonalDetailsFieldErrors } from '../interfaces/fines-mac-personal-details-field-errors.interface';
import { IFinesMacPersonalDetailsForm } from '../interfaces/fines-mac-personal-details-form.interface';

import { FinesService } from '@services/fines/fines-service/fines.service';
import { IGovUkSelectOptions } from '@components/govuk/govuk-select/interfaces/govuk-select-options.interface';

import { FINES_MAC_PERSONAL_DETAILS_ADDRESS_BLOCK_FIELD_IDS } from '../constants/fines-mac-personal-details-address-block-field-ids';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS_FIELD_ERRORS } from '../constants/fines-mac-personal-details-alias-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_DATE_OF_BIRTH_FIELD_ERRORS } from '../constants/fines-mac-personal-details-date-of-birth-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-personal-details-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_NAME_FIELD_ERRORS } from '../constants/fines-mac-personal-details-name-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_TITLE_DROPDOWN_OPTIONS } from '../constants/fines-mac-personal-details-title-dropdown-options';
import { FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_IDS } from '../constants/fines-mac-personal-details-vehicle-details-field-ids';
import { FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_ONE_FIELD_ERRORS } from '../constants/fines-mac-personal-details-address-line-one-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS } from '../constants/fines-mac-personal-details-address-line-three-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS } from '../constants/fines-mac-personal-details-address-line-two-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_ADDRESS_POSTCODE_FIELD_ERRORS } from '../constants/fines-mac-personal-details-address-postcode-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS } from '../constants/fines-mac-personal-details-alias';
import { FINES_MAC_PERSONAL_DETAILS_NAME_FIELD_IDS } from '../constants/fines-mac-personal-details-name-field-ids';
import { FINES_MAC_PERSONAL_DETAILS_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS } from '../constants/fines-mac-personal-details-national-insurance-number-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-personal-details-vehicle-details-field-errors';

// FORM CONTROLS
import { FINES_MAC_CONTROLS_ALIASES as F_M_PERSONAL_DETAILS_ALIASES } from '../../constants/controls/fines-mac-controls-aliases';
import { FINES_MAC_CONTROLS_FORENAMES as F_M_PERSONAL_DETAILS_FORENAMES } from '../../constants/controls/fines-mac-controls-forenames';
import { FINES_MAC_CONTROLS_SURNAME as F_M_PERSONAL_DETAILS_SURNAME } from '../../constants/controls/fines-mac-controls-surname';
import { FINES_MAC_CONTROLS_ADD_ALIAS as F_M_PERSONAL_DETAILS_ADD_ALIAS } from '../../constants/controls/fines-mac-controls-add-alias';
import { FINES_MAC_CONTROLS_DOB as F_M_PERSONAL_DETAILS_DOB } from '../../constants/controls/fines-mac-controls-dob';
import { FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER as F_M_PERSONAL_DETAILS_NATIONAL_INSURANCE_NUMBER } from '../../constants/controls/fines-mac-controls-national-insurance-number';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_ONE as F_M_PERSONAL_DETAILS_ADDRESS_LINE_ONE } from '../../constants/controls/fines-mac-controls-address-line-one';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_TWO as F_M_PERSONAL_DETAILS_ADDRESS_LINE_TWO } from '../../constants/controls/fines-mac-controls-address-line-two';
import { FINES_MAC_CONTROLS_POSTCODE as F_M_PERSONAL_DETAILS_POSTCODE } from '../../constants/controls/fines-mac-controls-postcode';
import { FINES_MAC_CONTROLS_VEHICLE_MAKE as F_M_PERSONAL_DETAILS_VEHICLE_MAKE } from '../../constants/controls/fines-mac-controls-vehicle-make';
import { FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK as F_M_PERSONAL_DETAILS_VEHICLE_REGISTRATION_MARK } from '../../constants/controls/fines-mac-controls-vehicle-registration-mark';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_THREE as F_M_PERSONAL_DETAILS_ADDRESS_LINE_THREE } from '../../constants/controls/fines-mac-controls-address-line-three';
import { FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE as F_M_PERSONAL_DETAILS_TITLE } from '../constants/controls/fines-mac-personal-details-controls-title';

import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { DateService } from '@services/date-service/date.service';
import { takeUntil } from 'rxjs';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

@Component({
  selector: 'app-fines-mac-personal-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukSelectComponent,
    GovukCancelLinkComponent,
    MojTicketPanelComponent,
    FinesMacAddressBlockComponent,
    FinesMacDateOfBirthComponent,
    FinesMacNationalInsuranceNumberComponent,
    FinesMacNameAliasComponent,
    FinesMacVehicleDetailsComponent,
    FinesMacNameComponent,
  ],
  templateUrl: './fines-mac-personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPersonalDetailsFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacPersonalDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly dateService = inject(DateService);
  protected readonly customNameFieldIds = FINES_MAC_PERSONAL_DETAILS_NAME_FIELD_IDS;
  protected readonly customAddressFieldIds = FINES_MAC_PERSONAL_DETAILS_ADDRESS_BLOCK_FIELD_IDS;
  protected readonly customVehicleDetailsFieldIds = FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_IDS;
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  public personalDetailsAliases = F_M_PERSONAL_DETAILS_ALIASES;
  public personalDetailsForenames = F_M_PERSONAL_DETAILS_FORENAMES;
  public personalDetailsSurname = F_M_PERSONAL_DETAILS_SURNAME;
  public personalDetailsAddAlias = F_M_PERSONAL_DETAILS_ADD_ALIAS;
  public personalDetailsDob = F_M_PERSONAL_DETAILS_DOB;
  public personalDetailsNationalInsuranceNumber = F_M_PERSONAL_DETAILS_NATIONAL_INSURANCE_NUMBER;
  public personalDetailsAddressLineOne = F_M_PERSONAL_DETAILS_ADDRESS_LINE_ONE;
  public personalDetailsAddressLineTwo = F_M_PERSONAL_DETAILS_ADDRESS_LINE_TWO;
  public personalDetailsAddressLineThree = F_M_PERSONAL_DETAILS_ADDRESS_LINE_THREE;
  public personalDetailsPostcode = F_M_PERSONAL_DETAILS_POSTCODE;
  public personalDetailsVehicleMake = F_M_PERSONAL_DETAILS_VEHICLE_MAKE;
  public personalDetailsVehicleRegistrationMark = F_M_PERSONAL_DETAILS_VEHICLE_REGISTRATION_MARK;
  public personalDetailsTitle = F_M_PERSONAL_DETAILS_TITLE;

  override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS,
    ...FINES_MAC_PERSONAL_DETAILS_NAME_FIELD_ERRORS,
    ...FINES_MAC_PERSONAL_DETAILS_ALIAS_FIELD_ERRORS,
    ...FINES_MAC_PERSONAL_DETAILS_DATE_OF_BIRTH_FIELD_ERRORS,
    ...FINES_MAC_PERSONAL_DETAILS_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS,
    ...FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...FINES_MAC_PERSONAL_DETAILS_ADDRESS_POSTCODE_FIELD_ERRORS,
  };

  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_PERSONAL_DETAILS_TITLE_DROPDOWN_OPTIONS;
  public yesterday!: string;

  public age!: number;
  public ageLabel!: string;

  /**
   * Sets up the personal details form.
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      [this.personalDetailsAliases.controlName]: this.createFormArray(this.personalDetailsAliases.validators, []),
      [this.personalDetailsForenames.controlName]: this.createFormControl(this.personalDetailsForenames.validators),
      [this.personalDetailsSurname.controlName]: this.createFormControl(this.personalDetailsSurname.validators),
      [this.personalDetailsAddAlias.controlName]: this.createFormControl(this.personalDetailsAddAlias.validators),
      [this.personalDetailsDob.controlName]: this.createFormControl(this.personalDetailsDob.validators),
      [this.personalDetailsNationalInsuranceNumber.controlName]: this.createFormControl(
        this.personalDetailsNationalInsuranceNumber.validators,
      ),
      [this.personalDetailsAddressLineOne.controlName]: this.createFormControl(
        this.personalDetailsAddressLineOne.validators,
      ),
      [this.personalDetailsAddressLineTwo.controlName]: this.createFormControl(
        this.personalDetailsAddressLineTwo.validators,
      ),
      [this.personalDetailsAddressLineThree.controlName]: this.createFormControl(
        this.personalDetailsAddressLineThree.validators,
      ),
      [this.personalDetailsPostcode.controlName]: this.createFormControl(this.personalDetailsPostcode.validators),
      [this.personalDetailsVehicleMake.controlName]: this.createFormControl(this.personalDetailsVehicleMake.validators),
      [this.personalDetailsVehicleRegistrationMark.controlName]: this.createFormControl(
        this.personalDetailsVehicleRegistrationMark.validators,
      ),
      [this.personalDetailsTitle.controlName]: this.createFormControl(this.personalDetailsTitle.validators),
    });
  }

  /**
   * Sets up the alias configuration for the personal details form.
   * The alias configuration includes the alias fields and controls validation.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = FINES_MAC_PERSONAL_DETAILS_ALIAS.map((control) => control.controlName);
    this.aliasControlsValidation = FINES_MAC_PERSONAL_DETAILS_ALIAS;
  }

  /**
   * Adds vehicle details field errors to the existing field errors object.
   * The field errors are merged with the existing field errors using the spread operator.
   * @returns void
   */
  private addVehicleDetailsFieldErrors(): void {
    this.fieldErrors = {
      ...this.fieldErrors,
      ...FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_ERRORS,
    };
  }

  /**
   * Listens for changes in the date of birth control and updates the age and label accordingly.
   */
  private dateOfBirthListener(): void {
    const dobControl = this.form.controls['dob'];

    // Initial update if the date of birth is already populated
    if (dobControl.value) {
      this.updateAgeAndLabel(dobControl.value);
    }

    // Subscribe to changes in the date of birth control
    dobControl.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((dateOfBirth) => {
      this.updateAgeAndLabel(dateOfBirth);
    });
  }

  /**
   * Updates the age and age label based on the provided date of birth.
   *
   * @param dateOfBirth - The date of birth in string format.
   */
  private updateAgeAndLabel(dateOfBirth: string): void {
    if (this.dateService.isValidDate(dateOfBirth)) {
      const { formData: paymentTermsFormData } = this.finesService.finesMacState.paymentTerms;
      this.age = this.dateService.calculateAge(dateOfBirth);
      this.ageLabel = this.age >= 18 ? 'Adult' : 'Youth';

      // Reset payment terms default date data
      paymentTermsFormData.has_days_in_default = false;
      paymentTermsFormData.days_in_default_date = null;
      paymentTermsFormData.days_in_default = null;
    }
  }

  /**
   * Sets up the initial personal details for the fines-mac-personal-details-form component.
   * This method initializes the personal details form, alias configuration, alias form controls,
   * adds vehicle details field errors if the defendant type is 'adultOrYouthOnly', sets initial
   * error messages, repopulates the form with personal details, and sets up the alias checkbox listener.
   */
  private initialPersonalDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.personalDetails;
    const key = this.defendantType as keyof IFinesMacPersonalDetailsDefendantTypes;
    this.setupPersonalDetailsForm();

    this.setupAliasConfiguration();
    this.setupAliasFormControls([...Array(formData.aliases.length).keys()], 'aliases');
    if (key === 'adultOrYouthOnly') {
      this.addVehicleDetailsFieldErrors();
    }
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('add_alias', 'aliases');
    this.dateOfBirthListener();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  public override ngOnInit(): void {
    this.initialPersonalDetailsSetup();
    super.ngOnInit();
  }
}
