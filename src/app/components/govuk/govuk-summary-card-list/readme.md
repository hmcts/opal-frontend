---

# GOV.UK Summary Card List Component

This Angular component is used to render a list of summary cards, each card providing a summary of key information with GOV.UK styling.

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
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
```

## Usage

You can use the summary card list component in your template as follows:

```html
<app-govuk-summary-card-list [cards]="summaryCards"></app-govuk-summary-card-list>
```

### Example in HTML:

```html
<ul class="govuk-summary-card-list">
  <li *ngFor="let card of cards" class="govuk-summary-card">
    <!-- Card content here -->
    <app-govuk-summary-card [card]="card"></app-govuk-summary-card>
  </li>
</ul>
```

## Inputs

| Input   | Type    | Description                                                                                                    |
| ------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `cards` | `Array` | An array of card objects to display. Each card contains a title, description, and any other necessary details. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-summary-card-list.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use the `govuk-summary-card-list` component to display a list of summary cards with key information.
