---

# Abstract Form Alias Base Component

This Angular component provides a foundational abstract form structure for managing alias-based controls. It includes the base logic needed to handle form controls in a reusable manner and is intended to be extended by other components.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractFormAliasBase` in your project, ensure that it is extended or used as a base for form-related components within your Angular application.

```typescript
import { AbstractFormAliasBase } from '@components/abstract/abstract-form-alias-base/abstract-form-alias-base';
```

## Usage

This component is intended to be used as a base class for form components. You can extend this class to create a form that manages alias-based controls.

```typescript
export class MyFormComponent extends AbstractFormAliasBase {
  // Extend the functionality with specific form logic
}
```

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { AbstractFormAliasBase } from '@components/abstract/abstract-form-alias-base/abstract-form-alias-base';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
})
export class MyFormComponent extends AbstractFormAliasBase {
  // Add specific form controls and functionality
}
```

## Inputs

Since `AbstractFormAliasBase` is an abstract class, the actual inputs will depend on how the class is extended. Typically, this class works with alias controls that are defined in the child components that extend it.

| Input       | Type          | Description                                           |
| ----------- | ------------- | ----------------------------------------------------- |
| `aliasForm` | `FormGroup`   | The form group managing alias controls.               |

## Methods

`AbstractFormAliasBase` provides common methods that are useful for handling alias-based form logic. Some common methods include:

- **`buildFormAliasControls()`**: Builds an array of form controls for the given form array.
- **`addAliasControls()`**: Adds alias controls to the form array.
- **`removeFormAliasControls()`**: Removes a form alias control from a form array and updates the list of form array controls.
- **`addAlias()`**: Adds an alias to the specified index of the form array.
- **`removeAllFormAliasControls()`**: Removes all form alias controls from a form array.
- **`removeFormAliasControlsErrors()`**: Removes errors from form alias controls.
- **`removeFormAliasControl()`**: Removes a specific form alias control.
- **`setupAliasFormControls()`**: Sets up alias form controls.
- **`setupAliasCheckboxListener()`**: Sets up a listener for the alias checkbox.

###Example

```
<form [formGroup]="form">
  <div formArrayName="aliases">
    <div *ngFor="let alias of form.controls.aliases.controls; let i = index">
      <input [formControlName]="i" placeholder="Alias {{ i + 1 }}">
    </div>
  </div>
  <button type="submit">Submit</button>
</form>
```


## Testing

Unit tests for this component can be found in the `abstract-form-alias-base.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component. When contributing, ensure that changes are consistent with the underlying form structure and follow Angular best practices.

---

This `README.md` provides an overview of the `abstract-form-alias-base` component and its usage as a base for handling form alias controls in an Angular application.
