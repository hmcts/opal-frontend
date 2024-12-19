import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractSortableTableComponent } from '@components/abstract/abstract-sortable-table/abstract-sortable-table.component';
import { MojSortableTableHeaderComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-header/moj-sortable-table-header.component';
import { MojSortableTableRowDataComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row-data/moj-sortable-table-row-data.component';
import { MojSortableTableRowComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row.component';
import { MojSortableTableComponent } from '@components/moj/moj-sortable-table/moj-sortable-table.component';
import { IFinesDraftTableWrapperTableData } from './interfaces/fines-draft-table-wrapper-table-data.interface';
import { IFinesDraftTableWrapperTableSort } from './interfaces/fines-draft-table-wrapper-table-sort.interface';
import { GovukPaginationComponent } from '../../../../components/govuk/govuk-pagination/govuk-pagination.component';

@Component({
  selector: 'app-fines-draft-table-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    GovukPaginationComponent,
  ],
  templateUrl: './fines-draft-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftTableWrapperComponent extends AbstractSortableTableComponent {
  public override abstractTableData!: IFinesDraftTableWrapperTableData[];
  @Input({ required: true }) set tableData(tableData: IFinesDraftTableWrapperTableData[]) {
    this.abstractTableData = tableData;
  }

  @Input({ required: true }) set existingSortState(existingSortState: IFinesDraftTableWrapperTableSort | null) {
    this.abstractExistingSortState = existingSortState;
  }
  @Input({ required: true }) public isApprovedTab: boolean = false;
  @Output() public linkClicked = new EventEmitter<number>();

  /**
   * Handles the click event on a defendant.
   * Emits the clicked defendant's ID.
   *
   * @param {number} id - The ID of the clicked defendant.
   * @returns {void}
   */
  public onDefendantClick(id: number): void {
    this.linkClicked.emit(id);
  }
}
