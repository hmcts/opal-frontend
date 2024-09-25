import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AbstractFormAliasBaseComponent } from '@components/abstract/abstract-form-alias-base/abstract-form-alias-base';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { FinesMacAddressBlockComponent } from '../../components/fines-mac-address-block/fines-mac-address-block.component';
import { FinesMacDateOfBirthComponent } from '../../components/fines-mac-date-of-birth/fines-mac-date-of-birth.component';
import { FinesMacNameAliasComponent } from '../../components/fines-mac-name-alias/fines-mac-name-alias.component';
import { FinesMacNationalInsuranceNumberComponent } from '../../components/fines-mac-national-insurance-number/fines-mac-national-insurance-number.component';
import { FinesMacVehicleDetailsComponent } from '../../components/fines-mac-vehicle-details/fines-mac-vehicle-details.component';
import { FinesMacNameComponent } from '../../components/fines-mac-name/fines-mac-name.component';

import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFinesMacParentGuardianDetailsForm } from '../interfaces/fines-mac-parent-guardian-details-form.interface';

import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_BLOCK_FIELD_IDS } from '../constants/fines-mac-parent-guardian-details-address-block-field-ids';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-address-line-one-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-address-line-two-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-address-line-three-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_POSTCODE_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-address-postcode-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS } from '../constants/fines-mac-parent-guardian-details-alias';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-alias-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_DATE_OF_BIRTH_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-date-of-birth-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_NAME_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-name-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_NAME_FIELD_IDS } from '../constants/fines-mac-parent-guardian-details-name-field-ids';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-national-insurance-number-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_VEHICLE_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-vehicle-details-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_VEHICLE_DETAILS_FIELD_IDS } from '../constants/fines-mac-parent-guardian-details-vehicle-details-field-ids';

// FORM CONTROLS
import { FINES_MAC_CONTROLS_ALIASES as F_M_PARENT_GUARDIAN_DETAILS_ALIASES } from '../../constants/controls/fines-mac-controls-aliases';
import { FINES_MAC_CONTROLS_FORENAMES as F_M_PARENT_GUARDIAN_DETAILS_FORENAMES } from '../../constants/controls/fines-mac-controls-forenames';
import { FINES_MAC_CONTROLS_SURNAME as F_M_PARENT_GUARDIAN_DETAILS_SURNAME } from '../../constants/controls/fines-mac-controls-surname';
import { FINES_MAC_CONTROLS_ADD_ALIAS as F_M_PARENT_GUARDIAN_DETAILS_ADD_ALIAS } from '../../constants/controls/fines-mac-controls-add-alias';
import { FINES_MAC_CONTROLS_DOB as F_M_PARENT_GUARDIAN_DETAILS_DOB } from '../../constants/controls/fines-mac-controls-dob';
import { FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER as F_M_PARENT_GUARDIAN_DETAILS_NATIONAL_INSURANCE_NUMBER } from '../../constants/controls/fines-mac-controls-national-insurance-number';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_ONE as F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE } from '../../constants/controls/fines-mac-controls-address-line-one';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_TWO as F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO } from '../../constants/controls/fines-mac-controls-address-line-two';
import { FINES_MAC_CONTROLS_POSTCODE as F_M_PARENT_GUARDIAN_DETAILS_POSTCODE } from '../../constants/controls/fines-mac-controls-postcode';
import { FINES_MAC_CONTROLS_VEHICLE_MAKE as F_M_PARENT_GUARDIAN_DETAILS_VEHICLE_MAKE } from '../../constants/controls/fines-mac-controls-vehicle-make';
import { FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK as F_M_PARENT_GUARDIAN_DETAILS_VEHICLE_REGISTRATION_MARK } from '../../constants/controls/fines-mac-controls-vehicle-registration-mark';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_CONTROLS_ADDRESS_LINE_THREE as F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE } from '../constants/controls/fines-mac-parent-guardian-details-controls-address-line-three';

import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

