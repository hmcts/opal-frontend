import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CustomAddressBlockComponent,
  FormBaseComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components';
import {
  MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FIELD_ERROR,
  ADDRESS_LINE_ONE_FIELD_ERRORS,
  ADDRESS_LINE_TWO_FIELD_ERRORS,
  ADDRESS_LINE_THREE_FIELD_ERRORS,
  POST_CODE_FIELD_ERRORS,
  CUSTOM_ADDRESS_FIELD_IDS,
  MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS,
  MANUAL_ACCOUNT_CREATION_NESTED_ROUTES,
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import {
  IFieldErrors,
  IFormArrayControl,
  IFormArrayControlValidation,
  IManualAccountCreationCompanyDetailsForm,
} from '@interfaces';
import { Subscription } from 'rxjs';
import { alphabeticalTextValidator, specialCharactersValidator, optionalMaxLengthValidator } from 'src/app/validators';

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
export class CompanyDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationCompanyDetailsForm>();

  public readonly customAddressFieldIds = CUSTOM_ADDRESS_FIELD_IDS;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly manualAccountCreationNestedRoutes = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES;

  public aliasControls: { [key: string]: IFormArrayControl }[] = [];
  public aliasControlsValidation: IFormArrayControlValidation[] = [];
  public aliasFields: string[] = [];

  override fieldErrors: IFieldErrors = {
    ...MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FIELD_ERROR,
    ...ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...POST_CODE_FIELD_ERRORS,
  };

  private addAliasListener!: Subscription | undefined;

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
      const continueFlow = event.submitter ? event.submitter.className.includes('continue-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, continueFlow: continueFlow });
    }
  }

  /**
   * Sets up the listener for the alias checkbox.
   * This method ensures any existing subscription is cleared to avoid memory leaks.
   * It subscribes to the value changes of the 'addAlias' control in the form,
   * and updates the alias controls based on the value of the checkbox.
   */
  private setUpAliasCheckboxListener(): void {
    // Ensure any existing subscription is cleared to avoid memory leaks
    this.addAliasListener?.unsubscribe();

    const addAliasControl = this.form.get('addAlias');
    if (!addAliasControl) {
      return;
    }

    this.addAliasListener = addAliasControl.valueChanges.subscribe((shouldAddAlias) => {
      this.aliasControls = shouldAddAlias
        ? this.buildFormArrayControls([0], 'aliases', this.aliasFields, this.aliasControlsValidation)
        : this.removeAllFormArrayControls(this.aliasControls, 'aliases', this.aliasFields);
    });
  }

  /**
   * Adds an alias to the aliasControls form array.
   *
   * @param index - The index at which to add the alias.
   */
  public addAlias(index: number): void {
    this.aliasControls.push(
      this.addFormArrayControls(index, 'aliases', this.aliasFields, this.aliasControlsValidation),
    );
  }

  /**
   * Removes an alias from the aliasControls array.
   *
   * @param index - The index of the alias to remove.
   */
  public removeAlias(index: number): void {
    this.aliasControls = this.removeFormArrayControls(index, 'aliases', this.aliasControls, this.aliasFields);
  }

  /**
   * Sets up the aliases for the personal details form.
   * Re-populates the alias controls if there are any aliases.
   */
  private setupAliasFormControls(): void {
    const aliases = this.macStateService.manualAccountCreation.companyDetails.aliases;
    // Re-populate the alias controls if there are any aliases
    if (aliases.length) {
      this.aliasControls = this.buildFormArrayControls(
        [...Array(aliases.length).keys()],
        'aliases',
        this.aliasFields,
        this.aliasControlsValidation,
      );
    }
  }

  /**
   * Performs the initial setup for the personal details form component.
   * This method sets up the personal details form, alias configuration, aliases,
   * initial error messages, nested route, form population, and alias checkbox listener.
   */
  private initialSetup(): void {
    this.setupCompanyDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.companyDetails);
    this.setUpAliasCheckboxListener();
  }

  public override ngOnInit(): void {
    this.initialSetup();
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.addAliasListener?.unsubscribe();
    super.ngOnDestroy();
  }
}
