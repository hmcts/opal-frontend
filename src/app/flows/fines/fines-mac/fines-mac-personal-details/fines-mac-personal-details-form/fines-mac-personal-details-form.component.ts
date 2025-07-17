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
import { AbstractFormAliasBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-alias-base';
import { IFinesMacPersonalDetailsFieldErrors } from '../interfaces/fines-mac-personal-details-field-errors.interface';
import { IFinesMacPersonalDetailsForm } from '../interfaces/fines-mac-personal-details-form.interface';
import { FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-personal-details-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS } from '../constants/fines-mac-personal-details-alias';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { takeUntil } from 'rxjs';
import { FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS as FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS } from '../constants/fines-mac-personal-details-vehicle-details-fields';
import { IFinesMacDefendantTypes } from '../../interfaces/fines-mac-defendant-types.interface';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '../../constants/fines-mac-title-dropdown-options.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';

import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { nationalInsuranceNumberValidator } from '@hmcts/opal-frontend-common/validators/national-insurance-number';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { specialCharactersValidator } from '@hmcts/opal-frontend-common/validators/special-characters';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { LETTERS_WITH_SPACES_PATTERN } from '../../../constants/fines-patterns.constant';
@Component({
  selector: 'app-fines-mac-personal-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukSelectComponent,
    GovukCancelLinkComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukTextInputComponent,
    MojTicketPanelComponent,
    MojDatePickerComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-mac-personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPersonalDetailsFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacPersonalDetailsForm>();
  protected readonly dateService = inject(DateService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  @Input() public defendantType!: string;
  override fieldErrors: IFinesMacPersonalDetailsFieldErrors = {
    ...FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS,
  };
  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  public yesterday!: string;
  public age!: number;
  public ageLabel!: string;

  /**
   * Sets up the personal details form.
   */
  private setupPersonalDetailsForm(): void {
    this.form = new FormGroup({
      fm_personal_details_title: new FormControl(null, [Validators.required]),
      fm_personal_details_forenames: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
        patternValidator(LETTERS_WITH_SPACES_PATTERN),
      ]),
      fm_personal_details_surname: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        patternValidator(LETTERS_WITH_SPACES_PATTERN),
      ]),
      fm_personal_details_aliases: new FormArray([]),
      fm_personal_details_add_alias: new FormControl(null),
      fm_personal_details_dob: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      fm_personal_details_national_insurance_number: new FormControl(null, [nationalInsuranceNumberValidator()]),
      fm_personal_details_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      fm_personal_details_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(30),
        specialCharactersValidator(),
      ]),
      fm_personal_details_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(16),
        specialCharactersValidator(),
      ]),
      fm_personal_details_post_code: new FormControl(null, [optionalMaxLengthValidator(8)]),
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
   * Adds vehicle details controls to the form.
   * Iterates over the FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS array and creates a control for each field.
   */
  private addVehicleDetailsControls(): void {
    FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS.forEach((control) => {
      this.createControl(control.controlName, control.validators);
    });
  }

  /**
   * Listens for changes in the date of birth control and updates the age and label accordingly.
   */
  private dateOfBirthListener(): void {
    const dobControl = this.form.controls['fm_personal_details_dob'];

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

      this.finesMacStore.resetPaymentTermsDaysInDefault();
    }
  }

  /**
   * Sets up the initial personal details for the fines-mac-personal-details-form component.
   * This method initializes the personal details form, alias configuration, alias form controls,
   * adds vehicle details field errors if the defendant type is 'adultOrYouthOnly', sets initial
   * error messages, repopulates the form with personal details, and sets up the alias checkbox listener.
   */
  private initialPersonalDetailsSetup(): void {
    const { formData } = this.finesMacStore.personalDetails();
    const key = this.defendantType as keyof IFinesMacDefendantTypes;
    this.setupPersonalDetailsForm();

    this.setupAliasConfiguration();
    this.setupAliasFormControls(
      [...Array(formData.fm_personal_details_aliases.length).keys()],
      'fm_personal_details_aliases',
    );
    if (key === 'adultOrYouthOnly') {
      this.addVehicleDetailsControls();
    }
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('fm_personal_details_add_alias', 'fm_personal_details_aliases');
    this.dateOfBirthListener();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  public override ngOnInit(): void {
    this.initialPersonalDetailsSetup();
    super.ngOnInit();
  }
}
