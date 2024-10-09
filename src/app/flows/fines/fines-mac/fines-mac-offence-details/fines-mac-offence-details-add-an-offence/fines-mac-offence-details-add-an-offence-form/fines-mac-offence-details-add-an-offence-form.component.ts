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
import { AbstractFormArrayBaseComponent } from '@components/abstract/abstract-form-array-base/abstract-form-array-base';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { DateService } from '@services/date-service/date.service';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@services/utils/utils.service';
import { Observable, EMPTY, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS } from '../../constants/fines-mac-offence-details-creditor-options';
import { FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS } from '../../constants/fines-mac-offence-details-offences-field-errors';
import { IFinesMacOffenceDetailsForm } from '../../interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOffenceDetailsState } from '../../interfaces/fines-mac-offence-details-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths';
import { FinesMacOffenceDetailsService } from '../../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { futureDateValidator } from '@validators/future-date/future-date.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS } from '../../constants/fines-mac-offence-details-impositions';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_FIELD_ERRORS } from '../../constants/fines-mac-offence-details-impositions-field-errors';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../../constants/fines-mac-offence-details-result-codes';
import { CommonModule } from '@angular/common';
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov/alphagov-accessible-autocomplete/alphagov-accessible-autocomplete.component';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukRadioComponent } from '@components/govuk/govuk-radio/govuk-radio.component';
import { GovukRadiosItemComponent } from '@components/govuk/govuk-radio/govuk-radios-item/govuk-radios-item.component';
import { GovukTextInputPrefixSuffixComponent } from '@components/govuk/govuk-text-input-prefix-suffix/govuk-text-input-prefix-suffix.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacOffenceDetailsDebounceTime } from '../../enums/fines-mac-offence-details-debounce-time.enum';

@Component({
  selector: 'app-fines-mac-offence-details-add-an-offence-form',
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
  templateUrl: './fines-mac-offence-details-add-an-offence-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsAddAnOffenceFormComponent
  extends AbstractFormArrayBaseComponent
  implements OnInit, OnDestroy
{
  @Input() public defendantType!: string;
  @Input({ required: true }) public resultCodeItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public formDataIndex!: number;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacOffenceDetailsForm>();

  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly opalFinesService = inject(OpalFines);
  protected readonly dateService = inject(DateService);
  protected readonly utilsService = inject(UtilsService);
  protected readonly finesMacService = inject(FinesService);
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;
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
   * sets up the form array form controls, sets initial error messages,
   * repopulates the form with data, listens for changes in the offence code,
   * and adds controls to the form array if there are no offence details draft
   * and no impositions.
   */
  private initialAddAnOffenceDetailsSetup(): void {
    const { offenceDetailsDraft } = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState;
    const hasOffenceDetailsDraft = offenceDetailsDraft.length > 0;
    const impositionsKey = 'fm_offence_details_impositions';
    const formData = hasOffenceDetailsDraft
      ? offenceDetailsDraft[0].formData
      : this.finesMacService.finesMacState.offenceDetails[0].formData;
    const impositionsLength = formData[impositionsKey].length;

    this.setupAddAnOffenceForm();
    this.setupImpositionsConfiguration();
    this.setupFormArrayFormControls([...Array(impositionsLength).keys()], impositionsKey);
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.offenceCodeListener();

    if (!hasOffenceDetailsDraft && impositionsLength === 0) {
      this.addControlsToFormArray(0, impositionsKey);
    } else {
      formData[impositionsKey].forEach((_, index) => this.setupResultCodeListener(index));
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
      this.offenceCode$ = this.opalFinesService.getOffenceByCjsCode(cjsCode).pipe(
        tap((offence) => {
          offenceCodeControl.setErrors(offence.count !== 0 ? null : { invalidOffenceCode: true }, { emitEvent: false });
        }),
      );

      this.selectedOffenceConfirmation = true;

      this.changeDetector.detectChanges();
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
        debounceTime(FinesMacOffenceDetailsDebounceTime.debounceTime),
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
   * Sets up a result code listener for the specified index and form array name.
   * This method invokes the `resultCodeListener` and updates the `fieldErrors` object
   * with the field errors specific to the given index.
   *
   * @param index - The index of the result code listener.
   * @param formArrayName - The name of the form array.
   */
  private setupResultCodeListener(index: number): void {
    this.resultCodeListener(index);
    this.fieldErrors = {
      ...this.fieldErrors,
      ...FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_FIELD_ERRORS(index),
    };
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
   * Updates the offence details draft with the provided form data.
   * If an offence details entry with the same index already exists in the draft, it updates the existing entry.
   * Otherwise, it adds a new entry to the draft.
   *
   * @param formData - The form data to update the offence details draft with.
   * @returns void
   */
  private updateOffenceDetailsDraft(formData: IFinesMacOffenceDetailsState): void {
    const offenceDetailsDraft = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft;
    const offenceDetailsIndex = this.form.get('fm_offence_details_index')!.value;

    const index = offenceDetailsDraft.findIndex(
      (item) => item.formData.fm_offence_details_index === offenceDetailsIndex,
    );

    if (index !== -1) {
      offenceDetailsDraft[index].formData = formData;
    } else {
      offenceDetailsDraft.push({
        formData: formData,
        nestedFlow: false,
      });
    }
  }

  /**
   * Navigates to the account details page.
   */
  public goToAccountDetails(): void {
    this.handleRoute(
      `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`,
      true,
    );
  }

  /**
   * Navigates to the search offences page and updates the offence details draft.
   */
  public goToSearchOffences(): void {
    this.updateOffenceDetailsDraft(this.form.value);
    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.searchOffences);
  }

  /**
   * Removes the imposition at the specified rowIndex from the form.
   *
   * @param rowIndex - The index of the imposition to be removed.
   * @returns void
   */
  public removeImpositionConfirmation(rowIndex: number): void {
    const formArray = this.form.controls['fm_offence_details_impositions'] as FormArray;

    this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition = {
      rowIndex,
      formArray: formArray,
      formArrayControls: this.formArrayControls,
    };

    this.updateOffenceDetailsDraft(this.form.value);
    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.removeImposition);
  }

  /**
   * Adds controls to the form array at the specified index.
   *
   * @param index - The index at which to add the controls.
   * @param formArrayName - The name of the form array.
   */
  public override addControlsToFormArray(index: number, formArrayName: string): void {
    super.addControlsToFormArray(index, formArrayName);
    this.setupResultCodeListener(index);
  }

  public override ngOnInit(): void {
    this.initialAddAnOffenceDetailsSetup();
    super.ngOnInit();
  }
}
