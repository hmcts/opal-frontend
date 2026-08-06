import { ActivatedRoute } from '@angular/router';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { firstValueFrom, of, Subject, toArray } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../constants/fines-draft-route-data-keys.constant';
import { FINES_DRAFT_TAB_FRAGMENT } from '../constants/fines-draft-tab-fragments.constant';
import { FINES_DRAFT_RESOLVER_EMPTY_RESPONSE } from '../routing/resolvers/constants/fines-draft-resolver-empty-response.constant';
import {
  createDraftFragmentStream,
  createDraftTabCountStream,
  createDraftTabDataStreams,
} from './fines-draft-shared.utils';

const createActivatedRoute = (fragment: string | null, data: Record<string, unknown> = {}): ActivatedRoute =>
  ({ snapshot: { fragment, data } }) as unknown as ActivatedRoute;

describe('createDraftFragmentStream', () => {
  it('should preserve the initial fragment without clearing the cache', () => {
    const clearCache = vi.fn();
    const fragments: string[] = [];

    createDraftFragmentStream(of('review'), clearCache).subscribe((fragment) => fragments.push(fragment));

    expect(fragments).toEqual(['review']);
    expect(clearCache).not.toHaveBeenCalled();
  });

  it('should clear the cache for every fragment after the initial emission', () => {
    const clearCache = vi.fn();
    const fragments: string[] = [];

    createDraftFragmentStream(of('review', 'approved', 'deleted'), clearCache).subscribe((fragment) =>
      fragments.push(fragment),
    );

    expect(fragments).toEqual(['review', 'approved', 'deleted']);
    expect(clearCache).toHaveBeenCalledTimes(2);
  });
});

describe('createDraftTabDataStreams', () => {
  it('should use resolved data initially and fetch later tabs with shared cache and date handling', () => {
    const resolvedResponse = { count: 1, summaries: [] };
    const fetchedResponse = { count: 2, summaries: [] };
    const fragmentSubject = new Subject<string>();
    const clearCache = vi.fn();
    const getDateRange = vi.fn(() => ({ from: '2026-07-27', to: '2026-08-03' }));
    const getDraftAccounts = vi.fn(() => of(fetchedResponse));
    const onTabChange = vi.fn();
    const populateTableData = vi.fn(() => []);
    const accountCounts: number[] = [];
    const tableDataLengths: number[] = [];

    const { draftAccounts$, tabData$ } = createDraftTabDataStreams({
      fragment$: fragmentSubject.asObservable(),
      activatedRoute: createActivatedRoute(FINES_DRAFT_TAB_FRAGMENT.review, {
        [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: resolvedResponse,
      }),
      userState: OPAL_USER_STATE_MOCK,
      accountParamOptions: {
        includeSubmittedBy: true,
        includeNotSubmittedBy: false,
      },
      clearCache,
      getDateRange,
      getDraftAccounts,
      onTabChange,
      populateTableData,
    });

    const accountSubscription = draftAccounts$.subscribe(({ response }) => accountCounts.push(response.count));
    const tableDataSubscription = tabData$.subscribe((tableData) => tableDataLengths.push(tableData.length));

    fragmentSubject.next(FINES_DRAFT_TAB_FRAGMENT.review);
    fragmentSubject.next(FINES_DRAFT_TAB_FRAGMENT.approved);

    expect(accountCounts).toEqual([1, 2]);
    expect(tableDataLengths).toEqual([0, 0]);
    expect(onTabChange).toHaveBeenNthCalledWith(1, FINES_DRAFT_TAB_FRAGMENT.review);
    expect(onTabChange).toHaveBeenNthCalledWith(2, FINES_DRAFT_TAB_FRAGMENT.approved);
    expect(clearCache).toHaveBeenCalledTimes(1);
    expect(getDateRange).toHaveBeenCalledWith(7);
    expect(getDraftAccounts).toHaveBeenCalledOnce();
    expect(getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((user) => user.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.approved],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((user) => user.business_unit_user_id),
      accountStatusDateFrom: ['2026-07-27'],
      accountStatusDateTo: ['2026-08-03'],
    });
    expect(populateTableData).toHaveBeenNthCalledWith(1, resolvedResponse);
    expect(populateTableData).toHaveBeenNthCalledWith(2, fetchedResponse);

    accountSubscription.unsubscribe();
    tableDataSubscription.unsubscribe();
  });

  it('should return an empty response without fetching data for an invalid tab', async () => {
    const getDraftAccounts = vi.fn();

    const { draftAccounts$ } = createDraftTabDataStreams({
      fragment$: of('invalid'),
      activatedRoute: createActivatedRoute('invalid'),
      userState: OPAL_USER_STATE_MOCK,
      accountParamOptions: {
        includeSubmittedBy: false,
        includeNotSubmittedBy: true,
      },
      clearCache: vi.fn(),
      getDateRange: vi.fn(),
      getDraftAccounts,
      onTabChange: vi.fn(),
      populateTableData: vi.fn(() => []),
    });

    await expect(firstValueFrom(draftAccounts$)).resolves.toEqual({
      tab: 'invalid',
      response: FINES_DRAFT_RESOLVER_EMPTY_RESPONSE,
    });
    expect(getDraftAccounts).not.toHaveBeenCalled();
  });
});

