import { inject } from '@angular/core';
import { hasUrlStateMatchGuard } from '@hmcts/opal-frontend-common/guards/has-url-state-match';
import { FINES_ACC_ROUTING_PATHS } from '../../constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesAccountStore } from '../../../stores/fines-acc.store';

export const finesAccStateGuard = hasUrlStateMatchGuard(
  () => {
    const finesAccountStore = inject(FinesAccountStore);
    return finesAccountStore.account_number();
  },
  (route) => !route.params['accountId'], // Skip validation if no account number in URL
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
