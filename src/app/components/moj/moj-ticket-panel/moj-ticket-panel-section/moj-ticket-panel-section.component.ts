import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-ticket-panel-section',
  standalone: true,
  imports: [],
  templateUrl: './moj-ticket-panel-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojTicketPanelSectionComponent {
  @Input({ required: false }) sectionClasses!: string;
}
