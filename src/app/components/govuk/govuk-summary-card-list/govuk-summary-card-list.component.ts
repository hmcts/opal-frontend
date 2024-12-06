import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-summary-card-list',
  standalone: true,
  imports: [],
  templateUrl: './govuk-summary-card-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryCardListComponent {
  @Input({ required: false }) cardTitle!: string;
  @Input({ required: false }) contentHidden!: boolean;
}
