import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({
  selector: 'app-moj-sortable-table',
  standalone: true,
  templateUrl: './moj-sortable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableComponent {
  @Input() columns!: Array<{ key: string; label: string }>; // Define the columns with keys that match T properties
  @Input() data!: []; // The data array to be displayed
}
