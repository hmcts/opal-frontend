import {
  Component,
  HostBinding,
  ChangeDetectionStrategy,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-moj-sortable-table-header, [app-moj-sortable-table-header]',
  standalone: true,
  imports: [],
  templateUrl: './moj-sortable-table-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableHeaderComponent {
  @Input() columnKey!: string; // The key to sort by
  @Input() sortDirection: 'none' | 'ascending' | 'descending' = 'none'; // Default sort direction

  @Output() sortChange = new EventEmitter<{ key: string; sortType: 'asc' | 'desc' }>();

  @HostBinding('class') hostClass = `govuk-table__header`;

  @HostBinding('attr.aria-sort') get ariaSort(): string {
    return this.sortDirection;
  }
  @HostBinding('scope') get hostScope() {
    return 'col';
  }

  toggleSort(): void {
    this.sortDirection =
      this.sortDirection === 'none' ? 'ascending' : this.sortDirection === 'ascending' ? 'descending' : 'none';

    if (this.sortDirection !== 'none') {
      this.sortChange.emit({
        key: this.columnKey,
        sortType: this.sortDirection === 'ascending' ? 'asc' : 'desc',
      });
    }
  }
}
