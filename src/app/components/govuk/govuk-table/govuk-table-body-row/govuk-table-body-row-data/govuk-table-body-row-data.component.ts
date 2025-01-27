import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-table-body-row-data, [app-govuk-table-body-row-data]',

  imports: [],
  templateUrl: './govuk-table-body-row-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTableBodyRowDataComponent {
  @Input({ required: true }) id!: string;

  @HostBinding('class') hostClass = 'govuk-table__cell';
  @HostBinding('id') get hostId() {
    return this.id;
  }
}
