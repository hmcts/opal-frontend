import { ActivatedRoute } from '@angular/router';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../constants/fines-draft-route-data-keys.constant';
import {
  getResolvedDraftAccountsByKey,
  getResolvedDraftAccounts,
  getResolvedDraftCount,
  getResolvedOrFetchDraftCount,
  isFinesDraftAccountsResponse,
} from './fines-draft-route-data.utils';

const createActivatedRoute = (data: Record<string, unknown>): ActivatedRoute =>
  ({
    snapshot: {
      data,
    },
  }) as ActivatedRoute;

describe('finesDraftRouteDataUtils', () => {
  it('should identify valid draft account responses', () => {
    expect(isFinesDraftAccountsResponse(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)).toBe(true);
    expect(isFinesDraftAccountsResponse({ count: '1', summaries: [] })).toBe(false);
    expect(isFinesDraftAccountsResponse({ count: 1 })).toBe(false);
  });

  it('should read resolved draft accounts from route data', () => {
    const activatedRoute = createActivatedRoute({
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
    });

    expect(getResolvedDraftAccounts(activatedRoute)).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
  });

  it('should read resolved draft accounts using a specific route data key', () => {
    const activatedRoute = createActivatedRoute({
      [FINES_DRAFT_ROUTE_DATA_KEYS.allRejectedAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
    });

    expect(getResolvedDraftAccountsByKey(activatedRoute, FINES_DRAFT_ROUTE_DATA_KEYS.allRejectedAccounts)).toEqual(
      OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
    );
  });

  it('should return null when resolved draft accounts are malformed', () => {
    const activatedRoute = createActivatedRoute({
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: { count: 1 },
    });

    expect(getResolvedDraftAccounts(activatedRoute)).toBeNull();
  });

  it('should read resolved draft counts from route data', () => {
    const activatedRoute = createActivatedRoute({
      [FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount]: 5,
    });

    expect(getResolvedDraftCount(activatedRoute, FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount)).toBe(5);
  });

  it('should use resolved count before falling back to an API request', async () => {
    const activatedRoute = createActivatedRoute({
      [FINES_DRAFT_ROUTE_DATA_KEYS.failedCount]: 7,
    });
    const fetchDraftAccounts = vi.fn().mockReturnValue(of({ count: 1, summaries: [] }));

    const count = await firstValueFrom(
      getResolvedOrFetchDraftCount(activatedRoute, FINES_DRAFT_ROUTE_DATA_KEYS.failedCount, fetchDraftAccounts),
    );

    expect(count).toBe(7);
    expect(fetchDraftAccounts).not.toHaveBeenCalled();
  });

  it('should fetch count when route data does not contain a resolved count', async () => {
    const activatedRoute = createActivatedRoute({});
    const fetchDraftAccounts = vi.fn().mockReturnValue(of({ count: 3, summaries: [] }));

    const count = await firstValueFrom(
      getResolvedOrFetchDraftCount(activatedRoute, FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount, fetchDraftAccounts),
    );

    expect(count).toBe(3);
    expect(fetchDraftAccounts).toHaveBeenCalledOnce();
  });
});