describe('createDraftTabCountStream', () => {
  const formatCount = (count: number): string => (count >= 100 ? '99+' : count.toString());

  it('should use the resolved count and suppress duplicate active-tab counts', async () => {
    const getDraftAccounts = vi.fn();
    const count$ = createDraftTabCountStream({
      activatedRoute: createActivatedRoute(FINES_DRAFT_TAB_FRAGMENT.review, {
        [FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount]: 100,
      }),
      draftAccounts$: of({
        tab: FINES_DRAFT_TAB_FRAGMENT.rejected,
        response: { count: 100, summaries: [] },
      }),
      routeDataKey: FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount,
      defaultTab: FINES_DRAFT_TAB_FRAGMENT.review,
      countTab: FINES_DRAFT_TAB_FRAGMENT.rejected,
      userState: OPAL_USER_STATE_MOCK,
      accountParamOptions: {
        statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
        includeSubmittedBy: true,
        includeNotSubmittedBy: false,
      },
      getDraftAccounts,
      formatCount,
    });

    await expect(firstValueFrom(count$.pipe(toArray()))).resolves.toEqual(['99+']);
    expect(getDraftAccounts).not.toHaveBeenCalled();
  });

  it('should fetch the count when the initial fragment is missing', async () => {
    const getDraftAccounts = vi.fn(() => of({ count: 4, summaries: [] }));
    const count$ = createDraftTabCountStream({
      activatedRoute: createActivatedRoute(null),
      draftAccounts$: of({
        tab: FINES_DRAFT_TAB_FRAGMENT.review,
        response: { count: 1, summaries: [] },
      }),
      routeDataKey: FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount,
      defaultTab: FINES_DRAFT_TAB_FRAGMENT.review,
      countTab: FINES_DRAFT_TAB_FRAGMENT.rejected,
      userState: OPAL_USER_STATE_MOCK,
      accountParamOptions: {
        statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
        includeSubmittedBy: true,
        includeNotSubmittedBy: false,
      },
      getDraftAccounts,
      formatCount,
    });

    await expect(firstValueFrom(count$)).resolves.toBe('4');
    expect(getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((user) => user.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((user) => user.business_unit_user_id),
    });
  });

  it('should use the active count-tab response without making a separate count request', async () => {
    const getDraftAccounts = vi.fn();
    const count$ = createDraftTabCountStream({
      activatedRoute: createActivatedRoute(FINES_DRAFT_TAB_FRAGMENT.rejected),
      draftAccounts$: of({
        tab: FINES_DRAFT_TAB_FRAGMENT.rejected,
        response: { count: 3, summaries: [] },
      }),
      routeDataKey: FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount,
      defaultTab: FINES_DRAFT_TAB_FRAGMENT.review,
      countTab: FINES_DRAFT_TAB_FRAGMENT.rejected,
      userState: OPAL_USER_STATE_MOCK,
      accountParamOptions: {
        statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
        includeSubmittedBy: true,
        includeNotSubmittedBy: false,
      },
      getDraftAccounts,
      formatCount,
    });

    await expect(firstValueFrom(count$)).resolves.toBe('3');
    expect(getDraftAccounts).not.toHaveBeenCalled();
  });
});
