import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AbstractFormAliasBaseComponent } from '@components/abstract';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import { FinesMacAddressBlockComponent } from '../../components/fines-mac-address-block/fines-mac-address-block.component';
import { FinesMacDateOfBirthComponent } from '../../components/fines-mac-date-of-birth/fines-mac-date-of-birth.component';
import { FinesMacNameAliasComponent } from '../../components/fines-mac-name-alias/fines-mac-name-alias.component';
import { FinesMacNationalInsuranceNumberComponent } from '../../components/fines-mac-national-insurance-number/fines-mac-national-insurance-number.component';
import { FinesMacVehicleDetailsComponent } from '../../components/fines-mac-vehicle-details/fines-mac-vehicle-details.component';
import { FinesMacNameComponent } from '../../components/fines-mac-name/fines-mac-name.component';

import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFinesMacParentGuardianDetailsFieldErrors } from '../interfaces/fines-mac-parent-guardian-details-field-errors.interface';
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
import { FINES_MAC_CONTROLS_ALIASES as PGD_CONTROL_ALIASES } from '../../constants/controls/fines-mac-controls-aliases';
import { FINES_MAC_CONTROLS_FORENAMES as PGD_CONTROL_FORENAMES } from '../../constants/controls/fines-mac-controls-forenames';
import { FINES_MAC_CONTROLS_SURNAME as PGD_CONTROL_SURNAME } from '../../constants/controls/fines-mac-controls-surname';
import { FINES_MAC_CONTROLS_ADD_ALIAS as PGD_CONTROL_ADD_ALIAS } from '../../constants/controls/fines-mac-controls-add-alias';
import { FINES_MAC_CONTROLS_DOB as PGD_CONTROL_DOB } from '../../constants/controls/fines-mac-controls-dob';
import { FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER as PGD_CONTROL_NATIONAL_INSURANCE_NUMBER } from '../../constants/controls/fines-mac-controls-national-insurance-number';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_ONE as PGD_CONTROL_ADDRESS_LINE_ONE } from '../../constants/controls/fines-mac-controls-address-line-one';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_TWO as PGD_CONTROL_ADDRESS_LINE_TWO } from '../../constants/controls/fines-mac-controls-address-line-two';
import { FINES_MAC_CONTROLS_POSTCODE as PGD_CONTROL_POSTCODE } from '../../constants/controls/fines-mac-controls-postcode';
import { FINES_MAC_CONTROLS_VEHICLE_MAKE as PGD_CONTROL_VEHICLE_MAKE } from '../../constants/controls/fines-mac-controls-vehicle-make';
import { FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK as PGD_CONTROL_VEHICLE_REGISTRATION_MARK } from '../../constants/controls/fines-mac-controls-vehicle-registration-mark';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_CONTROLS_ADDRESS_LINE_THREE as PGD_CONTROL_ADDRESS_LINE_THREE } from '../constants/controls/fines-mac-parent-guardian-details-controls-address-line-three';

import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';

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

  override fieldErrors: IFinesMacParentGuardianDetailsFieldErrors = {
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

  /**
   * Sets up the parent/guardian details form with the necessary form controls.
   */
  private setupParentGuardianDetailsForm(): void {
    this.form = new FormGroup({
      [PGD_CONTROL_ALIASES.controlName]: this.createFormArray(PGD_CONTROL_ALIASES.validators, []),
      [PGD_CONTROL_FORENAMES.controlName]: this.createFormControl(PGD_CONTROL_FORENAMES.validators),
      [PGD_CONTROL_SURNAME.controlName]: this.createFormControl(PGD_CONTROL_SURNAME.validators),
      [PGD_CONTROL_ADD_ALIAS.controlName]: this.createFormControl(PGD_CONTROL_ADD_ALIAS.validators),
      [PGD_CONTROL_DOB.controlName]: this.createFormControl(PGD_CONTROL_DOB.validators),
      [PGD_CONTROL_NATIONAL_INSURANCE_NUMBER.controlName]: this.createFormControl(
        PGD_CONTROL_NATIONAL_INSURANCE_NUMBER.validators,
      ),
      [PGD_CONTROL_ADDRESS_LINE_ONE.controlName]: this.createFormControl(PGD_CONTROL_ADDRESS_LINE_ONE.validators),
      [PGD_CONTROL_ADDRESS_LINE_TWO.controlName]: this.createFormControl(PGD_CONTROL_ADDRESS_LINE_TWO.validators),
      [PGD_CONTROL_ADDRESS_LINE_THREE.controlName]: this.createFormControl(PGD_CONTROL_ADDRESS_LINE_THREE.validators),
      [PGD_CONTROL_POSTCODE.controlName]: this.createFormControl(PGD_CONTROL_POSTCODE.validators),
      [PGD_CONTROL_VEHICLE_MAKE.controlName]: this.createFormControl(PGD_CONTROL_VEHICLE_MAKE.validators),
      [PGD_CONTROL_VEHICLE_REGISTRATION_MARK.controlName]: this.createFormControl(
        PGD_CONTROL_VEHICLE_REGISTRATION_MARK.validators,
      ),
      [PGD_CONTROL_ALIASES.controlName]: this.createFormArray(PGD_CONTROL_ALIASES.validators, []),
      [PGD_CONTROL_FORENAMES.controlName]: this.createFormControl(PGD_CONTROL_FORENAMES.validators),
      [PGD_CONTROL_SURNAME.controlName]: this.createFormControl(PGD_CONTROL_SURNAME.validators),
      [PGD_CONTROL_ADD_ALIAS.controlName]: this.createFormControl(PGD_CONTROL_ADD_ALIAS.validators),
      [PGD_CONTROL_DOB.controlName]: this.createFormControl(PGD_CONTROL_DOB.validators),
      [PGD_CONTROL_NATIONAL_INSURANCE_NUMBER.controlName]: this.createFormControl(
        PGD_CONTROL_NATIONAL_INSURANCE_NUMBER.validators,
      ),
      [PGD_CONTROL_ADDRESS_LINE_ONE.controlName]: this.createFormControl(PGD_CONTROL_ADDRESS_LINE_ONE.validators),
      [PGD_CONTROL_ADDRESS_LINE_TWO.controlName]: this.createFormControl(PGD_CONTROL_ADDRESS_LINE_TWO.validators),
      [PGD_CONTROL_ADDRESS_LINE_THREE.controlName]: this.createFormControl(PGD_CONTROL_ADDRESS_LINE_THREE.validators),
      [PGD_CONTROL_POSTCODE.controlName]: this.createFormControl(PGD_CONTROL_POSTCODE.validators),
      [PGD_CONTROL_VEHICLE_MAKE.controlName]: this.createFormControl(PGD_CONTROL_VEHICLE_MAKE.validators),
      [PGD_CONTROL_VEHICLE_REGISTRATION_MARK.controlName]: this.createFormControl(
        PGD_CONTROL_VEHICLE_REGISTRATION_MARK.validators,
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
