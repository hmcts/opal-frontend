import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractSortableTableComponent } from '@components/abstract/abstract-sortable-table/abstract-sortable-table.component';
import { MojSortableTableHeaderComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-header/moj-sortable-table-header.component';
import { MojSortableTableRowDataComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row-data/moj-sortable-table-row-data.component';
import { MojSortableTableRowComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row.component';
import { MojSortableTableComponent } from '@components/moj/moj-sortable-table/moj-sortable-table.component';

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
  // TODO: Create table data interface to match the data structure
  @Input({ required: true }) set tableData(tableData: any | null) {
    this.abstractTableData = tableData;
  }

  //TODO: Create sort state interface to match the data structure
  @Input({ required: true }) set existingSortState(existingSortState: any | null) {
    this.abstractExistingSortState = existingSortState;
  }
}
