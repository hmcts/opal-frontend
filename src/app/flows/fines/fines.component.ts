import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesMacStore } from './fines-mac/stores/fines-mac.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from './fines-draft/stores/fines-draft.store';
import { FinesSaStore } from './fines-sa/stores/fines-sa.store';
import { FinesAccountStore } from './fines-acc/stores/fines-acc.store';
import { OpalFines } from './services/opal-fines-service/opal-fines.service';

@Component({
  selector: 'app-fines',
  imports: [RouterOutlet],
  templateUrl: './fines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly finesDraftStore = inject(FinesDraftStore);
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly finesAccountStore = inject(FinesAccountStore);
  private readonly opalFines = inject(OpalFines);

  public ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.opalFines.clearAllCaches();
    this.finesMacStore.resetStore();
    this.finesDraftStore.resetStore();
    this.finesSaStore.resetStore();
    this.finesAccountStore.resetStore();

    // Clear any errors...
    this.globalStore.resetBannerError();
  }
}
