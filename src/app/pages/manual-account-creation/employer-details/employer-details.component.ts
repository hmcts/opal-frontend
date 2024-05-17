import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GovukBackLinkComponent, GovukButtonComponent, GovukErrorSummaryComponent, GovukTextInputComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IFieldError, IFieldErrors, IFormControlErrorMessage, IFormError, IFormErrorSummaryMessage, IHighPriorityFormError } from '@interfaces';
import { StateService } from '@services';
import { optionalEmailAddressValidator, optionalMaxLengthValidator, optionalPhoneNumberValidator } from 'src/app/validators';

@Component({
  selector: 'app-employer-details',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent, 
    GovukBackLinkComponent, 
    GovukButtonComponent, 
    GovukErrorSummaryComponent,
  ],
  templateUrl: './employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly router = inject(Router);
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  public employerDetailsForm!: FormGroup;
  public formControlErrorMessages!: IFormControlErrorMessage;
  public formErrorSummaryMessage!: IFormErrorSummaryMessage[];

  // We will move this to a constant field in the future
  private fieldErrors: IFieldErrors = {
    employerName: {
      required: {
        message: 'Enter employer name',
        priority: 1,
      },
      maxlength: {
        message: 'The employer name must be 35 characters or fewer',
        priority: 2,
      },
    },
    employeeReference: {
      required: {
        message: 'Enter employee reference or National Insurance number',
        priority: 1,
      },
      maxlength: {
        message: 'The employee reference must be 20 characters or fewer',
        priority: 2,
      },
    },
    employerEmailAddress: {
      maxlength: {
        message: 'The employer email address must be 76 characters or fewer',
        priority: 2,
      },
      emailPattern: {
        message: 'Enter employer email address in the correct format like, name@example.com',
        priority: 2,
      }
    },
    employerTelephone: {
      maxlength: {
        message: 'The employer email address must be 11 characters or fewer',
        priority: 1,
      },
      phoneNumberPattern: {
        message: 'Enter employer telephone number in the correct format',
        priority: 2,
      }
    },
    employerAddress1: {
      required: {
        message: 'Enter address line 1, typically the building and street',
        priority: 1,
      },
      maxlength: {
        message: 'The employer address line 1 must be 30 characters or fewer',
        priority: 2,
      },
    },
    employerAddress2: {
      maxlength: {
        message: 'The employer address line 2 must be 30 characters or fewer',
        priority: 1,
      },
    },
    employerAddress3: {
      maxlength: {
        message: 'The employer address line 3 must be 30 characters or fewer',
        priority: 1,
      },
    },
    employerAddress4: {
      maxlength: {
        message: 'The employer address line 4 must be 30 characters or fewer',
        priority: 1,
      },
    },
    employerAddress5: {
      maxlength: {
        message: 'The employer address line 5 must be 30 characters or fewer',
        priority: 1,
      },
    },
    employerPostcode: {
      maxlength: {
        message: 'The employer postcode must be 8 characters or fewer',
        priority: 1,
      },
    },
  };

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
    const control = this.employerDetailsForm.get(controlPath);

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
   * Sets up the employer details form with the necessary form controls.
   */
  private setupEmployerDetailsForm(): void {
    this.employerDetailsForm = new FormGroup({
      employerName: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
      employeeReference: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      employerEmailAddress: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      employerTelephone: new FormControl(null, [optionalMaxLengthValidator(11), optionalPhoneNumberValidator()]),
      employerAddress1: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      employerAddress2: new FormControl(null, [optionalMaxLengthValidator(30)]),
      employerAddress3: new FormControl(null, [optionalMaxLengthValidator(30)]),
      employerAddress4: new FormControl(null, [optionalMaxLengthValidator(30)]),
      employerAddress5: new FormControl(null, [optionalMaxLengthValidator(30)]),
      employerPostcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Handles back and navigates to the manual account creation page.
   */
  public handleBack(): void {
    this.router.navigate([ManualAccountCreationRoutes.createAccount]);
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.stateService.manualAccountCreationEmployerDetails = this.employerDetailsForm.value;
    const errorSummary = this.getFormErrors(this.employerDetailsForm);

    this.setErrorMessages(errorSummary);

    if (this.employerDetailsForm.valid) {
      this.stateService.manualAccountCreationEmployerDetails = this.employerDetailsForm.value;
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
    this.setupEmployerDetailsForm();
    this.setInitialErrorMessages(this.employerDetailsForm);
  }
}
