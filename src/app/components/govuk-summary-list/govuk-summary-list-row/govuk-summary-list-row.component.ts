import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-govuk-summary-list-row',
  standalone: true,
  imports: [],
  templateUrl: './govuk-summary-list-row.component.html',
  styleUrl: './govuk-summary-list-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: table-row-group;
      }
    `,
  ],
})
export class GovukSummaryListRowComponent {}
