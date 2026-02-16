import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FinesConStore } from '../stores/fines-con.store';
import { inject } from '@angular/core';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_CON_ROUTING_PATHS } from '../routing/constants/fines-con-routing-paths.constant';

export const finesConFlowStateGuard = hasFlowStateGuard(
  /**
   * Retrieves the current business unit selection form from the FinesConStore.
   */
  () => inject(FinesConStore).selectBuForm(),

  /**
   * Validates that state changes were made and required fields exist.
   */
  () => {
    const conStore = inject(FinesConStore);
    return conStore.stateChanges() && !!conStore.getBusinessUnitId() && !!conStore.getDefendantType();
  },

  /**
   * Redirects the user to the business unit selection screen if no flow state is present.
   * @returns A fallback URL string.
   */
  () =>
    `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.con.root}/${FINES_CON_ROUTING_PATHS.children.selectBusinessUnit}`,
);
