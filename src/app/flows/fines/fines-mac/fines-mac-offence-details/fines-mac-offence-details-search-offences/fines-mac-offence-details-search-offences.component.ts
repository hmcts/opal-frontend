import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/core/components/govuk';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/core/types';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences',
  imports: [GovukButtonComponent, GovukBackLinkComponent],
  templateUrl: './fines-mac-offence-details-search-offences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);

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

  public ngOnInit(): void {
    this.finesMacOffenceDetailsStore.setOffenceCodeMessage('');
  }
}
