import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent, GovukCancelLinkComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [GovukCancelLinkComponent, GovukButtonComponent],
  templateUrl: './company-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetailsComponent {
  private readonly router = inject(Router);

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  /**
   * Handles route with the supplied route
   *
   * @param route string of route
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }
}
