---

# GOV.UK Radios Conditional Component

This Angular component extends the GOV.UK-styled radios component to support conditional content that is shown or hidden based on the selection of a radio option.

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
import { GovukRadiosConditionalComponent } from '@components/govuk/govuk-radios-conditional/govuk-radios-conditional.component';
```

## Usage

You can use the radios conditional component in your template as follows:

```html
<app-govuk-radios-conditional>
  <!-- Conditional content here -->
  <div class="govuk-radios__conditional">
    <p>This content is displayed conditionally based on the selected radio option.</p>
  </div>
</app-govuk-radios-conditional>
```

### Example in HTML:

```html
<ng-content></ng-content>
```

This component allows you to add conditional content inside a radio button group that is displayed or hidden based on the user's selection.

## Inputs

There are no specific inputs for this component as it is used to render conditional content based on radio selections.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-radios-conditional.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of the `govuk-radios-conditional` component and explains how to use it for displaying conditional content based on radio button selections.
