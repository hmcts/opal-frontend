import { inject } from '@angular/core';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FINES_ACC_ROUTING_PATHS } from '../../constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';

export const finesAccAccountStateGuard = hasFlowStateGuard(
  () => '1234567', // Hardcoded account number for now
  (accountData) => true, // Always allow access for now
  () => {
    const accountNumber = '1234567'; // Use the hardcoded account number

    if (accountNumber) {
      return `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.acc.root}/${accountNumber}/${FINES_ACC_ROUTING_PATHS.children.details}`;
    }

    return `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.acc.root}/${FINES_ACC_ROUTING_PATHS.children.details}`;
  },
);
