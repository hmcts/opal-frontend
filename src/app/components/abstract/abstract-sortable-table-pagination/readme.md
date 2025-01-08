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

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@components/abstract/abstract-sortable-table-pagination/abstract-sortable-table-pagination.component';

@Component({
  selector: 'app-sortable-table-pagination',
  templateUrl: './sortable-table-pagination.component.html',
})
export class SortableTablePaginationComponent extends AbstractSortableTablePaginationComponent {
  public abstractTableData = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
    { name: 'Diana', age: 28 },
    { name: 'Eve', age: 32 },
  ];

  public abstractExistingSortState = {
    name: 'none',
    age: 'none',
  };

  public abstractPageSize = 2;
  public abstractCurrentPage = 1;
}
```

## Inputs

`AbstractSortableTablePaginationComponent` provides key inputs to manage table data and sorting states.

| Input                       | Type                   | Description                                      |
| --------------------------- | ---------------------- | ------------------------------------------------ |
| `abstractTableData`         | `IAbstractTableData[]` | The table data to be displayed and sorted.       |
| `abstractExistingSortState` | `IAbstractSortState`   | The initial sorting state for the table columns. |
| `abstractPageSize`          | `number`               | The number of rows to display per page.          |
| `abstractCurrentPage`       | `number`               | The current page number.                         |

## Methods

`AbstractSortableTablePaginationComponent` introduces additional methods for managing pagination while retaining sorting logic.

### Common Methods:

- **`createSortState(tableData: IAbstractTableData[])`**: Generates the initial sort state with all columns set to 'none'.
- **`onSortChange(event: { key: string; sortType: 'ascending' | 'descending' })`**: Updates the sorting state and reorders the table data accordingly.
- **`onPageChange(newPage: number)`**: Updates the current page and recalculates the table data to be displayed.
- **`ngOnInit()`**: Lifecycle hook to initialise the sort state and pagination.

###Examples

```
onPageChange(2); // Switches to page 2
onSortChange({ key: 'name', sortType: 'ascending' }); // Sorts by name in ascending order
```

## Interfaces

`AbstractSortableTablePaginationComponent` uses the same interfaces for sorting as `AbstractSortableTableComponent` but also includes pagination-related interfaces.

### Key Interfaces:

1. **Table Data Interface**:

   - `IAbstractTableData`: Represents a row of table data.

2. **Sort State Interface**:

   - `IAbstractSortState`: Tracks the sorting state of each column.

3. **Pagination Interface**:
   - `IAbstractPaginationState`: Manages the current page and page size.

## Mocks

Several mock files are included to simulate table data, sorting behaviours, and pagination scenarios for testing purposes.

### Mock Files:

1. **abstract-sortable-table-data.mock.ts**: Simulates table data scenarios.
2. **abstract-sortable-table-sort-state.mock.ts**: Provides mock sort states for testing.
3. **abstract-pagination-state.mock.ts**:Mocks pagination state for testing.

These mocks can be used in unit tests to validate table sorting and pagination behaviour.

## Testing

Unit tests for this component can be found in the `abstract-sortable-table-pagination.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

### Testing Scenarios

You can use the mock files to test various scenarios, such as sorting data, managing pagination state, and validating table behaviours.

```typescript
import { AbstractPaginationStateMock } from '@mocks/abstract-pagination-state.mock.ts';
// Simulate pagination scenarios in your tests
```

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that all changes follow Angular best practices and maintain consistency with sorting and pagination logic.

---

This `README.md` provides a detailed guide on how to extend and use the `AbstractSortableTablePaginationComponent` in your Angular application. It also includes references to interfaces and mocks that support table sorting, pagination, and testing.
