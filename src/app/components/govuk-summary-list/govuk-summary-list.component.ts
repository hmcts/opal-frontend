import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-summary-list',
  standalone: true,
  imports: [],
  templateUrl: './govuk-summary-list.component.html',
  styleUrl: './govuk-summary-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListComponent {
  @Input({ required: true }) summaryListId!: string;
}
