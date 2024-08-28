import { FinesService } from '@services/fines';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants';
import { FINES_ROUTING_PATHS } from '@constants/fines';
import { hasFlowStateGuard } from '@guards';
import { inject } from '@angular/core';

export const finesMacFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesService).finesMacState.accountDetails,
  (accountDetails) => !!accountDetails.AccountType && !!accountDetails.DefendantType,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`,
);
