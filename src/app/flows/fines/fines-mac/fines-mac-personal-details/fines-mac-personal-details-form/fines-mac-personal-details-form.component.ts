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
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormAliasBaseComponent } from '@components/abstract';
import {
  FinesMacAddressBlockComponent,
  FinesMacDateOfBirthComponent,
  FinesMacNameAliasComponent,
  FinesMacNationalInsuranceNumberComponent,
  FinesMacVehicleDetailsComponent,
} from '../../components';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukSelectComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import { ScotgovDatePickerComponent } from '@components/scotgov';
import { DateTime } from 'luxon';
import {
  alphabeticalTextValidator,
  optionalValidDateValidator,
  dateOfBirthValidator,
  nationalInsuranceNumberValidator,
  specialCharactersValidator,
  optionalMaxLengthValidator,
} from '@validators';
import {
  IFinesMacPersonalDetailsDefendantTypes,
  IFinesMacPersonalDetailsFieldErrors,
  IFinesMacPersonalDetailsForm,
} from '../interfaces';
import { FinesService } from '@services/fines';
import { IGovUkSelectOptions } from '@interfaces/components/govuk';
import {
  FINES_MAC_PERSONAL_DETAILS_ADDRESS_BLOCK_FIELD_IDS,
  FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_ONE_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_ADDRESS_POSTCODE_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_ALIAS,
  FINES_MAC_PERSONAL_DETAILS_ALIAS_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_DATE_OF_BIRTH_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_NAME_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_TITLE_DROPDOWN_OPTIONS,
  FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_IDS,
} from '../constants';
import { FINES_MAC_ROUTING_NESTED_ROUTES, FINES_MAC_ROUTING_PATHS } from '../../routing/constants';

@Component({
  selector: 'app-fines-mac-personal-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    ScotgovDatePickerComponent,
    GovukSelectComponent,
    GovukCancelLinkComponent,
    FinesMacAddressBlockComponent,
    FinesMacDateOfBirthComponent,
    FinesMacNationalInsuranceNumberComponent,
    FinesMacNameAliasComponent,
    FinesMacVehicleDetailsComponent,
  ],
  templateUrl: './fines-mac-personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPersonalDetailsFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacPersonalDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly customAddressFieldIds = FINES_MAC_PERSONAL_DETAILS_ADDRESS_BLOCK_FIELD_IDS;
  protected readonly customVehicleDetailsFieldIds = FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_IDS;
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IFinesMacPersonalDetailsFieldErrors = {
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
  public yesterday: string = DateTime.now().minus({ days: 1 }).setLocale('en-gb').toLocaleString();

  /**
   * Sets up the personal details form.
   *
   * This method initializes the form group and its form controls with the necessary validators.
   *
   * @returns void
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      Title: new FormControl(null, [Validators.required]),
      Forenames: new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
      Surname: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      AddAlias: new FormControl(null),
      Aliases: new FormArray([]),
      DOB: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      NationalInsuranceNumber: new FormControl(null, [nationalInsuranceNumberValidator()]),
      AddressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      AddressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      AddressLine3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
      Postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
      VehicleMake: new FormControl(null, [optionalMaxLengthValidator(30)]),
      VehicleRegistrationMark: new FormControl(null, [optionalMaxLengthValidator(11)]),
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
    this.setupAliasFormControls([...Array(formData.Aliases.length).keys()], 'Aliases');
    if (key === 'adultOrYouthOnly') {
      this.addVehicleDetailsFieldErrors();
    }
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('AddAlias', 'Aliases');
  }

  public override ngOnInit(): void {
    this.initialPersonalDetailsSetup();
    super.ngOnInit();
  }
}
