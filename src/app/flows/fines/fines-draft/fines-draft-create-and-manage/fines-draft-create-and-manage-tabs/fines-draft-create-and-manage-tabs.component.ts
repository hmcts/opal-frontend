import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT } from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort-default.constant';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { distinctUntilChanged, filter, map, Observable, startWith, Subject, takeUntil, tap } from 'rxjs';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFinesDraftAccountStatuses } from '@services/fines/opal-fines-service/enums/opal-fines-draft-account-statuses.enum';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths.constant';

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
  private readonly globalStore = inject(GlobalStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly finesDraftService = inject(FinesDraftService);
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
  private readonly BASE_PATH = `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/`;
  public readonly PATH_REVIEW_ACCOUNT = `${this.BASE_PATH}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`;
  public readonly PATH_AMEND_ACCOUNT = `${this.BASE_PATH}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;

  /**
   * Initializes the tab data stream for the fines draft management tabs.
   *
   * This method sets up an observable (`tabData$`) that emits tab-specific data
   * based on the provided initial data, the selected tab, and changes to the route fragment.
   * It listens for tab changes, updates the active tab in the service, and constructs
   * the required filter parameters for each tab.
   *
   * @param initialData - The initial fines draft accounts response data used to populate the tabs.
   * @param initialTab - The tab to be selected initially.
   */
  private setupTabDataStream(initialData: IOpalFinesDraftAccountsResponse, initialTab: string): void {
    this.tabData$ = this.finesDraftService.createTabDataStream(
      initialData,
      initialTab,
      this.activatedRoute.fragment.pipe(
        startWith(initialTab),
        filter((frag): frag is string => !!frag),
        map((tab) => tab!),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((tab) => (this.finesDraftService.activeTab = tab)),
      ),
      (tab) => ({
        businessUnitIds: this.businessUnitIds,
        statuses: FINES_DRAFT_TAB_STATUSES.find((t) => t.tab === tab)?.statuses,
        submittedBy: this.businessUnitUserIds,
      }),
    );
  }

  /**
   * Initializes the `rejectedCount$` observable stream to track the count of rejected fines drafts.
   *
   * This method sets up a stream using the `finesDraftService.createRejectedCountStream` method,
   * which listens for navigation events and updates the rejected count based on the current tab and filter criteria.
   *
   * @param resolverRejectedCount - The initial count of rejected fines drafts to use as a baseline.
   * @param initialTab - The name of the tab to use as the initial filter for the stream.
   *
   * @remarks
   * The stream listens for `NavigationEnd` events from the Angular router, extracts the current route fragment
   * (defaulting to 'review' if not present), and updates the rejected count accordingly. The filter criteria
   * include the current business unit IDs, user IDs, and a status filter for rejected drafts.
   *
   * The stream is automatically unsubscribed when the component is destroyed.
   */
  private setupRejectedCountStream(resolverRejectedCount: number, initialTab: string): void {
    this.rejectedCount$ = this.finesDraftService.createRejectedCountStream(
      initialTab,
      resolverRejectedCount,
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute.snapshot.fragment || 'review'),
        distinctUntilChanged(),
        startWith(initialTab),
        takeUntil(this.destroy$),
      ),
      () => ({
        businessUnitIds: this.businessUnitIds,
        submittedBy: this.businessUnitUserIds,
        statuses: [OpalFinesDraftAccountStatuses.rejected],
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
    this.finesDraftStore.setFragmentAndAmend(
      this.finesDraftService.activeTab,
      this.finesDraftService.activeTab === 'rejected',
    );
    this.finesDraftService.onDefendantClick(
      draftAccountId,
      this.finesDraftStore.amend() ? this.PATH_AMEND_ACCOUNT : this.PATH_REVIEW_ACCOUNT,
    );
  }

  /**
   * Navigates to the specified route relative to the parent route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.finesDraftStore.setFragment(this.finesDraftService.activeTab);
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
