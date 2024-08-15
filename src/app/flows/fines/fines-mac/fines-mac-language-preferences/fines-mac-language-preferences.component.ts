import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';
import { GovukButtonComponent, GovukCancelLinkComponent } from '@components/govuk';

@Component({
  selector: 'app-fines-mac-language-preferences',
  standalone: true,
  imports: [GovukButtonComponent, GovukCancelLinkComponent],
  templateUrl: './fines-mac-language-preferences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacLanguagePreferencesComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly finesMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

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
