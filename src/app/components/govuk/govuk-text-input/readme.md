---

# GOV.UK Text Input Component

This Angular component provides a GOV.UK-styled single-line text input, following GOV.UK design and accessibility standards.

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
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
```

## Usage

You can use the text input component in your template as follows:

```html
<app-govuk-text-input
  [inputId]="'name'"
  [labelText]="'Full name'"
  [hintText]="'Enter your full name.'"
  [inputType]="'text'"
></app-govuk-text-input>
```

### Example in HTML:

```html
<div class="govuk-form-group">
  <label class="govuk-label" for="{{ inputId }}">{{ labelText }}</label>
  <span class="govuk-hint">{{ hintText }}</span>
  <input class="govuk-input" id="{{ inputId }}" type="{{ inputType }}" />
</div>
```

## Inputs

| Input       | Type     | Description                                              |
| ----------- | -------- | -------------------------------------------------------- |
| `inputId`   | `string` | The ID for the text input element.                       |
| `labelText` | `string` | The label for the text input.                            |
| `hintText`  | `string` | Optional hint text displayed below the label.            |
| `inputType` | `string` | The type attribute of the input (e.g., 'text', 'email'). |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-text-input.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use the `govuk-text-input` component for single-line text inputs styled with the GOV.UK design system.
