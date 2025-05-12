import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_MAC_ACCOUNT_TYPES } from '../../../fines-mac/constants/fines-mac-account-types';
import { FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT } from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort-default.constant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { MojBannerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-banner';
import {
  MojSubNavigationItemComponent,
  MojSubNavigationComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS } from '../routing/constants/fines-draft-check-and-manage-routing-paths.constant';
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
import { OpalFinesDraftAccountStatuses } from '@services/fines/opal-fines-service/enums/opal-fines-draft-account-statuses.enum';
@Component({
  selector: 'app-fines-draft-check-and-manage-tabs',
  imports: [
    CommonModule,
    MojBannerComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    MojBadgeComponent,
    FinesDraftTableWrapperComponent,
  ],
  templateUrl: './fines-draft-check-and-manage-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCheckAndManageTabsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly dateService = inject(DateService);
  protected readonly finesDraftStore = inject(FinesDraftStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly globalStore = inject(GlobalStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly businessUnitIds = this.globalStore
    .userState()
    .business_unit_user.map((business_unit_user) => business_unit_user.business_unit_id);
  private readonly businessUnitUserIds = this.globalStore
    .userState()
    .business_unit_user.map((business_unit_user) => business_unit_user.business_unit_user_id);

  protected readonly finesDraftCheckAndManageRoutingPaths = FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS;

  public tabData$!: Observable<IFinesDraftTableWrapperTableData[]>;
  public rejectedCount$!: Observable<string>;

  public tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
  public activeTab!: string;

  /**
   * Populates table data from the given response.
   *
   * @param {IOpalFinesDraftAccountsResponse} response - The response containing draft account summaries.
   * @returns {IFinesDraftTableWrapperTableData[]} An array of table data objects.
   */
  private populateTableData(response: IOpalFinesDraftAccountsResponse): IFinesDraftTableWrapperTableData[] {
    return response.summaries.map(({ draft_account_id, account_snapshot }) => {
      const { defendant_name, date_of_birth, created_date, account_type, business_unit_name } = account_snapshot;

      return {
        Account: '',
        'Defendant id': draft_account_id,
        Defendant: defendant_name,
        'Date of birth': date_of_birth,
        CreatedDate: created_date,
        Created: this.dateService.getDaysAgo(created_date),
        'Account type': FINES_MAC_ACCOUNT_TYPES[account_type as keyof typeof FINES_MAC_ACCOUNT_TYPES],
        'Business unit': business_unit_name,
      };
    });
  }

  /**
   * Navigates to the review account page for the given draft account ID.
   *
   * @param draftAccountId - The ID of the draft account to review.
   * @returns void
   */
  private navigateToReviewAccount(draftAccountId: number): void {
    this.finesDraftStore.setFragmentAndAmend(this.activeTab, this.activeTab === 'rejected');
    if (this.finesDraftStore.amend()) {
      this.router.navigate([
        `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`,
        draftAccountId,
      ]);
    } else {
      this.router.navigate([
        `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`,
        draftAccountId,
      ]);
    }
  }

  /**
   * Sets up a data stream for managing tab-specific data in the component.
   *
   * This method initializes an observable (`tabData$`) that listens to changes in the
   * route fragment and dynamically fetches or processes data based on the active tab.
   * It also updates the `activeTab` property whenever the tab changes.
   *
   * @param initialData - The initial data to populate the table when the component is initialized.
   * @param initialTab - The default tab to be used when the component is first loaded.
   *
   * The observable performs the following steps:
   * - Listens to the route fragment and starts with the `initialTab`.
   * - Filters out invalid fragments and ensures only valid strings are processed.
   * - Updates the `activeTab` property whenever the tab changes.
   * - Fetches data for the active tab:
   *   - If the tab matches the `initialTab`, it uses the provided `initialData`.
   *   - Otherwise, it fetches data from the `opalFinesService` based on the tab's statuses,
   *     business unit IDs, and user IDs.
   * - Shares the fetched data across multiple subscribers using `shareReplay`.
   * - Cleans up the observable when the component is destroyed using `takeUntil`.
   */
  private setupTabDataStream(initialData: IOpalFinesDraftAccountsResponse, initialTab: string): void {
    this.tabData$ = this.activatedRoute.fragment.pipe(
      filter((frag): frag is string => !!frag),
      startWith(initialTab),
      map((tab) => tab!),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      tap((tab) => (this.activeTab = tab)),
      switchMap((tab) => {
        if (tab === initialTab) {
          return of(this.populateTableData(initialData));
        }

        return this.opalFinesService
          .getDraftAccounts({
            businessUnitIds: this.businessUnitIds,
            statuses: FINES_DRAFT_TAB_STATUSES.find((t) => t.tab === tab)?.statuses,
            submittedBy: this.businessUnitUserIds,
          })
          .pipe(
            map((res) => this.populateTableData(res)),
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
   * Sets up a stream to manage the rejected count for fines draft tabs.
   * This stream listens to router navigation events and updates the rejected count
   * based on the currently active tab. If the active tab matches the initial tab,
   * it uses the provided `resolverRejectedCount`. Otherwise, it fetches the rejected
   * count dynamically from the `opalFinesService`.
   *
   * @param resolverRejectedCount - The initial rejected count to use for the default tab.
   * @param initialTab - The name of the initial tab to compare against during navigation.
   * @returns An observable that emits the formatted rejected count as a string.
   */
  private setupRejectedCountStream(resolverRejectedCount: number, initialTab: string): void {
    const tab$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute.snapshot.fragment || 'review'),
      distinctUntilChanged(),
      startWith(initialTab),
    );
    this.rejectedCount$ = tab$.pipe(
      switchMap((tab) => {
        if (tab === initialTab) {
          const capped = this.formatCount(resolverRejectedCount);
          return of(capped);
        } else {
          // Fetch new rejected count on tab change
          const params = {
            businessUnitIds: [], // Provide actual business unit IDs here if needed
            statuses: [OpalFinesDraftAccountStatuses.rejected],
          };
          return this.opalFinesService.getDraftAccounts(params).pipe(map((res) => this.formatCount(res.count)));
        }
      }),
    );
  }

  /**
   * Handles the click event on a defendant item.
   * Navigates to the review account page for the specified defendant.
   *
   * @param {number} id - The unique identifier of the defendant.
   * @returns {void}
   */
  public onDefendantClick(id: number): void {
    this.navigateToReviewAccount(id);
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