@Component({
  selector: 'app-fines-mac-parent-guardian-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
    FinesMacAddressBlockComponent,
    FinesMacNationalInsuranceNumberComponent,
    FinesMacDateOfBirthComponent,
    FinesMacNameAliasComponent,
    FinesMacVehicleDetailsComponent,
    FinesMacNameComponent,
  ],
  templateUrl: './fines-mac-parent-guardian-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacParentGuardianDetailsFormComponent
  extends AbstractFormAliasBaseComponent
  implements OnInit, OnDestroy
{
  @Output() protected override formSubmit = new EventEmitter<IFinesMacParentGuardianDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly customNameFieldIds = FINES_MAC_PARENT_GUARDIAN_DETAILS_NAME_FIELD_IDS;
  protected readonly customAddressFieldIds = FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_BLOCK_FIELD_IDS;
  protected readonly customVehicleDetailsFieldIds = FINES_MAC_PARENT_GUARDIAN_DETAILS_VEHICLE_DETAILS_FIELD_IDS;
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_NAME_FIELD_ERRORS,
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS_FIELD_ERRORS,
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_DATE_OF_BIRTH_FIELD_ERRORS,
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS,
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_POSTCODE_FIELD_ERRORS,
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_VEHICLE_DETAILS_FIELD_ERRORS,
  };

  public parentGuardianDetailsAliases = F_M_PARENT_GUARDIAN_DETAILS_ALIASES;
  public parentGuardianDetailsForenames = F_M_PARENT_GUARDIAN_DETAILS_FORENAMES;
  public parentGuardianDetailsSurname = F_M_PARENT_GUARDIAN_DETAILS_SURNAME;
  public parentGuardianDetailsAddAlias = F_M_PARENT_GUARDIAN_DETAILS_ADD_ALIAS;
  public parentGuardianDetailsDob = F_M_PARENT_GUARDIAN_DETAILS_DOB;
  public parentGuardianDetailsNationalInsuranceNumber = F_M_PARENT_GUARDIAN_DETAILS_NATIONAL_INSURANCE_NUMBER;
  public parentGuardianDetailsAddressLineOne = F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE;
  public parentGuardianDetailsAddressLineTwo = F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO;
  public parentGuardianDetailsAddressLineThree = F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE;
  public parentGuardianDetailsPostcode = F_M_PARENT_GUARDIAN_DETAILS_POSTCODE;
  public parentGuardianDetailsVehicleMake = F_M_PARENT_GUARDIAN_DETAILS_VEHICLE_MAKE;
  public parentGuardianDetailsVehicleRegistrationMark = F_M_PARENT_GUARDIAN_DETAILS_VEHICLE_REGISTRATION_MARK;

  /**
   * Sets up the parent/guardian details form with the necessary form controls.
   */
  private setupParentGuardianDetailsForm(): void {
    this.form = new FormGroup({
      [this.parentGuardianDetailsAliases.controlName]: this.createFormArray(
        this.parentGuardianDetailsAliases.validators,
        [],
      ),
      [this.parentGuardianDetailsForenames.controlName]: this.createFormControl(
        this.parentGuardianDetailsForenames.validators,
      ),
      [this.parentGuardianDetailsSurname.controlName]: this.createFormControl(
        this.parentGuardianDetailsSurname.validators,
      ),
      [this.parentGuardianDetailsAddAlias.controlName]: this.createFormControl(
        this.parentGuardianDetailsAddAlias.validators,
      ),
      [this.parentGuardianDetailsDob.controlName]: this.createFormControl(this.parentGuardianDetailsDob.validators),
      [this.parentGuardianDetailsNationalInsuranceNumber.controlName]: this.createFormControl(
        this.parentGuardianDetailsNationalInsuranceNumber.validators,
      ),
      [this.parentGuardianDetailsAddressLineOne.controlName]: this.createFormControl(
        this.parentGuardianDetailsAddressLineOne.validators,
      ),
      [this.parentGuardianDetailsAddressLineTwo.controlName]: this.createFormControl(
        this.parentGuardianDetailsAddressLineTwo.validators,
      ),
      [this.parentGuardianDetailsAddressLineThree.controlName]: this.createFormControl(
        this.parentGuardianDetailsAddressLineThree.validators,
      ),
      [this.parentGuardianDetailsPostcode.controlName]: this.createFormControl(
        this.parentGuardianDetailsPostcode.validators,
      ),
      [this.parentGuardianDetailsVehicleMake.controlName]: this.createFormControl(
        this.parentGuardianDetailsVehicleMake.validators,
      ),
      [this.parentGuardianDetailsVehicleRegistrationMark.controlName]: this.createFormControl(
        this.parentGuardianDetailsVehicleRegistrationMark.validators,
      ),
    });
  }

  /**
   * Sets up the alias configuration for the parent or guardian details form.
   * The alias configuration includes the alias fields and controls validation.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS.map((control) => control.controlName);
    this.aliasControlsValidation = FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS;
  }

  /**
   * Sets up the initial parent guardian details.
   * This method initializes the parent guardian details form,
   * sets the initial error messages, and repopulates the form
   * with the existing parent guardian details.
   */
  private initialParentGuardianDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.parentGuardianDetails;
    this.setupParentGuardianDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls([...Array(formData.aliases.length).keys()], 'aliases');
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('add_alias', 'aliases');
  }

  public override ngOnInit(): void {
    this.initialParentGuardianDetailsSetup();
    super.ngOnInit();
  }
}
