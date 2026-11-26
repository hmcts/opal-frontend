import { Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_SUSPENSE_ITEM_ROUTING_PATHS } from '../routing/constants/fines-suspense-item-routing-paths.constant';

/**
 * Performs a fresh results lookup, including when the reference has not changed.
 * Calls the parent's recovery callback if navigation is cancelled or rejected.
 * Returns completion so the parent can clear its pending-search flag.
 */
export function navigateToSuspenseItemResults(
  router: Router,
  reference: string,
  onNavigationFailed: () => void,
): Promise<void> {
  return router
    .navigate(
      [
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_SUSPENSE_ITEM_ROUTING_PATHS.root,
        ...FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.results.replace(':suspenseItemId', reference).split('/'),
      ],
      { onSameUrlNavigation: 'reload' },
    )
    .then((navigated) => {
      if (!navigated) {
        onNavigationFailed();
      }
    }, onNavigationFailed);
}
