import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesMacStore } from './fines-mac/stores/fines-mac.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constant';

@Component({
  selector: 'app-fines',
  imports: [RouterOutlet],
  templateUrl: './fines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly finesMacStore = inject(FinesMacStore);

  public ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesMacStore.resetFinesMacStore();

    // Clear any errors...
    this.globalStore.setError({
      ...GLOBAL_ERROR_STATE,
    });
  }
}
