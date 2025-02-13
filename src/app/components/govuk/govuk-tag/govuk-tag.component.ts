import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-tag',
  imports: [],
  templateUrl: './govuk-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTagComponent {
  @Input({ required: true }) tagId!: string;
  @Input({ required: false }) tagClasses!: string;
}
