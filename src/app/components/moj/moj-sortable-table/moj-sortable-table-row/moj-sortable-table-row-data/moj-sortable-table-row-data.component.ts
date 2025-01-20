import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-moj-sortable-table-row-data,[app-moj-sortable-table-row-data]',

  imports: [],
  templateUrl: './moj-sortable-table-row-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableRowDataComponent {
  @Input({ required: true }) id!: string;

  @HostBinding('class') hostClass = 'govuk-table__cell';
  @HostBinding('id') get hostId() {
    return this.id;
  }
}
