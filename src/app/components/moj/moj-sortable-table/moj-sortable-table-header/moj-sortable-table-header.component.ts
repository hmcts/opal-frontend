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

  @Output() sortChange = new EventEmitter<{ key: string; sortType: 'ascending' | 'descending' }>();

  @HostBinding('attr.aria-sort') get ariaSort(): string | null {
    return this.sortDirection;
  }

  @HostBinding('scope') hostScope = 'col';

  @HostBinding('class') get hostClass(): string {
    return 'govuk-table__header';
  }

  public toggleSort(): void {
    const newDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending';

    this.sortChange.emit({
      key: this.columnKey,
      sortType: newDirection,
    });
  } /** This method will validate the sort type ASC or DESC and emit this with the header column key*/
}
