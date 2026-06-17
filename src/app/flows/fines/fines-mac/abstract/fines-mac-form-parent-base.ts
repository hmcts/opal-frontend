import { inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesMacRoutingNestedRoutes } from '../routing/interfaces/fines-mac-routing-nested-routes.interface';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';

export abstract class FinesMacFormParentBaseComponent extends AbstractFormParentBaseComponent {
  protected readonly finesMacStore = inject(FinesMacStore);

  public defendantType = this.finesMacStore.getDefendantType();

  /**
   * Navigates to the configured nested route when one exists for the current defendant type.
   *
   * @param nestedRouteKey - The current form's key in the nested route configuration.
   * @returns Whether a nested route was found and navigation was triggered.
   */
  protected navigateToNestedRoute(nestedRouteKey: keyof IFinesMacRoutingNestedRoutes): boolean {
    if (!this.defendantType) {
      return false;
    }

    const nextRoute = FINES_MAC_ROUTING_NESTED_ROUTES[this.defendantType][nestedRouteKey];
    if (!nextRoute) {
      return false;
    }

    this.routerNavigate(nextRoute.nextRoute);
    return true;
  }

  /**
   * Navigates back to account details.
   */
  protected navigateToAccountDetails(): void {
    this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountDetails);
  }

  /**
   * Handles unsaved changes coming from a child form component.
   *
   * @param unsavedChanges - Whether the child form has unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
