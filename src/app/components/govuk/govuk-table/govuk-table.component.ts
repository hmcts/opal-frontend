import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-table',
  standalone: true,
  imports: [],
  templateUrl: './govuk-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTableComponent {
  @Input({ required: false }) public tableClasses!: string;
  @Input({ required: false }) public results!: boolean;
}
