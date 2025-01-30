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
import { Observable, EMPTY, debounceTime, distinctUntilChanged, tap, takeUntil, map } from 'rxjs';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS } from '../../constants/fines-mac-offence-details-creditor-options.constant';
import { FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS } from '../../constants/fines-mac-offence-details-offences-field-errors.constant';
import { IFinesMacOffenceDetailsForm } from '../../interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOffenceDetailsState } from '../../interfaces/fines-mac-offence-details-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacOffenceDetailsService } from '../../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { futureDateValidator } from '@validators/future-date/future-date.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS } from '../../constants/fines-mac-offence-details-impositions.constant';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_FIELD_ERRORS } from '../../constants/fines-mac-offence-details-impositions-field-errors.constant';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../../constants/fines-mac-offence-details-result-codes.constant';
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
import { FinesMacOffenceDetailsDebounceTime } from '../../enums/fines-mac-offence-details-debounce-time.enum';
import { GovukRadiosConditionalComponent } from '@components/govuk/govuk-radio/govuk-radios-conditional/govuk-radios-conditional.component';
import { CommonModule } from '@angular/common';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from '../../constants/fines-mac-offence-details-state.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths';
import { MojBannerComponent } from '@components/moj/moj-banner/moj-banner.component';
import { IFinesMacOffenceDetailsAddAnOffenceFormMinorCreditor } from './interfaces/fines-mac-offence-details-add-an-offence-form-minor-creditor.interface';
import { FinesMacOffenceDetailsMinorCreditorInformationComponent } from '../../fines-mac-offence-details-minor-creditor-information/fines-mac-offence-details-minor-creditor-information.component';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { IFinesMacOffenceDetailsAddAnOffenceFormMinorCreditorHidden } from './interfaces/fines-mac-offence-details-add-an-offence-form-minor-creditor-hidden.interface';
import { FinesMacStore } from '../../../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-offence-details-add-an-offence-form',
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
    GovukRadiosConditionalComponent,
    MojBannerComponent,
    FinesMacOffenceDetailsMinorCreditorInformationComponent,
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
  @Input({ required: true }) public majorCreditorItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public offenceIndex!: number;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacOffenceDetailsForm>();

  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly opalFinesService = inject(OpalFines);
  protected readonly dateService = inject(DateService);
  protected readonly utilsService = inject(UtilsService);
  public finesMacStore = inject(FinesMacStore);
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  public selectedOffenceConfirmation!: boolean;
  public selectedOffenceSuccessful!: boolean;
  public selectedOffenceTitle!: string;
  public today!: string;

  public offenceCode$: Observable<IOpalFinesOffencesRefData> = EMPTY;

  public creditorOptions = FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS;

  public minorCreditors!: IFinesMacOffenceDetailsAddAnOffenceFormMinorCreditor;
  public minorCreditorsHidden!: IFinesMacOffenceDetailsAddAnOffenceFormMinorCreditorHidden;

  override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS,
  };

  /**
   * Sets up the form for adding an offence.
   */
  private setupAddAnOffenceForm(): void {
    this.form = new FormGroup({
      fm_offence_details_id: new FormControl(this.offenceIndex),
      fm_offence_details_date_of_sentence: new FormControl(null, [
        Validators.required,
        optionalValidDateValidator(),
        futureDateValidator(),
      ]),
      fm_offence_details_offence_cjs_code: new FormControl(null, [Validators.required]),
      fm_offence_details_offence_id: new FormControl(null),
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
    let formData;

    if (hasOffenceDetailsDraft) {
      formData = offenceDetailsDraft[0].formData;
    } else {
      const offenceDetails = structuredClone(this.finesMacStore.offenceDetails()[this.offenceIndex]);
      formData = offenceDetails
        ? {
            ...structuredClone(offenceDetails.formData),
            fm_offence_details_impositions: this.addIndexToFormArrayData(
              offenceDetails.formData.fm_offence_details_impositions,
            ),
          }
        : { ...structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE), fm_offence_details_id: this.offenceIndex };
    }

    const impositionsLength = formData[impositionsKey].length;

    this.setupAddAnOffenceForm();
    this.setupImpositionsConfiguration();
    this.setupFormArrayFormControls([...Array(impositionsLength).keys()], impositionsKey);
    this.setInitialErrorMessages();
    this.getMinorCreditors();
    this.rePopulateForm(formData);
    this.offenceCodeListener();

    if (!hasOffenceDetailsDraft && impositionsLength === 0) {
      this.addControlsToFormArray(0, impositionsKey);
    } else {
      formData[impositionsKey].forEach((_, index) => {
        this.setupResultCodeListener(index);
      });
    }
    this.today = this.dateService.toFormat(this.dateService.getDateNow(), 'dd/MM/yyyy');
  }

  /**
   * Populates the offence hint based on the provided CJS code.
   * @param cjsCode - The CJS code used to retrieve the offence details.
   */
  private populateOffenceHint(cjsCode: string): void {
    const offenceCodeControl = this.form.controls['fm_offence_details_offence_cjs_code'];
    const offenceIdControl = this.form.controls['fm_offence_details_offence_id'];
    offenceIdControl.setValue(null);

    if (cjsCode?.length >= 7 && cjsCode?.length <= 8) {
      this.offenceCode$ = this.opalFinesService.getOffenceByCjsCode(cjsCode).pipe(
        tap((offence) => {
          offenceCodeControl.setErrors(offence.count !== 0 ? null : { invalidOffenceCode: true }, { emitEvent: false });
          offenceIdControl.setValue(offence.count !== 1 ? null : offence.refData[0].offence_id, { emitEvent: false });
        }),
        map((response) => response),
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

    const offenceCodeControl = this.form.controls['fm_offence_details_offence_cjs_code'];

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
        takeUntil(this['ngUnsubscribe']),
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
   * Removes the minor creditor data at the specified index from the offence details draft state.
   * If the offence details draft state or child form data is not available, the function returns early.
   *
   * @param {number} index - The index of the minor creditor data to be removed.
   *
   * @returns {void}
   */
  private removeMinorCreditorData(index: number): void {
    this.removeMinorCreditorFromDraftState(index);
    this.removeMinorCreditorFromState(index);
  }

  /**
   * Removes a minor creditor from the draft state based on the provided index.
   *
   * @param {number} index - The index of the minor creditor to be removed.
   * @returns {void}
   */
  private removeMinorCreditorFromDraftState(index: number): void {
    const draftOffenceDetails =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0];
    if (!draftOffenceDetails?.childFormData) {
      return;
    }

    const minorCreditorIndex = draftOffenceDetails.childFormData.findIndex(
      (x) => x.formData.fm_offence_details_imposition_position === index,
    );

    if (minorCreditorIndex >= 0) {
      draftOffenceDetails.childFormData.splice(minorCreditorIndex, 1);
    }
  }

  /**
   * Removes a minor creditor from the state at the specified index.
   * If the minor creditor exists at the given index, it will be deleted.
   *
   * @param {number} index - The index of the minor creditor to be removed.
   * @returns {void}
   */
  private removeMinorCreditorFromState(index: number): void {
    if (this.minorCreditors[index]) {
      delete this.minorCreditors[index];
    }
  }

  /**
   * Listens for changes in the result code control and updates the needs creditor control accordingly.
   * @param index - The index of the impositions form group.
   */
  private resultCodeListener(index: number): void {
    const impositionsFormGroup = this.getFormArrayFormGroup(index, 'fm_offence_details_impositions');
    const resultCodeControl = this.getFormArrayFormGroupControl(
      impositionsFormGroup,
      'fm_offence_details_result_id',
      index,
    );
    const needsCreditorControl = this.getFormArrayFormGroupControl(
      impositionsFormGroup,
      'fm_offence_details_needs_creditor',
      index,
    );
    const creditorControl = this.getFormArrayFormGroupControl(
      impositionsFormGroup,
      'fm_offence_details_creditor',
      index,
    );
    const majorCreditorControl = this.getFormArrayFormGroupControl(
      impositionsFormGroup,
      'fm_offence_details_major_creditor_id',
      index,
    );

    if (needsCreditorControl.value) {
      this.creditorListener(index);
    }

    resultCodeControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this['ngUnsubscribe']))
      .subscribe((result_code: string) => {
        creditorControl.reset();
        const needsCreditor =
          result_code &&
          (result_code === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.compensation ||
            result_code === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.costs);
        needsCreditorControl.setValue(needsCreditor, { emitEvent: false });
        if (needsCreditor) {
          this.addFormArrayFormGroupControlValidators(creditorControl, [Validators.required]);
          this.creditorListener(index);
        } else {
          this.removeFormArrayFormGroupControlValidators(creditorControl);
          if (majorCreditorControl) {
            this.removeFormArrayFormGroupControlValidators(majorCreditorControl);
          }
          this.removeMinorCreditorData(index);
        }
      });
  }

  /**
   * Listens for changes in the creditor control and performs validation based on the selected value.
   *
   * @param index - The index of the form array group.
   */
  private creditorListener(index: number): void {
    const impositionsFormGroup = this.getFormArrayFormGroup(index, 'fm_offence_details_impositions');
    const creditorControl = this.getFormArrayFormGroupControl(
      impositionsFormGroup,
      'fm_offence_details_creditor',
      index,
    );

    if (creditorControl.value === 'major' || creditorControl.value === 'minor') {
      this.majorCreditorValidation(index, creditorControl.value === 'major', impositionsFormGroup);
    }

    creditorControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this['ngUnsubscribe']))
      .subscribe((creditor: string) => {
        this.majorCreditorValidation(index, creditor === 'major', impositionsFormGroup);
      });
  }

  /**
   * Validates the major creditor control in the form group.
   * @param index - The index of the form group.
   * @param add - Indicates whether to add or remove validators.
   * @param formGroup - The form group containing the major creditor control.
   */
  private majorCreditorValidation(index: number, add: boolean, formGroup: FormGroup): void {
    const majorCreditorControl = this.getFormArrayFormGroupControl(
      formGroup,
      'fm_offence_details_major_creditor_id',
      index,
    );

    if (add) {
      this.addFormArrayFormGroupControlValidators(majorCreditorControl, [Validators.required]);
    } else {
      this.removeFormArrayFormGroupControlValidators(majorCreditorControl);
    }
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
    const offenceDetailsIndex = this.form.get('fm_offence_details_id')!.value;

    const index = offenceDetailsDraft.findIndex((item) => item.formData.fm_offence_details_id === offenceDetailsIndex);

    const childFormData =
      structuredClone(this.finesMacStore.offenceDetails()[this.offenceIndex]?.childFormData) ||
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0]?.childFormData ||
      [];

    if (index !== -1) {
      offenceDetailsDraft[index].formData = formData;
    } else {
      offenceDetailsDraft.push({
        formData: formData,
        nestedFlow: false,
        childFormData: childFormData,
      });
    }
  }

  /**
   * Calculates the balance remaining for each offence in the form.
   * Updates the 'balance_remaining' control value for each offence.
   */
  private calculateBalanceRemaining(): void {
    const formArray = this.form.get('fm_offence_details_impositions') as FormArray;
    const formGroupsFormArray = formArray.controls as FormGroup[];

    formGroupsFormArray.forEach((control, rowIndex) => {
      const amountImposedControl = control.controls[`fm_offence_details_amount_imposed_${rowIndex}`];
      const amountPaidControl = control.controls[`fm_offence_details_amount_paid_${rowIndex}`];
      const balanceRemainingControl = control.controls[`fm_offence_details_balance_remaining_${rowIndex}`];

      const amountImposed: number = this.getControlValueOrDefault(amountImposedControl, 0);
      const amountPaid: number = this.getControlValueOrDefault(amountPaidControl, 0);

      balanceRemainingControl?.setValue(amountImposed - amountPaid, { emitEvent: false });
    });
  }

  /**
   * Navigates to the search offences page and updates the offence details draft.
   */
  public goToSearchOffences(): void {
    this.updateOffenceDetailsDraft(this.form.value);
    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.searchOffences);
  }

  /**
   * Navigates to the minor creditor page for the specified row index.
   *
   * @param rowIndex - The index of the row.
   */
  public goToMinorCreditor(rowIndex: number): void {
    const formArray = this.form.controls['fm_offence_details_impositions'] as FormArray;

    this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeImposition = {
      rowIndex,
      formArray: formArray,
      formArrayControls: this.formArrayControls,
    };

    this.updateOffenceDetailsDraft(this.form.value);
    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.addMinorCreditor);
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
   * Cancels the current operation and navigates to the appropriate route.
   * If there are no offences, it navigates to the account details page.
   * Otherwise, it navigates to the review offences page.
   */
  public cancelLink(): void {
    if (this.finesMacOffenceDetailsService.emptyOffences) {
      this.handleRoute(
        `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`,
        true,
      );
    } else {
      this.handleRoute(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences);
    }
  }

  /**
   * Handles the submit event for adding an offence.
   * This method calculates the remaining balance and handles the form submission.
   *
   * @param event - The submit event.
   */
  public handleAddAnOffenceSubmit(event: SubmitEvent): void {
    this.calculateBalanceRemaining();

    this.handleFormSubmit(event);
  }

  /**
   * Handles the minor creditor actions.
   * @param event - The event object containing the action and index.
   */
  public minorCreditorActions(event: { action: string; index: number }): void {
    if (event.action === 'remove' || event.action === 'change') {
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor = event.index;

      this.updateOffenceDetailsDraft(this.form.value);
      this.handleRoute(
        event.action === 'remove'
          ? this.fineMacOffenceDetailsRoutingPaths.children.removeMinorCreditor
          : this.fineMacOffenceDetailsRoutingPaths.children.addMinorCreditor,
      );
    } else if (event.action === 'showHideDetails') {
      this.minorCreditorsHidden[event.index] = !this.minorCreditorsHidden[event.index];
    }
  }

  /**
   * Retrieves the minor creditor form data for the specified row index.
   * @param rowIndex - The index of the row for which to retrieve the minor creditor form data.
   * @returns The minor creditor form data for the specified row index, or undefined if not found.
   */
  public getMinorCreditor(rowIndex: number): IFinesMacOffenceDetailsMinorCreditorForm | undefined {
    const offenceDetails = structuredClone(this.finesMacStore.offenceDetails()[this.offenceIndex]);
    return offenceDetails.childFormData!.find(
      (childFormData) => childFormData.formData.fm_offence_details_imposition_position === rowIndex,
    );
  }

  /**
   * Retrieves the minor creditors for the offence details.
   * The minor creditors are obtained from the offence details or the draft offence details.
   * The minor creditors are then stored in the `minorCreditors` property of the component.
   */
  public getMinorCreditors(): void {
    const offenceDetails = this.finesMacStore.offenceDetails()[this.offenceIndex];
    const draftOffenceDetails =
      this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0];

    const minorCreditorsArray =
      structuredClone(offenceDetails?.childFormData) || draftOffenceDetails?.childFormData || [];

    this.minorCreditors = minorCreditorsArray.reduce((acc, creditor) => {
      const position = creditor.formData.fm_offence_details_imposition_position;

      if (position != null) {
        acc[position] = creditor.formData;
      }

      return acc;
    }, {} as IFinesMacOffenceDetailsAddAnOffenceFormMinorCreditor);

    this.minorCreditorsHidden = minorCreditorsArray.reduce((acc, creditor) => {
      const position = creditor.formData.fm_offence_details_imposition_position;

      if (position != null) {
        acc[position] = true;
      }

      return acc;
    }, {} as IFinesMacOffenceDetailsAddAnOffenceFormMinorCreditorHidden);
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
