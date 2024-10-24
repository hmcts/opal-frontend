---

# Abstract Form Parent Base Component

This Angular component serves as a base class for parent components that manage child form controls or child form components. It provides a structure for handling interactions and validations between parent and child forms in a reusable way.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractFormParentBaseComponent` in your project, ensure that it is extended by parent components that manage child form components or controls.

```typescript
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
```

## Usage

This component is designed to be used as a base class for components that need to manage forms with child form controls or components. It facilitates communication between parent and child forms for validation, form submission, and error handling.

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';

@Component({
  selector: 'app-my-parent-form',
  templateUrl: './my-parent-form.component.html',
})
export class MyParentFormComponent extends AbstractFormParentBaseComponent {
  // Define child form logic and interaction methods
}
```

## Inputs

The `AbstractFormParentBaseComponent` facilitates managing multiple child form components or form controls. Components that extend this class typically manage form groups and handle parent-child form interactions.

| Input         | Type       | Description                                                 |
| ------------- | ---------- | ----------------------------------------------------------- |
| `formGroup`   | `FormGroup`| The form group that manages the parent form and child controls.|

## Outputs

The component may provide outputs to notify the parent component of changes in child forms or the form state. For instance, it can notify when a child form is submitted or validated.

## Methods

`AbstractFormParentBaseComponent` provides utility methods to manage the interaction between parent and child forms, handle validation, and manage form submissions.

### Common Methods:

- **`initializeChildForm()`**: Initializes child form components or controls within the parent form.
- **`validateChildForms()`**: Runs validation on all child forms or form controls.
- **`getChildFormErrors()`**: Retrieves error messages from child forms or controls.
- **`submitParentForm()`**: Handles form submission for the parent form and triggers child form validation.

Example:

```typescript
this.initializeChildForm();
const childErrors = this.getChildFormErrors();
if (this.validateChildForms()) {
  this.submitParentForm(); // Proceed with form submission
}
```

## Testing

Unit tests for this component can be found in the `abstract-form-parent-base.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

### Testing Scenarios

Test various interactions between parent and child forms, including form initialization, validation, and submission logic.

```typescript
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
// Test interactions between parent and child form components
```

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that all changes follow Angular best practices and maintain consistency with form management logic between parent and child components.

---

This `README.md` provides an overview of how to extend and use the `AbstractFormParentBaseComponent` to manage forms with child form components, handle validation, and manage parent-child form interactions in Angular applications.
