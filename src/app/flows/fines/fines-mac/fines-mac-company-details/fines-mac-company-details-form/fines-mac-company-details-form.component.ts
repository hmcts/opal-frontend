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
import { AbstractFormAliasBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-alias-base';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IFinesMacCompanyDetailsForm } from '../interfaces/fines-mac-company-details-form.interface';
import { IFinesMacCompanyDetailsFieldErrors } from '../interfaces/fines-mac-company-details-field-errors.interface';
import { FINES_MAC_COMPANY_DETAILS_ALIAS } from '../constants/fines-mac-company-details-alias';
import { FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-company-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { alphabeticalTextValidator } from '@hmcts/opal-frontend-common/validators/alphabetical-text';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { specialCharactersValidator } from '@hmcts/opal-frontend-common/validators/special-characters';

@Component({
  selector: 'app-fines-mac-company-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukCancelLinkComponent,
    GovukTextInputComponent,
  ],
  templateUrl: './fines-mac-company-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCompanyDetailsFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacCompanyDetailsForm>();

  private readonly finesMacStore = inject(FinesMacStore);

  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IFinesMacCompanyDetailsFieldErrors = FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the company details form with the necessary form controls.
   */
  private setupCompanyDetailsForm(): void {
    this.form = new FormGroup({
      fm_company_details_company_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
        alphabeticalTextValidator(),
      ]),
      fm_company_details_add_alias: new FormControl(null),
      fm_company_details_aliases: new FormArray([]),
      fm_company_details_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      fm_company_details_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(30),
        specialCharactersValidator(),
      ]),
      fm_company_details_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(16),
        specialCharactersValidator(),
      ]),
      fm_company_details_postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Sets up the alias configuration for the company details form.
   * This method initializes the aliasFields and aliasControlsValidation properties.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = FINES_MAC_COMPANY_DETAILS_ALIAS.map((item) => item.controlName);
    this.aliasControlsValidation = FINES_MAC_COMPANY_DETAILS_ALIAS;
  }

  /**
   * Performs the initial setup for the personal details form component.
   * This method sets up the personal details form, alias configuration, aliases,
   * initial error messages, nested route, form population, and alias checkbox listener.
   */
  private initialCompanyDetailsSetup(): void {
    const { formData } = this.finesMacStore.companyDetails();
    this.setupCompanyDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls(
      [...Array(formData['fm_company_details_aliases'].length).keys()],
      'fm_company_details_aliases',
    );
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('fm_company_details_add_alias', 'fm_company_details_aliases');
  }

  public override ngOnInit(): void {
    this.initialCompanyDetailsSetup();
    super.ngOnInit();
  }
}
