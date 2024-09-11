import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { hasFlowStateGuard } from '@guards';
import { inject } from '@angular/core';

export const finesMacFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesService).finesMacState.accountDetails,
  (accountDetails) => !!accountDetails.formData.account_type && !!accountDetails.formData.defendant_type,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`,
);
