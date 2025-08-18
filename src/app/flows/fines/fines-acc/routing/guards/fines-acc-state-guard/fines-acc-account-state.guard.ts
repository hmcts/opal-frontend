import { inject } from '@angular/core';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FINES_ACC_ROUTING_PATHS } from '../../constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesAccountStore } from '../../../stores/fines-acc.store';

export const finesAccAccountStateGuard = hasFlowStateGuard(
  () => {
    const finesAccountStore = inject(FinesAccountStore);
    return finesAccountStore.getAccountNumber();
  },
  (accountNumber) => !!accountNumber, // Check if account data exists
  () => {
    const finesAccountStore = inject(FinesAccountStore);
    const accountNumber = finesAccountStore.getAccountNumber();

    if (accountNumber) {
      return `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.acc.root}/${accountNumber}/${FINES_ACC_ROUTING_PATHS.children.details}`;
    }

    return `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.acc.root}/${FINES_ACC_ROUTING_PATHS.children.details}`;
  },
);
