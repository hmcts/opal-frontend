import { Component, computed, inject, Input } from '@angular/core';
import {
  MojTimelineComponent,
  MojTimelineItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-timeline';
import { IFinesMacAccountTimelineData } from '../../services/fines-mac-payload/interfaces/fines-mac-payload-account-timeline-data.interface';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';
import { getFeatureFlagReleaseState } from '../../../utils/fines-section-permissions.utils';

@Component({
  selector: 'app-fines-mac-review-account-history',
  imports: [GovukTagComponent, MojTimelineComponent, MojTimelineItemComponent, DateFormatPipe],
  templateUrl: './fines-mac-review-account-history.component.html',
})
export class FinesMacReviewAccountHistoryComponent {
  private readonly globalStore = inject(GlobalStore);

  @Input({ required: true }) public timelineData!: IFinesMacAccountTimelineData[];
  @Input({ required: true }) public defendantName!: string;
  @Input({ required: true }) public accountStatus!: string;
  @Input({ required: false }) public isRejected: boolean = false;

  public readonly headingLevel = computed(() =>
    getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true ? 3 : 2,
  );
}
