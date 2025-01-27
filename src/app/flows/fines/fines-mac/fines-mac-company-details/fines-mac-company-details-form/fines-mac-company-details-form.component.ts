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

import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
import { GovukCheckboxesConditionalComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-conditional/govuk-checkboxes-conditional.component';
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';

import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';

import { IFinesMacCompanyDetailsForm } from '../interfaces/fines-mac-company-details-form.interface';

import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacCompanyDetailsFieldErrors } from '../interfaces/fines-mac-company-details-field-errors.interface';
import { FINES_MAC_COMPANY_DETAILS_ALIAS } from '../constants/fines-mac-company-details-alias';
import { FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-company-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';

@Component({
  selector: 'app-fines-mac-company-details-form',

  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-company-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCompanyDetailsFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacCompanyDetailsForm>();

  protected readonly finesService = inject(FinesService);

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
    const { formData } = this.finesService.finesMacState.companyDetails;
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
