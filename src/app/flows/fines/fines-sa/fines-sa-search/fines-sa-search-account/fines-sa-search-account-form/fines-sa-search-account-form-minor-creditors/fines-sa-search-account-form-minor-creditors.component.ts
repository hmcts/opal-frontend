import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX } from './constants/fines-sa-search-account-form-minor-creditors-controls.constant';
import { Subject, takeUntil } from 'rxjs';
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
import { FinesSaService } from '../../../../services/fines-sa.service';

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
export class FinesSaSearchAccountFormMinorCreditorsComponent implements OnInit, OnDestroy {
  private readonly finesSaService = inject(FinesSaService);
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly prefix = FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX;
  private readonly finesMinorCreditorTypes = FINES_MINOR_CREDITOR_TYPES;

  @Input({ required: true }) public form!: FormGroup;
  @Input({ required: true }) public formControlErrorMessages!: IAbstractFormControlErrorMessage;
  public readonly minorCreditorTypes: IGovUkRadioOptions[] = Object.entries(this.finesMinorCreditorTypes).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

  /**
   * Retrieves form controls related to individual minor creditors.
   * @returns An object containing controls for last name, first names,
   * their exact match flags, address line 1, and post code.
   */
  private getIndividualMinorCreditorControls() {
    return {
      lastNameControl: this.form.get(`${this.prefix}last_name`),
      lastNameExactMatchControl: this.form.get(`${this.prefix}last_name_exact_match`),
      firstNamesControl: this.form.get(`${this.prefix}first_names`),
      firstNamesExactMatchControl: this.form.get(`${this.prefix}first_names_exact_match`),
      addressLine1Control: this.form.get(`${this.prefix}individual_address_line_1`),
      postCodeControl: this.form.get(`${this.prefix}individual_post_code`),
    };
  }

  /**
   * Retrieves form controls related to company minor creditors.
   * @returns An object containing controls for company name,
   * its exact match flag, address line 1, and post code.
   */
  private getCompanyMinorCreditorControls() {
    return {
      companyNameControl: this.form.get(`${this.prefix}company_name`),
      companyNameExactMatchControl: this.form.get(`${this.prefix}company_name_exact_match`),
      addressLine1Control: this.form.get(`${this.prefix}company_address_line_1`),
      postCodeControl: this.form.get(`${this.prefix}company_post_code`),
    };
  }

