---

# Abstract Form Array Removal Base Component

This Angular component serves as an abstract base class for managing form arrays with the ability to remove items dynamically. It provides reusable logic to handle dynamic form arrays, where users can add or remove entries.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractFormArrayRemovalBase` in your project, ensure that it is extended by components that manage dynamic form arrays with removal capabilities.

```typescript
import { AbstractFormArrayRemovalBase } from '@components/abstract/abstract-form-array-removal-base/abstract-form-array-removal-base';
```

## Usage

This component is designed to be used as a base class for components that manage arrays of form controls with the ability to remove items. You can extend this class to implement form arrays that allow users to remove specific entries.

```typescript
export class MyFormArrayRemovalComponent extends AbstractFormArrayRemovalBase {
  // Extend functionality with specific logic for adding/removing items in the form array
}
```

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { AbstractFormArrayRemovalBase } from '@components/abstract/abstract-form-array-removal-base/abstract-form-array-removal-base';

@Component({
  selector: 'app-my-form-array-removal',
  templateUrl: './my-form-array-removal.component.html',
})
export class MyFormArrayRemovalComponent extends AbstractFormArrayRemovalBase {
  // Define form array-specific logic for managing item removal
}
```

## Inputs

This base class handles dynamic arrays of form controls with the added feature of item removal. Components extending this class will handle form arrays with add/remove functionality.

| Input          | Type        | Description                                                       |
| -------------- | ----------- | ----------------------------------------------------------------- |
| `formArray`    | `FormArray` | A dynamic form array holding a list of form controls or groups.    |

## Methods

`AbstractFormArrayRemovalBase` provides utility methods for working with form arrays, including adding new items, removing existing items, and retrieving form controls or groups by index.

Some key methods include:

- **`addItem()`**: Adds a new form control or form group to the array.
- **`removeItem(index: number)`**: Removes a form control or form group at the specified index.
- **`getItemAt(index: number)`**: Retrieves a form control or form group from the array by index.

Example:

```typescript
this.addItem(); // Adds a new form control to the array
const item = this.getItemAt(0); // Retrieves the first item from the array
this.removeItem(1); // Removes the second item in the form array
```

## Testing

Unit tests for this component can be found in the `abstract-form-array-removal-base.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that any changes follow Angular best practices and maintain consistency with form management and removal logic.

---

This `README.md` provides an overview of how to extend and use the `AbstractFormArrayRemovalBase` component to manage dynamic form arrays with removal capabilities in Angular applications.
