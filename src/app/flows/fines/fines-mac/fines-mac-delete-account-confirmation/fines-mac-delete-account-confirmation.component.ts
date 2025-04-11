import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';

@Component({
  selector: 'app-fines-mac-delete-account-confirmation',
  imports: [GovukButtonComponent, GovukCancelLinkComponent],
  templateUrl: './fines-mac-delete-account-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacDeleteAccountConfirmationComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesMacStore = inject(FinesMacStore);

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

  public ngOnDestroy(): void {
    this.finesMacStore.setDeleteFromCheckAccount(false);
  }
}
