---

# GOV.UK Summary List Row Component

This Angular component represents an individual row in a GOV.UK-styled summary list, displaying a key-value pair along with optional actions.

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
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list-row/govuk-summary-list-row.component';
```

## Usage

You can use the summary list row component in your template as follows:

```html
<app-govuk-summary-list-row [key]="'Full name'" [value]="'John Doe'">
  <ng-container actions>
    <a href="/edit-name">Change</a>
  </ng-container>
</app-govuk-summary-list-row>
```

### Example in HTML:

```html
<div class="govuk-summary-list__row">
  <dt class="govuk-summary-list__key">{{ key }}</dt>
  <dd class="govuk-summary-list__value">{{ value }}</dd>
  <dd class="govuk-summary-list__actions">
    <ng-content select="[actions]"></ng-content>
  </dd>
</div>
```

## Inputs

| Input   | Type     | Description                                   |
| ------- | -------- | --------------------------------------------- |
| `key`   | `string` | The label or key for the summary list item.   |
| `value` | `string` | The value or content associated with the key. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-summary-list-row.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `govuk-summary-list-row` component for displaying individual rows in a GOV.UK-styled summary list.
