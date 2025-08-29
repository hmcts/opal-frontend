import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FINES_DRAFT_TABLE_WRAPPER_SORT_APPROVED,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED,
} from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort.constants';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertTextComponent,
  MojAlertIconComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import {
  MojSubNavigationItemComponent,
  MojSubNavigationComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { MojNotificationBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-notification-badge';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from '../routing/constants/fines-draft-create-and-manage-routing-paths.constant';
import { Observable, Subject } from 'rxjs';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesDraftAccountParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-params.interface';
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_DRAFT_MAX_REJECTED } from '../../constants/fines-draft-max-rejected.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_MAC_ACCOUNT_TYPES } from '../../../fines-mac/constants/fines-mac-account-types';

@Component({
  selector: 'app-fines-draft-create-and-manage-tabs',
  imports: [
    CommonModule,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertTextComponent,
    MojAlertIconComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    FinesDraftTableWrapperComponent,
    MojNotificationBadgeComponent,
  ],
  templateUrl: './fines-draft-create-and-manage-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCreateAndManageTabsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly globalStore = inject(GlobalStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly dateService = inject(DateService);
  private readonly userState = this.globalStore.userState();
  private readonly businessUnitIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_id,
  );
  private readonly businessUnitUserIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_user_id,
  );
  private readonly BASE_PATH = `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/`;

  protected readonly finesDraftCreateAndManageRoutingPaths = FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS;
  protected readonly finesDraftStore = inject(FinesDraftStore);

  public tabData$!: Observable<IFinesDraftTableWrapperTableData[]>;
  public rejectedCount$!: Observable<string>;
  public tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
  public readonly finesDraftService = inject(FinesDraftService);
  public readonly PATH_REVIEW_ACCOUNT = `${this.BASE_PATH}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`;
  public readonly PATH_AMEND_ACCOUNT = `${this.BASE_PATH}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;

  /**
   * Initializes the tab data stream for the fines draft create and manage tabs component.
   *
   * This method sets up a reactive data stream (`tabData$`) that updates the tab's data based on the current fragment (tab)
   * and relevant parameters such as business unit IDs, statuses, and user IDs. It also ensures that the draft accounts cache
   * is cleared when the tab changes. The data stream fetches draft account data from the service and processes it for table display.
   *
   * @private
   * @returns {void}
   */
  private setupTabDataStream(): void {
    const fragment$ = this.clearCacheOnTabChange(this.getFragmentStream('review', this.destroy$), () =>
      this.opalFinesService.clearDraftAccountsCache(),
    );

    this.tabData$ = this.createTabDataStream(
      fragment$,
      (tab) => {
        switch (tab) {
          case 'approved':
            this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_APPROVED;
            break;
          case 'deleted':
            this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED;
            break;
          default:
            this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
            break;
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

        return params;
      },
      (params) => this.opalFinesService.getDraftAccounts(params),
      (res) => this.finesDraftService.populateTableData(res),
    );
  }

  /**
   * Initializes the observable stream `rejectedCount$` to track the count of rejected draft accounts.
   *
   * This method sets up a stream that:
   * - Listens for changes to the 'review' tab fragment.
   * - Clears the draft accounts cache when the tab changes.
   * - Fetches the count of rejected draft accounts using the current business unit and user IDs.
   * - Formats the count with a cap defined by `FINES_DRAFT_MAX_REJECTED`.
   *
   * @private
   */
  private setupRejectedCountStream(): void {
    const fragment$ = this.clearCacheOnTabChange(this.getFragmentStream('review', this.destroy$), () =>
      this.opalFinesService.clearDraftAccountsCache(),
    );

    this.rejectedCount$ = this.createCountStream(
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
   * Handles the click event for a defendant in the fines draft process.
   *
   * Sets the current fragment and amendment state based on the active tab,
   * then triggers the defendant click logic in the fines draft service,
   * navigating to the appropriate path depending on whether the draft is being amended or reviewed.
   *
   * @param row - The draft account row associated with the defendant.
   */
  public onDefendantClick(row: IFinesDraftTableWrapperTableData): void {
    const { 'Account type': accountType, 'Defendant id': defendantId } = row;
    this.finesDraftStore.setFragmentAndAmend(this.activeTab, this.activeTab === 'rejected');

    const route =
      this.finesDraftStore.amend() && accountType !== FINES_MAC_ACCOUNT_TYPES['Fixed Penalty']
        ? this.finesDraftService.PATH_AMEND_ACCOUNT
        : this.finesDraftService.PATH_REVIEW_ACCOUNT;

    this.finesDraftService.onDefendantClick(defendantId, route);
  }

  /**
   * Handles the click event for an account.
   *
   * Navigates to the Account Details page for the specified account number.
   *
   * @param accountNumber - The account number of the clicked account.
   */
  public onAccountClick(accountNumber: string): void {
    this['router'].navigate([
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      accountNumber,
      FINES_ACC_ROUTING_PATHS.children.details,
    ]);
  }

  /**
   * Navigates to the specified route relative to the parent of the current activated route.
   * Also sets the current active tab as a fragment in the fines draft store.
   *
   * @param route - The route path to navigate to.
   */
  public handleRoute(route: string): void {
    this.finesDraftStore.setFragment(this.activeTab);
    this['router'].navigate([route], { relativeTo: this['activatedRoute'].parent });
  }

  /**
   * Angular lifecycle hook that is called after the component's data-bound properties have been initialized.
   *
   * This method performs the following initialization tasks:
   * - Resets the fine draft state in the store.
   * - Resets fragment and amendment state in the store.
   * - Sets up the data stream for tab information.
   * - Sets up the stream to track the count of rejected items.
   */
  public ngOnInit(): void {
    this.finesDraftStore.resetFineDraftState();
    this.finesDraftStore.resetFragmentAndAmend();
    this.setupTabDataStream();
    this.setupRejectedCountStream();
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Emits a value and completes the `destroy$` subject to clean up subscriptions
   * and prevent memory leaks.
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
