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
import { MojTicketPanelComponent } from '@components/moj';
import { DateService } from '@services';
import { takeUntil } from 'rxjs';

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
    MojTicketPanelComponent,
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
  protected readonly dateService = inject(DateService);
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
      title: new FormControl(null, [Validators.required]),
      forenames: new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
      surname: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      add_alias: new FormControl(null),
      aliases: new FormArray([]),
      dob: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      national_insurance_number: new FormControl(null, [nationalInsuranceNumberValidator()]),
      address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      address_line_2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      address_line_3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
      postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
      vehicle_make: new FormControl(null, [optionalMaxLengthValidator(30)]),
      vehicle_registration_mark: new FormControl(null, [optionalMaxLengthValidator(11)]),
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
