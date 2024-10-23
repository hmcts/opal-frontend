Here is the `README.md` for the `govuk-inset-text` component based on the files you provided:

---

# GOV.UK Inset Text Component

This Angular component renders inset text styled according to GOV.UK standards, used to highlight important information within a bordered box.

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
import { GovukInsetTextComponent } from '@components/govuk/govuk-inset-text/govuk-inset-text.component';
```

## Usage

You can use the inset text component in your template as follows:

```html
<app-govuk-inset-text [insetTextId]="'important-info'">
  <p>This is important information that stands out.</p>
</app-govuk-inset-text>
```

### Example in HTML:

```html
<div class="govuk-inset-text" [id]="insetTextId">
  <ng-content></ng-content>
</div>
```

This component is used to display content inside a GOV.UK-styled inset box, typically for important information or notices.

## Inputs

| Input         | Type     | Description                                            |
| ------------- | -------- | ------------------------------------------------------ |
| `insetTextId` | `string` | The unique ID for the inset text container (optional). |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-inset-text.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `govuk-inset-text` component to display important information in a GOV.UK-styled box【170†source】.
