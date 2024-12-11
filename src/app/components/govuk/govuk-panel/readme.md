---

# GOV.UK Panel Component

This Angular component renders a GOV.UK-styled panel, typically used to display important messages or confirmation details in a prominent way.

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
import { GovukPanelComponent } from '@components/govuk/govuk-panel/govuk-panel.component';
```

## Usage

You can use the panel component in your template as follows:

```html
<app-govuk-panel [panelTitle]="'Success'">
  <div>Your registration was successful.</div>
</app-govuk-panel>
```

### Example in HTML:

```html
<div class="govuk-panel govuk-panel--confirmation">
  <h1 class="govuk-panel__title">{{ panelTitle }}</h1>
  <div class="govuk-panel__body">
    <ng-content></ng-content>
  </div>
</div>
```

This component renders a confirmation panel with a customizable title and content inside the panel's body.

## Inputs

| Input        | Type     | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| `panelTitle` | `string` | The title displayed in the panel (optional). |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-panel.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use the `govuk-panel` component, including configuring its title and displaying content inside a GOV.UK-styled panel.
