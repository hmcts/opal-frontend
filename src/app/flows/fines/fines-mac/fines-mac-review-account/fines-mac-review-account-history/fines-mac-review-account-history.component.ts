import { Component, inject, Input } from '@angular/core';
import {
  MojTimelineComponent,
  MojTimelineItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-timeline';
import { IFinesMacAccountTimelineData } from '../../services/fines-mac-payload/interfaces/fines-mac-payload-account-timeline-data.interface';
import { DateService } from '@hmcts/opal-frontend-common/services';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';

@Component({
  selector: 'app-fines-mac-review-account-history',
  imports: [GovukTagComponent, MojTimelineComponent, MojTimelineItemComponent],
  templateUrl: './fines-mac-review-account-history.component.html',
})
export class FinesMacReviewAccountHistoryComponent {
  @Input({ required: true }) public timelineData!: IFinesMacAccountTimelineData[];
  @Input({ required: true }) public defendantName!: string;
  @Input({ required: true }) public accountStatus!: string;
  @Input({ required: false }) public isRejected!: boolean;
  protected readonly dateService = inject(DateService);
}
