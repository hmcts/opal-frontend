import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  IFieldError,
  IFieldErrors,
  IFormControlErrorMessage,
  IFormError,
  IFormErrorSummaryMessage,
  IHighPriorityFormError,
} from '@interfaces';

@Component({
  standalone: true,
  template: '',
})
export abstract class FormBaseComponent {
  public form!: FormGroup;
  public formControlErrorMessages!: IFormControlErrorMessage;
  public formErrorSummaryMessage!: IFormErrorSummaryMessage[];
  protected fieldErrors!: IFieldErrors;

  constructor() {}

  /**
   * Scrolls to the label of the component and focuses on the field id
   *
   * @param fieldId - Field id of the component
   */
  private scroll(fieldId: string): void {
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
      const labelTarget =
        document.querySelector(`label[for=${fieldId}]`) ||
        document.querySelector(`#${fieldId} .govuk-fieldset__legend`) ||
        document.querySelector(`label[for=${fieldId}-autocomplete]`);
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
    fieldErrors: IFieldError = {},
  ): IHighPriorityFormError | null {
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
  private getFieldErrorDetails(controlPath: string[]): IHighPriorityFormError | null {
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
        return this['getHighestPriorityError'](errorKeys, fieldErrors);
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
  private getFormErrors(form: FormGroup, controlPath: string[] = []): IFormError[] {
    // recursively get all errors from all controls in the form including nested form group controls
    const formControls = form.controls;

    const errorSummary = Object.keys(formControls)
      .filter((controlName) => formControls[controlName].invalid)
      .map((controlName) => {
        const control = formControls[controlName];

        if (control instanceof FormGroup) {
          return this.getFormErrors(control, [...controlPath, controlName]);
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
    return errorSummary.filter((item) => item.message !== null);
  }

  /**
   * Sets the initial error messages for the form controls.
   *
   * @param form - The FormGroup instance.
   */
  private setInitialErrorMessages(): void {
    const formControls = this.form.controls;
    const initialFormControlErrorMessages: IFormControlErrorMessage = {};

    Object.keys(formControls).map((controlName) => {
      initialFormControlErrorMessages[controlName] = null;
    });

    this.formControlErrorMessages = initialFormControlErrorMessages;
    this.formErrorSummaryMessage = [];
  }

  /**
   * Sets the error messages for the form controls and error summary based on the provided form errors.
   * @param formErrors - An array of form errors containing field IDs and error messages.
   */
  private setErrorMessages(formErrors: IFormError[]) {
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
  private getFormErrorSummaryIndex(fieldIds: string[], formErrorSummaryMessage: IFormErrorSummaryMessage[]): number[] {
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
    formErrorSummaryMessage: IFormErrorSummaryMessage[],
    indexes: number[],
  ): IFormErrorSummaryMessage[] {
    return formErrorSummaryMessage.filter((_, index) => !indexes.includes(index));
  }

  /**
   * Repopulates the search form with the data from the account enquiry search.
   * @param state - The state object containing the search form data.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rePopulateForm(state: any): void {
    this.form.patchValue(state);
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
  private splitFormErrors(fieldIds: string[], formErrors: IFormError[]): IFormError[][] {
    const cleanFormErrors: IFormError[] = [];
    const removedFormErrors: IFormError[] = [];

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
   * Handles the form errors for the date input fields.
   * @param formErrors - An array of form errors.
   * @returns An array of form errors with the manipulated error messages.
   */
  private handleDateInputFormErrors(formErrors: IFormError[]) {
    const dateInputFields = ['dayOfMonth', 'monthOfYear', 'year'];
    const splitFormErrors = this.splitFormErrors(dateInputFields, formErrors);
    const highPriorityDateControlErrors = this.getHighPriorityFormErrors(splitFormErrors[1]);
    let manipulatedFormErrors: IFormError[] = highPriorityDateControlErrors;

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
    formErrors: IFormError[],
  ): IFormError[] {
    const manipulatedFields: IFormError[] = [];
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
  private getHighPriorityFormErrors(formErrors: IFormError[]): IFormError[] {
    // Get the lowest priority (1 is the highest priority, 3 is the lowest priority)
    const lowestPriority = Math.min(...formErrors.map((item) => item.priority));
    return formErrors.filter((item) => item.priority === lowestPriority);
  }

  /**
   * Handles the error messages and populates the relevant variables
   */
  private handleErrorMessages(): void {
    let errorSummary = this['getFormErrors'](this.form);
    errorSummary = this['handleDateInputFormErrors'](errorSummary);

    this['setErrorMessages'](errorSummary);

    this.formErrorSummaryMessage = this['removeErrorSummaryMessages'](
      this.formErrorSummaryMessage,
      this['getDateFieldsToRemoveIndexes'](),
    );
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
}
