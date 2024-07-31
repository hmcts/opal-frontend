import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-moj-timeline',
  standalone: true,
  imports: [],
  templateUrl: './moj-timeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojTimelineComponent {}
