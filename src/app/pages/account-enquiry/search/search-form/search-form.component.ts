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
  IFormControlError,
  IFormControlErrors,
  IFormErrorMessages,
  IFormErrorSummaryEntry,
  IGovUkDateInput,
  IGovUkSelectOptions,
} from '@interfaces';
import { DATE_INPUTS } from '../config/date-inputs';

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
  };

  public formErrorMessages!: IFormErrorMessages;
  public formErrorSummary!: IFormErrorSummaryEntry[];

  /**
   * Returns the highest priority error from the given error keys and field errors.
   * @param errorKeys - An array of error keys.
   * @param fieldErrors - An object containing field errors.
   * @returns The highest priority error from the field errors.
   */
  private getHighestPriorityError(errorKeys: string[], fieldErrors: IFormControlError) {
    return errorKeys
      .map((errorType: string) => fieldErrors[errorType])
      .sort((a, b) => a['priority'] - b['priority'])[0];
  }

  /**
   * Retrieves the error message for a given form control.
   *
   * @param controlPath - The path to the form control.
   * @returns The error message for the control, or null if there are no errors.
   */
  private getFieldErrorMessages(controlPath: string[]): string | null {
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
        return this.getHighestPriorityError(errorKeys, fieldErrors)?.message;
      }
    }
    return null;
  }

  /**
   * Builds field error messages based on the provided error summary entries.
   * @param errorSummaryEntry - An array of error summary entries.
   */
  private buildFieldErrorMessages(errorSummaryEntry: IFormErrorSummaryEntry[]) {
    this.formErrorSummary = errorSummaryEntry;
    errorSummaryEntry.forEach((entry) => {
      this.formErrorMessages[entry.fieldId] = entry.message;
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
  private getErrorSummary(form: FormGroup, controlPath: string[] = []): IFormErrorSummaryEntry[] {
    // recursively get all errors from all controls in the form including nested form group controls
    const formControls = form.controls;

    return Object.keys(formControls)
      .filter((controlName) => formControls[controlName].invalid)
      .map((controlName) => {
        const control = formControls[controlName];

        if (control instanceof FormGroup) {
          return this.getErrorSummary(control, [...controlPath, controlName]);
        }

        return {
          fieldId: controlName,
          message: this.getFieldErrorMessages([...controlPath, controlName]),
        };
      })
      .flat();
  }

  /**
   * Sets the initial form error messages.
   *
   * @param form - The form group.
   */
  private setInitialFormErrorMessages(form: FormGroup): void {
    const formControls = form.controls;
    const initialFormErrorMessages: IFormErrorMessages = {};

    Object.keys(formControls).map((controlName) => {
      initialFormErrorMessages[controlName] = null;
    });

    this.formErrorMessages = initialFormErrorMessages;
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
        dayOfMonth: new FormControl(null),
        monthOfYear: new FormControl(null),
        year: new FormControl(null),
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

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.buildFieldErrorMessages(this.getErrorSummary(this.searchForm));

    // Code not required for DISCO+ as we are not using the form validation
    // if (this.searchForm.valid) {
    this.formSubmit.emit(this.searchForm.value);
    // }
  }

  public ngOnInit(): void {
    this.setupSearchForm();
    this.setInitialFormErrorMessages(this.searchForm);
    this.rePopulateSearchForm();
  }

  scroll(fieldId: string) {
    const labelElement = document.querySelector(`label[for=${fieldId}]`) as HTMLInputElement;
    const fieldElement = document.getElementById(fieldId);
    labelElement?.scrollIntoView({ behavior: 'smooth' });
    fieldElement?.focus();
  }
}
