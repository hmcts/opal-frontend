import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../constants/fines-draft-route-data-keys.constant';

export type FinesDraftAccountsRouteDataKey =
  | typeof FINES_DRAFT_ROUTE_DATA_KEYS.allRejectedAccounts
  | typeof FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts;
