Here is the `README.md` for the `govuk-checkboxes-item` component based on the files you provided:

---

# GOV.UK Checkboxes Item Component

This Angular component represents an individual checkbox within a GOV.UK-styled checkboxes group, supporting customization for label, input ID, and form control integration.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes-item/govuk-checkboxes-item.component';
```

## Usage

You can use the checkboxes item component in your template as follows:

```html
<app-govuk-checkboxes-item
  [inputId]="'exampleCheckbox1'"
  [inputName]="'exampleCheckbox'"
  [labelText]="'Option 1'"
  [formControl]="myFormControl"
></app-govuk-checkboxes-item>
```

### Example in HTML:

```html
<input
  class="govuk-checkboxes__input {{ inputClasses }}"
  [id]="inputId"
  [name]="inputName"
  type="checkbox"
  [formControl]="getControl"
  [attr.data-aria-controls]="ariaControls"
/>

<label class="govuk-label govuk-checkboxes__label {{ labelClasses }}" [for]="inputId"> {{ labelText }} </label>
```

This will render a checkbox with a label and allow the input to be linked to a form control.

## Inputs

| Input          | Type          | Description                                            |
| -------------- | ------------- | ------------------------------------------------------ |
| `inputId`      | `string`      | The unique ID for the checkbox input.                  |
| `inputName`    | `string`      | The name attribute for the checkbox input.             |
| `labelText`    | `string`      | The text displayed for the label.                      |
| `inputClasses` | `string`      | Additional CSS classes to apply to the checkbox input. |
| `labelClasses` | `string`      | Additional CSS classes to apply to the checkbox label. |
| `ariaControls` | `string`      | ARIA controls attribute for accessibility.             |
| `formControl`  | `FormControl` | Angular FormControl used for reactive forms.           |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-checkboxes-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of the `govuk-checkboxes-item` component, detailing the key inputs, such as `inputId`, `labelText`, and how it integrates with Angular forms【89†source】.
