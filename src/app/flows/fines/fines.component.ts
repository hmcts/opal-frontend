import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE } from './fines-mac/constants/fines-mac-state';
import { GlobalStateService } from '@services/global-state-service/global-state.service';

@Component({
  selector: 'app-fines',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './fines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesComponent implements OnDestroy {
  private readonly globalStateService = inject(GlobalStateService);
  protected readonly finesService = inject(FinesService);

  public ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesService.finesMacState = FINES_MAC_STATE;
    this.finesService.finesMacState.offenceDetails = [];

    // Clear any errors...
    this.globalStateService.error.set({
      error: false,
      message: '',
    });
  }
}
