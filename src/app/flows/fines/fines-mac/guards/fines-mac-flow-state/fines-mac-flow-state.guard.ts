import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { computed, inject } from '@angular/core';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';

// TODO: Refactor to check only originatorType after Fines Draft Accounts refactoring is complete
// (PO-2762, PO-2766, PO-2767, PO-2761, PO-2793, PO-2790)
// Currently checks both accountDetails and originatorType to avoid breaking draft account features
// (amending and viewing). Once draft accounts are updated, simplify this guard.
export const finesMacFlowStateGuard = hasFlowStateGuard(
  () => {
    const store = inject(FinesMacStore);
    return computed(() => ({
      accountDetails: store.accountDetails(),
      originatorType: store.originatorType(),
    }))();
  },
  (state) =>
    (!!state.accountDetails.formData.fm_create_account_account_type &&
      !!state.accountDetails.formData.fm_create_account_defendant_type) ||
    !!state.originatorType.formData.fm_originator_type_originator_type,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.originatorType}`,
);
