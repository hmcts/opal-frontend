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
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
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
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';

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
    MojBadgeComponent,
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
  private readonly businessUnitIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_id,
  );
  private readonly businessUnitUserIds = this.userState.business_unit_user.map(
    (business_unit_user) => business_unit_user.business_unit_user_id,
  );

  protected readonly finesDraftStore = inject(FinesDraftStore);
  protected readonly finesDraftCheckAndValidateRoutingPaths = FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS;

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
  private setupTabDataStream(): void {
    const fragment$ = this.clearCacheOnTabChange(this.getFragmentStream('to-review', this.destroy$), () =>
      this.opalFinesService.clearDraftAccountsCache(),
    );

    this.tabData$ = this.createTabDataStream<IOpalFinesDraftAccountsResponse, IFinesDraftTableWrapperTableData[]>(
      fragment$,
      (tab) => {
        if (tab === 'deleted' || tab === 'failed') {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED;
        } else {
          this.tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
        }

        const currentTab = FINES_DRAFT_TAB_STATUSES.find((t) => t.tab === tab);

        const params: IOpalFinesDraftAccountParams = {
          businessUnitIds: this.businessUnitIds,
          statuses: currentTab?.statuses,
          notSubmittedBy: this.businessUnitUserIds,
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
   * Initializes the `failedCount$` observable stream to track the number of draft accounts
   * with a "publishFailed" status. This method sets up the stream to:
   * - Listen for tab changes and clear the draft accounts cache when the "to-review" fragment is active.
   * - Fetch the count of draft accounts matching the specified business unit IDs, user IDs, and status.
   * - Format the resulting count with a cap defined by `FINES_DRAFT_MAX_REJECTED`.
   *
   * The stream is automatically cleaned up when the component is destroyed.
   *
   * @private
   */
  private setupFailedCountStream(): void {
    const fragment$ = this.clearCacheOnTabChange(this.getFragmentStream('to-review', this.destroy$), () =>
      this.opalFinesService.clearDraftAccountsCache(),
    );

    this.failedCount$ = this.createCountStream(
      fragment$,
      () => ({
        businessUnitIds: this.businessUnitIds,
        notSubmittedBy: this.businessUnitUserIds,
        statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed],
      }),
      (params) => this.opalFinesService.getDraftAccounts(params),
      (res) => res.count,
      (count) => this.formatCountWithCap(count, FINES_DRAFT_MAX_REJECTED),
    );
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

  public ngOnInit(): void {
    this.finesDraftStore.resetFineDraftState();
    this.finesDraftStore.resetFragmentAndChecker();
    this.setupTabDataStream();
    this.setupFailedCountStream();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
