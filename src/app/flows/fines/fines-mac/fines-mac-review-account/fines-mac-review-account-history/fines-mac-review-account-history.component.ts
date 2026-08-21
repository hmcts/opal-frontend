import { Component, Input } from '@angular/core';
import {
  MojTimelineComponent,
  MojTimelineItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-timeline';
import { IFinesMacAccountTimelineData } from '../../services/fines-mac-payload/interfaces/fines-mac-payload-account-timeline-data.interface';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';

const TIMELINE_STATUS_LABELS: Readonly<Record<string, string>> = {
  Submitted: 'Created',
  Resubmitted: 'Submitted',
};

@Component({
  selector: 'app-fines-mac-review-account-history',
  imports: [GovukTagComponent, MojTimelineComponent, MojTimelineItemComponent, DateFormatPipe],
  templateUrl: './fines-mac-review-account-history.component.html',
})
export class FinesMacReviewAccountHistoryComponent {
  @Input({ required: true }) public timelineData!: IFinesMacAccountTimelineData[];
  @Input({ required: true }) public defendantName!: string;
  @Input({ required: true }) public accountStatus!: string;
  @Input({ required: false }) public isRejected: boolean = false;

  /**
   * Returns the user-facing label for a draft account timeline status.
   *
   * @param status The status returned by the draft account API.
   * @returns The status label to display in the review history.
   */
  public getTimelineStatusLabel(status: string): string {
    return TIMELINE_STATUS_LABELS[status] ?? status;
  }
}
