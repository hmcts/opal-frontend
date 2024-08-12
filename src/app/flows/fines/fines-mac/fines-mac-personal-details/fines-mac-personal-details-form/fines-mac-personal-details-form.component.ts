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
  FinesMacNationalInsuranceNumberComponent,
} from '@components/fines/mac';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukErrorSummaryComponent,
  GovukSelectComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import { ScotgovDatePickerComponent } from '@components/scotgov';
import {
  FINES_MAC_ADDRESS_FIELD_IDS,
  FINES_MAC_DATE_OF_BIRTH_FIELD_ERRORS,
  FINES_MAC_NATIONAL_INSURANCE_FIELD_ERRORS,
  FINES_MAC_ADDRESS_LINE_ONE_FIELD_ERRORS,
  FINES_MAC_ADDRESS_LINE_TWO_FIELD_ERRORS,
  FINES_MAC_ADDRESS_LINE_THREE_FIELD_ERRORS,
  FINES_MAC_POSTCODE_FIELD_ERRORS,
} from '@constants/components/fine/mac';
import { DateTime } from 'luxon';
import {
  alphabeticalTextValidator,
  optionalValidDateValidator,
  dateOfBirthValidator,
  nationalInsuranceNumberValidator,
  specialCharactersValidator,
  optionalMaxLengthValidator,
} from '@validators';
import { IFinesMacPersonalDetailsForm } from '../interfaces';
import { FinesMacRoutes } from '@enums/fines/mac';
import {
  FINES_MAC_NESTED_ROUTES,
  FINES_MAC_TITLE_DROPDOWN_OPTIONS,
} from '@constants/fines/mac';
import { FinesService } from '@services/fines';
import { IGovUkSelectOptions } from '@interfaces/components/govuk';
import { IAbstractFieldErrors } from '@interfaces/components/abstract';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS, FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS } from '../constants';

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
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukSelectComponent,
    GovukCancelLinkComponent,
    FinesMacAddressBlockComponent,
    FinesMacDateOfBirthComponent,
    FinesMacNationalInsuranceNumberComponent,
  ],
  templateUrl: './fines-mac-personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPersonalDetailsFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() private formSubmit = new EventEmitter<IFinesMacPersonalDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly customAddressFieldIds = FINES_MAC_ADDRESS_FIELD_IDS;
  protected readonly finesMacRoutes = FinesMacRoutes;
  protected readonly finesMacNestedRoutes = FINES_MAC_NESTED_ROUTES;

  override fieldErrors: IAbstractFieldErrors = {
    ...FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS,
    ...FINES_MAC_DATE_OF_BIRTH_FIELD_ERRORS,
    ...FINES_MAC_NATIONAL_INSURANCE_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...FINES_MAC_POSTCODE_FIELD_ERRORS,
  };

  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
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
    this.aliasFields = ['AliasForenames', 'AliasSurname'];
    this.aliasControlsValidation = FINES_MAC_PERSONAL_DETAILS_ALIAS;
  }

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   * @returns void
   */
  public handleFormSubmit(event: SubmitEvent): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      const nestedFlow = event.submitter ? event.submitter.className.includes('nested-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, nestedFlow: nestedFlow });
    }
  }

  /**
   * Performs the initial setup for the personal details form component.
   * This method sets up the personal details form, alias configuration, aliases,
   * initial error messages, nested route, form population, and alias checkbox listener.
   */
  private initialSetup(): void {
    const { personalDetails } = this.finesService.finesMacState;
    this.setupPersonalDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls([...Array(personalDetails.Aliases.length).keys()], 'Aliases');
    this.setInitialErrorMessages();
    this.rePopulateForm(personalDetails);
    this.setUpAliasCheckboxListener('AddAlias', 'Aliases');
  }

  public override ngOnInit(): void {
    this.initialSetup();
    super.ngOnInit();
  }
}
