---

# GOV.UK Checkboxes Divider Component

This Angular component provides a divider that can be used within the GOV.UK Checkboxes component to separate groups of checkboxes visually.

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
import { GovukCheckboxesDividerComponent } from '@components/govuk/govuk-checkboxes-divider/govuk-checkboxes-divider.component';
```

## Usage

You can use the checkboxes divider component to visually separate groups of checkboxes. Here's an example of how to use it:

```html
<app-govuk-checkboxes>
  <div class="govuk-checkboxes__item">
    <input class="govuk-checkboxes__input" id="option1" name="options" type="checkbox" value="option1" />
    <label class="govuk-label govuk-checkboxes__label" for="option1">Option 1</label>
  </div>

  <app-govuk-checkboxes-divider></app-govuk-checkboxes-divider>

  <div class="govuk-checkboxes__item">
    <input class="govuk-checkboxes__input" id="option2" name="options" type="checkbox" value="option2" />
    <label class="govuk-label govuk-checkboxes__label" for="option2">Option 2</label>
  </div>
</app-govuk-checkboxes>
```

### Example in HTML:

```html
<div class="govuk-checkboxes__divider">
  <ng-content></ng-content>
</div>
```

This provides a visual divider between checkbox items when needed.

## Inputs

There are no specific inputs for this component as it simply renders a divider between checkboxes.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-checkboxes-divider.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` outlines the functionality and usage of the `govuk-checkboxes-divider` component, which is used to add a visual divider between groups of checkboxes.
