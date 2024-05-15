import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GovukTextInputComponent,
  GovukRadiosComponent,
  GovukCheckboxesComponent,
  GovukDateInputComponent,
  GovukSelectComponent,
  GovukButtonComponent,
  AlphagovAccessibleAutocompleteComponent,
  GovukErrorSummaryComponent,
} from '@components';
import {
  IAccountEnquiryStateSearch,
  IFieldError,
  IFieldErrors,
  IFormControlErrorMessage,
  IFormError,
  IFormErrorSummaryMessage,
  IGovUkDateInput,
  IGovUkRadioInput,
  IGovUkSelectOptions,
  IHighPriorityFormError,
} from '@interfaces';
import { DATE_INPUTS } from '../config/date-inputs';
import { overEighteenValidator } from 'src/app/validators';
import { SEARCH_TYPE_RADIOS } from '../config/search-type-radios';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukRadiosComponent,
    GovukCheckboxesComponent,
    GovukDateInputComponent,
    GovukSelectComponent,
    GovukButtonComponent,
    AlphagovAccessibleAutocompleteComponent,
    GovukErrorSummaryComponent,
    GovukRadiosComponent,
  ],
  templateUrl: './search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent implements OnInit {
  @Input({ required: true }) public selectOptions!: IGovUkSelectOptions[];
  @Input({ required: true }) public state!: IAccountEnquiryStateSearch;

  @Output() private formSubmit = new EventEmitter<IAccountEnquiryStateSearch>();

  public readonly dateInputs: IGovUkDateInput = DATE_INPUTS;
  public searchForm!: FormGroup;

  public radioOptions: IGovUkRadioInput[] = SEARCH_TYPE_RADIOS;

  // We will move this to a constant field in the future
  private fieldErrors: IFieldErrors = {
    court: {
      required: {
        message: 'Select a court',
        priority: 1,
      },
    },
    dayOfMonth: {
      required: {
        message: 'The date your passport was issued must include a day',
        priority: 1,
      },
      maxlength: {
        message: 'The day must be 2 characters or fewer',
        priority: 2,
      },
      underEighteen: {
        message: 'You need to be older than 18 years old',
        priority: 3,
      },
    },
    monthOfYear: {
      required: {
        message: 'The date your passport was issued must include a month',
        priority: 1,
      },
      underEighteen: {
        message: 'You need to be older than 18 years old',
        priority: 3,
      },
    },
    year: {
      required: {
        message: 'The date your passport was issued must include a year',
        priority: 1,
      },
      underEighteen: {
        message: 'You need to be older than 18 years old',
        priority: 3,
      },
    },
    whereDoYouLive: {
      required: {
        message: 'Select the country where you live',
        priority: 1,
      },
    },
  };

  public formControlErrorMessages!: IFormControlErrorMessage;
  public formErrorSummaryMessage!: IFormErrorSummaryMessage[];

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
    const control = this.searchForm.get(controlPath);

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
  private setInitialErrorMessages(form: FormGroup): void {
    const formControls = form.controls;
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
   * Sets up the search form with the necessary form controls.
   */
  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
      court: new FormControl(null, [Validators.required]),
      surname: new FormControl(null),
      forename: new FormControl(null),
      initials: new FormControl(null),
      dateOfBirth: new FormGroup(
        {
          dayOfMonth: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
          monthOfYear: new FormControl(null, [Validators.required]),
          year: new FormControl(null, [Validators.required]),
        },
        { validators: overEighteenValidator('dayOfMonth', 'monthOfYear', 'year') },
      ),
      addressLine: new FormControl(null),
      niNumber: new FormControl(null),
      pcr: new FormControl(null),
      whereDoYouLive: new FormGroup({
        whereDoYouLive: new FormControl(null, [Validators.required]),
      }),
    });
  }

  /**
   * Repopulates the search form with the data from the account enquiry search.
   */
  private rePopulateSearchForm(): void {
    this.searchForm.patchValue(this.state);
  }

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
   * Clears the search form.
   */
  public handleClearForm(): void {
    this.searchForm.reset();
  }

  // /**
  //  * Returns an array of indexes representing the date input fields that should be removed from the form error summary message.
  //  *
  //  * @param formErrorSummaryMessage - The array of form error summary messages.
  //  * @returns An array of indexes representing the date input fields to remove.
  //  */
  // private getDateFieldsToRemoveIndexes(formErrorSummaryMessage: IFormErrorSummaryMessage[]): number[] {
  //   const dateInputFields = ['dayOfMonth', 'monthOfYear', 'year'];
  //   const indexesToRemove: number[] = [];

  //   // Collect the indexes of the date fields that are present in the formErrorSummaryMessage
  //   const foundIndexes: { [key: string]: number } = {};

  //   for (const field of dateInputFields) {
  //     const index = formErrorSummaryMessage.findIndex((error) => error.fieldId === field);
  //     if (index !== -1) {
  //       foundIndexes[field] = index;
  //     }
  //   }

  //   // Determine which indexes to remove based on the found fields
  //   if (
  //     foundIndexes['dayOfMonth'] !== undefined &&
  //     foundIndexes['monthOfYear'] !== undefined &&
  //     foundIndexes['year'] !== undefined
  //   ) {
  //     // All three date fields are present
  //     indexesToRemove.push(foundIndexes['monthOfYear'], foundIndexes['year']);
  //   } else if (foundIndexes['dayOfMonth'] !== undefined && foundIndexes['monthOfYear'] !== undefined) {
  //     // Only dayOfMonth and monthOfYear are present
  //     indexesToRemove.push(foundIndexes['monthOfYear']);
  //   } else if (foundIndexes['monthOfYear'] !== undefined && foundIndexes['year'] !== undefined) {
  //     // Only monthOfYear and year are present
  //     indexesToRemove.push(foundIndexes['year']);
  //   }

  //   return indexesToRemove;
  // }

  /**
   * Returns an array of indexes representing the date input fields that should be removed from the form error summary message.
   *
   * @param formErrorSummaryMessage - The array of form error summary messages.
   * @returns An array of indexes representing the date input fields to remove.
   */
  private getDateFieldsToRemoveIndexes(formErrorSummaryMessage: IFormErrorSummaryMessage[]): number[] {
    const dateInputFields = ['dayOfMonth', 'monthOfYear', 'year'];
    const indexesToRemove: number[] = [];

    // Collect the indexes of the date fields that are present in the formErrorSummaryMessage
    const foundIndexes = dateInputFields
      .map((field) => formErrorSummaryMessage.findIndex((error) => error.fieldId === field))
      .filter((index) => index !== -1);

    // Determine which indexes to remove based on the found fields
    if (foundIndexes.length === 3) {
      // All three date fields are present
      indexesToRemove.push(foundIndexes[1], foundIndexes[2]);
    } else if (foundIndexes.length === 2) {
      // Two date fields are present
      indexesToRemove.push(foundIndexes[1]);
    }

    return indexesToRemove;
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
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    let errorSummary = this.getFormErrors(this.searchForm);
    errorSummary = this.handleDateInputFormErrors(errorSummary);

    this.setErrorMessages(errorSummary);

    this.formErrorSummaryMessage = this.removeErrorSummaryMessages(
      this.formErrorSummaryMessage,
      this.getDateFieldsToRemoveIndexes(this.formErrorSummaryMessage),
    );

    if (this.searchForm.valid) {
      this.formSubmit.emit(this.searchForm.value);
    }
  }

  /**
   * Handles the scroll of the component error from the summary
   *
   * @param fieldId - Field id of the component
   */
  public scrollTo(fieldId: string): void {
    this.scroll(fieldId);
  }

  public ngOnInit(): void {
    this.setupSearchForm();
    this.setInitialErrorMessages(this.searchForm);
    this.rePopulateSearchForm();
  }
}
