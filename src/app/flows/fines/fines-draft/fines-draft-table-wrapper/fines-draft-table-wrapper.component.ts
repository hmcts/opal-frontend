import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal, signal } from '@angular/core';
import { MojSortableTableHeaderComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-header/moj-sortable-table-header.component';
import { MojSortableTableRowDataComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row-data/moj-sortable-table-row-data.component';
import { MojSortableTableRowComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row.component';
import { MojSortableTableComponent } from '@components/moj/moj-sortable-table/moj-sortable-table.component';
import { IFinesDraftTableWrapperTableData } from './interfaces/fines-draft-table-wrapper-table-data.interface';
import { IFinesDraftTableWrapperTableSort } from './interfaces/fines-draft-table-wrapper-table-sort.interface';
import { AbstractSortableTablePaginationComponent } from '@components/abstract/abstract-sortable-table-pagination/abstract-sortable-table-pagination.component';
import { GovukPaginationComponent } from '@components/govuk/govuk-pagination/govuk-pagination.component';

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
export class FinesDraftTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  public override abstractTableDataSignal = signal<IFinesDraftTableWrapperTableData[]>([]);
  public override paginatedTableDataComputed!: Signal<IFinesDraftTableWrapperTableData[]>;
  public override itemsPerPageSignal = signal(25);
  @Input({ required: true }) set tableData(tableData: IFinesDraftTableWrapperTableData[]) {
    this.abstractTableDataSignal.set(tableData);
  }

  @Input({ required: true }) set existingSortState(existingSortState: IFinesDraftTableWrapperTableSort | null) {
    this.abstractExistingSortState = existingSortState;
  }
  @Input({ required: true }) public isApprovedTab: boolean = false;
}
