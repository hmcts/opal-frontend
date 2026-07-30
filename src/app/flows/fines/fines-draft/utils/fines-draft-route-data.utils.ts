import { ActivatedRoute } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../constants/fines-draft-route-data-keys.constant';
import { FinesDraftCountRouteDataKey } from '../types/fines-draft-count-route-data-key.type';
import { FinesDraftAccountsRouteDataKey } from '../types/fines-draft-accounts-route-data-key.type';

/**
 * Checks whether an unknown route-data value matches the draft accounts resolver response shape.
 *
 * @param response - The route-data value to validate.
 * @returns True when the value is a draft accounts response.
 */
export function isFinesDraftAccountsResponse(response: unknown): response is IOpalFinesDraftAccountsResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof (response as IOpalFinesDraftAccountsResponse).count === 'number' &&
    Array.isArray((response as IOpalFinesDraftAccountsResponse).summaries)
  );
}

/**
 * Reads a draft accounts response from the activated route snapshot.
 *
 * @param activatedRoute - The route containing resolver snapshot data.
 * @param dataKey - The route-data key for the draft accounts response.
 * @returns The resolved draft accounts response, or null when it is missing or malformed.
 */
export function getResolvedDraftAccountsByKey(
  activatedRoute: ActivatedRoute,
  dataKey: FinesDraftAccountsRouteDataKey,
): IOpalFinesDraftAccountsResponse | null {
  const draftAccounts = activatedRoute.snapshot.data?.[dataKey];
  return isFinesDraftAccountsResponse(draftAccounts) ? draftAccounts : null;
}

/**
 * Reads the resolved active-tab draft accounts response from the activated route snapshot.
 *
 * @param activatedRoute - The route containing resolver snapshot data.
 * @returns The resolved draft accounts response, or null when it is missing or malformed.
 */
export function getResolvedDraftAccounts(activatedRoute: ActivatedRoute): IOpalFinesDraftAccountsResponse | null {
  return getResolvedDraftAccountsByKey(activatedRoute, FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts);
}

/**
 * Reads a numeric draft count from the activated route snapshot.
 *
 * @param activatedRoute - The route containing resolver snapshot data.
 * @param dataKey - The route-data key for the count resolver.
 * @returns The resolved count, or null when it is missing or not numeric.
 */
export function getResolvedDraftCount(
  activatedRoute: ActivatedRoute,
  dataKey: FinesDraftCountRouteDataKey,
): number | null {
  const count = activatedRoute.snapshot.data?.[dataKey];
  return typeof count === 'number' ? count : null;
}

/**
 * Uses a resolved count when available, otherwise fetches the count from a draft accounts response.
 *
 * @param activatedRoute - The route containing resolver snapshot data.
 * @param dataKey - The route-data key for the count resolver.
 * @param fetchDraftAccounts - Factory for the fallback API request.
 * @returns An observable of the resolved or fetched count.
 */
export function getResolvedOrFetchDraftCount(
  activatedRoute: ActivatedRoute,
  dataKey: FinesDraftCountRouteDataKey,
  fetchDraftAccounts: () => Observable<IOpalFinesDraftAccountsResponse>,
): Observable<number> {
  const resolvedCount = getResolvedDraftCount(activatedRoute, dataKey);
  return resolvedCount !== null ? of(resolvedCount) : fetchDraftAccounts().pipe(map((res) => res.count));
}
