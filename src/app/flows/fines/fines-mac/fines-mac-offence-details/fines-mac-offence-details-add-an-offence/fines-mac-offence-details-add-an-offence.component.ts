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
import { FormGroup } from '@angular/forms';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_DATE_OF_SENTENCE as F_M_O_D_C_DATE_OF_SENTENCE } from '../constants/controls/fines-mac-offence-details-date-of-sentence.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_OFFENCE_CODE as F_M_O_D_C_OFFENCE_CODE } from '../constants/controls/fines-mac-offence-details-offence-code.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_IMPOSITIONS as F_M_O_D_C_IMPOSITIONS } from '../constants/controls/fines-mac-offence-details-impositions.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_RESULT_CODE as F_M_O_D_C_RESULT_CODE } from '../constants/controls/fines-mac-offence-details-result-code.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_ADD_IMPOSITION as F_M_O_D_C_ADD_IMPOSITION } from '../constants/controls/fines-mac-offence-details-add-imposition.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_IMPOSED as F_M_O_D_C_AMOUNT_IMPOSED } from '../constants/controls/fines-mac-offence-details-amount-imposed.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_PAID as F_M_O_D_C_AMOUNT_PAID } from '../constants/controls/fines-mac-offence-details-amount-paid.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_CREDITOR as F_M_O_D_C_CREDITOR } from '../constants/controls/fines-mac-offence-details-creditor.constant';

import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov/alphagov-accessible-autocomplete/alphagov-accessible-autocomplete.component';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IOpalFinesOffences } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
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

@Component({
  selector: 'app-fines-mac-offence-details-add-an-offence',
  standalone: true,
  imports: [
    GovukErrorSummaryComponent,
    MojDatePickerComponent,
    AlphagovAccessibleAutocompleteComponent,
    MojTicketPanelComponent,
    GovukButtonComponent,
    GovukTextInputPrefixSuffixComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-offence-details-add-an-offence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsAddAnOffenceComponent
  extends AbstractFormAliasBaseComponent
  implements OnInit, OnDestroy
{
  @Input() public defendantType!: string;
  @Input({ required: true }) public offences!: IOpalFinesOffences[];
  @Input({ required: true }) public offenceCodeItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public resultCodeItems!: IAlphagovAccessibleAutocompleteItem[];
  @Output() protected override formSubmit = new EventEmitter<IFinesMacOffenceDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  public offenceCodeHintText: string = `For example, HY35014. If you don't know the offence code, you can <a href="#">search the offence list</a>`;
  public selectedOffenceConfirmation!: boolean;
  public selectedOffenceSuccessful!: boolean;
  public selectedOffenceTitle!: string;

  public creditorOptions = FINES_MAC_OFFENCE_DETAILS_CREDITOR_OPTIONS;

  public offenceDetailsDateOfSentence = F_M_O_D_C_DATE_OF_SENTENCE;
  public offenceDetailsOffenceCode = F_M_O_D_C_OFFENCE_CODE;
  public offenceDetailsImpositions = F_M_O_D_C_IMPOSITIONS;
  public offenceDetailsResultCode = F_M_O_D_C_RESULT_CODE;
  public offenceDetailsAddImposition = F_M_O_D_C_ADD_IMPOSITION;
  public offenceDetailsAmountImposed = F_M_O_D_C_AMOUNT_IMPOSED;
  public offenceDetailsAmountPaid = F_M_O_D_C_AMOUNT_PAID;
  public offenceDetailsCreditor = F_M_O_D_C_CREDITOR;

  private setupAddAnOffenceForm(): void {
    this.form = new FormGroup({
      [this.offenceDetailsDateOfSentence.controlName]: this.createFormControl(
        this.offenceDetailsDateOfSentence.validators,
      ),
      [this.offenceDetailsOffenceCode.controlName]: this.createFormControl(this.offenceDetailsOffenceCode.validators),
      [this.offenceDetailsImpositions.controlName]: this.createFormArray(this.offenceDetailsImpositions.validators, []),
      [this.offenceDetailsAddImposition.controlName]: this.createFormControl(
        this.offenceDetailsAddImposition.validators,
      ),
    });
  }

  private initialAddAnOffenceDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.offenceDetails;
    this.setupAddAnOffenceForm();
    this.setupImpositionsConfiguration();
    this.setupAliasFormControls([...Array([]).keys()], this.offenceDetailsImpositions.controlName);
    this.offenceCodeListener();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener(
      this.offenceDetailsAddImposition.controlName,
      this.offenceDetailsImpositions.controlName,
    );
  }

  private offenceCodeListener(): void {
    this.form.controls[this.offenceDetailsOffenceCode.controlName].valueChanges.subscribe((cjs_code: string) => {
      this.selectedOffenceConfirmation = false;
      this.selectedOffenceSuccessful = false;
      this.selectedOffenceTitle = 'Enter a valid offence code';

      if (cjs_code && cjs_code.length >= 7 && cjs_code.length <= 8) {
        const offence = this.offences.find((offence) => offence.get_cjs_code === cjs_code);
        if (offence) {
          this.selectedOffenceTitle = offence.offence_title;
          this.selectedOffenceConfirmation = true;
          this.selectedOffenceSuccessful = true;
        }
      }
    });
  }

  private setupImpositionsConfiguration(): void {
    this.aliasFields = FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS.map((item) => item.controlName);
    this.aliasControlsValidation = FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS;
  }

  public override ngOnInit(): void {
    this.initialAddAnOffenceDetailsSetup();
    super.ngOnInit();
  }
}
