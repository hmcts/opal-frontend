import { ActivatedRoute } from '@angular/router';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { describe, expect, it } from 'vitest';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../constants/fines-draft-route-data-keys.constant';
import {
  getResolvedDraftAccountsByKey,
  getResolvedDraftAccounts,
  getResolvedDraftCount,
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
});
