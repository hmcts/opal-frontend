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
import { AbstractFormArrayBaseComponent } from '@components/abstract/abstract-form-array-base/abstract-form-array-base';
import { futureDateValidator } from '@validators/future-date/future-date.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';

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

  private setupAddAnOffenceForm(): void {
    this.form = new FormGroup({
      fm_offence_details_date_of_offence: new FormControl(null, [
        Validators.required,
        optionalValidDateValidator(),
        futureDateValidator(),
      ]),
      fm_offence_details_offence_code: new FormControl(null, [
        Validators.required,
        validValueValidator(this.offences.refData.map((offence) => offence.get_cjs_code)),
      ]),
      fm_offence_details_impositions: new FormArray([]),
    });
  }

  private initialAddAnOffenceDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.offenceDetails;
    this.setupAddAnOffenceForm();
    this.setupImpositionsConfiguration();
    this.setupFormArrayFormControls(
      [...Array(formData[0].fm_offence_details_impositions.length).keys()],
      'fm_offence_details_impositions',
    );
    this.offenceCodeListener();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData[0]);
    if (formData[0].fm_offence_details_impositions.length === 0) {
      this.addControlsToFormArray(0, 'fm_offence_details_impositions');
    }
    this.today = this.dateService.toFormat(this.dateService.getDateNow(), 'dd/MM/yyyy');
  }

  private offenceCodeListener(): void {
    this.form.controls['fm_offence_details_offence_code'].valueChanges.subscribe((cjs_code: string) => {
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
    this.formArrayFields = FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS.map((item) => item.controlName);
    this.formArrayControlsValidation = FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS;
  }

  private resultCodeListener(index: number): void {
    const impositionsFormArray = this.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    impositionsFormGroup.controls[`fm_offence_details_result_code_${index}`].valueChanges.subscribe(
      (result_code: string) => {
        if (
          result_code &&
          (result_code === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.compensation ||
            result_code === FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.costs)
        ) {
          impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`].setValue(true);
        } else {
          impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`].setValue(false);
        }
      },
    );
  }

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