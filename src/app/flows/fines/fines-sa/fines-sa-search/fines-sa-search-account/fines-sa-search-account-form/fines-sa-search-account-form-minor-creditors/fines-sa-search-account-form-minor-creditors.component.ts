import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { takeUntil, distinctUntilChanged, merge } from 'rxjs';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { FINES_MINOR_CREDITOR_TYPES } from 'src/app/flows/fines/constants/fines-minor-creditor-types.constant';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { requiredMinorCreditorDataValidator } from './validators/fines-sa-search-account-form-minor-creditors.validator';

@Component({
  selector: 'app-fines-sa-search-account-form-minor-creditors',
  imports: [
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukTextInputComponent,
  ],
  templateUrl: './fines-sa-search-account-form-minor-creditors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchAccountFormMinorCreditorsComponent extends AbstractFormBaseComponent {
  private readonly finesMinorCreditorTypes = FINES_MINOR_CREDITOR_TYPES;

  @Input({ required: true }) public override form!: FormGroup;
  @Input({ required: true }) public override formControlErrorMessages!: IAbstractFormControlErrorMessage;
  public readonly minorCreditorTypes: IGovUkRadioOptions[] = Object.entries(this.finesMinorCreditorTypes).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

  private get minorCreditorType(): FormControl {
    return this.form.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;
  }

  /**
   * Gets the `FormGroup` instance associated with the 'fsa_search_account_minor_creditors_individual' control
   * from the main form. This group contains the form controls and validation logic for individual minor creditors.
   *
   * @returns {FormGroup} The form group for individual minor creditors.
   */
  public get individualGroup(): FormGroup {
    return this.form.get('fsa_search_account_minor_creditors_individual') as FormGroup;
  }

  /**
   * Gets the FormGroup instance associated with the 'fsa_search_account_minor_creditors_company' control
   * from the parent form. This FormGroup contains the form controls and validation state
   * for the minor creditors company section of the search account form.
   *
   * @returns {FormGroup} The FormGroup for the minor creditors company.
   */
  public get companyGroup(): FormGroup {
    return this.form.get('fsa_search_account_minor_creditors_company') as FormGroup;
  }

  /**
   * Removes dynamically added required validators from individual tab controls.
   * This ensures that conditional validation rules don't persist when switching to company tab.
   */
  private clearIndividualDynamicValidators(): void {
    const firstNamesControl = this.individualGroup.get('fsa_search_account_minor_creditors_first_names');
    const lastNameControl = this.individualGroup.get('fsa_search_account_minor_creditors_last_name');
    this.toggleRequired(firstNamesControl, false);
    this.toggleRequired(lastNameControl, false);
  }

  /**
   * Resets and updates the validity of the provided form controls.
   * This method clears the value and validation state of each control without emitting events.
   * @param controls An array of AbstractControl or null to reset and validate.
   */
  private resetAndValidateControls(controls: (AbstractControl | null)[]): void {
    controls.forEach((control) => {
      control?.setErrors(null);
      control?.reset(null, { emitEvent: false });
      control?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }

  /**
   * Adds or removes the `required` validator on a control and updates its validity without emitting events.
   */
  private toggleRequired(control: AbstractControl | null, shouldBeRequired: boolean): void {
    if (!control) return;
    if (shouldBeRequired) {
      control.addValidators(Validators.required);
    } else {
      control.removeValidators(Validators.required);
    }
    control.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Removes dynamically added required validators from company tab controls.
   * This ensures that conditional validation rules don't persist when switching to individual tab.
   */
  private clearCompanyDynamicValidators(): void {
    const companyNameControl = this.companyGroup.get('fsa_search_account_minor_creditors_company_name');
    this.toggleRequired(companyNameControl, false);
  }

  /**
   * Sets up a subscription to listen for changes on the minor creditor type control.
   * When the minor creditor type changes, it triggers form control resets and validations.
   */
  private resetAndValidateFormGroup(group: FormGroup): void {
    group.reset(undefined, { emitEvent: false });
    group.markAsPristine();
    group.markAsUntouched();
    group.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  /**
   * Applies conditional validation to the last name field for individual minor creditors.
   * If the minor creditor type is not 'individual', does nothing.
   * If first_names is populated and last_name is not, last_name becomes required.
   */
  private handleIndividualConditionalValidation(): void {
    const type = this.minorCreditorType.value;
    if (type !== 'individual') return;

    const individualGroup = this.individualGroup as FormGroup;
    if (!individualGroup) return;

    const firstNamesControl = individualGroup.get('fsa_search_account_minor_creditors_first_names');
    const firstNamesExactMatchControl = individualGroup.get(
      'fsa_search_account_minor_creditors_first_names_exact_match',
    );
    const lastNameControl = individualGroup.get('fsa_search_account_minor_creditors_last_name');
    const lastNameExactMatchControl = individualGroup.get('fsa_search_account_minor_creditors_last_name_exact_match');

    if (!firstNamesControl || !lastNameControl) return;

    const firstNamesHasValue = !!(firstNamesControl.value as string)?.trim?.();
    const lastNameHasValue = !!(lastNameControl.value as string)?.trim?.();
    const lastNameExactMatchHasValue = !!lastNameExactMatchControl?.value;
    const firstNamesExactMatchHasValue = !!firstNamesExactMatchControl?.value;

    // last name required if first names OR last name exact match is set but last name is empty
    const shouldRequireLastName = (firstNamesHasValue || lastNameExactMatchHasValue) && !lastNameHasValue;
    this.toggleRequired(lastNameControl, shouldRequireLastName);

    // first names required if first names exact match is set but first names is empty
    const shouldRequireFirstName = firstNamesExactMatchHasValue && !firstNamesHasValue;
    this.toggleRequired(firstNamesControl, shouldRequireFirstName);
  }

  /**
   * Sets up conditional validation listeners for first names, last name, and their exact match flags.
   */
  private setupIndividualConditionalValidation(): void {
    const firstNamesControl = this.individualGroup.get('fsa_search_account_minor_creditors_first_names') as FormControl;
    const firstNamesExactMatchControl = this.individualGroup.get(
      'fsa_search_account_minor_creditors_first_names_exact_match',
    ) as FormControl;
    const lastNameControl = this.individualGroup.get('fsa_search_account_minor_creditors_last_name') as FormControl;
    const lastNameExactMatchControl = this.individualGroup.get(
      'fsa_search_account_minor_creditors_last_name_exact_match',
    ) as FormControl;

    const areMissingIndividualControls =
      !firstNamesControl || !lastNameControl || !firstNamesExactMatchControl || !lastNameExactMatchControl;
    if (areMissingIndividualControls) return;

    merge(
      firstNamesControl.valueChanges,
      lastNameControl.valueChanges,
      firstNamesExactMatchControl.valueChanges,
      lastNameExactMatchControl.valueChanges,
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleIndividualConditionalValidation());
  }

  /**
   * Conditionally applies the "required" validation to the company name field based on if exact match is selected.
   * @private
   */
  private handleCompanyConditionalValidation(): void {
    const minorCreditorType = this.minorCreditorType.value;
    if (minorCreditorType !== 'company') return;

    const companyNameControl = this.companyGroup.get('fsa_search_account_minor_creditors_company_name') as FormControl;
    const companyNameExactMatchControl = this.companyGroup.get(
      'fsa_search_account_minor_creditors_company_name_exact_match',
    ) as FormControl;
    const areMissingCompanyControls = !companyNameControl || !companyNameExactMatchControl;
    if (areMissingCompanyControls) return;

    const companyNameHasValue = !!(companyNameControl.value as string)?.trim?.();
    const companyNameExactMatchHasValue = !!companyNameExactMatchControl.value;

    const shouldRequireCompanyName = companyNameExactMatchHasValue && !companyNameHasValue;
    this.toggleRequired(companyNameControl, shouldRequireCompanyName);
  }

  /**
   * Sets up conditional validation for the company name and its exact match flag.
   */
  private setupCompanyConditionalValidation(): void {
    const companyNameControl = this.companyGroup.get('fsa_search_account_minor_creditors_company_name') as FormControl;
    const companyNameExactMatchControl = this.companyGroup.get(
      'fsa_search_account_minor_creditors_company_name_exact_match',
    ) as FormControl;

    const areMissingCompanyControls = !companyNameControl || !companyNameExactMatchControl;
    if (areMissingCompanyControls) return;

    merge(companyNameControl.valueChanges, companyNameExactMatchControl.valueChanges)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleCompanyConditionalValidation());
  }

  /**
   * Sets up listeners and validators for the minor creditor type selection in the form.
   *
   * - Applies a custom validator to the 'minor_creditor_type' control, ensuring required data is present
   *   based on the selected type (individual or company).
   * - Subscribes to changes in the 'minor_creditor_type' control to reset and update the corresponding
   *   form group (individual or company) when the type changes.
   * - Subscribes to value changes in both the individual and company form groups to trigger form-level
   *   validation updates.
   *
   * This method should be called during component initialization to ensure the form behaves correctly
   * when users interact with the minor creditor type selection.
   *
   * @private
   */
  private setupMinorCreditorTypeListener(): void {
    const typeControl = this.minorCreditorType;
    if (typeControl) {
      typeControl.setValidators(
        requiredMinorCreditorDataValidator(() => ({
          individualGroup: this.individualGroup,
          companyGroup: this.companyGroup,
        })),
      );
      typeControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

    this.minorCreditorType?.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged())
      .subscribe((type) => {
        if (type === 'individual') {
          // Clear company tab: remove dynamic validators first, then clear field states
          this.clearCompanyDynamicValidators();
          this.resetAndValidateControls(Object.values(this.companyGroup.controls));
          this.resetAndValidateFormGroup(this.companyGroup);
        } else if (type === 'company') {
          // Clear individual tab: remove dynamic validators first, then clear field states
          this.clearIndividualDynamicValidators();
          this.resetAndValidateControls(Object.values(this.individualGroup.controls));
          this.resetAndValidateFormGroup(this.individualGroup);
        }
        // Only now update the typeControl validity
        typeControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      });

    // Only update validity if the group is valid and dirty, and avoid loops
    this.individualGroup.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged()).subscribe(() => {
      if (typeControl?.dirty) {
        typeControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });

    this.companyGroup.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged()).subscribe(() => {
      if (typeControl?.dirty) {
        typeControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });
  }

  /**
   * Initializes listeners for form control changes.
   * Sets up minor creditor type change handling and dynamic validation rules.
   */
  private initialiseFormListeners(): void {
    this.setupMinorCreditorTypeListener();
    this.setupIndividualConditionalValidation();
    this.setupCompanyConditionalValidation();
  }

  /**
   * Angular lifecycle hook that is called after the component's data-bound properties have been initialized.
   *
   * This override sets up a listener for changes to the minor creditor type and then calls the parent class's
   * `ngOnInit` method to ensure any inherited initialization logic is executed.
   */
  public override ngOnInit(): void {
    this.initialiseFormListeners();
    super.ngOnInit();
  }
}
