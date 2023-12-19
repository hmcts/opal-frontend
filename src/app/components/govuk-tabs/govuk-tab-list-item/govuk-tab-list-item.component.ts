import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-tab-list-item',
  standalone: true,
  imports: [],
  templateUrl: './govuk-tab-list-item.component.html',
  styleUrl: './govuk-tab-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabListItemComponent {
  @Input({ required: true }) public href!: string;
}
