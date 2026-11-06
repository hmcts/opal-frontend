import { FINES_ACCOUNT_ROUTE_TYPES } from '../../constants/fines-acc-route-types.constant';

export type FinesAccRouteType = (typeof FINES_ACCOUNT_ROUTE_TYPES)[keyof typeof FINES_ACCOUNT_ROUTE_TYPES];
