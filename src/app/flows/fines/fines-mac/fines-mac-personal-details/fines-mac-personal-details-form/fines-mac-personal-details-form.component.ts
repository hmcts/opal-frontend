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
  FinesMacNameComponent,
  FinesMacNationalInsuranceNumberComponent,
  FinesMacVehicleDetailsComponent,
} from '../../components';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukSelectComponent,
} from '@components/govuk';
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
  FINES_MAC_PERSONAL_DETAILS_NAME_FIELD_IDS,
  FINES_MAC_PERSONAL_DETAILS_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_TITLE_DROPDOWN_OPTIONS,
  FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_ERRORS,
  FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELD_IDS,
} from '../constants';
import { FINES_MAC_ROUTING_NESTED_ROUTES, FINES_MAC_ROUTING_PATHS } from '../../routing/constants';
import { MojTicketPanelComponent } from '@components/moj';
import { DateService } from '@services';
import { takeUntil } from 'rxjs';
import {
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADD_ALIAS,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_ONE,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_TWO,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_ALIASES,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_DOB,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_FORENAMES,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_NATIONAL_INSURANCE_NUMBER,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_POSTCODE,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_SURNAME,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_MAKE,
  FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_REGISTRATION_MARK,
} from '../constants/controls';

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
  public yesterday!: string;

  public age!: number;
  public ageLabel!: string;

  /**
   * Sets up the personal details form.
   *
   * This method initializes the form group and its form controls with the necessary validators.
   *
   * @returns void
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_FORENAMES.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_FORENAMES.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_FORENAMES.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_SURNAME.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_SURNAME.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_SURNAME.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADD_ALIAS.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADD_ALIAS.initialValue,
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ALIASES.controlName]: new FormArray([]),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_DOB.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_DOB.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_DOB.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_NATIONAL_INSURANCE_NUMBER.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_NATIONAL_INSURANCE_NUMBER.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_NATIONAL_INSURANCE_NUMBER.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_ONE.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_ONE.controlName,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_ONE.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_TWO.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_TWO.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_TWO.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_POSTCODE.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_POSTCODE.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_POSTCODE.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_MAKE.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_MAKE.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_MAKE.validators],
      ),
      [FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_REGISTRATION_MARK.controlName]: new FormControl(
        FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_REGISTRATION_MARK.initialValue,
        [...FINES_MAC_PERSONAL_DETAILS_CONTROLS_VEHICLE_REGISTRATION_MARK.validators],
      ),
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
      this.age = this.dateService.calculateAge(dateOfBirth);
      this.ageLabel = this.age >= 18 ? 'Adult' : 'Youth';
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
