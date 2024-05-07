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
import { IAccountEnquiryStateSearch, IGovUkDateInput, IGovUkSelectOptions } from '@interfaces';
import { DATE_INPUTS } from '../config/date-inputs';

// interface FieldError {
//   message: string;
//   priority: number;
// }

interface FieldError {
  [key: string]: {
    message: string;
    priority: number;
  };
}

interface FieldErrors {
  [key: string]: FieldError;
}

interface FormErrorMessages {
  [key: string]: string | null;
}

interface ErrorSummaryEntry {
  fieldId: string;
  message: string | null;
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

  public fieldErrors: FieldErrors = {
    surname: {
      required: {
        message: 'Enter an email address',
        priority: 1,
      },
      email: {
        message: 'Enter a valid email address',
        priority: 2,
      },
      maxlength: {
        message: 'Too long',
        priority: 3,
      },
    },
  };

  public formErrorMessages!: FormErrorMessages;

  private getHighestPriorityError(errorKeys: string[], fieldErrors: FieldError) {
    return errorKeys
      .map((errorType: string) => fieldErrors[errorType])
      .sort((a, b) => a['priority'] - b['priority'])[0];
  }

  public getFieldErrorMessages(controlPath: string[]): string | null {
    // Get the control
    const control = this.searchForm.get(controlPath);

    // If we have errors
    if (control?.errors) {
      /// Get all the error keys
      const controlKey = controlPath[controlPath.length - 1];
      const errorKeys = Object.keys(control.errors);
      const fieldErrors = this.fieldErrors[controlKey];

      if (fieldErrors) {
        return this.getHighestPriorityError(errorKeys, fieldErrors).message;
      }
    }
    return null;
  }

  private buildFieldErrorMessages(errorSummaryEntry: ErrorSummaryEntry[]) {
    errorSummaryEntry.forEach((entry) => {
      this.formErrorMessages[entry.fieldId] = entry.message;
    });
  }

  getErrorSummary(form: FormGroup, controlPath: string[] = []): ErrorSummaryEntry[] {
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
   * Sets up the search form with the necessary form controls.
   */
  private setupSearchForm(): void {
    this.searchForm = new FormGroup({
      court: new FormControl(null, [Validators.required]),
      surname: new FormControl(null, [Validators.required, Validators.maxLength(5), Validators.email]),
      forename: new FormControl(null),
      initials: new FormControl(null),
      dateOfBirth: new FormGroup({
        dayOfMonth: new FormControl(null, [Validators.required]),
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

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.buildFieldErrorMessages(this.getErrorSummary(this.searchForm));
    console.log(this.formErrorMessages);

    if (this.searchForm.valid) {
      // this.formSubmit.emit(this.searchForm.value);
    }
  }

  public ngOnInit(): void {
    this.setupSearchForm();
    this.rePopulateSearchForm();
  }
}
