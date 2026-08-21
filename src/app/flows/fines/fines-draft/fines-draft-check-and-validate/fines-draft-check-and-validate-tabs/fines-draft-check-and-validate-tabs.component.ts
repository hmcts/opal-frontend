import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { Observable, Subject } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../routing/constants/fines-draft-check-and-validate-routing-paths.constant';
import {
  FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED,
} from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort.constants';
import { CommonModule } from '@angular/common';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { FinesDraftService } from '../../services/fines-draft.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
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
import { IFinesDraftTabAccounts } from '../../interfaces/fines-draft-tab-accounts.interface';
import { createDraftTabCountStream, createDraftTabDataStreams } from '../../utils/fines-draft-shared.utils';

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
    const { draftAccounts$, tabData$ } = createDraftTabDataStreams({
      fragment$: this.getFragmentStream(FINES_DRAFT_TAB_FRAGMENT.toReview, this.destroy$),
      activatedRoute: this.activatedRoute,
      userState: this.userState,
      accountParamOptions: {
        includeSubmittedBy: false,
        includeNotSubmittedBy: true,
      },
      clearCache: () => this.opalFinesService.clearCache('draftAccountsCache$'),
      getDateRange: (historicWindowInDays) => this.dateService.getDateRange(historicWindowInDays, 0),
      getDraftAccounts: (params) => this.opalFinesService.getDraftAccounts(params),
      populateTableData: (response) => this.finesDraftService.populateTableData(response),
      onTabChange: (tab) => {
        if (tab === FINES_DRAFT_TAB_FRAGMENT.deleted || tab === FINES_DRAFT_TAB_FRAGMENT.failed) {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED;
        } else {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
        }
      },
    });

    this.tabData$ = tabData$;

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
    this.failedCount$ = createDraftTabCountStream({
      activatedRoute: this.activatedRoute,
      draftAccounts$,
      routeDataKey: FINES_DRAFT_ROUTE_DATA_KEYS.failedCount,
      defaultTab: FINES_DRAFT_TAB_FRAGMENT.toReview,
      countTab: FINES_DRAFT_TAB_FRAGMENT.failed,
      userState: this.userState,
      accountParamOptions: {
        statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed],
        includeSubmittedBy: false,
        includeNotSubmittedBy: true,
      },
      getDraftAccounts: (params) => this.opalFinesService.getDraftAccounts(params),
      formatCount: (count) => this.formatCountWithCap(count, FINES_DRAFT_MAX_REJECTED),
    });
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
