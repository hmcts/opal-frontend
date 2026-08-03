import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { distinctUntilChanged, EMPTY, filter, map, merge, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import {
  FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED,
} from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort.constants';
import { CommonModule } from '@angular/common';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { FinesDraftService } from '../../services/fines-draft.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { FINES_DRAFT_MAX_REJECTED } from '../../constants/fines-draft-max-rejected.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { MojNotificationBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-notification-badge';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_DRAFT_TAB_FRAGMENT } from '../../constants/fines-draft-tab-fragments.constant';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../../constants/fines-draft-route-data-keys.constant';
import { getResolvedDraftAccounts, getResolvedDraftCount } from '../../utils/fines-draft-route-data.utils';
import { buildFinesDraftAccountParams } from '../../utils/fines-draft-account-params.utils';
import { FINES_DRAFT_RESOLVER_EMPTY_RESPONSE } from '../../routing/resolvers/constants/fines-draft-resolver-empty-response.constant';
import { IFinesDraftTabAccounts } from '../../interfaces/fines-draft-tab-accounts.interface';
import { createDraftFragmentStream } from '../../utils/fines-draft-fragment-stream.utils';

@Component({
  selector: 'app-fines-draft-check-and-validate-tabs',
  imports: [
    CommonModule,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    FinesDraftTableWrapperComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
    MojNotificationBadgeComponent,
  ],
  templateUrl: './fines-draft-check-and-validate-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCheckAndValidateTabsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly globalStore = inject(GlobalStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly dateService = inject(DateService);
  private readonly userState = this.globalStore.userState();

  protected readonly finesDraftStore = inject(FinesDraftStore);
  protected readonly finesDraftCheckAndValidateRoutingPaths = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;
  protected readonly finesDraftTabFragment = FINES_DRAFT_TAB_FRAGMENT;

  public readonly finesDraftService = inject(FinesDraftService);
  public tabData$!: Observable<IFinesDraftTableWrapperTableData[]>;
  public failedCount$!: Observable<string>;
  public tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;

  /**
   * Initializes and sets up the observable data stream for the fines draft tab component.
   *
   * This method listens to changes in the route fragment (representing the active tab),
   * and updates the tab data stream accordingly. It uses the provided initial tab,
   * and constructs the necessary parameters for fetching and populating the tab's table data.
   *
   */
  private setupTabDataStream(): Observable<IFinesDraftTabAccounts> {
    const fragment$ = createDraftFragmentStream(
      this.getFragmentStream(FINES_DRAFT_TAB_FRAGMENT.toReview, this.destroy$),
      () => this.opalFinesService.clearCache('draftAccountsCache$'),
    );
    let pendingResolvedDraftAccounts = getResolvedDraftAccounts(this.activatedRoute);

    const draftAccounts$: Observable<IFinesDraftTabAccounts> = fragment$.pipe(
      switchMap((tab) => {
        const resolvedDraftAccounts = pendingResolvedDraftAccounts;
        pendingResolvedDraftAccounts = null;

        if (tab === FINES_DRAFT_TAB_FRAGMENT.deleted || tab === FINES_DRAFT_TAB_FRAGMENT.failed) {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED;
        } else {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
        }

        const currentTab = FINES_DRAFT_TAB_STATUSES.find((t) => t.tab === tab);
        if (!currentTab) {
          return of({ tab, response: FINES_DRAFT_RESOLVER_EMPTY_RESPONSE });
        }

        const params: IOpalFinesDraftAccountParams = buildFinesDraftAccountParams(this.userState, {
          statuses: currentTab.statuses,
          includeSubmittedBy: false,
          includeNotSubmittedBy: true,
        });

        if (currentTab?.historicWindowInDays) {
          const { from, to } = this.dateService.getDateRange(currentTab.historicWindowInDays, 0);
          params.accountStatusDateFrom = [from];
          params.accountStatusDateTo = [to];
        }

        if (resolvedDraftAccounts) {
          return of({ tab, response: resolvedDraftAccounts });
        }

        return this.opalFinesService.getDraftAccounts(params).pipe(map((response) => ({ tab, response })));
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.tabData$ = draftAccounts$.pipe(map(({ response }) => this.finesDraftService.populateTableData(response)));

    return draftAccounts$;
  }

  /**
   * Initializes the `failedCount$` observable stream to track the number of draft accounts
   * with a "publishFailed" status. This method sets up the stream to:
   * - Use the resolved failed count when route data is available.
   * - Fall back to fetching the count matching the specified business unit IDs, user IDs, and status.
   * - Format the resulting count with a cap defined by `FINES_DRAFT_MAX_REJECTED`.
   *
   * The stream is automatically cleaned up when the component is destroyed.
   *
   * @private
   */
  private setupFailedCountStream(draftAccounts$: Observable<IFinesDraftTabAccounts>): void {
    const failedCount$ = merge(
      this.getInitialFailedCountStream(),
      draftAccounts$.pipe(
        filter(({ tab }) => tab === FINES_DRAFT_TAB_FRAGMENT.failed),
        map(({ response }) => response.count),
      ),
    );

    this.failedCount$ = failedCount$.pipe(
      map((count) => this.formatCountWithCap(count, FINES_DRAFT_MAX_REJECTED)),
      distinctUntilChanged(),
    );
  }

  /**
   * Uses the resolved failed count when available, otherwise fetches it unless the failed tab response is already active.
   *
   * @returns The initial failed count stream.
   */
  private getInitialFailedCountStream(): Observable<number> {
    const resolvedCount = getResolvedDraftCount(this.activatedRoute, FINES_DRAFT_ROUTE_DATA_KEYS.failedCount);
    if (resolvedCount !== null) {
      return of(resolvedCount);
    }

    const initialTab = this.activatedRoute.snapshot.fragment ?? FINES_DRAFT_TAB_FRAGMENT.toReview;
    if (initialTab === FINES_DRAFT_TAB_FRAGMENT.failed) {
      return EMPTY;
    }

    return this.opalFinesService
      .getDraftAccounts(
        buildFinesDraftAccountParams(this.userState, {
          statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed],
          includeSubmittedBy: false,
          includeNotSubmittedBy: true,
        }),
      )
      .pipe(map((response) => response.count));
  }

  /**
   * Handles the click event for a defendant in the fines draft process.
   *
   * Sets the current fragment and checker state in the fines draft store,
   * then triggers the defendant click logic in the fines draft service,
   * navigating to the review account path.
   *
   * @param row - The draft account row associated with the defendant.
   */
  public onDefendantClick(row: IFinesDraftTableWrapperTableData): void {
    const draftAccountId = +row['Defendant id'];
    this.finesDraftStore.setFragmentAndChecker(this.activeTab, true);
    this.finesDraftService.onDefendantClick(draftAccountId, this.finesDraftService.PATH_REVIEW_ACCOUNT);
  }

  /**
   * Handles the click event for an account.
   *
   * Navigates to the Account Details page for the specified account id.
   *
   * @param accountID - The account id of the clicked account.
   */
  public onAccountClick(accountID: number): void {
    this['router'].navigate([
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.children.defendant,
      accountID,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
    ]);
  }

  /**
   * Resets draft state and initializes the tab data and failed count streams.
   */
  public ngOnInit(): void {
    this.finesDraftStore.resetFineDraftState();
    this.finesDraftStore.resetFragmentAndChecker();
    const draftAccounts$ = this.setupTabDataStream();
    this.setupFailedCountStream(draftAccounts$);
  }

  /**
   * Completes the component teardown stream used by route fragment subscriptions.
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
