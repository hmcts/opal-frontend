import { inject } from '@angular/core';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FINES_ACC_ROUTING_PATHS } from '../../constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesAccStore } from '../../../store/fines-acc-store';

export const finesAccAccountStateGuard = hasFlowStateGuard(
  () => inject(FinesAccStore).accountData(),
  (accountData) => !!accountData && !!accountData.account_number,
  () => {
    const store = inject(FinesAccStore);
    const accountData = store.accountData();
    const accountNumber = accountData?.account_number;

    if (accountNumber) {
      return `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.acc.root}/${accountNumber}/${FINES_ACC_ROUTING_PATHS.children.details}`;
    }

    return `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.acc.root}/${FINES_ACC_ROUTING_PATHS.children.details}`;
  },
);
