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
import { AbstractFormAliasBaseComponent } from '@components/abstract';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';

import { FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-line-one-field-errors';
import { FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-line-two-field-errors';
import { FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-line-three-field-errors';
import { FINES_MAC_ADDRESS_BLOCK_FIELD_IDS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-field-ids';
import { FINES_MAC_ADDRESS_BLOCK_POSTCODE_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-postcode-field-errors';

import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { alphabeticalTextValidator, specialCharactersValidator, optionalMaxLengthValidator } from '@validators';
import { FinesMacAddressBlockComponent } from '../../components/fines-mac-address-block/fines-mac-address-block.component';
import { IFinesMacCompanyDetailsForm } from '../interfaces/fines-mac-company-details-form.interface';

import { FinesService } from '@services/fines';
import { IFinesMacCompanyDetailsFieldErrors } from '../interfaces/fines-mac-company-details-field-errors.interface';
import { FINES_MAC_COMPANY_DETAILS_ALIAS } from '../constants/fines-mac-company-details-alias';
import { FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-company-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';

@Component({
  selector: 'app-fines-mac-company-details-form',
  standalone: true,
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
    FinesMacAddressBlockComponent,
  ],
  templateUrl: './fines-mac-company-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCompanyDetailsFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacCompanyDetailsForm>();

  protected readonly finesService = inject(FinesService);
  public readonly customAddressFieldIds = FINES_MAC_ADDRESS_BLOCK_FIELD_IDS;
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IFinesMacCompanyDetailsFieldErrors = {
    ...FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS,
    ...FINES_MAC_ADDRESS_BLOCK_POSTCODE_FIELD_ERRORS,
  };

  /**
   * Sets up the company details form with the necessary form controls.
   */
  private setupCompanyDetailsForm(): void {
    this.form = new FormGroup({
      company_name: new FormControl(null, [Validators.required, Validators.maxLength(50), alphabeticalTextValidator()]),
      add_alias: new FormControl(null),
      aliases: new FormArray([]),
      address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      address_line_2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      address_line_3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
      postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
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
    this.setupAliasFormControls([...Array(formData.aliases.length).keys()], 'aliases');
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('add_alias', 'aliases');
  }

  public override ngOnInit(): void {
    this.initialCompanyDetailsSetup();
    super.ngOnInit();
  }
}
