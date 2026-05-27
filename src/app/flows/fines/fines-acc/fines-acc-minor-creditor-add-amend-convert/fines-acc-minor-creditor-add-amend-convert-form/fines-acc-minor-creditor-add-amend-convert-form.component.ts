import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
  GovukCheckboxesConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { IGovUkSelectOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-select/interfaces';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '../../../fines-mac/constants/fines-mac-title-dropdown-options.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { IFinesAccMinorCreditorAddAmendConvertForm } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-form.interface';
import { IFinesAccMinorCreditorAddAmendConvertFieldErrors } from '../interfaces/fines-acc-minor-creditor-add-amend-convert-field-errors.interface';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM } from '../constants/fines-acc-minor-creditor-add-amend-convert-form.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FIELD_ERRORS } from '../constants/fines-acc-minor-creditor-add-amend-convert-field-errors.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES } from '../constants/fines-acc-minor-creditor-add-amend-convert-control-names.constant';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CREDITOR_TYPES } from '../constants/fines-acc-minor-creditor-add-amend-convert-creditor-types.constant';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fines-acc-minor-creditor-add-amend-convert-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukSelectComponent,
    GovukTextInputComponent,
    CapitalisationDirective,
    GovukRadiosConditionalComponent,
    GovukHeadingWithCaptionComponent,
  ],
  templateUrl: './fines-acc-minor-creditor-add-amend-convert-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorAddAmendConvertFormComponent
  extends AbstractFormBaseComponent
  implements OnInit, OnDestroy
{
  private readonly finesAccStore = inject(FinesAccountStore);
  protected override formSubmit = new EventEmitter<IFinesAccMinorCreditorAddAmendConvertForm>();
  protected readonly accountNumber = this.finesAccStore.getAccountNumber();
  protected readonly partyName = this.finesAccStore.party_name();

  @Input({ required: false }) public initialFormData: IFinesAccMinorCreditorAddAmendConvertForm =
    FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM;

  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};
  public readonly controls = FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CONTROL_NAMES;
  public readonly creditorTypes = FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_CREDITOR_TYPES;
  public readonly minorCreditorRoutingPaths = FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS;
  public readonly titleOptions: IGovUkSelectOptions[] = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  public readonly individualConditionalId = 'facc_minor_creditor_creditor_type_individual_conditional';
  public readonly companyConditionalId = 'facc_minor_creditor_creditor_type_company_conditional';

  public override fieldErrors: IFinesAccMinorCreditorAddAmendConvertFieldErrors = {
    ...FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FIELD_ERRORS,
  };

  /**
   * Creates the minor creditor amend form controls from the resolved initial form data.
   */
  private setupForm(): void {
    const { formData } = this.initialFormData;

    this.form = new FormGroup({
      [this.controls.creditorType]: new FormControl(formData.facc_minor_creditor_creditor_type),
      [this.controls.title]: new FormControl(formData.facc_minor_creditor_title),
      [this.controls.forenames]: new FormControl(formData.facc_minor_creditor_forenames),
      [this.controls.surname]: new FormControl(formData.facc_minor_creditor_surname),
      [this.controls.companyName]: new FormControl(formData.facc_minor_creditor_company_name),
      [this.controls.addressLine1]: new FormControl(formData.facc_minor_creditor_address_line_1),
      [this.controls.addressLine2]: new FormControl(formData.facc_minor_creditor_address_line_2),
      [this.controls.addressLine3]: new FormControl(formData.facc_minor_creditor_address_line_3),
      [this.controls.addressLine4]: new FormControl(formData.facc_minor_creditor_address_line_4),
      [this.controls.addressLine5]: new FormControl(formData.facc_minor_creditor_address_line_5),
      [this.controls.postCode]: new FormControl(formData.facc_minor_creditor_post_code),
      [this.controls.payByBacs]: new FormControl(formData.facc_minor_creditor_pay_by_bacs ?? false),
      [this.controls.bankAccountName]: new FormControl(formData.facc_minor_creditor_bank_account_name),
      [this.controls.bankSortCode]: new FormControl(formData.facc_minor_creditor_bank_sort_code),
      [this.controls.bankAccountNumber]: new FormControl(formData.facc_minor_creditor_bank_account_number),
      [this.controls.bankAccountReference]: new FormControl(formData.facc_minor_creditor_bank_account_reference),
    });
  }

  /**
   * Initialises the form before wiring up shared form behaviour.
   */
  public override ngOnInit(): void {
    this.setupForm();
    super.ngOnInit();
  }
}
