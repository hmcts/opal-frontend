import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  computed,
  inject,
} from '@angular/core';
import { AbstractFormAliasBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-alias-base';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';
import { getFeatureFlagReleaseState } from '../../../utils/fines-section-permissions.utils';
import { removeAliasAndRestoreState } from '../../../utils/fines-alias-renumbering.utils';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IFinesMacCompanyDetailsForm } from '../interfaces/fines-mac-company-details-form.interface';
import { IFinesMacCompanyDetailsFieldErrors } from '../interfaces/fines-mac-company-details-field-errors.interface';
import { FINES_MAC_COMPANY_DETAILS_ALIAS } from '../constants/fines-mac-company-details-alias';
import { FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-company-details-field-errors.constant';
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
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { TrimLeadingTrailingWhitespaceDirective } from '@hmcts/opal-frontend-common/directives/trim-leading-trailing-whitespace';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { ALPHANUMERIC_WITH_SPACES_PATTERN, SINGLE_ASCII_CHARACTERS } from '@hmcts/opal-frontend-common/constants';

//regex pattern validators for the form controls
const SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR = patternValidator(SINGLE_ASCII_CHARACTERS, 'singleAsciiCharacters');
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);

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
    CapitalisationDirective,
    TrimLeadingTrailingWhitespaceDirective,
  ],
  templateUrl: './fines-mac-company-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCompanyDetailsFormComponent extends AbstractFormAliasBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly globalStore = inject(GlobalStore);
  private readonly injector = inject(Injector);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacCompanyDetailsForm>();

  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  @Input() public defendantType!: string;
  override fieldErrors: IFinesMacCompanyDetailsFieldErrors = FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS;

  public readonly release1a1_2Enabled = computed(
    () => getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true,
  );

  /**
   * Sets up the company details form with the necessary form controls.
   */
  private setupCompanyDetailsForm(): void {
    this.form = new FormGroup({
      fm_company_details_company_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      fm_company_details_add_alias: new FormControl(null),
      fm_company_details_aliases: new FormArray([]),
      fm_company_details_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      fm_company_details_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(30),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      fm_company_details_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(16),
        SINGLE_ASCII_CHARACTERS_PATTERN_VALIDATOR,
      ]),
      fm_company_details_postcode: new FormControl(null, [
        optionalMaxLengthValidator(8),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
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
      [...new Array(formData['fm_company_details_aliases'].length).keys()],
      'fm_company_details_aliases',
    );
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('fm_company_details_add_alias', 'fm_company_details_aliases');
  }

  /**
   * Removes the selected company alias and renumbers the remaining controls.
   * Preserves existing FormControl instances and their values.
   */

  public removeAndRenumberAlias(index: number): void {
    const formArrayName = 'fm_company_details_aliases';

    this.aliasControls = removeAliasAndRestoreState({
      aliases: this.form.get(formArrayName) as FormArray,
      aliasFields: this.aliasFields,
      index,
      formArrayName,
      errorSummaryCount: this.formErrorSummaryMessage.length,
      errorMessages: this.formControlErrorMessages,
      removeAlias: (aliasIndex) => this.removeAlias(aliasIndex, formArrayName),
      createAliasControls: (rowIndex) => this.createAliasControls(this.aliasFields, rowIndex),
      refreshErrors: () => this.handleErrorMessages(),
      elementRef: this.elementRef,
      injector: this.injector,
    });
  }

  public get aliasFormGroups(): AbstractControl[] {
    return (this.form.get('fm_company_details_aliases') as FormArray).controls;
  }

  public override ngOnInit(): void {
    this.initialCompanyDetailsSetup();
    super.ngOnInit();
  }
}
