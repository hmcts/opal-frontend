import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT } from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort-default.constant';
import { NavigationEnd } from '@angular/router';
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
import { distinctUntilChanged, filter, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { AbstractTabData } from 'src/app/abstract/abstract-tab-data';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_DRAFT_MAX_REJECTED } from '../../constants/fines-draft-max-rejected.constant';

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
export class FinesDraftCreateAndManageTabsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly globalStore = inject(GlobalStore);
  private readonly opalFinesService = inject(OpalFines);
  protected readonly finesDraftStore = inject(FinesDraftStore);
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
   * Initializes and sets up the observable data stream for tab-specific data in the fines draft management component.
   *
   * @param initialData - The initial data response containing fines draft account information.
   * @param initialTab - The tab identifier to be selected initially.
   *
   * This method:
   * - Listens to changes in the route fragment to detect tab changes.
   * - Filters and maps the fragment to ensure a valid tab string is used.
   * - Uses the fragment observable to drive the data stream for the selected tab.
   * - Constructs the necessary parameters for fetching tab data based on the current tab.
   * - Fetches the draft accounts data from the service and processes it for table display.
   * - Assigns the resulting observable to `tabData$` for use in the component template.
   */
  private setupTabDataStream(initialData: IOpalFinesDraftAccountsResponse, initialTab: string): void {
    const fragment$ = this['activatedRoute'].fragment.pipe(
      startWith(initialTab),
      filter((frag): frag is string => !!frag),
      map((tab) => tab!),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    );

    this.tabData$ = this.createTabDataStream(
      initialData,
      initialTab,
      fragment$,
      (tab) => ({
        businessUnitIds: this.businessUnitIds,
        statuses: FINES_DRAFT_TAB_STATUSES.find((t) => t.tab === tab)?.statuses,
        submittedBy: this.businessUnitUserIds,
      }),
      (params) => this.opalFinesService.getDraftAccounts(params),
      (res) => this.finesDraftService.populateTableData(res),
    );
  }

  /**
   * Initializes and sets up the observable stream for tracking the count of rejected draft fines.
   *
   * This method listens to Angular router navigation events to detect changes in the URL fragment,
   * which determines the currently active tab. It then creates an observable (`rejectedCount$`)
   * that emits the formatted count of rejected draft fines, capped at a predefined maximum.
   *
   * @param resolverRejectedCount - The initial count of rejected draft fines, typically resolved from a route resolver.
   * @param initialTab - The name of the tab to be selected initially, used as the default fragment.
   *
   * @remarks
   * - The stream is automatically unsubscribed when the component is destroyed.
   * - The count is fetched from the backend using `opalFinesService.getDraftAccounts` with appropriate filter parameters.
   * - The count is formatted and capped using `formatCountWithCap`.
   */
  private setupRejectedCountStream(resolverRejectedCount: number, initialTab: string): void {
    const fragment$ = this['router'].events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this['activatedRoute'].snapshot.fragment || 'review'),
      distinctUntilChanged(),
      startWith(initialTab),
      takeUntil(this.destroy$),
    );

    this.rejectedCount$ = this.createCountStream(
      initialTab,
      resolverRejectedCount,
      fragment$,
      () => ({
        businessUnitIds: this.businessUnitIds,
        submittedBy: this.businessUnitUserIds,
        statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
      }),
      (params) => this.opalFinesService.getDraftAccounts(params),
      (res) => res.count,
      (count) => this.formatCountWithCap(count, FINES_DRAFT_MAX_REJECTED),
    );
  }

  /**
   * Handles the click event for a defendant in the fines draft context.
   *
   * Sets the current fragment and amend state in the fines draft store based on the active tab,
   * then triggers the defendant click logic in the fines draft service with the appropriate path.
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
   * Navigates to the specified route relative to the parent route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.finesDraftStore.setFragment(this.activeTab);
    this['router'].navigate([route], { relativeTo: this['activatedRoute'].parent });
  }

  public ngOnInit(): void {
    this.finesDraftStore.resetFineDraftState();
    this.finesDraftStore.resetFragmentAndAmend();
    const resolvedDraftAccounts = this['activatedRoute'].snapshot.data[
      'draftAccounts'
    ] as IOpalFinesDraftAccountsResponse;
    const resolvedRejectedAccounts = this['activatedRoute'].snapshot.data['rejectedCount'] as number;
    const initialTab = this['activatedRoute'].snapshot.fragment ?? 'review';
    this.setupTabDataStream(resolvedDraftAccounts, initialTab);
    this.setupRejectedCountStream(resolvedRejectedAccounts, initialTab);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
