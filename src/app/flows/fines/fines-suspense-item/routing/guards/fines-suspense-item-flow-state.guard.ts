import { inject } from '@angular/core';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_SUSPENSE_ITEM_ROUTING_PATHS } from '../constants/fines-suspense-item-routing-paths.constant';
import { FinesSuspenseItemStore } from '../../stores/fines-suspense-item.store';

export const finesSuspenseItemFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesSuspenseItemStore).selectedBusinessUnitId(),
  (businessUnitId) => businessUnitId !== null,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_SUSPENSE_ITEM_ROUTING_PATHS.root}/${FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search}`,
);
