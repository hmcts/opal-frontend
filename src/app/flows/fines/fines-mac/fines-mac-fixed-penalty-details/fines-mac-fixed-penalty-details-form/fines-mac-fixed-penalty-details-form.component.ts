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
import { debounceTime, distinctUntilChanged, EMPTY, map, Observable, takeUntil, tap } from 'rxjs';
import { IFinesMacDefendantTypes } from '../../interfaces/fines-mac-defendant-types.interface';
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
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../../fines-mac-offence-details/constants/fines-mac-offence-details-default-values.constant';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { futureDateValidator } from '@hmcts/opal-frontend-common/validators/future-date';
import { amountValidator } from '@hmcts/opal-frontend-common/validators/amount';
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
  @Input() public defendantType!: string;
  @Input({ required: true }) public enforcingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public issuingAuthorityAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacFixedPenaltyDetailsForm>();
  protected readonly finesMacStore = inject(FinesMacStore);
  protected readonly dateService = inject(DateService);
  protected readonly opalFinesService = inject(OpalFines);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;
  public formReady = false;
  public readonly searchOffenceUrl = `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.root}/${FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS.root}`;
  public offenceCode$: Observable<IOpalFinesOffencesRefData> = EMPTY;
  public selectedOffenceConfirmation!: boolean;
  public selectedOffenceSuccessful!: boolean;
  public selectedOffenceTitle!: string;

  override fieldErrors: IFinesMacFixedPenaltyDetailsFieldErrors = {
    ...FINES_MAC_FIXED_PENALTY_DETAILS_FIELD_ERRORS,
  };

  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  public today: string = this.dateService.getPreviousDate({ days: 0 });
  public yesterday = this.dateService.getPreviousDate({ days: 1 });
  public age!: number;
  public ageLabel!: string;

  /**
   * Sets up the personal details form.
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
      fm_fp_personal_details_post_code: new FormControl(null, [optionalMaxLengthValidator(8)]),
      // Court Details
      fm_fp_court_details_imposing_court_id: new FormControl(null, [Validators.required]),
      fm_fp_court_details_issuing_authority_id: new FormControl(null, [Validators.required]),
      // Comments and Notes
      fm_fp_account_comments_notes_comments: new FormControl(null, [alphabeticalTextValidator()]),
      fm_fp_account_comments_notes_notes: new FormControl(null, [alphabeticalTextValidator()]),
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
        Validators.maxLength(10),
        optionalValidDateValidator(),
        futureDateValidator(),
      ]),
      fm_fp_offence_details_offence_id: new FormControl(null),
      fm_fp_offence_details_offence_cjs_code: new FormControl(null, [
        Validators.required,
        Validators.maxLength(8),
        alphabeticalTextValidator(),
      ]),
      fm_fp_offence_details_time_of_offence: new FormControl(null, [
        Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/), // Matches time in HH:mm format, e.g., 12:34
      ]),
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
      ]),
      fm_fp_offence_details_driving_licence_number: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-Za-z]{5}\d{6}[A-Za-z]{2}[A-Za-z0-9]{3}$/), // Example pattern for driving licence number
      ]),
      fm_fp_offence_details_nto_nth: new FormControl(null, [Validators.maxLength(10)]),
      fm_fp_offence_details_date_nto_issued: new FormControl(null, [
        Validators.maxLength(10),
        optionalValidDateValidator(),
        futureDateValidator(),
      ]),
    });
  }

  /**
   * Listens for changes in the offence type and updates the required fields within the vehicle section.
   */
  private offenceTypeListener(): void {
    console.log('offenceTypeListener called');
    const offenceTypeControl = this.form.controls['fm_fp_offence_details_offence_type'];

    // Initial update if the date of birth is already populated
    if (offenceTypeControl.value) {
    }

    // Subscribe to changes in the offence type control
    offenceTypeControl.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((offenceType) => {
      console.log('offenceTypeListener valueChanges called', offenceType);
      if (offenceType === 'vehicle') {
        this.form.controls['fm_fp_offence_details_vehicle_registration_number'].addValidators(Validators.required);
        this.form.controls['fm_fp_offence_details_driving_licence_number'].addValidators(Validators.required);
      } else {
        this.form.controls['fm_fp_offence_details_vehicle_registration_number'].removeValidators(Validators.required);
        this.form.controls['fm_fp_offence_details_driving_licence_number'].removeValidators(Validators.required);
      }
      this.form.controls['fm_fp_offence_details_vehicle_registration_number'].updateValueAndValidity();
      this.form.controls['fm_fp_offence_details_driving_licence_number'].updateValueAndValidity();
    });
  }

  /**
   * Listens for changes in the date of birth control and updates the age and label accordingly.
   */
  private dateOfBirthListener(): void {
    const dobControl = this.form.controls['fm_fp_personal_details_dob'];

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

  public readonly languageOptions: { key: string; value: string }[] = Object.entries(
    FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS,
  ).map(([key, value]) => ({ key, value }));

  /**
   * Sets up the initial personal details for the fines-mac-personal-details-form component.
   * This method initializes the personal details form, alias configuration, alias form controls,
   * adds vehicle details field errors if the defendant type is 'adultOrYouthOnly', sets initial
   * error messages, repopulates the form with personal details, and sets up the alias checkbox listener.
   */
  private initialFixedPenaltyDetailsSetup(): void {
    const formData = {
      ...this.replaceKeys(this.finesMacStore.personalDetails().formData),
      ...this.replaceKeys(this.finesMacStore.courtDetails().formData),
      ...this.replaceKeys(this.finesMacStore.accountCommentsNotes().formData),
      ...this.replaceKeys(this.finesMacStore.languagePreferences().formData),
      ...this.replaceKeys(this.finesMacStore.fixedPenaltyOffenceDetails().formData),
    };
    const key = this.defendantType as keyof IFinesMacDefendantTypes;
    this.setupFixedPenaltyDetailsForm();

    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.form.controls['fm_fp_offence_details_offence_type'].updateValueAndValidity();
    this.dateOfBirthListener();
    this.offenceCodeListener();
    this.offenceTypeListener();
  }

  private replaceKeys<T extends object>(formData: T) {
    const result: any = {};

    for (const [key, value] of Object.entries(formData)) {
      const newKey = (key as string).replace('fm_', 'fm_fp_');
      result[newKey] = value;
    }

    return result;
  }

  /**
   * Listens for changes in the offence code control and performs actions based on the input.
   * If the input meets the specified length criteria, it retrieves the offence details using the provided code.
   * @private
   * @returns {void}
   */
  private offenceCodeListener(): void {
    this.selectedOffenceConfirmation = false;

    const offenceCodeControl = this.form.controls['fm_fp_offence_details_offence_cjs_code'];

    // Populate the offence hint if the offence code is already set
    if (offenceCodeControl.value) {
      this.populateOffenceHint(offenceCodeControl.value);
    }

    // Listen for changes in the offence code control
    offenceCodeControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap((cjs_code: string) => {
          cjs_code = this.utilsService.upperCaseAllLetters(cjs_code);
          offenceCodeControl.setValue(cjs_code, { emitEvent: false });
        }),
        debounceTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((cjs_code: string) => {
        this.populateOffenceHint(cjs_code);
      });
  }

  /**
   * Populates the offence hint based on the provided CJS code.
   * @param cjsCode - The CJS code used to retrieve the offence details.
   */
  private populateOffenceHint(cjsCode: string): void {
    const offenceCodeControl = this.form.controls['fm_fp_offence_details_offence_cjs_code'];
    const offenceIdControl = this.form.controls['fm_fp_offence_details_offence_id'];
    offenceIdControl.setValue(null);

    if (cjsCode?.length >= 7 && cjsCode?.length <= 8) {
      this.offenceCode$ = this.opalFinesService.getOffenceByCjsCode(cjsCode).pipe(
        tap((offence) => {
          offenceCodeControl.setErrors(offence.count !== 0 ? null : { invalidOffenceCode: true }, { emitEvent: false });
          offenceIdControl.setValue(offence.count !== 1 ? null : offence.refData[0].offence_id, { emitEvent: false });
        }),
        map((response) => response),
        takeUntil(this.ngUnsubscribe),
      );

      this.selectedOffenceConfirmation = true;

      this.changeDetector.detectChanges();
    } else {
      this.selectedOffenceConfirmation = false;
    }
  }

  public override ngOnInit(): void {
    this.initialFixedPenaltyDetailsSetup();
    super.ngOnInit();
  }
}
