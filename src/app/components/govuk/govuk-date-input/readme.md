---

# GOV.UK Date Input Component

This Angular component provides a GOV.UK-styled date input field, allowing users to enter day, month, and year values with validation support and error handling.

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
import { GovukDateInputComponent } from '@components/govuk/govuk-date-input/govuk-date-input.component';
```

## Usage

You can use the date input component in your template as follows:

```html
<app-govuk-date-input
  [fieldSetId]="'passport-issued'"
  [legendText]="'Passport Issued Date'"
  [legendHint]="'For example, 31 3 2023'"
  [errorDay]="'Enter a valid day'"
  [errorMonth]="'Enter a valid month'"
  [errorYear]="'Enter a valid year'"
  [dateInputs]="{
    day: { inputId: 'day', inputName: 'day', inputLabel: 'Day', inputClasses: 'govuk-input--width-2' },
    month: { inputId: 'month', inputName: 'month', inputLabel: 'Month', inputClasses: 'govuk-input--width-2' },
    year: { inputId: 'year', inputName: 'year', inputLabel: 'Year', inputClasses: 'govuk-input--width-4' }
  }"
></app-govuk-date-input>
```

### Example in HTML:

```html
<div class="govuk-form-group">
  <fieldset class="govuk-fieldset" role="group" id="passport-issued">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">Passport Issued Date</legend>
    <div class="govuk-hint">For example, 31 3 2023</div>
    <div class="govuk-date-input">
      <div class="govuk-date-input__item">
        <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="day" name="day" type="text" />
        <label class="govuk-label govuk-date-input__label" for="day">Day</label>
      </div>
      <div class="govuk-date-input__item">
        <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="month" name="month" type="text" />
        <label class="govuk-label govuk-date-input__label" for="month">Month</label>
      </div>
      <div class="govuk-date-input__item">
        <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="year" name="year" type="text" />
        <label class="govuk-label govuk-date-input__label" for="year">Year</label>
      </div>
    </div>
  </fieldset>
</div>
```

## Inputs

| Input        | Type     | Description                                                            |
| ------------ | -------- | ---------------------------------------------------------------------- |
| `fieldSetId` | `string` | The ID for the fieldset, used to connect the inputs for accessibility. |
| `legendText` | `string` | The legend text displayed at the top of the fieldset.                  |
| `legendHint` | `string` | Optional hint text displayed beneath the legend.                       |
| `errorDay`   | `string` | Error message for the day input field.                                 |
| `errorMonth` | `string` | Error message for the month input field.                               |
| `errorYear`  | `string` | Error message for the year input field.                                |
| `dateInputs` | `object` | Configuration object for the day, month, and year input fields.        |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-date-input.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use and configure the `govuk-date-input` component, including its input properties for validation, legends, and hints.
