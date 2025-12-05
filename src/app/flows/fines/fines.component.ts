import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from './services/opal-fines-service/opal-fines.service';
import { FinesDraftStore } from './fines-draft/stores/fines-draft.store';

@Component({
  selector: 'app-fines',
  imports: [RouterOutlet],
  templateUrl: './fines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly opalFines = inject(OpalFines);
  private readonly finesDraftStore = inject(FinesDraftStore);

  public ngOnDestroy(): void {
    // Cleanup all cache
    this.opalFines.clearAllCaches();
    this.finesDraftStore.resetStore();

    // Clear any errors...
    this.globalStore.resetBannerError();
  }
}
