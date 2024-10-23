Here is the `README.md` for the `govuk-text-input-prefix-suffix` component:

---

# GOV.UK Text Input Prefix/Suffix Component

This Angular component provides a GOV.UK-styled single-line text input with optional prefix or suffix, commonly used for input fields like currency or percentages.

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
import { GovukTextInputPrefixSuffixComponent } from '@components/govuk/govuk-text-input-prefix-suffix/govuk-text-input-prefix-suffix.component';
```

## Usage

You can use the text input with prefix/suffix in your template as follows:

```html
<app-govuk-text-input-prefix-suffix
  [inputId]="'amount'"
  [labelText]="'Amount'"
  [prefix]="'£'"
  [suffix]="'per month'"
></app-govuk-text-input-prefix-suffix>
```

### Example in HTML:

```html
<div class="govuk-form-group">
  <label class="govuk-label" for="{{ inputId }}">{{ labelText }}</label>
  <div class="govuk-input__wrapper">
    <span *ngIf="prefix" class="govuk-input__prefix">{{ prefix }}</span>
    <input class="govuk-input" id="{{ inputId }}" type="text" />
    <span *ngIf="suffix" class="govuk-input__suffix">{{ suffix }}</span>
  </div>
</div>
```

## Inputs

| Input       | Type     | Description                               |
| ----------- | -------- | ----------------------------------------- |
| `inputId`   | `string` | The ID for the text input element.        |
| `labelText` | `string` | The label for the text input.             |
| `prefix`    | `string` | Optional prefix (e.g., currency symbol).  |
| `suffix`    | `string` | Optional suffix (e.g., 'per month', '%'). |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-text-input-prefix-suffix.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use the `govuk-text-input-prefix-suffix` component to display text inputs with optional prefixes and suffixes, such as currency or percentage symbols, styled with GOV.UK standards.