  /**
   * Retrieves the form control for the minor creditor type selector.
   * @returns The AbstractControl representing the minor creditor type.
   */
  private getMinorCreditorType() {
    return this.form.get(`${this.prefix}minor_creditor_type`);
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
      control?.updateValueAndValidity();
    });
  }

  /**
   * Removes dynamically added required validators from individual tab controls.
   * This ensures that conditional validation rules don't persist when switching to company tab.
   */
  private clearIndividualDynamicValidators(): void {
    const { firstNamesControl, lastNameControl } = this.getIndividualMinorCreditorControls();

    if (firstNamesControl) {
      firstNamesControl.removeValidators(Validators.required);
      firstNamesControl.updateValueAndValidity({ emitEvent: false });
    }

    if (lastNameControl) {
      lastNameControl.removeValidators(Validators.required);
      lastNameControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  /**
   * Removes dynamically added required validators from company tab controls.
   * This ensures that conditional validation rules don't persist when switching to individual tab.
   */
  private clearCompanyDynamicValidators(): void {
    const { companyNameControl } = this.getCompanyMinorCreditorControls();

    if (companyNameControl) {
      companyNameControl.removeValidators(Validators.required);
      companyNameControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  /**
   * Handles changes to the minor creditor type form control.
   * Completely clears inactive tab including dynamically added validators and field states.
   */
  private handleMinorCreditorTypeChange(): void {
    const minorCreditorTypeControl = this.getMinorCreditorType();
    if (!minorCreditorTypeControl) return;

    const isIndividual = minorCreditorTypeControl.value === 'individual';
    const isCompany = minorCreditorTypeControl.value === 'company';

    const individualControls = Object.values(this.getIndividualMinorCreditorControls());
    const companyControls = Object.values(this.getCompanyMinorCreditorControls());

    if (isCompany) {
      // Clear individual tab: remove dynamic validators first, then clear field states
      this.clearIndividualDynamicValidators();
      this.resetAndValidateControls(individualControls);
    }
    if (isIndividual) {
      // Clear company tab: remove dynamic validators first, then clear field states
      this.clearCompanyDynamicValidators();
      this.resetAndValidateControls(companyControls);
    }
  }

  /**
   * Sets up a subscription to listen for changes on the minor creditor type control.
   * When the minor creditor type changes, it triggers form control resets and validations.
   */
  private setupMinorCreditorTypeChangeListener(): void {
    const minorCreditorTypeControl = this.getMinorCreditorType();
    if (!minorCreditorTypeControl) return;

    minorCreditorTypeControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.handleMinorCreditorTypeChange();
    });
  }

  /**
   * Applies conditional validation to the last name field for individual minor creditors.
   * If the minor creditor type is not 'individual', does nothing.
   * If first_names is populated and last_name is not, last_name becomes required.
   */
  private handleIndividualConditionalValidation(): void {
    const minorCreditorType = this.getMinorCreditorType()?.value;
    if (minorCreditorType !== 'individual') return;

    const { firstNamesControl, lastNameControl, firstNamesExactMatchControl, lastNameExactMatchControl } =
      this.getIndividualMinorCreditorControls();
    if (!firstNamesControl || !lastNameControl) return;

    //last name validation
    const firstNamesHasValue = !!firstNamesControl?.value?.trim();
    const lastNameHasValue = !!lastNameControl?.value?.trim();
    const lastNameExactMatchHasValue = !!lastNameExactMatchControl?.value;
    const shouldRequireLastName = (firstNamesHasValue || lastNameExactMatchHasValue) && !lastNameHasValue;

    //first name validation
    const firstNamesExactMatchHasValue = !!firstNamesExactMatchControl?.value;
    const shouldRequireFirstName = firstNamesExactMatchHasValue && !firstNamesHasValue;

    //last name validation
    if (shouldRequireLastName) {
      lastNameControl.addValidators(Validators.required);
    } else {
      lastNameControl.removeValidators(Validators.required);
    }
    lastNameControl.updateValueAndValidity({ emitEvent: false });

    //first name validation
    if (shouldRequireFirstName) {
      firstNamesControl.addValidators(Validators.required);
    } else {
      firstNamesControl.removeValidators(Validators.required);
    }
    firstNamesControl.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Sets up conditional validation listeners for first names, last name, and their exact match flags.
   */
  private setupIndividualConditionalValidation(): void {
    const { firstNamesControl, lastNameControl, firstNamesExactMatchControl, lastNameExactMatchControl } =
      this.getIndividualMinorCreditorControls();
    const individualControlsHaveValue =
      !firstNamesControl || !lastNameControl || !firstNamesExactMatchControl || !lastNameExactMatchControl;

    if (individualControlsHaveValue) return;

    firstNamesControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleIndividualConditionalValidation());

    lastNameControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleIndividualConditionalValidation());

    firstNamesExactMatchControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleIndividualConditionalValidation());

    lastNameExactMatchControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleIndividualConditionalValidation());
  }

  /**
   * Conditionally applies the "required" validation to the company name field based on if exact match is selected.
   * @private
   */
  private handleCompanyConditionalValidation(): void {
    const minorCreditorType = this.getMinorCreditorType()?.value;
    if (minorCreditorType !== 'company') return;

    const { companyNameControl, companyNameExactMatchControl } = this.getCompanyMinorCreditorControls();
    const companyControlsHaveValue = !companyNameControl || !companyNameExactMatchControl;

    if (companyControlsHaveValue) return;

    const companyNameHasValue = !!companyNameControl?.value?.trim();
    const companyNameExactMatchHasValue = !!companyNameExactMatchControl?.value;

    const shouldRequireCompanyName = companyNameExactMatchHasValue && !companyNameHasValue;

    if (shouldRequireCompanyName) {
      companyNameControl.addValidators(Validators.required);
    } else {
      companyNameControl.removeValidators(Validators.required);
    }
    companyNameControl.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Sets up conditional validation for the company name and its exact match flag.
   */
  private setupCompanyConditionalValidation(): void {
    const { companyNameControl, companyNameExactMatchControl } = this.getCompanyMinorCreditorControls();
    const companyControlsHaveValue = !companyNameControl || !companyNameExactMatchControl;
    if (companyControlsHaveValue) return;

    companyNameControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleCompanyConditionalValidation());

    companyNameExactMatchControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleCompanyConditionalValidation());
  }

  /**
   * Initializes listeners for form control changes.
   * Sets up minor creditor type change handling and dynamic validation rules.
   */
  private initialiseFormListeners(): void {
    this.setupMinorCreditorTypeChangeListener();
    this.setupIndividualConditionalValidation();
    this.setupCompanyConditionalValidation();
  }

  /**
   * Applies validation logic to the minor creditor form section based on the selected creditor type.
   *
   * - For 'individual' type, checks if any of the required individual fields (last name, first names, address line 1, post code)
   *   are populated. If none are populated, sets a validation error on the type control.
   * - For 'company' type, checks if any of the required company fields (company name, address line 1, post code)
   *   are populated. If none are populated, sets a validation error on the type control.
   *
   * Marks the type control as touched after validation.
   *
   * @remarks
   * Utilizes `finesSaService.isAnyTextFieldPopulated` to determine if any relevant fields contain data.
   *
   * @returns {void}
   */
  public applyMinorCreditorValidation(): void {
    const typeControl = this.getMinorCreditorType();
    const type = typeControl?.value;
    if (!type) {
      return;
    }

    if (type === 'individual') {
      const { lastNameControl, firstNamesControl, addressLine1Control, postCodeControl } =
        this.getIndividualMinorCreditorControls();

      const isEmpty = !this.finesSaService.isAnyTextFieldPopulated([
        lastNameControl,
        firstNamesControl,
        addressLine1Control,
        postCodeControl,
      ]);

      if (isEmpty) {
        typeControl.setErrors({
          requiredIndividualMinorCreditorData: true,
        });
      } else {
        typeControl.setErrors(null);
      }

      typeControl.markAsTouched();
    }

    if (type === 'company') {
      const { companyNameControl, addressLine1Control, postCodeControl } = this.getCompanyMinorCreditorControls();

      const isEmpty = !this.finesSaService.isAnyTextFieldPopulated([
        companyNameControl,
        addressLine1Control,
        postCodeControl,
      ]);

      if (isEmpty) {
        typeControl.setErrors({
          requiredCompanyMinorCreditorData: true,
        });
      } else {
        typeControl.setErrors(null);
      }

      typeControl.markAsTouched();
    }
  }

  /**
   * Angular lifecycle hook called on component initialization.
   * Sets up necessary form listeners to manage minor creditor search fields dynamically.
   */
  public ngOnInit(): void {
    this.initialiseFormListeners();
  }

  /**
   * Angular lifecycle hook called on component destruction.
   * Cleans up subscriptions to prevent memory leaks.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
