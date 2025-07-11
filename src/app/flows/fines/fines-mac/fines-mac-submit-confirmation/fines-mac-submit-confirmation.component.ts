import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';
import { GovukPanelComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-panel';
import { FINES_DRAFT_ROUTING_PATHS } from '../../fines-draft/routing/constants/fines-draft-routing-paths.constant';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from '../../fines-draft/fines-draft-create-and-manage/routing/constants/fines-draft-create-and-manage-routing-paths.constant';

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
   * Navigates to the create account page within the fines MAC flow.
   *
   * This method uses the Angular Router to navigate to the route specified
   * by `FINES_MAC_ROUTING_PATHS.children.createAccount`. The navigation is
   * relative to the parent route of the current activated route.
   *
   * @returns {void}
   */
  public createNewAccount(): void {
    this.router.navigate([FINES_MAC_ROUTING_PATHS.children.createAccount], { relativeTo: this.activatedRoute.parent });
  }

  /**
   * Navigates to the inputter route within the fines draft CAM routing paths.
   * This method constructs the navigation path using predefined routing constants
   * and then uses the Angular Router to navigate to the specified route.
   *
   * @remarks
   * This method is typically used to redirect the user to the "see all accounts" view.
   *
   * @returns {void}
   */
  public seeAllAccounts(): void {
    this.finesMacStore.resetFinesMacStore();

    this.router.navigate(
      [
        `${FINES_ROUTING_PATHS.root}/${FINES_DRAFT_ROUTING_PATHS.root}/${FINES_DRAFT_ROUTING_PATHS.children.createAndManage}/${FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS.children.tabs}`,
      ],
      {
        fragment: 'review',
      },
    );
  }
}
