import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
import { CanDeactivateTypes } from '@guards/types/can-deactivate.type';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences',
  standalone: true,
  imports: [GovukButtonComponent, GovukBackLinkComponent],
  templateUrl: './fines-mac-offence-details-search-offences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesService = inject(FinesService);

  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes form state -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateTypes {
    return true;
  }

  /**
   * Navigates to the specified route.
   * @param route - The route to navigate to.
   * @param event - The optional event object.
   */
  public handleRoute(route: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
  }
}
