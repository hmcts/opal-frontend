import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-moj-sortable-table',
  standalone: true,
  imports: [],
  templateUrl: './moj-sortable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableComponent {
  @Input() columns!: Array<{ key: string; label: string }>; // Define the columns with keys that match T properties
  @Input() data!: any[]; // The data array to be displayed
  @Input() sortKey!: any; // The current sort key
  @Input() sortDirection!: 'ascending' | 'descending' | 'none'; // The current sort direction, using a union type for simplicity

  @Output() sortChange = new EventEmitter<{ key: string; direction: 'ascending' | 'descending' }>();

  onSortChange(key: string): void {
    const newDirection: 'ascending' | 'descending' =
      this.sortKey === key && this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortChange.emit({ key, direction: newDirection });
  }
}
