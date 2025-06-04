import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MojBannerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-banner';
import { FINES_MAC_REVIEW_ACCOUNT_FAILED_BANNER_MESSAGE } from './constant/fines-mac-review-account-failed-banner-message.constant';

@Component({
  selector: 'app-fines-mac-review-account-failed-banner',
  imports: [MojBannerComponent],
  templateUrl: './fines-mac-review-account-failed-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountFailedBannerComponent {
  public readonly failedBannerMessage = FINES_MAC_REVIEW_ACCOUNT_FAILED_BANNER_MESSAGE;
}
