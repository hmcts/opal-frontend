import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IAbstractFormBaseFieldError } from './interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from './interfaces/abstract-form-base-field-errors.interface';
import { IAbstractFormBaseFormError } from './interfaces/abstract-form-base-form-error.interface';
import { IAbstractFormBaseFormErrorSummaryMessage } from './interfaces/abstract-form-base-form-error-summary-message.interface';
import { IAbstractFormBaseHighPriorityFormError } from './interfaces/abstract-form-base-high-priority-form-error.interface';
import { IAbstractFormBaseForm } from './interfaces/abstract-form-base-form.interface';
import { IAbstractFormControlErrorMessage } from '../interfaces/abstract-form-control-error-message.interface';
import { IAbstractFormArrayControlValidation } from '../interfaces/abstract-form-array-control-validation.interface';

@Component({
  template: '',
})
export abstract class AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Output() protected unsavedChanges = new EventEmitter<boolean>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() protected formSubmit = new EventEmitter<IAbstractFormBaseForm<any>>();

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public form!: FormGroup;
  public formControlErrorMessages!: IAbstractFormControlErrorMessage;
  public formErrorSummaryMessage!: IAbstractFormBaseFormErrorSummaryMessage[];
  protected fieldErrors!: IAbstractFormBaseFieldErrors;
  protected formSubmitted = false;
  protected readonly ngUnsubscribe = new Subject<void>();
  public formErrors!: IAbstractFormBaseFormError[];

  constructor() {}

  /**
   * Scrolls to the label of the component and focuses on the field id
   *
   * @param fieldId - Field id of the component
   */
  private scroll(fieldId: string): void {
    let labelTarget;
    let fieldElement;

    const autocompleteLabel = document.querySelector(`label[for=${fieldId}-autocomplete]`);
    const regularLabel = document.querySelector(`label[for=${fieldId}]`);
    const fieldsetLegend = document.querySelector(`#${fieldId} .govuk-fieldset__legend`);

    if (autocompleteLabel) {
      labelTarget = autocompleteLabel;
      fieldElement = document.getElementById(`${fieldId}-autocomplete`);
    } else {
      labelTarget = regularLabel || fieldsetLegend;
      fieldElement = document.getElementById(fieldId);
    }

    if (fieldElement) {
      if (labelTarget) {
        labelTarget.scrollIntoView({ behavior: 'smooth' });
      }
      fieldElement.focus();
    }
  }

  /**
   * Returns the highest priority form error from the given error keys and field errors.
   * @param errorKeys - An array of error keys.
   * @param fieldErrors - An object containing field errors.
   * @returns The highest priority form error or null if no errors are found.
   */
  private getHighestPriorityError(
    errorKeys: string[] = [],
    fieldErrors: IAbstractFormBaseFieldError = {},
  ): IAbstractFormBaseHighPriorityFormError | null {
    if (errorKeys.length && Object.keys(fieldErrors).length) {
      const errors = errorKeys.map((errorType: string) => {
        return {
          ...fieldErrors[errorType],
          type: errorType,
        };
      });

      const sortedErrors = [...errors].sort((a, b) => a.priority - b.priority);

      return sortedErrors[0];
    }
    return null;
  }

  /**
   * Retrieves the details of the highest priority form error for a given control path.
   * @param controlPath - The path to the control in the form.
   * @returns The details of the highest priority form error, or null if there are no errors.
   */
  private getFieldErrorDetails(controlPath: (string | number)[]): IAbstractFormBaseHighPriorityFormError | null {
    // Get the control
    const control = this.form.get(controlPath);

    // If we have errors
    const controlErrors = control?.errors;

    if (controlErrors) {
      /// Get all the error keys
      const controlKey = controlPath[controlPath.length - 1];
      const errorKeys = Object.keys(controlErrors) || [];
      const fieldErrors = this.fieldErrors[controlKey] || {};

      if (errorKeys.length && Object.keys(fieldErrors).length) {
        return this.getHighestPriorityError(errorKeys, fieldErrors);
      }
    }
    return null;
  }

  /**
   * Retrieves all form errors from the provided form and its nested form groups.
   *
   * @param form - The form group to retrieve errors from.
   * @param controlPath - An optional array representing the path to the current control within the form group.
   * @returns An array of form errors, each containing the field ID, error message, priority, and type.
   */
  private getFormErrors(form: FormGroup, controlPath: (string | number)[] = []): IAbstractFormBaseFormError[] {
    // recursively get all errors from all controls in the form including nested form group controls
    const formControls = form.controls;

    const errorSummary = Object.keys(formControls)
      .filter((controlName) => formControls[controlName].invalid)
      .map((controlName) => {
        const control = formControls[controlName];

        if (control instanceof FormGroup) {
          return this.getFormErrors(control, [...controlPath, controlName]);
        }

        if (control instanceof FormArray) {
          return control.controls
            .map((controlItem, index) => {
              // We only support FormGroups in FormArrays
              if (controlItem instanceof FormGroup) {
                return this.getFormErrors(controlItem, [...controlPath, controlName, index]);
              }

              return [];
            })
            .flat();
        }

        const getFieldErrorDetails = this.getFieldErrorDetails([...controlPath, controlName]);

        // Return the error summary entry
        // If we don't have the error details, return a null message
        return {
          fieldId: controlName,
          message: getFieldErrorDetails?.message ?? null,
          priority: getFieldErrorDetails?.priority ?? 999999999,
          type: getFieldErrorDetails?.type ?? null,
        };
      })
      .flat();

    // Remove any null errors
    return errorSummary.filter((item) => item?.message !== null);
  }

  /**
   * Sets the error messages for the form controls and error summary based on the provided form errors.
   * @param formErrors - An array of form errors containing field IDs and error messages.
   */
  private setErrorMessages(formErrors: IAbstractFormBaseFormError[]) {
    // Reset the form error messages
    this.formControlErrorMessages = {};
    this.formErrorSummaryMessage = [];

    // Set the form error messages based on the error summary entries
    formErrors.forEach((entry) => {
      this.formControlErrorMessages[entry.fieldId] = entry.message;
      this.formErrorSummaryMessage.push({ fieldId: entry.fieldId, message: entry.message });
    });
  }

  /**
   * Gets the indexes of the date fields to remove based on the form error summary message.
   * @returns An array of indexes representing the date fields to remove.
   */
  private getDateFieldsToRemoveIndexes(): number[] {
    const indexesToRemove: number[] = [];
    // The order of the field ids is important
    // this is the order in which we want to remove them
    const foundIndexes = this.getFormErrorSummaryIndex(
      ['dayOfMonth', 'monthOfYear', 'year'],
      this.formErrorSummaryMessage,
    );

    // Determine which indexes to remove based on the found fields
    switch (foundIndexes.length) {
      case 3:
        // All three date fields are present
        indexesToRemove.push(foundIndexes[1], foundIndexes[2]);
        break;
      case 2:
        // Two date fields are present
        indexesToRemove.push(foundIndexes[1]);
        break;
    }

    return indexesToRemove;
  }

  /**
   * Returns an array of indices corresponding to the positions of the given field IDs in the form error summary message array.
   *
   * @param fieldIds - An array of field IDs to search for in the form error summary message array.
   * @param formErrorSummaryMessage - An array of form error summary messages.
   * @returns An array of indices corresponding to the positions of the field IDs in the form error summary message array.
   */
  private getFormErrorSummaryIndex(
    fieldIds: string[],
    formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[],
  ): number[] {
    return fieldIds.reduce((acc: number[], field) => {
      const index = formErrorSummaryMessage.findIndex((error) => error.fieldId === field);
      return index !== -1 ? [...acc, index] : acc;
    }, []);
  }

  /**
   * Removes error summary messages from the given array based on the specified indexes.
   *
   * @param formErrorSummaryMessage - The array of error summary messages.
   * @param indexes - The indexes of the error summary messages to be removed.
   * @returns The updated array of error summary messages.
   */
  private removeErrorSummaryMessages(
    formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[],
    indexes: number[],
  ): IAbstractFormBaseFormErrorSummaryMessage[] {
    return formErrorSummaryMessage.filter((_, index) => !indexes.includes(index));
  }

  /**
   * Splits the form errors into two arrays based on the provided field IDs.
   * Errors with field IDs included in the fieldIds array will be moved to the removedFormErrors array,
   * while the remaining errors will be moved to the cleanFormErrors array.
   *
   * @param fieldIds - An array of field IDs to filter the form errors.
   * @param formErrors - An array of form errors to be split.
   * @returns An array containing two arrays: cleanFormErrors and removedFormErrors.
   */
  private splitFormErrors(
    fieldIds: string[],
    formErrors: IAbstractFormBaseFormError[],
  ): IAbstractFormBaseFormError[][] {
    const cleanFormErrors: IAbstractFormBaseFormError[] = [];
    const removedFormErrors: IAbstractFormBaseFormError[] = [];

    formErrors.forEach((error) => {
      if (fieldIds.includes(error.fieldId)) {
        removedFormErrors.push(error);
      } else {
        cleanFormErrors.push(error);
      }
    });

    return [cleanFormErrors, removedFormErrors];
  }

  /**
   * Manipulates the error message for specific fields in the formErrors array.
   * @param fields - An array of field IDs to target for error message manipulation.
   * @param messageOverride - The new error message to be used for the targeted fields.
   * @param errorType - The type of error to match for the targeted fields.
   * @param formErrors - An array of IFormError objects representing the form errors.
   * @returns An array of IFormError objects with the manipulated error messages.
   */
  private manipulateFormErrorMessage(
    fields: string[],
    messageOverride: string,
    errorType: string,
    formErrors: IAbstractFormBaseFormError[],
  ): IAbstractFormBaseFormError[] {
    const manipulatedFields: IAbstractFormBaseFormError[] = [];
    formErrors.forEach((field) => {
      if (fields.includes(field.fieldId)) {
        if (field.type === errorType) {
          manipulatedFields.push({ ...field, message: messageOverride });
        } else {
          manipulatedFields.push(field);
        }
      } else {
        manipulatedFields.push(field);
      }
    });

    return manipulatedFields;
  }

  /**
   * Retrieves the form errors with the highest priority.
   *
   * @param formErrors - An array of form errors.
   * @returns An array of form errors with the highest priority.
   */
  private getHighPriorityFormErrors(formErrors: IAbstractFormBaseFormError[]): IAbstractFormBaseFormError[] {
    // Get the lowest priority (1 is the highest priority, 3 is the lowest priority)
    const lowestPriority = Math.min(...formErrors.map((item) => item.priority));
    return formErrors.filter((item) => item.priority === lowestPriority);
  }

  /**
   * Setup listener for the form value changes and to emit hasUnsavedChanges
   */
  private setupListener(): void {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.unsavedChanges.emit(this.hasUnsavedChanges());
    });
  }

  /**
   * Adds controls to a form group.
   *
   * @param formGroup - The form group to add controls to.
   * @param controls - An array of form array control validations.
   * @param index - The index of the form array control.
   */
  protected addControlsToFormGroup(
    formGroup: FormGroup,
    controls: IAbstractFormArrayControlValidation[],
    index: number,
  ): void {
    controls.forEach(({ controlName, validators }) => {
      formGroup.addControl(`${controlName}_${index}`, new FormControl(null, validators));
    });
  }

  /**
   * Creates a form control with the specified validators and initial value.
   *
   * @param validators - An array of validator functions.
   * @param initialValue - The initial value for the form control. Defaults to null.
   * @returns The created form control.
   */
  protected createFormControl(validators: ValidatorFn[], initialValue: string | null = null): FormControl {
    return new FormControl(initialValue, { validators: [...validators] });
  }

  /**
   * Handles the error messages and populates the relevant variables
   */
  protected handleErrorMessages(): void {
    this.formErrors = this.getFormErrors(this.form);

    this.setErrorMessages(this.formErrors);

    this.formErrorSummaryMessage = this.removeErrorSummaryMessages(
      this.formErrorSummaryMessage,
      this.getDateFieldsToRemoveIndexes(),
    );
  }

  /**
   * Checks whether the form has been touched and submitted
   *
   * @returns boolean
   */
  protected hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.formSubmitted;
  }

  /**
   * Sets the value of a specified form control and marks it as touched.
   *
   * @param {string} value - The value to set for the form control.
   * @param {string} control - The name of the form control to update.
   */
  protected setInputValue(value: string, control: string) {
    this.form.controls[control].patchValue(value);
    this.form.controls[control].markAsTouched();
  }

  /**
   * Handles the form errors for the date input fields.
   * @param formErrors - An array of form errors.
   * @returns An array of form errors with the manipulated error messages.
   */
  protected handleDateInputFormErrors() {
    const dateInputFields = ['dayOfMonth', 'monthOfYear', 'year'];
    const splitFormErrors = this.splitFormErrors(dateInputFields, this.formErrors);
    const highPriorityDateControlErrors = this.getHighPriorityFormErrors(splitFormErrors[1]);
    let manipulatedFormErrors: IAbstractFormBaseFormError[] = highPriorityDateControlErrors;

    // If we have more than one error then we want to manipulate the error message
    if (highPriorityDateControlErrors.length > 1) {
      manipulatedFormErrors = this.manipulateFormErrorMessage(
        dateInputFields,
        'Please enter a DOB',
        'required',
        manipulatedFormErrors,
      );
    }

    return [...splitFormErrors[0], ...manipulatedFormErrors];
  }

  /**
   * Sets the initial error messages for the form controls.
   *
   * @param form - The FormGroup instance.
   */
  protected setInitialErrorMessages(): void {
    const formControls = this.form.controls;
    const initialFormControlErrorMessages: IAbstractFormControlErrorMessage = {};

    Object.keys(formControls).forEach((controlName) => {
      initialFormControlErrorMessages[controlName] = null;
    });

    this.formControlErrorMessages = initialFormControlErrorMessages;
    this.formErrorSummaryMessage = [];
  }

  /**
   * Repopulates the search form with the data from the account enquiry search.
   * @param state - The state object containing the search form data.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected rePopulateForm(state: any): void {
    this.form.patchValue(state);
  }

  /**
   * Adds a new form control to the form group.
   *
   * @param controlName - The name of the control to add.
   * @param validators - An array of validators to apply to the control.
   */
  protected createControl(controlName: string, validators: ValidatorFn[]): void {
    this.form.addControl(controlName, new FormControl(null, validators));
  }

  /**
   * Updates the validators of an existing form control.
   *
   * @param controlName - The name of the control to update.
   * @param validators - An array of validators to apply to the control.
   */
  protected updateControl(controlName: string, validators: ValidatorFn[]): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValidators(validators);
      control.updateValueAndValidity();
    } else {
      this.createControl(controlName, validators);
    }
  }

  /**
   * Removes a control from the form.
   *
   * @param controlName - The name of the control to remove.
   */
  protected removeControl(controlName: string): void {
    if (this.formControlErrorMessages [controlName]) {
      this.removeControlErrors(controlName);
    }
    this.form.removeControl(controlName);
  }

  /**
   * Removes the error message associated with the specified control name from the formControlErrorMessages object.
   *
   * @param controlName - The name of the control for which to remove the error message.
   */
  protected removeControlErrors(controlName: string): void {
    delete this.formControlErrorMessages[controlName];
  }

  /**
   * Clears the search form.
   */
  public handleClearForm(): void {
    this.form.reset();
  }

  /**
   * Handles the scroll of the component error from the summary
   *
   * @param fieldId - Field id of the component
   */
  public scrollTo(fieldId: string): void {
    this['scroll'](fieldId);
  }

  /**
   * Handles route with the supplied route
   *
   * @param route string of route
   * @param nonRelative boolean indicating if route is relative to the parent
   */
  public handleRoute(route: string, nonRelative: boolean = false, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.unsavedChanges.emit(this.hasUnsavedChanges());
    if (nonRelative) {
      this.router.navigate([route]);
    } else {
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
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

  public ngOnInit(): void {
    if (this.form) {
      this.setupListener();
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
