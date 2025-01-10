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
  public abstractTableData = signal([
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
    { name: 'Diana', age: 28 },
    { name: 'Eve', age: 32 },
  ]);

  public abstractExistingSortState = {
    name: 'none',
    age: 'none',
  };

  public abstractTablePaginatedItemsPerPage = signal(5);
  public abstractTablePaginatedCurrentPage = signal(1);
  public abstractTablePaginatedData = signal<IAbstractTableData[]>([]);
}
```

## Inputs

`AbstractSortableTablePaginationComponent` provides key inputs to manage table data and sorting states.

| Input                                | Type                           | Description                                                  |
| ------------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| `abstractTablePaginatedCurrentPage`  | `signal<number>`               | Tracks the current page in the pagination.                   |
| `abstractTablePaginatedItemsPerPage` | `signal<number>`               | Specifies the number of items per page.                      |
| `abstractTablePaginatedStartIndex`   | `signal<number>`               | Indicates the start index of the items for the current page. |
| `abstractTablePaginatedEndIndex`     | `signal<number>`               | Indicates the end index of the items for the current page.   |
| `abstractTablePaginatedData`         | `signal<IAbstractTableData[]>` | Contains the paginated table data.                           |

## Methods

`AbstractSortableTablePaginationComponent` introduces additional methods for managing pagination while retaining sorting logic.

### Common Methods:

- **`updatePaginatedData()`**:
  Updates the paginated data based on the current page and items per page. Bound to an effect for automatic updates.
- **`onPageChange(newPage: number)`**: Updates the current page and recalculates the table data to be displayed.

###Examples

```
onPageChange(2); // Switches to page 2
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
