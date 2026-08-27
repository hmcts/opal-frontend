import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../constants/fines-draft-route-data-keys.constant';

export type FinesDraftCountRouteDataKey =
  | typeof FINES_DRAFT_ROUTE_DATA_KEYS.failedCount
  | typeof FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount;
