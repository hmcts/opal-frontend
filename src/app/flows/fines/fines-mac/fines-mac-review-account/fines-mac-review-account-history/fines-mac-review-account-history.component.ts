import { Component, inject, Input } from '@angular/core';
import { MojTimelineItemComponent } from '@components/moj/moj-timeline/moj-timeline-item/moj-timeline-item.component';
import { MojTimelineComponent } from '@components/moj/moj-timeline/moj-timeline.component';
import { IFinesMacAccountTimelineData } from '../../services/fines-mac-payload/interfaces/fines-mac-payload-account-timeline-data.interface';
import { DateService } from '@services/date-service/date.service';
import { GovukTagComponent } from '@components/govuk/govuk-tag/govuk-tag.component';

@Component({
  selector: 'app-fines-mac-review-account-history',
  imports: [GovukTagComponent, MojTimelineComponent, MojTimelineItemComponent],
  templateUrl: './fines-mac-review-account-history.component.html',
})
export class FinesMacReviewAccountHistoryComponent {
  @Input({ required: true }) public timelineData!: IFinesMacAccountTimelineData[];
  @Input({ required: true }) public defendantName!: string;
  @Input({ required: true }) public accountStatus!: string;
  protected readonly dateService = inject(DateService);
}
