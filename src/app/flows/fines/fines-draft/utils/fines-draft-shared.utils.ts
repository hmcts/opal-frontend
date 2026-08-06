import { ActivatedRoute } from '@angular/router';
import { type IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { IDateRange } from '@hmcts/opal-frontend-common/services/date-service/interfaces';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { distinctUntilChanged, EMPTY, filter, map, merge, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { FINES_DRAFT_TAB_STATUSES } from '../constants/fines-draft-tab-statuses.constant';
import { IFinesDraftTableWrapperTableData } from '../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { IFinesDraftAccountParamOptions } from '../interfaces/fines-draft-account-param-options.interface';
import { IFinesDraftTabAccounts } from '../interfaces/fines-draft-tab-accounts.interface';
import { FinesDraftCountRouteDataKey } from '../types/fines-draft-count-route-data-key.type';
import { FinesDraftTabFragment } from '../types/fines-draft-tab-fragment.type';
import { FINES_DRAFT_RESOLVER_EMPTY_RESPONSE } from '../routing/resolvers/constants/fines-draft-resolver-empty-response.constant';
import { buildFinesDraftAccountParams } from './fines-draft-account-params.utils';
import { getResolvedDraftAccounts, getResolvedDraftCount } from './fines-draft-route-data.utils';

type FinesDraftTabAccountParamOptions = Omit<IFinesDraftAccountParamOptions, 'statuses'>;
type GetDraftAccounts = (params: IOpalFinesDraftAccountParams) => Observable<IOpalFinesDraftAccountsResponse>;

export interface IFinesDraftTabDataStreamsOptions {
  fragment$: Observable<string>;
  activatedRoute: ActivatedRoute;
  userState: IOpalUserState;
  accountParamOptions: FinesDraftTabAccountParamOptions;
  clearCache: () => void;
  getDateRange: (historicWindowInDays: number) => IDateRange;
  getDraftAccounts: GetDraftAccounts;
  onTabChange: (tab: string) => void;
  populateTableData: (response: IOpalFinesDraftAccountsResponse) => IFinesDraftTableWrapperTableData[];
}

export interface IFinesDraftTabDataStreams {
  draftAccounts$: Observable<IFinesDraftTabAccounts>;
  tabData$: Observable<IFinesDraftTableWrapperTableData[]>;
}

export interface IFinesDraftTabCountStreamOptions {
  activatedRoute: ActivatedRoute;
  draftAccounts$: Observable<IFinesDraftTabAccounts>;
  routeDataKey: FinesDraftCountRouteDataKey;
  defaultTab: FinesDraftTabFragment;
  countTab: FinesDraftTabFragment;
  userState: IOpalUserState;
  accountParamOptions: IFinesDraftAccountParamOptions;
  getDraftAccounts: GetDraftAccounts;
  formatCount: (count: number) => string;
}

/**
 * Preserves the initial resolver cache and clears it on later draft tab changes.
 *
 * @param fragment$ - The active draft tab stream.
 * @param clearCache - The callback that clears the draft accounts cache.
 * @returns The active draft tab stream with cache invalidation applied.
 */
export function createDraftFragmentStream(fragment$: Observable<string>, clearCache: () => void): Observable<string> {
  let isInitialFragment = true;

  return fragment$.pipe(
    tap(() => {
      if (isInitialFragment) {
        isInitialFragment = false;
        return;
      }

      clearCache();
    }),
  );
}

/**
 * Creates the shared resolver-backed draft account stream used by the draft tab pages.
 *
 * @param options - Route, request, cache, date, and flow-specific tab configuration.
 * @returns The shared account-response stream and its table-data projection.
 */
export function createDraftTabDataStreams(options: IFinesDraftTabDataStreamsOptions): IFinesDraftTabDataStreams {
  const fragment$ = createDraftFragmentStream(options.fragment$, options.clearCache);
  let pendingResolvedDraftAccounts = getResolvedDraftAccounts(options.activatedRoute);

  const draftAccounts$ = fragment$.pipe(
    switchMap((tab) => {
      const resolvedDraftAccounts = pendingResolvedDraftAccounts;
      pendingResolvedDraftAccounts = null;
      options.onTabChange(tab);

      const currentTab = FINES_DRAFT_TAB_STATUSES.find((tabStatus) => tabStatus.tab === tab);
      if (!currentTab) {
        return of({ tab, response: FINES_DRAFT_RESOLVER_EMPTY_RESPONSE });
      }

      const params = buildFinesDraftAccountParams(options.userState, {
        ...options.accountParamOptions,
        statuses: currentTab.statuses,
      });

      if (currentTab.historicWindowInDays) {
        const { from, to } = options.getDateRange(currentTab.historicWindowInDays);
        params.accountStatusDateFrom = [from];
        params.accountStatusDateTo = [to];
      }

      if (resolvedDraftAccounts) {
        return of({ tab, response: resolvedDraftAccounts });
      }

      return options.getDraftAccounts(params).pipe(map((response) => ({ tab, response })));
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  return {
    draftAccounts$,
    tabData$: draftAccounts$.pipe(map(({ response }) => options.populateTableData(response))),
  };
}

/**
 * Creates a formatted count stream for a draft status tab.
 *
 * The resolved count is preferred. When no count was resolved, a separate request is made unless the count tab is the
 * initial tab, in which case the active tab response supplies the count.
 *
 * @param options - Route, active-tab stream, request, and formatting configuration.
 * @returns The formatted draft status count stream.
 */
export function createDraftTabCountStream(options: IFinesDraftTabCountStreamOptions): Observable<string> {
  const resolvedCount = getResolvedDraftCount(options.activatedRoute, options.routeDataKey);
  let initialCount$: Observable<number>;

  if (resolvedCount !== null) {
    initialCount$ = of(resolvedCount);
  } else {
    const initialTab = options.activatedRoute.snapshot.fragment ?? options.defaultTab;
    initialCount$ =
      initialTab === options.countTab
        ? EMPTY
        : options
            .getDraftAccounts(buildFinesDraftAccountParams(options.userState, options.accountParamOptions))
            .pipe(map((response) => response.count));
  }

  return merge(
    initialCount$,
    options.draftAccounts$.pipe(
      filter(({ tab }) => tab === options.countTab),
      map(({ response }) => response.count),
    ),
  ).pipe(map(options.formatCount), distinctUntilChanged());
}
