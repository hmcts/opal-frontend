import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { FinesMacStore } from './fines-mac/stores/fines-mac.store';

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
      error: false,
      message: '',
    });
  }
}
