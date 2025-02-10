import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-table',
  imports: [],
  templateUrl: './govuk-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTableComponent {
  @Input({ required: false }) public tableClasses!: string;
}
