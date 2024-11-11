import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { MojSortableTableComponent } from '../../components/moj/moj-sortable-table/moj-sortable-table.component';

interface ExampleData {
  name: string;
  age: number;
  occupation: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, MojSortableTableComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public readonly globalStateService = inject(GlobalStateService);
  public readonly finesRoutingPaths = FINES_ROUTING_PATHS;

  public active: string = 'nav1';

  // Defining the columns to be displayed in the table, using keys that match properties of the ExampleData interface
  tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'occupation', label: 'Occupation' },
  ];

  // Data to be displayed in the table
  data: ExampleData[] = [
    { name: 'Alice', age: 30, occupation: 'Engineer' },
    { name: 'Bob', age: 25, occupation: 'Designer' },
    { name: 'Charlie', age: 35, occupation: 'Manager' },
  ];

  // State for current sort key and direction
  currentSortKey: any = 'name';
  currentSortDirection: 'ascending' | 'descending' | 'none' = 'none';

  // Getter for sorted data, applies sorting logic whenever sort key or direction changes
  get sortedData(): ExampleData[] {
    return this.data.slice().sort((a: any, b: any) => {
      const key = this.currentSortKey;
      if (a[key] < b[key]) {
        return this.currentSortDirection === 'ascending' ? -1 : 1;
      } else if (a[key] > b[key]) {
        return this.currentSortDirection === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  // Method to handle sort change events emitted by the child component
  onSortChange(event: { key: string; direction: 'ascending' | 'descending' }): void {
    this.currentSortKey = event.key;
    this.currentSortDirection = event.direction;
  }
}
