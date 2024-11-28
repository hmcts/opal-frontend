import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-sortable-table',
  standalone: true,
  templateUrl: './moj-sortable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableComponent {
  @Input({ required: false }) public tableClasses!: string;
}
