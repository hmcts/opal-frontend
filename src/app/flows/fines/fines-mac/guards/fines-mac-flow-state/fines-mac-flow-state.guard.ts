import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { hasFlowStateGuard } from '@guards/has-flow-state/has-flow-state.guard';
import { inject } from '@angular/core';
import { FinesMacStore } from '../../stores/fines-mac.store';

export const finesMacFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesMacStore).accountDetails(),
  (accountDetails) =>
    !!accountDetails.formData.fm_create_account_account_type &&
    !!accountDetails.formData.fm_create_account_defendant_type,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`,
);
