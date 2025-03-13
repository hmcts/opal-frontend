import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-sortable-table-status',
  standalone: true,
  templateUrl: './moj-sortable-table-status.component.html',
})
export class MojSortableTableStatusComponent {
  @Input({ required: false }) public columnTitle!: string;
  @Input({ required: false }) public sortDirection!: 'ascending' | 'descending' | 'none';
}
