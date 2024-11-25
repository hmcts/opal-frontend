import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-sortable-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moj-sortable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableComponent {
  @Input({ required: false }) public tableClasses!: string;
}
