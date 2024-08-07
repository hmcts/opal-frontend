import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovukButtonComponent, GovukCancelLinkComponent } from '@components/govuk';
import { FinesMacRoutes } from '../enums';

@Component({
  selector: 'app-fines-mac-offence-details',
  standalone: true,
  imports: [GovukButtonComponent, GovukCancelLinkComponent],
  templateUrl: './fines-mac-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsComponent {
  private readonly router = inject(Router);

  protected readonly finesMacRoutes = FinesMacRoutes;

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }
}
