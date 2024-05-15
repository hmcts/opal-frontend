import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-tag',
  standalone: true,
  imports: [],
  templateUrl: './govuk-tag.component.html',
  styleUrl: './govuk-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTagComponent {
  @Input({ required: false }) tagClasses!: string;
}
