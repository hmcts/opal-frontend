import { CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../constants/fines-mac-offence-details-routing-paths.constant';

interface ICanDeactivateAddAnOffenceComponent {
  canDeactivate: () => CanDeactivateTypes;
}

const nestedOffenceDetailsRoutes = [
  FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addMinorCreditor,
  FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition,
  FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeMinorCreditor,
  FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeOffence,
];

const isNestedOffenceDetailsRoute = (nextState: RouterStateSnapshot): boolean =>
  nestedOffenceDetailsRoutes.some((route) => nextState.url.endsWith(`/${route}`));

export const finesMacOffenceDetailsAddAnOffenceCanDeactivateGuard: CanDeactivateFn<
  ICanDeactivateAddAnOffenceComponent
> = (component, _currentRoute, _currentState, nextState) =>
  isNestedOffenceDetailsRoute(nextState)
    ? true
    : canDeactivateGuard(component, _currentRoute, _currentState, nextState);
