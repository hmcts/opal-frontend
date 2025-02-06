import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { hasFlowStateGuard } from '@guards/has-flow-state/has-flow-state.guard';
import { inject } from '@angular/core';

export const finesMacFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesService).finesMacState.accountDetails,
  (accountDetails) =>
    !!accountDetails.formData.fm_create_account_account_type &&
    !!accountDetails.formData.fm_create_account_defendant_type,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`,
);
