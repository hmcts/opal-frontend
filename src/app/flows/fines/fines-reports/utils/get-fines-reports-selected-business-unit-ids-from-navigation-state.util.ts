import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IFinesReportsBusinessUnitNavigationState } from '../interfaces/fines-reports-business-unit-navigation-state.interface';

/**
 * Reads selected business unit ids from the current router navigation or browser history state.
 *
 * @param router - Router used to access the current navigation extras state.
 * @param location - Location used to access browser history state when navigation extras are unavailable.
 * @returns Selected business unit ids, or an empty array when none were supplied.
 */
export const getFinesReportsSelectedBusinessUnitIdsFromNavigationState = (
  router: Router,
  location: Location,
): number[] => {
  const navigationState = router.currentNavigation()?.extras.state as
    | IFinesReportsBusinessUnitNavigationState
    | undefined;
  const locationState = location.getState() as IFinesReportsBusinessUnitNavigationState | undefined;
  const selectedBusinessUnitIds = navigationState?.selectedBusinessUnitIds ?? locationState?.selectedBusinessUnitIds;

  return Array.isArray(selectedBusinessUnitIds) ? selectedBusinessUnitIds : [];
};
