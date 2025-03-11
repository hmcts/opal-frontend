# Abstract Sortable Table Pagination Component

This Angular component extends the functionality of the `AbstractSortableTableComponent` to include pagination capabilities. It provides reusable logic for handling table data sorting and pagination, making it ideal for components that require both functionalities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Methods](#methods)
- [Interfaces](#interfaces)
- [Mocks](#mocks)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractSortableTablePaginationComponent` in your project, extend it in your custom table components to manage sorting and pagination in your Angular application.

```typescript
import { AbstractSortableTablePaginationComponent } from '@components/abstract/abstract-sortable-table-pagination/abstract-sortable-table-pagination.component';
```

## Usage

This component is designed to be used as a base class for managing sorting and pagination in a reusable and scalable way.

### Dynamic Data

If the table data is fetched asynchronously, ensure that `abstractTableDataSignal` is updated reactively:

```typescript
fetchData(): void {
  this.isLoading = true;
  this.error = null;

  fetch('/api/data')
    .then((response) => response.json())
    .then((data) => {
      this.abstractTableDataSignal.set(data);
      this.isLoading = false;
    })
    .catch((err) => {
      this.error = 'Failed to load data.';
      this.isLoading = false;
    });
}

```

### Example Usage:

#### Pagination Component

The `app-govuk-pagination` component renders pagination controls. Ensure that the bindings (`currentPage`, `limit`, and `total`) are correctly connected to the signals in your component. The `changePage` event updates the `currentPageSignal` signal to reflect the new page.

```typescript
@Component({
  selector: 'app-sortable-table-pagination',
  templateUrl: './sortable-table-pagination.component.html',
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    GovukPaginationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableTablePaginationComponent extends AbstractSortableTablePaginationComponent {
  // Define the full dataset for the table (Angular Signal for reactivity)
  public abstractTableDataSignal = signal([
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
    { name: 'Diana', age: 28 },
    { name: 'Eve', age: 32 },
  ]);

  // Initial sort state for the columns
  public abstractExistingSortState = {
    name: 'none',
    age: 'none',
  };

  constructor() {
    super();
    // Signals to manage pagination
    this.currentPageSignal = signal(1);
    this.itemsPerPageSignal = signal(5);
  }
}
```

```html
<app-moj-sortable-table>
  <ng-container head>
    <th
      app-moj-sortable-table-header
      columnKey="name"
      [sortDirection]="sortStateSignal()['name']"
      (sortChange)="onSortChange($event)"
    >
      Name
    </th>
    <th
      app-moj-sortable-table-header
      columnKey="age"
      [sortDirection]="sortStateSignal()['age']"
      (sortChange)="onSortChange($event)"
    >
      Age
    </th>
  </ng-container>
  <ng-container row>
    @for (row of paginatedTableDataComputed(); track row.name) {
    <tr app-moj-sortable-table-row>
      <td app-moj-sortable-table-row-data id="name">{{ row.name }}</td>
      <td app-moj-sortable-table-row-data id="defendant">{{ row.age }}</a>
    </tr>
    }
  </ng-container>
</app-moj-sortable-table>
@if (abstractTableDataSignal()!.length > this.paginatedTableDataComputed().length) {
<app-govuk-pagination
  [currentPage]="currentPageSignal()"
  [limit]="itemsPerPageSignal()"
  [total]="abstractTableDataSignal().length"
  (changePage)="onPageChange($event)"
></app-govuk-pagination>
}
```

## Inputs

The following signals and computed properties are available to manage table data and pagination:

### Signals

| Input                     | Type                           | Description                                               |
| ------------------------- | ------------------------------ | --------------------------------------------------------- |
| `currentPageSignal`       | `signal<number>`               | Tracks the current page in the pagination.                |
| `itemsPerPageSignal`      | `signal<number>`               | Specifies the number of items per page.                   |
| `abstractTableDataSignal` | `signal<IAbstractTableData[]>` | Holds the full dataset for the table, updated reactively. |

### Computed Properties

Computed properties reactively calculate their values based on signals and other computed properties. For example:

- `paginatedTableDataComputed` depends on `abstractTableDataSignal`, `startIndexComputed`, and `endIndexComputed`.
- Changes to any of these dependencies automatically update `paginatedTableDataComputed`.

| Property                     | Type                             | Description                                                                                                            |
| ---------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `startIndexComputed`         | `computed<number>`               | The 1-based index of the first item on the current page. Depends on `currentPageSignal` and `itemsPerPageSignal`.      |
| `endIndexComputed`           | `computed<number>`               | The 1-based index of the last item on the current page. Depends on `startIndexComputed` and `abstractTableDataSignal`. |
| `paginatedTableDataComputed` | `computed<IAbstractTableData[]>` | Combines sorting and pagination. Depends on `abstractTableDataSignal`, `startIndexComputed`, and `endIndexComputed`.   |

> **Note**: Signals (`currentPageSignal`, `itemsPerPageSignal`, `abstractTableDataSignal`) are Angular reactive properties that trigger re-computation of dependent computed properties like `paginatedTableDataComputed` whenever they are updated.

## Methods

`AbstractSortableTablePaginationComponent` introduces additional methods for managing pagination while retaining sorting logic.

### Common Methods:

- **`onPageChange(newPage: number)`**: Updates the current page and recalculates the table data to be displayed.
- **`onSortChange(event: { key: string; sortType: 'ascending' | 'descending' })`**:
  Updates the sort state for the table and resets the pagination to the first page. This ensures that the user always starts from the beginning of the dataset when a new sorting order is applied.

### Examples

- **Change Page**:
  ```typescript
  component.onPageChange(2); // Switches to page 2
  ```
- **Sort Table**:
  ```typescript
  component.onSortChange({ key: 'name', sortType: 'ascending' });
  // Sorts the table by the 'name' column in ascending order and resets to page 1.
  ```

## Interfaces

`AbstractSortableTablePaginationComponent` uses interfaces to represent table data and sorting state.

### Key Interfaces:

1. **Table Data Interface**:

   - `IAbstractTableData`: Represents a row of table data.

2. **Sort State Interface**:
   - `IAbstractSortState`: Tracks the sorting state of each column.

## Mocks

Several mock files are included to simulate table data, sorting behaviours, and pagination scenarios for testing purposes.

### Mock Files:

1. **abstract-sortable-table-data.mock.ts**: Simulates table data scenarios.
2. **abstract-sortable-table-sort-state.mock.ts**: Provides mock sort states for testing.

These mocks can be used in unit tests to validate table sorting and pagination behaviour.

## Testing

Unit tests for this component can be found in the `abstract-sortable-table-pagination.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

### Testing Scenarios

Use the mock files provided to test various scenarios, such as:

- Sorting data by different columns and verifying the updated order.
- Changing the current page and validating that the correct data subset is displayed.
- Adjusting the number of items per page and ensuring the table updates accordingly.
- **Dynamic Data Updates**: Verify that `paginatedTableDataComputed` updates correctly when `abstractTableDataSignal` changes dynamically (e.g., after an API call).

### Additional Testing Scenarios

- **Empty Datasets**: Ensure the component gracefully handles cases where the dataset is empty and displays a "No data available" message.
- **Large Datasets**: Test performance and correctness with datasets containing thousands of rows.
- **Custom Sorting Keys**: Validate that sorting logic works with non-numeric or complex keys, such as dates or nested object properties.

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that all changes follow Angular best practices and maintain consistency with sorting and pagination logic.

### Prerequisites

This component is compatible with Angular 16 and above, as it uses Angular Signals and standalone components.

---

This `README.md` provides a detailed guide on how to extend and use the `AbstractSortableTablePaginationComponent` in your Angular application. It also includes references to interfaces and mocks that support table sorting, pagination, and testing.
