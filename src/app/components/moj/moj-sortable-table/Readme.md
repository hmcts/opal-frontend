---

# MOJ Sortable Table Component

This Angular component provides a Ministry of Justice (MOJ)-styled Sortable table.

## Table of Contents

- [Usage](#usage)
- [Inputs](#inputs)
- [Testing](#testing)
- [Contributing](#contributing)

## Usage

#First you have to create a new component called wrapper for your sortable table component It should be something like this.This should be seperate from your parent component.


```typescript
    import { CommonModule } from '@angular/common';
    import { Component, Input, OnInit } from '@angular/core';
    import { AbstractSortableTableComponent } from '@components/abstract/abstract-sortable-table/abstract-sortable-table.component';
    import { MojSortableTableHeaderComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-header/moj-sortable-table-header.component';
    import { MojSortableTableRowDataComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row-data/moj-sortable-table-row-data.component';
    import { MojSortableTableRowComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row.component';
    import { MojSortableTableComponent } from '@components/moj/moj-sortable-table/moj-sortable-table.component';
    import { ITableComponentTableData, ISortState } from './Interfaces/table-wrap-interfaces';
    import { IObjectSortableInterface } from '@services/sort-service/interfaces/sort-service-interface';
    @Component({
    selector: 'app-table-wrap',
    standalone: true,
    imports: [
        CommonModule,
        MojSortableTableComponent,
        MojSortableTableHeaderComponent,
        MojSortableTableRowComponent,
        MojSortableTableRowDataComponent,
    ],
    templateUrl: './table-wrap.component.html',
    })
    export class TableWrapComponent extends AbstractSortableTableComponent implements OnInit {
    @Input({ required: true }) set tableData(tableData: ITableComponentTableData[]) {
        this.abstractTableData = tableData;
    }

    @Input({ required: true }) set existingSortState(existingSortState: ISortState | null) {
        this.abstractExistingSortState = existingSortState;
    }
    }

```
#Then In the wrapper HTML element,  you have to create the sortable table columns and rows like this.

```html

<app-moj-sortable-table>
  <ng-container head>
    <th
      app-moj-sortable-table-header
      columnKey="imposition"
      [sortDirection]="sortState['imposition']"
      (sortChange)="onSortChange($event)"
    >
      Imposition
    </th>
    <th
      app-moj-sortable-table-header
      columnKey="creditor"
      [sortDirection]="sortState['creditor']"
      (sortChange)="onSortChange($event)"
    >
      Creditor
    </th>
    <th
      app-moj-sortable-table-header
      columnKey="amountImposed"
      [sortDirection]="sortState['amountImposed']"
      (sortChange)="onSortChange($event)"
    >
      Amount imposed
    </th>
    <th
      app-moj-sortable-table-header
      columnKey="amountPaid"
      [sortDirection]="sortState['amountPaid']"
      (sortChange)="onSortChange($event)"
    >
      Amount paid
    </th>
    <th
      app-moj-sortable-table-header
      columnKey="balanceRemaining"
      [sortDirection]="sortState['balanceRemaining']"
      (sortChange)="onSortChange($event)"
    >
      Balance remaining
    </th>
  </ng-container>
  <ng-container row>
    @for (row of abstractTableData; track row) {
      <tr app-moj-sortable-table-row>
        <td app-moj-sortable-table-row-data id="imposition">{{ row['imposition'] }}</td>
        <td app-moj-sortable-table-row-data id="creditor">
          {{
            row['creditor'] === 'major'
              ? 'Major Creditor'
              : row['creditor'] === 'minor'
                ? 'Minor Creditor'
                : 'Default Creditor'
          }}
        </td>
        <td app-moj-sortable-table-row-data id="amountImposed">{{ row['amountImposed'] }}</td>
        <td app-moj-sortable-table-row-data id="amountPaid">{{ row['amountPaid'] }}</td>
        <td app-moj-sortable-table-row-data id="balanceRemaining">{{ row['balanceRemaining'] }}</td>
      </tr>
    }
  </ng-container>
</app-moj-sortable-table>


```

#These are some of the interfaces you will need to create for your component.
```typescript
    import { ISortStateInterface } from '@components/abstract/abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';
    import { IObjectSortableInterface } from '@services/sort-service/interfaces/sort-service-interface';

    export interface ITableComponentTableData extends IObjectSortableInterface<string | number> {
    imposition: string;
    creditor: string;
    amountImposed: number;
    amountPaid: number;
    balanceRemaining: number;
    }

    export interface ISortState extends ISortStateInterface {
    imposition: 'ascending' | 'descending' | 'none';
    creditor: 'ascending' | 'descending' | 'none';
    amountImposed: 'ascending' | 'descending' | 'none';
    amountPaid: 'ascending' | 'descending' | 'none';
    balanceRemaining: 'ascending' | 'descending' | 'none';
    }
```

#In your parent component you need to have the data you will be passing in. Such as


```typescript

    tableData: ITableComponentTableData[] = [
        {
        imposition: 'Imposition 1',
        creditor: 'major',
        amountImposed: 1000,
        amountPaid: 200,
        balanceRemaining: 800,
        },
        {
        imposition: 'Imposition 2',
        creditor: 'minor',
        amountImposed: 1500,
        amountPaid: 500,
        balanceRemaining: 1000,
        },
        {
        imposition: 'Imposition 3',
        creditor: 'default',
        amountImposed: 2000,
        amountPaid: 1000,
        balanceRemaining: 1000,
        },
    ];

    public existingState: ISortState = {
        imposition: 'ascending',
        creditor: 'none',
        amountImposed: 'none',
        amountPaid: 'none',
        balanceRemaining: 'none',
    };

    public handleEmit($event: any): void {
        console.log('Emit', $event);
    }
    }

```

#Then you need to forge them all together with the table wrapping component in the parent html.

```html
    <app-table-wrap
    [tableData]="tableData"
    [existingSortState]="existingState"
    (abstractSortState)="handleEmit($event)"
    ></app-table-wrap>

```





## Inputs

| Input             | Type    | Description                                                    |
| ----------------- | ------- | -------------------------------------------------------------- |
| `tableData` | `obj` | Object of key:value pairs representing a table. |
| `existingSortState` | `obj` | Object of key:value pairs representing a state of sorting. |




## Testing

Unit tests for this component can be found in the `moj-primary-navigation.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use and configure the `moj-primary-navigation` component to display a primary navigation bar for MOJ applications.
