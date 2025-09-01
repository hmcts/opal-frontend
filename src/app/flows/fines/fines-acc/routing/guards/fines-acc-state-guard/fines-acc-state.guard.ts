import { inject } from '@angular/core';
import { hasUrlStateMatchGuard } from '@hmcts/opal-frontend-common/guards/has-url-state-match';
import { FINES_ACC_ROUTING_PATHS } from '../../constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesAccountStore } from '../../../stores/fines-acc.store';

/**
 * A guard that validates the fines account state by comparing the store's account number with the
 * "accountId" specified in the route parameters.
 *
 * This guard is constructed using the "hasUrlStateMatchGuard" function and performs the following steps:
 * - Injects the FinesAccountStore to fetch the current account number.
 * - Processes only routes that have an "accountId" parameter.
 * - Compares the account number from the store with the "accountId" from the route:
 *   - Returns false if the store does not have an account number.
 *   - Returns false if the store's account number does not match the route's "accountId".
 *   - Returns true if the account numbers match.
 * - Constructs a new URL based on the account number if redirection is necessary, using predefined routing paths.
 *
 * @remarks
 * Ensure that FinesAccountStore, FINES_ROUTING_PATHS, and FINES_ACC_ROUTING_PATHS are properly imported in the module.
 */
export const finesAccStateGuard = hasUrlStateMatchGuard(
  () => {
    const finesAccountStore = inject(FinesAccountStore);
    return finesAccountStore.account_number();
  },
  (route) => !!route.params['accountId'], // Only process routes that have accountId parameter
  (storeAccountNumber, route) => {
    const urlAccountNumber = route.params['accountId'];

    if (!storeAccountNumber) {
      return false;
    }

    if (storeAccountNumber !== urlAccountNumber) {
      return false;
    }

    return true;
  },
  (route) => {
    const accountNumber = route.params['accountId'];
    return `${FINES_ROUTING_PATHS.root}/defendant/${accountNumber}/${FINES_ACC_ROUTING_PATHS.children.details}`;
  },
);
