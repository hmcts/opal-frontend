import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Column } from './interfaces/moj-sortable-table-interface';
@Component({
  selector: 'app-moj-sortable-table',
  standalone: true,
  templateUrl: './moj-sortable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableComponent {
  @Input() columns!: Column[];
  @Input() data!: [];
}
