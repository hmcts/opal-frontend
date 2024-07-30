import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CustomAddressBlockComponent,
  FormAliasBaseComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components';
import {
  ADDRESS_LINE_ONE_FIELD_ERRORS,
  ADDRESS_LINE_TWO_FIELD_ERRORS,
  ADDRESS_LINE_THREE_FIELD_ERRORS,
  POST_CODE_FIELD_ERRORS,
  CUSTOM_ADDRESS_FIELD_IDS,
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldErrors } from '@interfaces';
import { alphabeticalTextValidator, specialCharactersValidator, optionalMaxLengthValidator } from 'src/app/validators';
import { MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS } from '../constants/manual-account-creation-company-details-alias';
import { MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FIELD_ERROR } from '../constants/manual-account-creation-company-details-field-errors';
import { MANUAL_ACCOUNT_CREATION_NESTED_ROUTES } from '../../constants/manual-account-creation-nested-routes';
import { IManualAccountCreationCompanyDetailsForm } from '../interfaces/manual-account-creation-company-details-form.interface';

@Component({
  selector: 'app-company-details-form',
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
    CustomAddressBlockComponent,
  ],
  templateUrl: './company-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetailsFormComponent extends FormAliasBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationCompanyDetailsForm>();

  public readonly customAddressFieldIds = CUSTOM_ADDRESS_FIELD_IDS;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly manualAccountCreationNestedRoutes = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES;

  override fieldErrors: IFieldErrors = {
    ...MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FIELD_ERROR,
    ...ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...POST_CODE_FIELD_ERRORS,
  };

  /**
   * Sets up the company details form with the necessary form controls.
   */
  private setupCompanyDetailsForm(): void {
    this.form = new FormGroup({
      companyName: new FormControl(null, [Validators.required, Validators.maxLength(50), alphabeticalTextValidator()]),
      addAlias: new FormControl(null),
      aliases: new FormArray([]),
      addressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      addressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      addressLine3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
      postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Sets up the alias configuration for the company details form.
   * This method initializes the aliasFields and aliasControlsValidation properties.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = ['companyName'];
    this.aliasControlsValidation = MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS;
  }

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   * @returns void
   */
  public handleFormSubmit(event: SubmitEvent): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      const nestedFlow = event.submitter ? event.submitter.className.includes('nested-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, nestedFlow: nestedFlow });
    }
  }

  /**
   * Performs the initial setup for the personal details form component.
   * This method sets up the personal details form, alias configuration, aliases,
   * initial error messages, nested route, form population, and alias checkbox listener.
   */
  private initialSetup(): void {
    const { companyDetails } = this.macStateService.manualAccountCreation;
    this.setupCompanyDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls([...Array(companyDetails.aliases.length).keys()], 'aliases');
    this.setInitialErrorMessages();
    this.rePopulateForm(companyDetails);
    this.setUpAliasCheckboxListener('addAlias', 'aliases');
  }

  public override ngOnInit(): void {
    this.initialSetup();
    super.ngOnInit();
  }
}
