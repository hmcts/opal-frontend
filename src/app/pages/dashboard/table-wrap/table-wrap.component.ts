import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractSortableTableComponent } from '@components/abstract/abstract-sortable-table/abstract-sortable-table.component';
import { MojSortableTableHeaderComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-header/moj-sortable-table-header.component';
import { MojSortableTableRowDataComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row-data/moj-sortable-table-row-data.component';
import { MojSortableTableRowComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row.component';
import { MojSortableTableComponent } from '@components/moj/moj-sortable-table/moj-sortable-table.component';
import { ITableComponentTableData, ISortState } from './Interfaces/table-wrap-interfaces';
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

  @Input({ required: true }) set existingSortState(existingSortState: ISortState | null[]) {
    this.abstractExistingSortState = existingSortState;
  }
}
