import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormAliasBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-alias-base';
import { IFinesMacFixedPenaltyDetailsForm } from '../interfaces/fines-mac-fixed-penalty-details-form.interface';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { EMPTY, Observable, of, takeUntil } from 'rxjs';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '../../constants/fines-mac-title-dropdown-options.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';

import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { alphabeticalTextValidator } from '@hmcts/opal-frontend-common/validators/alphabetical-text';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { specialCharactersValidator } from '@hmcts/opal-frontend-common/validators/special-characters';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { IFinesMacFixedPenaltyDetailsFieldErrors } from '../interfaces/fines-mac-fixed-penalty-details-field-errors.interface';
import { FINES_MAC_FIXED_PENALTY_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-fixed-penalty-details-field-errors';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukTextInputPrefixSuffixComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input-prefix-suffix';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../fines-mac-offence-details/routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS } from '../../fines-mac-offence-details/fines-mac-offence-details-search-offences/routing/constants/fines-mac-offence-details-search-offences-routing-paths.constant';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { futureDateValidator } from '@hmcts/opal-frontend-common/validators/future-date';
import { amountValidator } from '@hmcts/opal-frontend-common/validators/amount';
import { IAgeObject } from '@hmcts/opal-frontend-common/services/date-service/interfaces';
import { FinesMacOffenceDetailsService } from '../../fines-mac-offence-details/services/fines-mac-offence-details.service';
import { timeFormatValidator } from '@hmcts/opal-frontend-common/validators/time-format';
import { drivingLicenceNumberValidator } from '@hmcts/opal-frontend-common/validators/driving-licence-number';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';
@Component({
  selector: 'app-fines-mac-fixed-penalty-details-form',
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukSelectComponent,
    GovukCancelLinkComponent,
    GovukTextAreaComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukTextInputComponent,
    GovukTextInputPrefixSuffixComponent,
    MojTicketPanelComponent,
    MojDatePickerComponent,
    CapitalisationDirective,
    AlphagovAccessibleAutocompleteComponent,
  ],
  templateUrl: './fines-mac-fixed-penalty-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacFixedPenaltyDetailsFormComponent
  extends AbstractFormAliasBaseComponent
  implements OnInit, OnDestroy
{
  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  @Output() protected override formSubmit = new EventEmitter<IFinesMacFixedPenaltyDetailsForm>();
  protected readonly finesMacStore = inject(FinesMacStore);
  protected readonly dateService = inject(DateService);
  protected readonly opalFinesService = inject(OpalFines);
  protected readonly offenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly transformationService = inject(TransformationService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;
  protected readonly finesPrefix = 'fm_';
  protected readonly fixedPenaltyPrefix = 'fm_fp_';

  @Input() public defendantType!: string;
  @Input({ required: true }) public enforcingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public issuingAuthorityAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];

  public readonly searchOffenceUrl = `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.root}/${FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS.root}`;
  public readonly languageOptions: { key: string; value: string }[] = Object.entries(
    FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS,
  ).map(([key, value]) => ({ key, value }));
  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;

  public offenceCode$: Observable<IOpalFinesOffencesRefData> = EMPTY;
  public selectedOffenceConfirmation!: boolean;
  public selectedOffenceSuccessful!: boolean;
  public selectedOffenceTitle!: string;
  public today: string = this.dateService.getPreviousDate({ days: 0 });
  public yesterday = this.dateService.getPreviousDate({ days: 1 });
  public age: IAgeObject | null = null;

  override fieldErrors: IFinesMacFixedPenaltyDetailsFieldErrors = {
    ...FINES_MAC_FIXED_PENALTY_DETAILS_FIELD_ERRORS,
  };

  /*
   * Sets up the form for fixed penalty details, including personal details, court details, comments and notes,
   * language preferences, and offence details.
   */
  private setupFixedPenaltyDetailsForm(): void {
    this.form = new FormGroup({
      // Personal Details
      fm_fp_personal_details_title: new FormControl(null, [Validators.required]),
      fm_fp_personal_details_forenames: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
        alphabeticalTextValidator(),
      ]),
      fm_fp_personal_details_surname: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        alphabeticalTextValidator(),
      ]),
      fm_fp_personal_details_dob: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      fm_fp_personal_details_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      fm_fp_personal_details_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(30),
        specialCharactersValidator(),
      ]),
      fm_fp_personal_details_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(16),
        specialCharactersValidator(),
      ]),
      fm_fp_personal_details_post_code: new FormControl(null, [
        optionalMaxLengthValidator(8),
        alphabeticalTextValidator(),
      ]),
      // Court Details
      fm_fp_court_details_imposing_court_id: new FormControl(null, [Validators.required]),
      fm_fp_court_details_originator_id: new FormControl(null, [
        Validators.required,
        Validators.maxLength(41),
        alphabeticalTextValidator(),
      ]),
      fm_fp_court_details_originator_name: new FormControl(null),
      // Comments and Notes
      fm_fp_account_comments_notes_comments: new FormControl(null, [
        Validators.maxLength(30),
        alphabeticalTextValidator(),
      ]),
      fm_fp_account_comments_notes_notes: new FormControl(null, [
        Validators.maxLength(1000),
        alphabeticalTextValidator(),
      ]),
      fm_fp_account_comments_notes_system_notes: new FormControl(null),
      // Language Preferences
      fm_fp_language_preferences_document_language: new FormControl(null),
      fm_fp_language_preferences_hearing_language: new FormControl(null),
      // Offence Details
      fm_fp_offence_details_notice_number: new FormControl(null, [
        Validators.required,
        Validators.maxLength(16),
        alphabeticalTextValidator(),
      ]),
      fm_fp_offence_details_offence_type: new FormControl('vehicle'),
      fm_fp_offence_details_date_of_offence: new FormControl(null, [
        Validators.required,
        optionalValidDateValidator(),
        futureDateValidator(),
      ]),
      fm_fp_offence_details_offence_id: new FormControl(null),
      fm_fp_offence_details_offence_cjs_code: new FormControl(null, [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(7),
        alphabeticalTextValidator(),
      ]),
      fm_fp_offence_details_time_of_offence: new FormControl(null, [timeFormatValidator()]),
      fm_fp_offence_details_place_of_offence: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        alphabeticalTextValidator(),
      ]),
      fm_fp_offence_details_amount_imposed: new FormControl(null, [Validators.required, amountValidator(18, 2)]),
      // Offence Details Vehicle
      fm_fp_offence_details_vehicle_registration_number: new FormControl(null, [
        Validators.required,
        Validators.maxLength(7),
        alphabeticalTextValidator(),
      ]),
      fm_fp_offence_details_driving_licence_number: new FormControl(null, [
        Validators.required,
        drivingLicenceNumberValidator(),
      ]),
      fm_fp_offence_details_nto_nth: new FormControl(null, [Validators.maxLength(10), alphabeticalTextValidator()]),
      fm_fp_offence_details_date_nto_issued: new FormControl(null, [
        optionalValidDateValidator(),
        futureDateValidator(),
      ]),
    });
  }

  /**
   * Listens for changes in the offence type and updates the required fields within the vehicle section.
   */
  private offenceTypeListener(): void {
    const offenceTypeControl = this.form.controls[`${this.fixedPenaltyPrefix}offence_details_offence_type`];

    // Subscribe to changes in the offence type control
    offenceTypeControl.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((offenceType) => {
      this.updateOffenceControlValidators(offenceType);
    });
  }

  /**
   * Updates the validators for the vehicle registration number and driving licence number fields depending on the offence type.
   * @param offenceType - The type of offence (e.g., 'vehicle' or other).
   */
  private updateOffenceControlValidators(offenceType: string): void {
    if (offenceType === 'vehicle') {
      this.form.controls['fm_fp_offence_details_vehicle_registration_number'].addValidators([
        Validators.required,
        Validators.maxLength(7),
        alphabeticalTextValidator(),
      ]);
      this.form.controls['fm_fp_offence_details_driving_licence_number'].addValidators([
        Validators.required,
        drivingLicenceNumberValidator(),
      ]);
    } else {
      this.form.controls['fm_fp_offence_details_vehicle_registration_number'].clearValidators();
      this.form.controls['fm_fp_offence_details_driving_licence_number'].clearValidators();
    }
    this.form.controls['fm_fp_offence_details_vehicle_registration_number'].updateValueAndValidity();
    this.form.controls['fm_fp_offence_details_driving_licence_number'].updateValueAndValidity();
  }

  /**
   * Listens for changes in the date of birth control and updates the age and label accordingly.
   */
  private dateOfBirthListener(): void {
    const dobControl = this.form.controls[`${this.fixedPenaltyPrefix}personal_details_dob`];

    // Initial update if the date of birth is already populated
    if (dobControl.value) {
      this.age = this.dateService.getAgeObject(dobControl.value);
    }

    // Subscribe to changes in the date of birth control
    dobControl.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((dateOfBirth) => {
      this.age = this.dateService.getAgeObject(dateOfBirth);
    });
  }

  /**
   * Sets up the initial state of the fixed penalty details form, including re-populating it with existing data.
   */
  private initialFixedPenaltyDetailsSetup(): void {
    const formData = {
      ...this.transformationService.replaceKeys(
        this.finesMacStore.personalDetails().formData,
        this.finesPrefix,
        this.fixedPenaltyPrefix,
      ),
      ...this.transformationService.replaceKeys(
        this.finesMacStore.courtDetails().formData,
        this.finesPrefix,
        this.fixedPenaltyPrefix,
      ),
      ...this.transformationService.replaceKeys(
        this.finesMacStore.accountCommentsNotes().formData,
        this.finesPrefix,
        this.fixedPenaltyPrefix,
      ),
      ...this.transformationService.replaceKeys(
        this.finesMacStore.languagePreferences().formData,
        this.finesPrefix,
        this.fixedPenaltyPrefix,
      ),
      ...this.transformationService.replaceKeys(
        this.finesMacStore.fixedPenaltyDetails().formData,
        this.finesPrefix,
        this.fixedPenaltyPrefix,
      ),
    };
    this.setupFixedPenaltyDetailsForm();

    this.setInitialErrorMessages();
    this.rePopulateForm(formData);

    this.form.controls[`${this.fixedPenaltyPrefix}offence_details_offence_type`].updateValueAndValidity();
    this.updateOffenceControlValidators(
      this.form.controls[`${this.fixedPenaltyPrefix}offence_details_offence_type`].value,
    );
    this.dateOfBirthListener();
    this.offenceTypeListener();
    this.setupOffenceCodeListener();
  }

  /**
   * Sets up the offence code listener to handle changes in the offence code field.
   * It initializes the offence code listener from the offence details service, which fetches
   * offence details based on the CJS code entered by the user.
   * It updates the offenceCode$ observable with the fetched offence details and handles
   * the confirmation of the selected offence.
   */
  private setupOffenceCodeListener(): void {
    this.offenceDetailsService.initOffenceCodeListener(
      this.form,
      `${this.fixedPenaltyPrefix}offence_details_offence_cjs_code`,
      `${this.fixedPenaltyPrefix}offence_details_offence_id`,
      this.ngUnsubscribe,
      this.opalFinesService.getOffenceByCjsCode.bind(this.opalFinesService),
      (result) => {
        this.offenceCode$ = of(result);
      },
      (confirmed) => {
        this.selectedOffenceConfirmation = confirmed;
      },
    );
  }

  /**
   * Retrieves the prosecutor details based on the originator ID from the fixed penalty details.
   * It finds the corresponding prosecutor from the prosecutorsData array
   * and returns the pretty name for that prosecutor or null if not found.
   *
   * @private
   * @returns {string | null}
   */
  private getProsecutorFromId(prosecutorId: string): IAlphagovAccessibleAutocompleteItem | null {
    const prosecutor = this.issuingAuthorityAutoCompleteItems.find(
      (p: IAlphagovAccessibleAutocompleteItem) => p.value == prosecutorId);
    if (!prosecutor) {
      return null;
    }
    return prosecutor
  }

  /**
   * Sets the court_details_originator_name form control to the prosecutor name if it exists.
   * @param event 
   */
  private setProsecutorName(): void {    
    const prosecutor = this.getProsecutorFromId(this.form.controls[`${this.fixedPenaltyPrefix}court_details_originator_id`].value.toString());
    if (prosecutor) {
      const prosecutorName = prosecutor.name.replace(/\s*\([^)]*\)/, '').trim();
      this.form.controls[`${this.fixedPenaltyPrefix}court_details_originator_name`].setValue(prosecutorName);
    }
  }

  public override handleFormSubmit(event: SubmitEvent): void {
    this.setProsecutorName();
    super.handleFormSubmit(event);
  }
  
  public override ngOnInit(): void {
    this.initialFixedPenaltyDetailsSetup();
    super.ngOnInit();
  }
}
