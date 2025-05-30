import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import {
  FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED,
} from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort-default.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { MojBannerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-banner';
import {
  MojSubNavigationItemComponent,
  MojSubNavigationComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from '../routing/constants/fines-draft-create-and-manage-routing-paths.constant';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { FINES_DRAFT_MAX_REJECTED } from '../../constants/fines-draft-max-rejected.constant';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
@Component({
  selector: 'app-fines-draft-create-and-manage-tabs',
  imports: [
    CommonModule,
    MojBannerComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    MojBadgeComponent,
    FinesDraftTableWrapperComponent,
  ],
  templateUrl: './fines-draft-create-and-manage-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCreateAndManageTabsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  protected readonly finesDraftStore = inject(FinesDraftStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly globalStore = inject(GlobalStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly finesDraftService = inject(FinesDraftService);
  private readonly dateService = inject(DateService);
  private readonly userState = this.globalStore.userState();
  private readonly businessUnitIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_id,
  );
  private readonly businessUnitUserIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_user_id,
  );

  protected readonly finesDraftCreateAndManageRoutingPaths = FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS;

  public tabData$!: Observable<IFinesDraftTableWrapperTableData[]>;
  public rejectedCount$!: Observable<string>;

  public tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
  public activeTab!: string;
  private readonly BASE_PATH = `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/`;
  public readonly PATH_REVIEW_ACCOUNT = `${this.BASE_PATH}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`;
  public readonly PATH_AMEND_ACCOUNT = `${this.BASE_PATH}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;

  /**
   * Initializes and manages the observable stream for tab data in the fines draft create and manage component.
   *
   * This method sets up `tabData$` as an observable that reacts to changes in the route fragment (representing the active tab).
   * It emits the appropriate table data for the selected tab, using the provided initial data for the first tab load,
   * and fetching fresh data from the API for subsequent tab changes.
   *
   * @param initialData - The initial fines draft accounts response used to populate the table data for the first tab load.
   * @param initialTab - The name of the tab to be initially selected and loaded.
   *
   * @remarks
   * - Uses Angular's `ActivatedRoute` to listen for fragment changes (tab selection).
   * - Ensures the initial data is only used once for the first tab load.
   * - Fetches and populates table data for other tabs using the `opalFinesService`.
   * - Cleans up the observable stream on component destruction.
   */
  private setupTabDataStream(initialData: IOpalFinesDraftAccountsResponse, initialTab: string): void {
    let initialTabUsed = false;

    this.tabData$ = this.activatedRoute.fragment.pipe(
      tap((tab) => {
        this.activeTab = tab ?? initialTab;
        if (tab === 'deleted') {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED;
        } else {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
        }
      }),
      switchMap((tab) => {
        const isFirstInitialTab = tab === initialTab && !initialTabUsed;

        if (isFirstInitialTab) {
          initialTabUsed = true;
          return of(this.finesDraftService.populateTableData(initialData));
        }

        const currentTab = FINES_DRAFT_TAB_STATUSES.find((t) => t.tab === tab);

        const params: IOpalFinesDraftAccountParams = {
          businessUnitIds: this.businessUnitIds,
          statuses: currentTab?.statuses,
          submittedBy: this.businessUnitUserIds,
        };

        if (currentTab?.historicWindowInDays) {
          const { from, to } = this.dateService.getDateRange(currentTab.historicWindowInDays, 0);
          params.accountStatusDateFrom = [from];
          params.accountStatusDateTo = [to];
        }

        return this.opalFinesService.getDraftAccounts(params).pipe(
          map((res) => this.finesDraftService.populateTableData(res)),
          shareReplay(1),
        );
      }),
    );
  }

  /**
   * Formats a given count as a string. If the count exceeds the maximum allowed
   * rejected fines (`FINES_DRAFT_MAX_REJECTED`), it appends a "+" to the maximum value.
   * Otherwise, it returns the count as a string.
   *
   * @param count - The number to format.
   * @returns A formatted string representing the count or the maximum value with a "+" suffix.
   */
  private formatCount(count: number): string {
    return count > FINES_DRAFT_MAX_REJECTED ? `${FINES_DRAFT_MAX_REJECTED}+` : `${count}`;
  }

  /**
   * Initializes and manages the observable stream `rejectedCount$` that tracks the count of rejected draft accounts
   * based on the currently active tab and route fragment. The stream emits a formatted count value, either from the
   * provided resolver on the initial tab load or by fetching updated counts from the backend service when the tab changes.
   *
   * @param resolverRejectedCount - The initial count of rejected draft accounts, typically resolved before component initialization.
   * @param initialTab - The name of the tab to be used as the initial active tab.
   *
   * @remarks
   * - The stream listens to changes in the route fragment to determine the active tab.
   * - On the first load of the initial tab, it emits the provided resolver count without making a backend call.
   * - For subsequent tab changes, it fetches the rejected count from the backend using the current filter parameters.
   * - The observable is automatically unsubscribed when the component is destroyed.
   */
  private setupRejectedCountStream(resolverRejectedCount: number, initialTab: string): void {
    let initialTabUsed = false;

    this.rejectedCount$ = this.activatedRoute.fragment.pipe(
      filter((frag): frag is string => !!frag),
      startWith(initialTab),
      map((tab) => tab!),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      tap((tab) => (this.activeTab = tab)),
      switchMap((tab) => {
        const isFirstInitialTab = tab === initialTab && !initialTabUsed;

        if (isFirstInitialTab) {
          initialTabUsed = true;
          const capped = this.formatCount(resolverRejectedCount);
          return of(capped);
        }

        const params = {
          businessUnitIds: this.businessUnitIds,
          submittedBy: this.businessUnitUserIds,
          statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
        };
        return this.opalFinesService.getDraftAccounts(params).pipe(map((res) => this.formatCount(res.count)));
      }),
    );
  }

  /**
   * Handles the click event on a defendant item within the fines draft flow.
   *
   * Sets the current fragment and amend state in the fines draft store based on the active tab,
   * then triggers the defendant click logic in the fines draft service, navigating to the appropriate
   * path depending on whether the draft is being amended or reviewed.
   *
   * @param draftAccountId - The unique identifier of the draft account associated with the defendant.
   */
  public onDefendantClick(draftAccountId: number): void {
    this.finesDraftStore.setFragmentAndAmend(this.activeTab, this.activeTab === 'rejected');
    this.finesDraftService.onDefendantClick(
      draftAccountId,
      this.finesDraftStore.amend() ? this.PATH_AMEND_ACCOUNT : this.PATH_REVIEW_ACCOUNT,
    );
  }

  /**
   * Handles the tab switch by updating the active tab and triggering a router fragment update.
   *
   * @param fragment - The identifier of the tab to activate.
   */
  public handleTabSwitch(fragment: string): void {
    this.activeTab = fragment;
    this.router.navigate([], {
      relativeTo: this.activatedRoute.parent,
      fragment,
    });
  }

  /**
   * Navigates to the specified route relative to the parent route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.finesDraftStore.setFragment(this.activeTab);
    this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
  }

  public ngOnInit(): void {
    this.finesDraftStore.resetFineDraftState();
    this.finesDraftStore.resetFragmentAndAmend();
    const resolvedDraftAccounts = this.activatedRoute.snapshot.data['draftAccounts'] as IOpalFinesDraftAccountsResponse;
    const resolvedRejectedAccounts = this.activatedRoute.snapshot.data['rejectedCount'] as number;
    const initialTab = this.activatedRoute.snapshot.fragment ?? 'review';
    this.setupTabDataStream(resolvedDraftAccounts, initialTab);
    this.setupRejectedCountStream(resolvedRejectedAccounts, initialTab);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
