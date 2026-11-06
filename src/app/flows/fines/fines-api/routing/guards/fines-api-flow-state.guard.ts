import { inject } from '@angular/core';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FinesApiStore } from '../../stores/fines-api.store';
import { FINES_API_ROUTING_PATHS } from '../constants/fines-api-routing-paths.constant';

export const finesApiFlowStateGuard = hasFlowStateGuard(
  () => inject(FinesApiStore).selectedBusinessUnitIds(),
  (selectedBusinessUnitIds) => selectedBusinessUnitIds.length > 0,
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.autoPaymentIn.root}/${FINES_API_ROUTING_PATHS.children.selectBusinessUnits}`,
);
