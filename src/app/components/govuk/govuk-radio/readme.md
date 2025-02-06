---

# GOV.UK Radio Component

This Angular component renders a GOV.UK-styled radio button group, allowing users to select from multiple radio button options with associated legends, hints, and error handling.

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
import { GovukRadioComponent } from '@components/govuk/govuk-radio/govuk-radio.component';
```

## Usage

You can use the radio component in your template as follows:

```html
<app-govuk-radio
  [fieldSetId]="'example-radio'"
  [legendText]="'Choose an option'"
  [legendHint]="'Please select one'"
  [errors]="'You must select an option'"
  [radioClasses]="'custom-radio-class'"
>
  <div class="govuk-radios__item">
    <input class="govuk-radios__input" id="option1" name="options" type="radio" value="option1" />
    <label class="govuk-label govuk-radios__label" for="option1">Option 1</label>
  </div>
  <div class="govuk-radios__item">
    <input class="govuk-radios__input" id="option2" name="options" type="radio" value="option2" />
    <label class="govuk-label govuk-radios__label" for="option2">Option 2</label>
  </div>
</app-govuk-radio>
```

### Example in HTML:

```html
<div class="govuk-form-group" [class.govuk-form-group--error]="!!errors">
  <fieldset class="govuk-fieldset" [id]="fieldSetId" [attr.aria-describedby]="fieldSetId">
    <legend class="govuk-fieldset__legend {{ legendClasses }}">{{ legendText }}</legend>
    <div class="govuk-hint">{{ legendHint }}</div>

    <p id="{{ this.fieldSetId }}-error-message" class="govuk-error-message">
      <span class="govuk-visually-hidden">Error: </span> {{ errors }}
    </p>

    <div class="govuk-radios {{ radioClasses }}">
      <ng-content></ng-content>
    </div>
  </fieldset>
</div>
```

## Inputs

| Input          | Type     | Description                                                 |
| -------------- | -------- | ----------------------------------------------------------- |
| `fieldSetId`   | `string` | The ID for the fieldset, used to associate with the radios. |
| `legendText`   | `string` | The legend or title for the radio group.                    |
| `legendHint`   | `string` | An optional hint displayed beneath the legend.              |
| `errors`       | `string` | Error message to display if there are validation errors.    |
| `radioClasses` | `string` | Additional CSS classes to apply to the radio group.         |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-radio.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of the `govuk-radio` component, detailing how to configure it with legends, hints, and error messages.
