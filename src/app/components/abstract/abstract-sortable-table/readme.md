---

# Abstract Sortable Table Component

This Angular component serves as a foundational base for managing table sorting functionality. It provides reusable logic for handling table data sorting and is designed to be extended by other table components.

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

To use the `AbstractSortableTableComponent` in your project, extend it in your custom table components to manage sorting functionality in your Angular application.

```typescript
import { AbstractSortableTableComponent } from '@components/abstract/abstract-sortable-table/abstract-sortable-table.component';
```

## Usage

This component is designed to be used as a base class for managing sorting in a reusable and scalable way.

### Example Usage:

```typescript
import { Component } from '@angular/core';
import { AbstractSortableTableComponent } from '@components/abstract/abstract-sortable-table/abstract-sortable-table.component';

@Component({
  selector: 'app-sortable-table',
  templateUrl: './sortable-table.component.html',
})
export class SortableTableComponent extends AbstractSortableTableComponent {
  public abstractTableData = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
  ];

  public abstractExistingSortState = {
    name: 'none',
    age: 'none',
  };
}
```

## Inputs

`AbstractSortableTableComponent` provides key inputs to manage table data and sorting states.

| Input         | Type       | Description                                         |
| ------------- | ---------- | --------------------------------------------------- |
| `abstractTableData`   | `IAbstractTableData[]`| The table data to be displayed and sorted.    |

## Methods

`AbstractSortableTableComponent` provides utility methods for managing sorting logic.

### Common Methods:

- **`createSortState(tableData: IAbstractTableData[])`**: Generates the initial sort state with all columns set to 'none'.
- **`onSortChange(event: { key: string; sortType: 'ascending' | 'descending' })`**: Updates the sorting state and reorders the table data accordingly.
- **`ngOnInit()`**: Lifecycle hook to initialise the sort state.

###Examples

```
onSortChange({ key: 'name', sortType: 'ascending' });
```
## Interfaces

`AbstractSortableTableComponent` uses several interfaces to define table data and sorting state structures.

### Key Interfaces:

1. **Table Data Interface**:
   - `IAbstractTableData`: Represents a row of table data.

2. **Sort State Interface**:
   - `IAbstractSortState`: Tracks the sorting state of each column.

## Mocks

Several mock files are included to simulate table data and sorting behaviours for testing purposes.

### Mock Files:

1. **abstract-sortable-table-data.mock.ts**: Simulates table data scenarios.
2. **abstract-sortable-table-sort-state.mock.ts**: Provides mock sort states for testing.

These mocks can be used in unit tests to validate table sorting behaviour.

## Testing

Unit tests for this component can be found in the `abstract-sortable-table.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

### Testing Scenarios

You can use the mock files to test various scenarios, such as sorting data, managing sort state, and validating table behaviours.

```typescript
import { AbstractSortableTableDataMock } from '@mocks/abstract-sortable-table-data.mock.ts';
// Simulate table sorting scenarios in your tests
```

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that all changes follow Angular best practices and maintain consistency with sorting logic and table management.

---

This `README.md` provides a detailed guide on how to extend and use the `AbstractSortableTableComponent` in your Angular application. It also includes references to interfaces and mocks that support form control, validation, and testing.
