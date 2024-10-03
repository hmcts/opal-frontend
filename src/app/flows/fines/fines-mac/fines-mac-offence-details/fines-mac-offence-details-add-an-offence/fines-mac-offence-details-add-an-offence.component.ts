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
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov/alphagov-accessible-autocomplete/alphagov-accessible-autocomplete.component';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS } from '../constants/fines-mac-offence-details-impositions';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukTextInputPrefixSuffixComponent } from '@components/govuk/govuk-text-input-prefix-suffix/govuk-text-input-prefix-suffix.component';
import { GovukRadioComponent } from '@components/govuk/govuk-radio/govuk-radio.component';
import { GovukRadiosItemComponent } from '@components/govuk/govuk-radio/govuk-radios-item/govuk-radios-item.component';
import { FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS } from '../constants/fines-mac-offence-details-creditor-options';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes';
import { DateService } from '@services/date-service/date.service';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS } from '../constants/fines-mac-offence-details-offences-field-errors';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_FIELD_ERRORS } from '../constants/fines-mac-offence-details-impositions-field-errors';
import { CommonModule } from '@angular/common';
import { AbstractFormArrayBaseComponent } from '@components/abstract/abstract-form-array-base/abstract-form-array-base';
import { futureDateValidator } from '@validators/future-date/future-date.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { UtilsService } from '@services/utils/utils.service';
import { IFinesMacOffenceDetailsState } from '../interfaces/fines-mac-offence-details-state.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { EMPTY, Observable, debounceTime, distinctUntilChanged, take, tap } from 'rxjs';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';

@Component({
  selector: 'app-fines-mac-offence-details-add-an-offence',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukErrorSummaryComponent,
    MojDatePickerComponent,
    AlphagovAccessibleAutocompleteComponent,
    MojTicketPanelComponent,
    GovukButtonComponent,
    GovukTextInputPrefixSuffixComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukCancelLinkComponent,
    GovukTextInputComponent,
  ],
  templateUrl: './fines-mac-offence-details-add-an-offence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsAddAnOffenceComponent
  extends AbstractFormArrayBaseComponent
  implements OnInit, OnDestroy
{
  @Input() public defendantType!: string;
  @Input({ required: true }) public resultCodeItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public formData!: IFinesMacOffenceDetailsState;
  @Input({ required: true }) public formDataIndex!: number;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacOffenceDetailsForm>();

  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesService = inject(FinesService);
  protected readonly dateService = inject(DateService);
  protected readonly utilsService = inject(UtilsService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  public selectedOffenceConfirmation!: boolean;
  public selectedOffenceSuccessful!: boolean;
  public selectedOffenceTitle!: string;
  public today!: string;

  public offenceCode$: Observable<IOpalFinesOffencesRefData> = EMPTY;

  public creditorOptions = FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS;

  override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS,
  };

  /**
   * Sets up the form for adding an offence.
   */
  private setupAddAnOffenceForm(): void {
    this.form = new FormGroup({
      fm_offence_details_index: new FormControl(this.formDataIndex),
      fm_offence_details_date_of_offence: new FormControl(null, [
        Validators.required,
        optionalValidDateValidator(),
        futureDateValidator(),
      ]),
      fm_offence_details_offence_code: new FormControl(null, [Validators.required]),
      fm_offence_details_impositions: new FormArray([]),
    });
  }

  /**
   * Sets up the initial configuration for adding an offence details.
   * This method initializes the form, sets up the impositions configuration,
   * sets up the form array form controls, listens for changes in the offence code,
   * sets initial error messages, repopulates the form with existing data,
   * adds controls to the form array if necessary, and sets the current date.
   */
  private initialAddAnOffenceDetailsSetup(): void {
    this.setupAddAnOffenceForm();
    this.setupImpositionsConfiguration();
    this.setupFormArrayFormControls(
      [...Array(this.formData.fm_offence_details_impositions.length).keys()],
      'fm_offence_details_impositions',
    );
    this.setInitialErrorMessages();
    this.rePopulateForm(this.formData);
    this.offenceCodeListener();
    if (this.formData.fm_offence_details_impositions.length === 0) {
      this.addControlsToFormArray(0, 'fm_offence_details_impositions');
    }
    this.today = this.dateService.toFormat(this.dateService.getDateNow(), 'dd/MM/yyyy');
  }

  /**
   * Populates the offence hint based on the provided CJS code.
   * @param cjsCode - The CJS code used to retrieve the offence details.
   */
  private populateOffenceHint(cjsCode: string): void {
    const offenceCodeControl = this.form.controls['fm_offence_details_offence_code'];

    if (cjsCode?.length >= 7 && cjsCode?.length <= 8) {
      this.offenceCode$ = this.opalFinesService.getOffenceByCjsCode(cjsCode);
      this.selectedOffenceConfirmation = true;

      this.offenceCode$.pipe(take(1)).subscribe((offence) => {
        offenceCodeControl.setErrors(offence.count !== 0 ? null : { invalidOffenceCode: true });
      });
    } else {
      this.selectedOffenceConfirmation = false;
    }
  }

  /**
   * Listens for changes in the offence code control and performs actions based on the input.
   * If the input meets the specified length criteria, it retrieves the offence details using the provided code.
   * @private
   * @returns {void}
   */
  private offenceCodeListener(): void {
    this.selectedOffenceConfirmation = false;

    const offenceCodeControl = this.form.controls['fm_offence_details_offence_code'];

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
        debounceTime(250),
      )
      .subscribe((cjs_code: string) => {
        this.populateOffenceHint(cjs_code);
      });
  }

  /**
   * Sets up the impositions configuration for the fines-mac-offence-details-add-an-offence component.
   * This method initializes the formArrayFields and formArrayControlsValidation properties
   * based on the FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS array.
   */
  private setupImpositionsConfiguration(): void {
    this.formArrayFields = FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS.map((item) => item.controlName);
    this.formArrayControlsValidation = FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS;
  }

  /**
   * Listens for changes in the result code control and updates the needs creditor control accordingly.
   * @param index - The index of the impositions form group.
   */
  private resultCodeListener(index: number): void {
    const impositionsFormArray = this.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const resultCodeControl = impositionsFormGroup.controls[`fm_offence_details_result_code_${index}`];
    const needsCreditorControl = impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`];

    resultCodeControl.valueChanges.subscribe((result_code: string) => {
      const needsCreditor =
        result_code &&
        (result_code === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.compensation ||
          result_code === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.costs);
      needsCreditorControl.setValue(needsCreditor);
    });
  }

  /**
   * Adds controls to the form array at the specified index.
   *
   * @param index - The index at which to add the controls.
   * @param formArrayName - The name of the form array.
   */
  public override addControlsToFormArray(index: number, formArrayName: string): void {
    super.addControlsToFormArray(index, formArrayName);
    this.resultCodeListener(index);
    this.fieldErrors = {
      ...this.fieldErrors,
      ...FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_FIELD_ERRORS(index),
    };
  }

  public override ngOnInit(): void {
    this.initialAddAnOffenceDetailsSetup();
    super.ngOnInit();
  }
}
