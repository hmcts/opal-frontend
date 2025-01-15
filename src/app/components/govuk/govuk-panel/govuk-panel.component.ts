import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-govuk-panel',
  standalone: true,
  imports: [],
  templateUrl: './govuk-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukPanelComponent {
  @Input({ required: false }) panelTitle!: string;

  @HostBinding('class') classes = 'govuk-panel__body';
}
