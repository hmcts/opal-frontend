import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExampleData } from './interfaces/moj-sortable-table-interface';
@Component({
  selector: 'app-moj-sortable-table',
  standalone: true,
  templateUrl: './moj-sortable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableComponent {
  @Input() columns!: Array<{ key: string; label: string }>; // Define the columns with keys that match T properties
  @Input() data!: ExampleData[]; // The data array to be displayed
}
