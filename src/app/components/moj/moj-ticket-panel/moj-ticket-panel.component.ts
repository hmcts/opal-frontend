import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-moj-ticket-panel',
  standalone: true,
  imports: [],
  templateUrl: './moj-ticket-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojTicketPanelComponent {
  @Input({ required: false }) componentClasses!: string;
  @Input({ required: false }) sectionClasses!: string;
}
