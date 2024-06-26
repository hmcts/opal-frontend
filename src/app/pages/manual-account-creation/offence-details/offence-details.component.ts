import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent, GovukCancelLinkComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';

@Component({
  selector: 'app-offence-details',
  standalone: true,
  imports: [GovukButtonComponent, GovukCancelLinkComponent],
  templateUrl: './offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffenceDetailsComponent {
  private readonly router = inject(Router);

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }
}
