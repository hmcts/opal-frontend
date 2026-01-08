import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesAccountStore } from './stores/fines-acc.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

@Component({
  selector: 'app-fines-acc',
  imports: [RouterOutlet],
  templateUrl: './fines-acc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly finesAccStore = inject(FinesAccountStore);
  private readonly opalFines = inject(OpalFines);

  public ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesAccStore.resetStore();
    this.opalFines.clearAccountDetailsCache();

    // Clear any errors...
    this.globalStore.resetBannerError();
  }
}
