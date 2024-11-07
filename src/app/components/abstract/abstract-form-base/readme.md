---

# Abstract Form Base Component

This Angular component serves as a foundational base for managing form controls, validation, and error handling. It provides reusable functionality for managing forms and is designed to be extended by other form components.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Methods](#methods)
- [Interfaces](#interfaces)
- [Mocks](#mocks)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractFormBaseComponent` in your project, ensure that it is extended by form-related components to handle forms in your Angular application.

```typescript
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
```

## Usage

This component is designed to be used as a base class for managing forms, validations, and error handling in a reusable and scalable way.

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
})
export class MyFormComponent extends AbstractFormBaseComponent {
  // Define specific form controls and methods for your form
}
```

## Inputs

`AbstractFormBaseComponent` provides several key inputs that manage form control groups and their validation state.

| Input         | Type       | Description                                         |
| ------------- | ---------- | --------------------------------------------------- |
| `formGroup`   | `FormGroup`| The main form group that holds all form controls.    |

## Methods

`AbstractFormBaseComponent` provides utility methods for managing form controls, validating fields, and handling form error messages.

### Common Methods:

- **`scroll()`**: Scrolls to the label of the component and focuses on the field id.
- **`ngOnInit()`**: Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
- **`ngOnDestroy()`**: Lifecycle hook that is called when the directive is destroyed.
###Examples

```
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div>
    <label for="name">Name</label>
    <input id="name" formControlName="name">
    <div *ngIf="form.controls.name.invalid && form.controls.name.touched">
      Name is required.
    </div>
  </div>
  <div>
    <label for="email">Email</label>
    <input id="email" formControlName="email">
    <div *ngIf="form.controls.email.invalid && form.controls.email.touched">
      Enter a valid email.
    </div>
  </div>
  <button type="submit">Submit</button>
</form>
```
## Interfaces

`AbstractFormBaseComponent` utilizes several interfaces to manage form control states, error handling, and validation logic.

### Key Interfaces:

1. **Error Handling Interfaces**:
   - `AbstractFormBaseFieldError`: Represents individual field-level error details.
   - `AbstractFormBaseFormErrorSummaryMessage`: Manages summary-level error messages for the form.

2. **Form Status Interfaces**:
   - `AbstractFormBaseStatus`: Tracks the current form status (e.g., loading, submitted, or idle).

3. **Form Structure Interfaces**:
   - `AbstractFormBaseForm`: Defines the structure of form controls and their configuration.
   - `AbstractFormBaseHighPriorityFormError`: Manages high-priority error messages for critical form fields.

## Mocks

Several mock files are included to simulate form data, error states, and form summaries for testing purposes.

### Mock Files:

1. **abstract-form-base-form-control-error.mock.ts**: Simulates form control error scenarios.
2. **abstract-form-base-form-date-error-summary.mock.ts**: Mocks error summaries for date-based form controls.
3. **abstract-form-base-form-error-summary.mock.ts**: Provides error summaries for the form.
4. **abstract-form-base-form-state.mock.ts**: Mocks various form states, such as loading, error, and success.

These mocks can be used in unit tests to validate different form behaviors and error states.

## Testing

Unit tests for this component can be found in the `abstract-form-base.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

### Testing Scenarios

You can use the mock files to test various scenarios, such as form validation, error handling, and form submission.

```typescript
import { AbstractFormBaseFormErrorSummaryMock } from '@mocks/abstract-form-base-form-error-summary.mock.ts';
// Simulate form error scenarios in your tests
```

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that all changes follow Angular best practices and maintain consistency with form management and validation logic.

---

This `README.md` provides a detailed guide on how to extend and use the `AbstractFormBaseComponent` in your Angular application. It also includes references to interfaces and mocks that support form control, validation, and testing.
