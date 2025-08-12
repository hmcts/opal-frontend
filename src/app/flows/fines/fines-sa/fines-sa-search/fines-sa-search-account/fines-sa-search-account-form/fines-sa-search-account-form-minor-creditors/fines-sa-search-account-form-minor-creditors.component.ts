import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { takeUntil, distinctUntilChanged } from 'rxjs';
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
   * Resets the provided FormGroup to its initial state and updates its validation status.
   *
   * This method performs the following actions on the given FormGroup:
   * - Resets the form group without emitting value change events.
   * - Marks the form group as pristine (no changes made).
   * - Marks the form group as untouched (no controls have been visited).
   * - Updates the value and validity of the form group without emitting events.
   *
   * @param group - The FormGroup instance to reset and validate.
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
  private handleLastNameConditionalValidation(): void {
    const type = this.minorCreditorType?.value;

    if (type !== 'individual') {
      return;
    }

    // Add null checks for missing form groups
    const individualGroup = this.form.get('fsa_search_account_minor_creditors_individual') as FormGroup;
    if (!individualGroup) {
      return; // Exit gracefully if group doesn't exist
    }

    const firstNamesControl = individualGroup.get('fsa_search_account_minor_creditors_first_names');
    const lastNameControl = individualGroup.get('fsa_search_account_minor_creditors_last_name');

    // Check if controls exist
    if (!firstNamesControl || !lastNameControl) {
      return; // Exit gracefully if controls don't exist
    }

    const firstNamesValue = firstNamesControl.value;
    const lastNameValue = lastNameControl.value;

    const hasFirstNames = typeof firstNamesValue === 'string' ? firstNamesValue.trim() : firstNamesValue;
    const hasLastName = typeof lastNameValue === 'string' ? lastNameValue.trim() : lastNameValue;

    if (hasFirstNames && !hasLastName) {
      lastNameControl.addValidators(Validators.required);
    } else {
      lastNameControl.removeValidators(Validators.required);
    }

    lastNameControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  /**
   * Sets up conditional validation for last name based on first names for individual minor creditors.
   */
  private setupConditionalLastNameValidation(): void {
    const firstNamesControl = this.individualGroup.get('fsa_search_account_minor_creditors_first_names') as FormControl;
    if (!firstNamesControl) return;

    firstNamesControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.handleLastNameConditionalValidation());
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
          this.resetAndValidateFormGroup(this.companyGroup);
        } else if (type === 'company') {
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
    this.setupConditionalLastNameValidation();
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
