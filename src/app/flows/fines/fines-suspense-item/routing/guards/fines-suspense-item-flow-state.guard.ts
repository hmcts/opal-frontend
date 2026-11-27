import { inject } from '@angular/core';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_SUSPENSE_ITEM_ROUTING_PATHS } from '../constants/fines-suspense-item-routing-paths.constant';
import { FinesSuspenseItemStore } from '../../stores/fines-suspense-item.store';

/**
 * Requires a selected business unit before entering the results page or resolving its summary.
 * Redirects to Search when the selection is missing, for example after a browser refresh,
 * because the results URL contains the reference but the business unit is held in memory.
 */
export const finesSuspenseItemFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesSuspenseItemStore).selectedBusinessUnitId(),
  (businessUnitId) => businessUnitId !== null,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_SUSPENSE_ITEM_ROUTING_PATHS.root}/${FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search}`,
);
