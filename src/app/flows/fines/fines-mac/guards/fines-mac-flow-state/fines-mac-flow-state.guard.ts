import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { inject } from '@angular/core';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';

/**
 * Guard for the fines MAC flow state that validates the originator type selection.
 *
 * Checks if the originator type form data has been populated before allowing
 * navigation to subsequent steps in the fines MAC flow. If validation fails,
 * redirects to the originator type selection page.
 *
 * @returns {boolean} True if originator type is selected, false otherwise
 */
export const finesMacFlowStateGuard = hasFlowStateGuard(
  () => {
    const store = inject(FinesMacStore);
    return {
      originatorType: store.originatorType(),
    };
  },
  (state) => !!state.originatorType.formData.fm_originator_type_originator_type,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.originatorType}`,
);
