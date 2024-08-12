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
import {
  FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS,
  FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS,
  FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS,
  FINES_MAC_ADDRESS_BLOCK_FIELD_IDS,
  FINES_MAC_ADDRESS_BLOCK_POSTCODE_FIELD_ERRORS,
} from '@constants/components/fine/mac';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { alphabeticalTextValidator, specialCharactersValidator, optionalMaxLengthValidator } from '@validators';
import { FinesMacAddressBlockComponent } from '@components/fines/mac';
import { IFinesMacCompanyDetailsForm } from '../interfaces';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FINES_MAC_NESTED_ROUTES } from '@constants/fines/mac';
import { FinesService } from '@services/fines';
import { IFinesMacCompanyDetailsFieldErrors } from '../interfaces/fines-mac-company-details-field-errors.interface';
import { FINES_MAC_COMPANY_DETAILS_ALIAS, FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS } from '../constants';

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
  @Output() private formSubmit = new EventEmitter<IFinesMacCompanyDetailsForm>();

  protected readonly finesService = inject(FinesService);
  public readonly customAddressFieldIds = FINES_MAC_ADDRESS_BLOCK_FIELD_IDS;
  protected readonly finesMacRoutes = FinesMacRoutes;
  protected readonly finesMacNestedRoutes = FINES_MAC_NESTED_ROUTES;

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
      CompanyName: new FormControl(null, [Validators.required, Validators.maxLength(50), alphabeticalTextValidator()]),
      AddAlias: new FormControl(null),
      Aliases: new FormArray([]),
      AddressLine1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      AddressLine2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      AddressLine3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
      Postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Sets up the alias configuration for the company details form.
   * This method initializes the aliasFields and aliasControlsValidation properties.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = ['AliasOrganisationName'];
    this.aliasControlsValidation = FINES_MAC_COMPANY_DETAILS_ALIAS;
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
    const { companyDetails } = this.finesService.finesMacState;
    this.setupCompanyDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls([...Array(companyDetails.Aliases.length).keys()], 'Aliases');
    this.setInitialErrorMessages();
    this.rePopulateForm(companyDetails);
    this.setUpAliasCheckboxListener('AddAlias', 'Aliases');
  }

  public override ngOnInit(): void {
    this.initialSetup();
    super.ngOnInit();
  }
}
