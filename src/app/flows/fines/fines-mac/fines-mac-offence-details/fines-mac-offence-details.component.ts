import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukButtonComponent, GovukCancelLinkComponent } from '@components/govuk';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FinesService } from '@services/fines';

@Component({
  selector: 'app-fines-mac-offence-details',
  standalone: true,
  imports: [GovukButtonComponent, GovukCancelLinkComponent],
  templateUrl: './fines-mac-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesService = inject(FinesService);

  protected readonly finesMacRoutes = FINES_MAC_ROUTING_PATHS;

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
  }
}
