import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent } from '@components';
import { MANUAL_ACCOUNT_CREATION_EXIT_ROUTES } from '@constants';
import { StateService } from '@services';

@Component({
  selector: 'app-exit-page',
  standalone: true,
  imports: [GovukButtonComponent],
  templateUrl: './exit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExitPageComponent {
  private readonly router = inject(Router);
  private readonly stateService = inject(StateService);

  public handleOkClick(): void {
    // For now, test page will act as our 'Dashboard' page
    this.router.navigate([MANUAL_ACCOUNT_CREATION_EXIT_ROUTES[this.stateService.currentRoute]]);
  }

  public handleCancelClick(): void {
    // For now, test page will act as our 'Dashboard' page
    this.router.navigate([this.stateService.currentRoute]);
  }
}
