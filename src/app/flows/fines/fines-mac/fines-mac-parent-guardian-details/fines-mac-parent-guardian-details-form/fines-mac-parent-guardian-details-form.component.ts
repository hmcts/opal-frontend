import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AbstractFormAliasBaseComponent } from '@components/abstract';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import {
  FinesMacAddressBlockComponent,
  FinesMacDateOfBirthComponent,
  FinesMacNameAliasComponent,
  FinesMacNationalInsuranceNumberComponent,
  FinesMacVehicleDetailsComponent,
  FinesMacNameComponent,
} from '../../components';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  alphabeticalTextValidator,
  optionalValidDateValidator,
  dateOfBirthValidator,
  nationalInsuranceNumberValidator,
  specialCharactersValidator,
  optionalMaxLengthValidator,
} from '@validators';
import { IFinesMacParentGuardianDetailsFieldErrors, IFinesMacParentGuardianDetailsForm } from '../interfaces';
import {
  FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_BLOCK_FIELD_IDS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_POSTCODE_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_DATE_OF_BIRTH_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_NAME_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_NAME_FIELD_IDS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_VEHICLE_DETAILS_FIELD_ERRORS,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_VEHICLE_DETAILS_FIELD_IDS,
} from '../constants';
import { FinesService } from '@services/fines';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants';

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
      Forenames: new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
      Surname: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      AddAlias: new FormControl(null),
      Aliases: new FormArray([]),
      DOB: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      NationalInsuranceNumber: new FormControl(null, [nationalInsuranceNumberValidator()]),
      AddressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(25),
        specialCharactersValidator(),
      ]),
      AddressLine2: new FormControl(null, [optionalMaxLengthValidator(25), specialCharactersValidator()]),
      AddressLine3: new FormControl(null, [optionalMaxLengthValidator(13), specialCharactersValidator()]),
      Postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
      VehicleMake: new FormControl(null, [optionalMaxLengthValidator(30)]),
      VehicleRegistrationMark: new FormControl(null, [optionalMaxLengthValidator(11)]),
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
    const { parentGuardianDetails } = this.finesService.finesMacState;
    this.setupParentGuardianDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls([...Array(parentGuardianDetails.Aliases.length).keys()], 'Aliases');
    this.setInitialErrorMessages();
    this.rePopulateForm(this.finesService.finesMacState.parentGuardianDetails);
    this.setUpAliasCheckboxListener('AddAlias', 'Aliases');
  }

  public override ngOnInit(): void {
    this.initialParentGuardianDetailsSetup();
    super.ngOnInit();
  }
}
