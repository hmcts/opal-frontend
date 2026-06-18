import { FINES_MAC_NESTED_ROUTE_NAVIGATION_RESULTS } from '../constants/fines-mac-nested-route-navigation-results.constant';

export type TFinesMacNestedRouteNavigationResult =
  (typeof FINES_MAC_NESTED_ROUTE_NAVIGATION_RESULTS)[keyof typeof FINES_MAC_NESTED_ROUTE_NAVIGATION_RESULTS];
