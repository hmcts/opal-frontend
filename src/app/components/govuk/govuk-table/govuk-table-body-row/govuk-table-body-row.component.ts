import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-govuk-table-body-row, [app-govuk-table-body-row]',
  standalone: true,
  imports: [],
  templateUrl: './govuk-table-body-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTableBodyRowComponent {
  @HostBinding('class') hostClass = 'govuk-table__row';
}
