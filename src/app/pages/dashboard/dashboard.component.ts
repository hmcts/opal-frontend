import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { MojSortableTableComponent } from '../../components/moj/moj-sortable-table/moj-sortable-table.component';
import { MojSortableTableHeaderComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-header/moj-sortable-table-header.component';
import { MojSortableTableRowComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row.component';
import { MojSortableTableRowDataComponent } from '@components/moj/moj-sortable-table/moj-sortable-table-row/moj-sortable-table-row-data/moj-sortable-table-row-data.component';
import { CommonModule } from '@angular/common';
import { SortService } from '@services/sort-service/sort-service';
interface TableData {
  imposition: string;
  creditor: string;
  amountImposed: number;
  amountPaid: number;
  balanceRemaining: number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly globalStateService = inject(GlobalStateService);
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;

  public active: string = 'nav1';
  tableData = [
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

  sortedData = [];
  constructor(private readonly sortService: SortService) {}

  // Handle the sorting event
  onSortChange(event: { key: string; sortType: 'asc' | 'desc' }): void {
    console.log('Sort Event Received:', event); // Debug log for event details
    const { key, sortType } = event;

    sortType === 'asc'
      ? console.log(this.sortService.sortObjectsAsc(this.tableData, key))
      : console.log(this.sortService.sortObjectsDsc(this.tableData, key));

    console.log('Updated Sorted Data:', this.sortedData); // Debug log for sorted data
  }
}
