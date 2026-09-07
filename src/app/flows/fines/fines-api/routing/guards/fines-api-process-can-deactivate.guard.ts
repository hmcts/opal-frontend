import { CanDeactivateFn } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { ICanDeactivateCanComponentDeactivate } from '@hmcts/opal-frontend-common/guards/can-deactivate/interfaces';
import { FINES_API_ROUTING_PATHS } from '../constants/fines-api-routing-paths.constant';

const FINES_API_ROOT_URL = `/${FINES_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.root}`;
const FINES_API_CONFIRM_PROCESS_URL = `${FINES_API_ROOT_URL}/${FINES_API_ROUTING_PATHS.children.confirmProcess}`;

/**
 * Guards child navigation within Automatic Cash Input while leaving outer-flow navigation to the shell guard.
 * This prevents two data-loss prompts when both the Process route and its parent route deactivate together.
 */
export const finesApiProcessCanDeactivateGuard: CanDeactivateFn<ICanDeactivateCanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  if (nextState.url.startsWith(FINES_API_CONFIRM_PROCESS_URL)) {
    return true;
  }

  if (!nextState.url.startsWith(FINES_API_ROOT_URL)) {
    return true;
  }

  return canDeactivateGuard(component, currentRoute, currentState, nextState);
};
