import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-moj-sortable-table-header, [app-moj-sortable-table-header]',
  standalone: true,
  imports: [],
  templateUrl: './moj-sortable-table-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableHeaderComponent {
  @Input() sortDirection: 'none' | 'ascending' | 'descending' = 'none';

  @HostBinding('class') hostClass = `govuk-table__header`;

  @HostBinding('attr.aria-sort') get ariaSort(): string | null {
    return this.sortDirection !== 'none' ? this.sortDirection : null;
  }

  @HostBinding('scope') get hostScope() {
    return 'col';
  }
}
