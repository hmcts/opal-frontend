import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-details',
  standalone: true,
  imports: [],
  templateUrl: './govuk-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukDetailsComponent {
  @Input({ required: true }) summaryText!: string;
}
