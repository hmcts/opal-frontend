import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE } from './fines-mac/constants/fines-mac-state';
import { GlobalStore } from 'src/app/stores/global/global.store';

@Component({
  selector: 'app-fines',

  imports: [RouterOutlet],
  templateUrl: './fines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  protected readonly finesService = inject(FinesService);

  public ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesService.finesMacState = { ...FINES_MAC_STATE };
    this.finesService.finesMacState.offenceDetails = [];

    // Clear any errors...
    this.globalStore.setError({
      error: false,
      message: '',
    });
  }
}
