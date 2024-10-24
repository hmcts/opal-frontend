---

# Abstract Form Array Base Component

This Angular component serves as an abstract base class for managing form arrays. It provides reusable logic to handle dynamic form arrays, making it easier to work with forms that involve multiple items of similar data.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractFormArrayBase` in your project, ensure that it is extended by components that manage dynamic form arrays.

```typescript
import { AbstractFormArrayBase } from '@components/abstract/abstract-form-array-base/abstract-form-array-base';
```

## Usage

This component is intended to be used as a base class for components that manage arrays of form controls. You can extend this class to simplify managing forms where multiple entries of the same kind are required, such as a list of phone numbers or addresses.

```typescript
export class MyFormArrayComponent extends AbstractFormArrayBase {
  // Extend the functionality with specific form logic for form arrays
}
```

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { AbstractFormArrayBase } from '@components/abstract/abstract-form-array-base/abstract-form-array-base';

@Component({
  selector: 'app-my-form-array',
  templateUrl: './my-form-array.component.html',
})
export class MyFormArrayComponent extends AbstractFormArrayBase {
  // Add specific form array controls and logic here
}
```

## Inputs

The class manages an array of form controls through `FormArray`. Components that extend this base class will manage form arrays by leveraging the provided methods and inputs.

| Input         | Type        | Description                                                       |
| ------------- | ----------- | ----------------------------------------------------------------- |
| `formArray`   | `FormArray` | A dynamic form array that holds a list of form controls or groups. |

## Methods

`AbstractFormArrayBase` provides utility methods to work with form arrays, making it easier to dynamically add, remove, or manipulate the controls inside a `FormArray`.

Some common methods include:

- **`addItem()`**: Adds a new form control or form group to the array.
- **`removeItem(index: number)`**: Removes a form control or group at the specified index.
- **`getItemAt(index: number)`**: Retrieves the form control or group at the given index.
  
Example:

```typescript
this.addItem(); // Adds a new item to the form array
const item = this.getItemAt(0); // Gets the first item from the array
this.removeItem(2); // Removes the third item
```

## Testing

Unit tests for this component can be found in the `abstract-form-array-base.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that any changes follow Angular best practices and maintain consistency with form management logic.

---

This `README.md` provides an overview of how to extend and use the `AbstractFormArrayBase` component to manage dynamic form arrays in Angular applications.
