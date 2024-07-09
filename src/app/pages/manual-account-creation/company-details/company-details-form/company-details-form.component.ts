import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
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
} from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import {
  IFieldErrors,
  IManualAccountCreationCompanyAlias,
  IManualAccountCreationCompanyDetailsForm,
} from '@interfaces';
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
  ],
  templateUrl: './company-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationCompanyDetailsForm>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  override fieldErrors: IFieldErrors = {
    ...MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_FIELD_ERROR,
    ...ADDRESS_LINE_ONE_FIELD_ERRORS,
    ...ADDRESS_LINE_TWO_FIELD_ERRORS,
    ...ADDRESS_LINE_THREE_FIELD_ERRORS,
    ...POST_CODE_FIELD_ERRORS,
  };

  public override aliasControls: IManualAccountCreationCompanyAlias[] = [];

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
   * Builds the alias inputs based on the company details of the manual account creation.
   * If the addAlias flag is true, it adds the alias inputs based on the number of aliases in the company details.
   * Otherwise, it adds a single alias input.
   * It also handles the checkbox change event and repopulates the form if necessary.
   */
  private buildAliasInputs(): void {
    const companyDetails = this.macStateService.manualAccountCreation.companyDetails;
    if (companyDetails.addAlias) {
      companyDetails.aliases.map((_, index) => {
        this.addAliases(index);
      });
      this.addAliasCheckboxChange();
      this.rePopulateForm(companyDetails);
    } else {
      this.addAliases(0);
    }
  }

  /**
   * Updates the validators for the controls in the aliasFormGroup based on the value of 'addAlias' control in the form.
   * If 'addAlias' is true, sets the alias validators for each control.
   * If 'addAlias' is false, clears the alias validators for each control.
   *
   * @param aliasFormGroup - The FormGroup containing the controls to update validators for.
   */
  private updateAliasFormGroupValidators(aliasFormGroup: FormGroup): void {
    Object.keys(aliasFormGroup.controls).forEach((key) => {
      if (this.form.controls['addAlias'].value) {
        this.setAliasValidators(aliasFormGroup, key);
      } else {
        this.clearAliasValidators(aliasFormGroup, key);
      }
    });
  }

  /**
   * Sets the validators for the specified alias form control.
   *
   * @param aliasFormGroup - The FormGroup containing the alias form control.
   * @param key - The key of the alias form control.
   */
  private setAliasValidators(aliasFormGroup: FormGroup, key: string): void {
    aliasFormGroup.controls[key].setValidators([
      Validators.required,
      Validators.maxLength(30),
      alphabeticalTextValidator(),
    ]);
    aliasFormGroup.controls[key].updateValueAndValidity();
  }

  /**
   * Creates the form controls for the company details form.
   *
   * @param index - The index of the form control.
   * @returns An object containing the form controls for the company name.
   */
  private createControls(index: number) {
    return {
      companyName: {
        inputId: `companyName_${index}`,
        inputName: `companyName_${index}`,
        controlName: `companyName_${index}`,
      },
    };
  }

  /**
   * Adds controls to the form group based on the provided controls object.
   * If the 'addAlias' control is true, it adds controls for company name with required validators.
   * Otherwise, it adds controls for company name without any validators.
   *
   * @param formGroup - The form group to which the controls will be added.
   * @param controls - The object containing the control names for company name.
   */
  private addControlsToFormGroup(formGroup: FormGroup, controls: IManualAccountCreationCompanyAlias): void {
    if (this.form.controls['addAlias'].value) {
      formGroup.addControl(
        controls.companyName.controlName,
        new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
      );
    } else {
      formGroup.addControl(controls.companyName.controlName, new FormControl(null));
    }
  }

  /**
   * Removes the field errors for a specific index in the aliasControls array.
   * @param index - The index of the alias control.
   */
  private removeFieldErrors(index: number): void {
    const alias = this.aliasControls[index];
    delete this.fieldErrors[alias?.companyName?.controlName];
  }

  /**
   * Handles the change event of the add alias checkbox.
   * Updates the validators of each alias form group in the aliases form array.
   */
  public addAliasCheckboxChange(): void {
    const aliasesFormArray = this.form.get('aliases') as FormArray;
    const aliasFormGroups = aliasesFormArray.controls as FormGroup[];

    aliasFormGroups.forEach((aliasFormGroup: FormGroup) => {
      this.updateAliasFormGroupValidators(aliasFormGroup);
    });
  }

  /**
   * Adds aliases to the form.
   *
   * @param index - The index of the aliases to add.
   */
  public addAliases(index: number): void {
    const aliases = this.form.get('aliases') as FormArray;
    const aliasesFormGroup = new FormGroup({});

    const controls = this.createControls(index);
    this.aliasControls.push(controls);

    this.addControlsToFormGroup(aliasesFormGroup, controls);

    aliases.push(aliasesFormGroup);
  }

  /**
   * Removes an alias from the form array at the specified index.
   * Also removes any field errors and alias controls associated with the removed alias.
   *
   * @param index - The index of the alias to be removed.
   */
  public removeAlias(index: number): void {
    const aliases = this.form.get('aliases') as FormArray;
    aliases.removeAt(index);

    this.removeFieldErrors(index);
    this.removeAliasControls(index);
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

  public override ngOnInit(): void {
    this.setupCompanyDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.companyDetails);
    this.buildAliasInputs();
    super.ngOnInit();
  }
}
