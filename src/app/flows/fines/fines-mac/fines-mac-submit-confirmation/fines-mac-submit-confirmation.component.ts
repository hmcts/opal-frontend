import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';
import { GovukPanelComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-panel';
import { FINES_MAC_DRAFT_CREATE_AND_MANAGE_TABS_ROUTE } from '../constants/fines-mac-draft-create-and-manage-tabs-route.constant';

@Component({
  selector: 'app-fines-mac-submit-confirmation',
  imports: [GovukPanelComponent],
  templateUrl: './fines-mac-submit-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacSubmitConfirmationComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesMacStore = inject(FinesMacStore);

  /**
   * Navigates to the originator type step within the fines MAC flow.
   *
   * This method uses the Angular Router to navigate to the route specified
   * by `FINES_MAC_ROUTING_PATHS.children.originatorType`. The navigation is
   * relative to the parent route of the current activated route.
   *
   * @param event - The optional DOM event that triggered the navigation.
   * @returns {void}
   */
  public createNewAccount(event?: Event): void {
    event?.preventDefault();
    this.router.navigate([FINES_MAC_ROUTING_PATHS.children.originatorType], { relativeTo: this.activatedRoute.parent });
  }

  /**
   * Navigates to the inputter route within the fines draft CAM routing paths.
   * This method constructs the navigation path using predefined routing constants
   * and then uses the Angular Router to navigate to the specified route.
   *
   * @remarks
   * This method is typically used to redirect the user to the "see all accounts" view.
   *
   * @param event - The optional DOM event that triggered the navigation.
   * @returns {void}
   */
  public seeAllAccounts(event?: Event): void {
    event?.preventDefault();
    this.finesMacStore.resetStore();

    this.router.navigate([FINES_MAC_DRAFT_CREATE_AND_MANAGE_TABS_ROUTE.path], {
      fragment: FINES_MAC_DRAFT_CREATE_AND_MANAGE_TABS_ROUTE.fragment,
    });
  }
}
