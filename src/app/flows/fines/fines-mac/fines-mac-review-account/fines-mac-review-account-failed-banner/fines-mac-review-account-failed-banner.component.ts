import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { FinesDraftStore } from '../../../fines-draft/stores/fines-draft.store';

@Component({
  selector: 'app-fines-mac-review-account-failed-banner',
  imports: [MojAlertComponent, MojAlertContentComponent, MojAlertIconComponent, MojAlertTextComponent],
  templateUrl: './fines-mac-review-account-failed-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountFailedBannerComponent implements OnInit, OnDestroy {
  public readonly finesDraftStore = inject(FinesDraftStore);

  public ngOnInit(): void {
    this.finesDraftStore.setBannerMessageByType('error');
  }

  public ngOnDestroy(): void {
    this.finesDraftStore.resetBannerMessage();
  }
}
