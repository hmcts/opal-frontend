---

# MOJ Date Picker Component

This Angular component provides a Ministry of Justice (MOJ)-styled date picker, allowing users to select dates with a user-friendly interface.

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
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
```

## Usage

You can use the date picker component in your template as follows:

```html
<app-moj-date-picker [labelText]="'Select a date'" [dateFormat]="'dd/mm/yyyy'"></app-moj-date-picker>
```

### Example in HTML:

```html
<div class="moj-date-picker">
  <label class="govuk-label">{{ labelText }}</label>
  <input class="govuk-input" type="text" [attr.placeholder]="dateFormat" />
</div>
```

## Inputs

| Input        | Type     | Description                                                    |
| ------------ | -------- | -------------------------------------------------------------- |
| `labelText`  | `string` | The label for the date picker.                                 |
| `dateFormat` | `string` | The format to display and input the date (e.g., 'dd/mm/yyyy'). |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-date-picker.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use and configure the `moj-date-picker` component for selecting dates in an MOJ-styled interface.
