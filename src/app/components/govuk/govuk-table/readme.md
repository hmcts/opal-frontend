---

# GOV.UK Table Component

This Angular component renders a GOV.UK-styled table for displaying tabular data, following the GOV.UK design system.

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
import { GovukTableComponent } from '@components/govuk/govuk-table/govuk-table.component';
```

## Usage

You can use the table component in your template as follows:

```html
<app-govuk-table>
  <ng-container header>
    <th scope="col" class="govuk-table__header">TEST</th>
    <th scope="col" class="govuk-table__header">TEST</th>
    <th scope="col" class="govuk-table__header">TEST</th>
    <th scope="col" class="govuk-table__header">TEST</th>
    <th scope="col" class="govuk-table__header">TEST</th>
  </ng-container>
  <ng-container body>
    <td class="govuk-table__cell" id="imposition">
      {{ 'NULL' }}
    </td>

    <td class="govuk-table__cell" id="creditor">{{ 'NULL' }}</td>
    <td class="govuk-table__cell" id="amountImposed">
      {{ 'NULL' }}
    </td>
    <td class="govuk-table__cell" id="amountPaid">
      {{ 'NULL' }}
    </td>
    <td class="govuk-table__cell" id="balanceRemaining">
      {{ 'NULL' }}
    </td>
  </ng-container>
</app-govuk-table>
```

### Example in HTML:

```html
<table class="govuk-table">
  <caption class="govuk-table__caption">
    {{ caption }}
  </caption>
  <thead class="govuk-table__head">
    <tr class="govuk-table__row">
      <th *ngFor="let header of headers" class="govuk-table__header">{{ header }}</th>
    </tr>
  </thead>
  <tbody class="govuk-table__body">
    <tr *ngFor="let row of rows" class="govuk-table__row">
      <td *ngFor="let cell of row" class="govuk-table__cell">{{ cell }}</td>
    </tr>
  </tbody>
</table>
```

## Inputs

| Input     | Type     | Description                                           |
| --------- | -------- | ----------------------------------------------------- |
| `caption` | `string` | Caption displayed at the top of the table (optional). |
| `headers` | `Array`  | Array of header names for each column.                |
| `rows`    | `Array`  | Array of arrays, each representing a row of data.     |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-table.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use the `govuk-table` component to display tabular data using the GOV.UK design system.
