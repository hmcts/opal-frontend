---

# GOV.UK Checkboxes Component

This Angular component wraps the GOV.UK Checkboxes, providing a customizable way to handle multiple checkboxes with additional legend and hint features.

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
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
```

## Usage

You can use the checkboxes component in your template as follows:

```html
<app-govuk-checkboxes
  [fieldSetId]="'exampleFieldSet'"
  [legendText]="'Choose your options'"
  [legendHint]="'You can select multiple options'"
>
  <!-- Individual checkboxes go here -->
  <div class="govuk-checkboxes__item">
    <input class="govuk-checkboxes__input" id="option1" name="options" type="checkbox" value="option1" />
    <label class="govuk-label govuk-checkboxes__label" for="option1">Option 1</label>
  </div>
  <div class="govuk-checkboxes__item">
    <input class="govuk-checkboxes__input" id="option2" name="options" type="checkbox" value="option2" />
    <label class="govuk-label govuk-checkboxes__label" for="option2">Option 2</label>
  </div>
</app-govuk-checkboxes>
```

### Example in HTML:

```html
<div class="govuk-form-group">
  <fieldset class="govuk-fieldset" [id]="fieldSetId" [attr.aria-describedby]="fieldSetId">
    <legend
      class="govuk-fieldset__legend {{ legendClasses }}"
      [attr.describedby]="fieldSetId"
    >
      {{ legendText }}
    </legend>

    <div class="govuk-hint" *ngIf="legendHint">{{ legendHint }}</div>

    <div class="govuk-checkboxes {{ checkboxClasses }}" data-module="govuk-checkboxes">
      <ng-content></ng-content>
    </div>
  </fieldset>
</div>
```

## Inputs

| Input             | Type     | Description                                                                   |
| ----------------- | -------- | ----------------------------------------------------------------------------- |
| `fieldSetId`      | `string` | The ID of the fieldset, used to create a unique ARIA label for accessibility. |
| `legendText`      | `string` | The legend or title for the checkbox group.                                   |
| `legendHint`      | `string` | An optional hint text displayed under the legend.                             |
| `checkboxClasses` | `string` | Additional CSS classes to apply to the checkboxes.                            |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-checkboxes.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` outlines the key inputs, structure, and usage details of the `govuk-checkboxes` component, along with how to customize it using inputs like `legendText`, `legendHint`, and others.
