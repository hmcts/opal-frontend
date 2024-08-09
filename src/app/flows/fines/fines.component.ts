import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesService } from './services';
import { FINES_MAC__STATE } from './fines-mac/constants';
import { GlobalStateService } from '@services';

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
    this.finesService.finesMacState = FINES_MAC__STATE;

    // Clear any errors...
    this.globalStateService.error.set({
      error: false,
      message: '',
    });
  }
}
