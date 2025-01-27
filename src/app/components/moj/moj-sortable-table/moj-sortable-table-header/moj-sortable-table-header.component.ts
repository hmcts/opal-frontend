import { Component, HostBinding, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-moj-sortable-table-header, [app-moj-sortable-table-header]',
  standalone: true,
  imports: [],
  templateUrl: './moj-sortable-table-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableHeaderComponent {
  @Input() columnKey!: string;
  @Input() sortDirection: 'ascending' | 'descending' | 'none' = 'none';
  @Input() dataIndex: number = 0;

  @Output() sortChange = new EventEmitter<{ key: string; sortType: 'ascending' | 'descending' }>();

  @HostBinding('attr.aria-sort') get ariaSort(): string | null {
    return this.sortDirection;
  }

  @HostBinding('scope') hostScope = 'col';

  @HostBinding('class') get hostClass(): string {
    return 'govuk-table__header';
  }

  /**
   * Toggles the sort direction between 'ascending' and 'descending' for the table column.
   * Emits a sortChange event with the column key and the new sort direction.
   *
   * @public
   * @returns {void}
   */
  public toggleSort(): void {
    const newDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending';

    this.sortChange.emit({
      key: this.columnKey,
      sortType: newDirection,
    });
  }
}
