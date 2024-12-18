import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-moj-timeline-item',
  standalone: true,
  imports: [],
  templateUrl: './moj-timeline-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojTimelineItemComponent {}
