---

# GOV.UK Select Component

This Angular component provides a GOV.UK-styled select dropdown for selecting from a list of options.

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
import { GovukSelectComponent } from '@components/govuk/govuk-select/govuk-select.component';
```

## Usage

You can use the select component in your template as follows:

```html
<app-govuk-select
  [selectId]="'example-select'"
  [selectOptions]="options"
  [labelText]="'Choose an option'"
></app-govuk-select>
```

### Example in HTML:

```html
<div class="govuk-form-group">
  <label class="govuk-label" for="{{ selectId }}">{{ labelText }}</label>
  <select class="govuk-select" id="{{ selectId }}" name="{{ selectName }}">
    <option *ngFor="let option of selectOptions" [value]="option.value">{{ option.label }}</option>
  </select>
</div>
```

## Inputs

| Input         | Type     | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `selectId`    | `string` | The ID of the select element.                        |
| `selectName`  | `string` | The name attribute for the select input.             |
| `selectOptions`| `Array`  | Array of options where each option has a `label` and `value`. |
| `labelText`   | `string` | The text displayed in the label for the select input.|

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-select.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This template outlines the details for the `govuk-select` component, including installation, inputs, and usage within the Opal frontend codebase.
