---

# GOV.UK Radios Item Component

This Angular component represents an individual radio button item within a GOV.UK-styled radios group. It is typically used to display radio buttons with associated labels.

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
import { GovukRadiosItemComponent } from '@components/govuk/govuk-radio/govuk-radios-item/govuk-radios-item.component';
```

## Usage

You can use the radios item component in your template as follows:

```html
<app-govuk-radios-item
  [inputId]="'radio1'"
  [inputName]="'exampleRadio'"
  [labelText]="'Option 1'"
></app-govuk-radios-item>
```

### Example in HTML:

```html
<div class="govuk-radios__item">
  <input class="govuk-radios__input" id="{{ inputId }}" name="{{ inputName }}" type="radio" value="{{ inputValue }}" />
  <label class="govuk-label govuk-radios__label" for="{{ inputId }}">{{ labelText }}</label>
</div>
```

This component is used to display an individual radio button along with its label.

## Inputs

| Input          | Type     | Description                                         |
| -------------- | -------- | --------------------------------------------------- |
| `inputId`      | `string` | The ID for the radio button input.                  |
| `inputName`    | `string` | The name attribute for the radio input.             |
| `inputValue`   | `string` | The value of the radio button when selected.        |
| `labelText`    | `string` | The text displayed alongside the radio button.      |
| `inputClasses` | `string` | Additional CSS classes to apply to the radio input. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-radios-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use the `govuk-radios-item` component to create individual radio buttons with associated labels within a GOV.UK-styled radios group.
