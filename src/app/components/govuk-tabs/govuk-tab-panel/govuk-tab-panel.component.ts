import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-tab-panel',
  standalone: true,
  imports: [],
  templateUrl: './govuk-tab-panel.component.html',
  styleUrl: './govuk-tab-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabPanelComponent {
  @Input({ required: true }) public panelId!: string;
}
