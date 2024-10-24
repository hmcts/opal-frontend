---

# GOV.UK Radios Divider Component

This Angular component provides a divider for the GOV.UK-styled radios, helping visually separate radio button groups.

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
import { GovukRadiosDividerComponent } from '@components/govuk/govuk-radio/govuk-radios-divider/govuk-radios-divider.component';
```

## Usage

You can use the radios divider component in your template as follows:

```html
<app-govuk-radios-divider></app-govuk-radios-divider>
```

### Example in HTML:

```html
<div class="govuk-radios__divider">
  <ng-content></ng-content>
</div>
```

This component is typically used within a radio button group to create a visual separation between different sets of options.

## Inputs

There are no specific inputs for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-radios-divider.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides details on how to use the `govuk-radios-divider` component to visually separate groups of radio buttons within a form.
