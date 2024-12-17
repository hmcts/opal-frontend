import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-moj-timeline-item',
  standalone: true,
  imports: [],
  templateUrl: './moj-timeline-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojTimelineItemComponent implements AfterContentInit {
  @ContentChild('description', { static: false }) descriptionElement?: ElementRef;
  public hasDescriptionElement = false;

  public ngAfterContentInit(): void {
    this.hasDescriptionElement = !!this.descriptionElement;
  }
}
