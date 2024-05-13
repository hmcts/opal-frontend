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
} from '@components';
import {
  IAccountEnquiryStateSearch,
  IFormControlError,
  IFormControlErrors,
  IFormErrorMessages,
  IFormErrorSummaryEntry,
  IGovUkDateInput,
  IGovUkSelectOptions,
} from '@interfaces';
import { DATE_INPUTS } from '../config/date-inputs';

interface IHighPriorityError {
  message: string;
  priority: number;
  type: string;
}

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

  // We will move this to a constant field in the future
  private fieldErrors: IFormControlErrors = {
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
    },
    monthOfYear: {
      required: {
        message: 'The date your passport was issued must include a month',
        priority: 1,
      },
    },
    year: {
      required: {
        message: 'The date your passport was issued must include a year',
        priority: 1,
      },
    },
  };

  public formControlErrorMessages!: IFormErrorMessages;
  public formErrorSummaryMessage!: IFormErrorMessages;

  /**
   * Returns the highest priority error from the given list of error keys and field errors.
   * @param errorKeys - The list of error keys.
   * @param fieldErrors - The field errors object.
   * @returns The highest priority error.
   */
  private getHighestPriorityError(errorKeys: string[], fieldErrors: IFormControlError): IHighPriorityError {
    // Loop over the error keys and return the error with the highest priority
    // Also add the error type to the object
    const errors = errorKeys.map((errorType: string) => {
      return {
        ...fieldErrors[errorType],
        type: errorType,
      };
    });

    return errors.sort((a, b) => a['priority'] - b['priority'])[0];
  }

  /**
   * Retrieves the error message for a given form control.
   *
   * @param controlPath - The path to the form control.
   * @returns The error message for the control, or null if there are no errors.
   */
  private getFieldErrorDetails(controlPath: string[]): IHighPriorityError | null {
    // Get the control
    const control = this.searchForm.get(controlPath);

    // If we have errors
    const controlErrors = control?.errors;

    if (controlErrors) {
      /// Get all the error keys
      const controlKey = controlPath[controlPath.length - 1];
      const errorKeys = Object.keys(controlErrors);
      const fieldErrors = this.fieldErrors[controlKey];

      if (errorKeys && fieldErrors) {
        return this.getHighestPriorityError(errorKeys, fieldErrors);
      }
    }
    return null;
  }

  /**
   * Builds field error messages based on the provided error summary entries.
   * @param errorSummaryEntry - An array of error summary entries.
   */
  private setErrorMessages(errorSummaryEntry: IFormErrorSummaryEntry[]) {
    // Reset the form error messages
    this.formControlErrorMessages = {};
    this.formErrorSummaryMessage = {};

    // Set the form error messages based on the error summary entries
    errorSummaryEntry.forEach((entry) => {
      this.formControlErrorMessages[entry.fieldId] = entry.message;
      this.formErrorSummaryMessage[entry.fieldId] = entry.message;
    });
  }

  /**
   * Retrieves the error summary for a given form and its controls.
   * This method recursively gets all errors from all controls in the form, including nested form group controls.
   *
   * @param form - The form group to retrieve the error summary from.
   * @param controlPath - The path of the control within the form group (used for nested form groups).
   * @returns An array of ErrorSummaryEntry objects representing the error summary.
   */

  // Potentially refactor to handle null getErrorDetails response
  private getErrorSummary(form: FormGroup, controlPath: string[] = []): IFormErrorSummaryEntry[] {
    // recursively get all errors from all controls in the form including nested form group controls
    const formControls = form.controls;

    const errorSummary = Object.keys(formControls)
      .filter((controlName) => formControls[controlName].invalid)
      .map((controlName) => {
        const control = formControls[controlName];

        if (control instanceof FormGroup) {
          return this.getErrorSummary(control, [...controlPath, controlName]);
        }

        const getFieldErrorDetails = this.getFieldErrorDetails([...controlPath, controlName]);

        // Return the error summary entry
        // If we don't have the error details, return a null message
        return {
          fieldId: controlName,
          message: getFieldErrorDetails?.message || null,
          priority: getFieldErrorDetails?.priority || 999999999,
          type: getFieldErrorDetails?.type || null,
        };
      })
      .flat();

    // Remove any null errors
    return errorSummary.filter((item) => item.message !== null);
  }

  /**
   * Sets the initial form error messages.
   *
   * @param form - The form group.
   */
  private setInitialErrorMessages(form: FormGroup): void {
    const formControls = form.controls;
    const initialFormControlErrorMessages: IFormErrorMessages = {};
    const initialFormErrorSummaryMessage: IFormErrorMessages = {};

    Object.keys(formControls).map((controlName) => {
      initialFormControlErrorMessages[controlName] = null;
      initialFormErrorSummaryMessage[controlName] = null;
    });

    this.formControlErrorMessages = initialFormControlErrorMessages;
    this.formErrorSummaryMessage = initialFormErrorSummaryMessage;
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
      dateOfBirth: new FormGroup({
        dayOfMonth: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
        monthOfYear: new FormControl(null, [Validators.required]),
        year: new FormControl(null, [Validators.required]),
      }),
      addressLine: new FormControl(null),
      niNumber: new FormControl(null),
      pcr: new FormControl(null),
    });
  }

  /**
   * Repopulates the search form with the data from the account enquiry search.
   */
  private rePopulateSearchForm(): void {
    this.searchForm.patchValue(this.state);
  }

  /**
   * Clears the search form.
   */
  public handleClearForm(): void {
    this.searchForm.reset();
  }

  private splitErrorSummaryArrays(
    fieldIds: string[],
    errorSummary: IFormErrorSummaryEntry[],
  ): IFormErrorSummaryEntry[][] {
    const cleanErrorSummaries: IFormErrorSummaryEntry[] = [];
    const removedErrorSummaries: IFormErrorSummaryEntry[] = [];

    errorSummary.forEach((error) => {
      if (fieldIds.includes(error.fieldId)) {
        removedErrorSummaries.push(error);
      } else {
        cleanErrorSummaries.push(error);
      }
    });

    return [cleanErrorSummaries, removedErrorSummaries];
  }

  private getHighPriorityErrorSummaries(errorSummary: IFormErrorSummaryEntry[]): IFormErrorSummaryEntry[] {
    // Get the lowest priority (1 is the highest priority, 3 is the lowest priority)
    const lowestPriority = Math.min(...errorSummary.map((item) => item.priority));
    return errorSummary.filter((item) => item.priority === lowestPriority);
  }

  private manipulateErrorMessage(
    fields: string[],
    messageOverride: string,
    errorType: string,
    errorSummary: IFormErrorSummaryEntry[],
  ) {
    const manipulatedFields: IFormErrorSummaryEntry[] = [];
    errorSummary.forEach((field) => {
      if (fields.includes(field.fieldId)) {
        if (field.type === errorType) {
          manipulatedFields.push({ ...field, message: messageOverride });
        }
      } else {
        manipulatedFields.push(field);
      }
    });

    return manipulatedFields;
  }

  private handleDateInputFormErrors(errorSummary: IFormErrorSummaryEntry[]) {
    const dateInputFields = ['dayOfMonth', 'monthOfYear', 'year'];
    const splitErrorSummaries = this.splitErrorSummaryArrays(dateInputFields, errorSummary);
    const highPriorityDateControlErrors = this.getHighPriorityErrorSummaries(splitErrorSummaries[1]);
    let manipulatedErrorSummary: IFormErrorSummaryEntry[] = highPriorityDateControlErrors;

    // If we have more than one error then we want to manipulate the error message
    if (highPriorityDateControlErrors.length > 1) {
      manipulatedErrorSummary = this.manipulateErrorMessage(
        dateInputFields,
        'Please enter a DOB',
        'required',
        manipulatedErrorSummary,
      );
    }

    return [...splitErrorSummaries[0], ...manipulatedErrorSummary];
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    let errorSummary = this.getErrorSummary(this.searchForm);
    errorSummary = this.handleDateInputFormErrors(errorSummary);

    this.setErrorMessages(errorSummary);
  }

  public ngOnInit(): void {
    this.setupSearchForm();
    this.setInitialErrorMessages(this.searchForm);
    this.rePopulateSearchForm();
  }
}
