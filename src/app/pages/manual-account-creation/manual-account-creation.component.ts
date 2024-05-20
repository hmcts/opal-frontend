import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';
import { StateService } from '@services';

@Component({
  selector: 'app-manual-account-creation',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './manual-account-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualAccountCreationComponent implements OnDestroy {
  private readonly stateService = inject(StateService);

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.stateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;

    // Clear any errors...
    this.stateService.error.set({
      error: false,
      message: '',
    });
  }
}
