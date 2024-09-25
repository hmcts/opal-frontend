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
import { AbstractFormAliasBaseComponent } from '@components/abstract/abstract-form-alias-base/abstract-form-alias-base';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

/* CONTROLS */
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_DATE_OF_SENTENCE as F_M_OFFENCE_DETAILS_DATE_OF_SENTENCE } from '../constants/controls/fines-mac-offence-details-date-of-sentence.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_OFFENCE_CODE as F_M_OFFENCE_DETAILS_OFFENCE_CODE } from '../constants/controls/fines-mac-offence-details-offence-code.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_IMPOSITIONS as F_M_OFFENCE_DETAILS_IMPOSITIONS } from '../constants/controls/fines-mac-offence-details-impositions.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_RESULT_CODE as F_M_OFFENCE_DETAILS_RESULT_CODE } from '../constants/controls/fines-mac-offence-details-result-code.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_IMPOSED as F_M_OFFENCE_DETAILS_AMOUNT_IMPOSED } from '../constants/controls/fines-mac-offence-details-amount-imposed.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_PAID as F_M_OFFENCE_DETAILS_AMOUNT_PAID } from '../constants/controls/fines-mac-offence-details-amount-paid.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_NEEDS_CREDITOR as F_M_OFFENCE_DETAILS_NEEDS_CREDITOR } from '../constants/controls/fines-mac-offence-details-needs-creditor.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_CREDITOR as F_M_OFFENCE_DETAILS_CREDITOR } from '../constants/controls/fines-mac-offence-details-creditor.constant';

import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov/alphagov-accessible-autocomplete/alphagov-accessible-autocomplete.component';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
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
import { validValueValidator } from '@validators/valid-value/valid-value.validator';
import { CommonModule } from '@angular/common';

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
  extends AbstractFormAliasBaseComponent
  implements OnInit, OnDestroy
{
  @Input() public defendantType!: string;
  @Input({ required: true }) public offences!: IOpalFinesOffencesRefData;
  @Input({ required: true }) public resultCodeItems!: IAlphagovAccessibleAutocompleteItem[];
  @Output() protected override formSubmit = new EventEmitter<IFinesMacOffenceDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly dateService = inject(DateService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  public selectedOffenceConfirmation!: boolean;
  public selectedOffenceSuccessful!: boolean;
  public selectedOffenceTitle!: string;
  public today!: string;

  public creditorOptions = FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS;

  override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS,
  };

  public offenceDetailsDateOfSentence = F_M_OFFENCE_DETAILS_DATE_OF_SENTENCE;
  public offenceDetailsOffenceCode = F_M_OFFENCE_DETAILS_OFFENCE_CODE;
  public offenceDetailsImpositions = F_M_OFFENCE_DETAILS_IMPOSITIONS;
  public offenceDetailsResultCode = F_M_OFFENCE_DETAILS_RESULT_CODE;
  public offenceDetailsAmountImposed = F_M_OFFENCE_DETAILS_AMOUNT_IMPOSED;
  public offenceDetailsAmountPaid = F_M_OFFENCE_DETAILS_AMOUNT_PAID;
  public offenceDetailsNeedsCreditor = F_M_OFFENCE_DETAILS_NEEDS_CREDITOR;
  public offenceDetailsCreditor = F_M_OFFENCE_DETAILS_CREDITOR;

  private setupAddAnOffenceForm(): void {
    this.form = new FormGroup({
      [this.offenceDetailsDateOfSentence.controlName]: this.createFormControl(
        this.offenceDetailsDateOfSentence.validators,
      ),
      [this.offenceDetailsOffenceCode.controlName]: this.createFormControl(this.offenceDetailsOffenceCode.validators),
      [this.offenceDetailsImpositions.controlName]: this.createFormArray(this.offenceDetailsImpositions.validators, []),
    });
  }

  private initialAddAnOffenceDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.offenceDetails;
    this.addValidValueValidator();
    this.setupAddAnOffenceForm();
    this.setupImpositionsConfiguration();
    this.setupAliasFormControls(
      [...Array(formData[0].impositions.length).keys()],
      this.offenceDetailsImpositions.controlName,
    );
    this.offenceCodeListener();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData[0]);
    if (formData[0].impositions.length === 0) {
      this.addAlias(0, this.offenceDetailsImpositions.controlName);
    }
    this.today = this.dateService.toFormat(this.dateService.getDateNow(), 'dd/MM/yyyy');
  }

  private offenceCodeListener(): void {
    this.form.controls[this.offenceDetailsOffenceCode.controlName].valueChanges.subscribe((cjs_code: string) => {
      this.selectedOffenceConfirmation = false;
      this.selectedOffenceSuccessful = false;
      this.selectedOffenceTitle = 'Enter a valid offence code';

      if (cjs_code && cjs_code.length >= 7 && cjs_code.length <= 8) {
        this.selectedOffenceConfirmation = true;
        const offence = this.offences.refData.find((offence) => offence.get_cjs_code === cjs_code);
        if (offence) {
          this.selectedOffenceTitle = offence.offence_title;
          this.selectedOffenceSuccessful = true;
        }
      }
    });
  }

  private setupImpositionsConfiguration(): void {
    this.aliasFields = FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS.map((item) => item.controlName);
    this.aliasControlsValidation = FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS;
  }

  private resultCodeListener(index: number): void {
    const impositionsFormArray = this.form.get([this.offenceDetailsImpositions.controlName]) as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    impositionsFormGroup.controls[`${this.offenceDetailsResultCode.controlName}_${index}`].valueChanges.subscribe(
      (result_code: string) => {
        if (
          result_code &&
          (result_code === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.Compensation ||
            result_code === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.Costs)
        ) {
          impositionsFormGroup.controls[`${this.offenceDetailsNeedsCreditor.controlName}_${index}`].setValue(true);
        } else {
          impositionsFormGroup.controls[`${this.offenceDetailsNeedsCreditor.controlName}_${index}`].setValue(false);
        }
      },
    );
  }

  private addValidValueValidator(): void {
    this.offenceDetailsOffenceCode.validators.push(
      validValueValidator(this.offences.refData.map((offence) => offence.get_cjs_code)),
    );
  }

  public override addAlias(index: number, formArrayName: string): void {
    super.addAlias(index, formArrayName);
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

  public override handleFormSubmit(event: SubmitEvent): void {
    super.handleFormSubmit(event);
    console.log(this.formControlErrorMessages);
  }
}
