---

# Alphagov Accessible Autocomplete Component

This Angular component provides an accessible autocomplete input field styled with GOV.UK standards, allowing users to search and select options from a list.

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
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov/alphagov-accessible-autocomplete/alphagov-accessible-autocomplete.component';
```

## Usage

You can use the accessible autocomplete component in your template as follows:

```html
<app-alphagov-accessible-autocomplete
  [autoCompleteId]="'autocomplete'"
  [labelText]="'Search'"
  [hintText]="'Start typing to search'"
  [errors]="'Please select an option'"
  [inputName]="'search'"
></app-alphagov-accessible-autocomplete>
```

### Example in HTML:

```html
<div class="govuk-form-group" [class.govuk-form-group--error]="!!errors">
  <label class="govuk-label {{ labelClasses }}" [for]="autoCompleteId">{{ labelText }}</label>
  <div id="{{ inputId }}-hint" *ngIf="hintText" class="govuk-hint">{{ hintText }}</div>

  <p *ngIf="errors" id="{{ autoCompleteId }}-error-message" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error: </span> {{ errors }}
  </p>

  <div #autocomplete id="{{ autoCompleteId }}-container" class="{{ inputClasses }}"></div>
  <input [id]="inputId" [name]="inputName" type="hidden" [formControl]="getControl" />
</div>
```

## Inputs

| Input           | Type     | Default      | Description                                                                 |
| --------------- | -------- | ------------ | --------------------------------------------------------------------------- |
| `autoCompleteId`| `string` | `'autocomplete'` | The ID of the autocomplete container.                                         |
| `labelText`     | `string` | `'Search'`   | The label for the autocomplete input field.                                   |
| `hintText`      | `string` | `''`         | Optional hint text displayed under the label.                                 |
| `errors`        | `string` | `''`         | Error message to display if validation fails.                                 |
| `inputName`     | `string` | `''`         | The name attribute for the hidden input element.                              |
| `inputId`       | `string` | `'autocomplete-input'` | The ID for the hidden input field.                                              |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `alphagov-accessible-autocomplete.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `alphagov-accessible-autocomplete` component, providing accessible search functionality in a GOV.UK-styled form.
