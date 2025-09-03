import { hasFlowStateGuard } from '@hmcts/opal-frontend-common/guards/has-flow-state';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { inject } from '@angular/core';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';

export const finesSaFlowStateGuard = hasFlowStateGuard(
  /**
   * Retrieves the current search account state from the FinesSaStore.
   */
  () => inject(FinesSaStore).searchAccount(),

  /**
   * Simplified guard condition to track state changes.
   */
  () => inject(FinesSaStore).stateChanges(),

  /**
   * Redirects the user to the base search screen if no flow state is present.
   * @returns A fallback URL string.
   */
  () => `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.sa.root}/${FINES_SA_ROUTING_PATHS.children.search}`,
);
