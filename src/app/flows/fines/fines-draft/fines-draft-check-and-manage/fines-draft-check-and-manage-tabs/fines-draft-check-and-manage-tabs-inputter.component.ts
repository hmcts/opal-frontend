import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_ACCOUNT_TYPES } from '../../../fines-mac/constants/fines-mac-account-types';
import { FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT } from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort-default.constant';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_DRAFT_STATE } from '../../constants/fines-draft-state.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { MojSubNavigationItemComponent } from '@components/moj/moj-sub-navigation/moj-sub-navigation-item/moj-sub-navigation-item.component';
import { MojSubNavigationComponent } from '@components/moj/moj-sub-navigation/moj-sub-navigation.component';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { GlobalStore } from '@stores/global/global.store';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { OpalFinesDraftAccountStatuses } from '@services/fines/opal-fines-service/enums/opal-fines-draft-account-statuses.enum';
import { MojBannerComponent } from '@components/moj/moj-banner/moj-banner.component';
import { FINES_DRAFT_ROUTING_PATHS } from '../../routing/constants/fines-draft-routing-paths.constant';

@Component({
  selector: 'app-fines-draft-check-and-manage-tabs',
  imports: [
    CommonModule,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    FinesDraftTableWrapperComponent,
    MojBannerComponent,
  ],
  templateUrl: './fines-draft-check-and-manage-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCheckAndManageTabsComponent implements OnInit {
  private readonly opalFinesService = inject(OpalFines);
  public globalStore = inject(GlobalStore);
  private readonly dateService = inject(DateService);
  protected readonly finesService = inject(FinesService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly businessUnitIds = this.globalStore
    .userState()
    .business_unit_user.map((business_unit_user) => business_unit_user.business_unit_id);
  private readonly businessUnitUserIds = this.globalStore
    .userState()
    .business_unit_user.map((business_unit_user) => business_unit_user.business_unit_user_id);

  private readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  private readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  protected readonly finesDraftRoutingPaths = FINES_DRAFT_ROUTING_PATHS;

  public draftAccounts$!: Observable<IFinesDraftTableWrapperTableData[]>;

  public tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
  public activeTab!: string;
  public rejectedCount$!: Observable<string>;

  /**
   * Fetches draft accounts data based on the active tab option and business unit IDs.
   * It retrieves the statuses associated with the active tab and constructs the parameters
   * required for the API call. If statuses are found, it makes a call to the `opalFinesService`
   * to get the draft accounts and processes the response to populate the table data.
   *
   * @private
   * @returns {void}
   */
  private getDraftAccountsData(): void {
    const statuses = FINES_DRAFT_TAB_STATUSES.find((tab) => tab.tab === this.activeTab)?.statuses;
    const params = { businessUnitIds: this.businessUnitIds, statuses, submittedBy: this.businessUnitUserIds };

    if (statuses) {
      this.draftAccounts$ = this.opalFinesService
        .getDraftAccounts(params)
        .pipe(map((response) => this.populateTableData(response)));
    }
  }

  /**
   * Retrieves the count of rejected draft accounts and assigns it to `rejectedCount$`.
   *
   * This method constructs the parameters required to fetch the rejected draft accounts,
   * including the business unit IDs and the status set to rejected. It then calls the
   * `getDraftAccounts` method of `opalFinesService` with these parameters and maps the
   * response to extract the count of rejected accounts.
   *
   * @private
   * @returns {void}
   */
  private getRejectedCount(): void {
    const params = { businessUnitIds: this.businessUnitIds, statuses: [OpalFinesDraftAccountStatuses.rejected] };

    this.rejectedCount$ = this.opalFinesService.getDraftAccounts(params).pipe(
      map((response) => {
        if (response.count > 99) {
          return '99+';
        }
        return response.count.toString();
      }),
    );
  }

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
        account: '',
        defendantId: draft_account_id,
        defendant: defendant_name,
        dob: date_of_birth
          ? this.dateService.getFromFormatToFormat(date_of_birth, this.DATE_INPUT_FORMAT, this.DATE_OUTPUT_FORMAT)
          : '',
        created: this.dateService.getDaysAgoString(created_date) ?? '',
        accountType: FINES_MAC_ACCOUNT_TYPES[account_type as keyof typeof FINES_MAC_ACCOUNT_TYPES],
        businessUnit: business_unit_name,
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
    this.finesService.finesDraftFragment.set(this.activeTab);
    this.finesService.finesDraftAmend.set(this.activeTab === 'rejected');
    if (this.finesService.finesDraftAmend()) {
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
   * Switches the active tab based on the provided fragment.
   * If a matching tab option is found, it sets it as the active tab
   * and retrieves the draft accounts data.
   *
   * @param {string} fragment - The fragment identifier for the tab to switch to.
   * @private
   */
  private switchTab(fragment: string): void {
    this.activeTab = fragment;
    this.getDraftAccountsData();
  }

  /**
   * Handles the tab switch event by invoking the switchTab method with the provided event string.
   *
   * @param event - The event string that indicates which tab to switch to.
   */
  public handleTabSwitch(event: string) {
    this.switchTab(event);
  }

  /**
   * Navigates to the specified route relative to the parent route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.finesService.finesDraftFragment.set(this.activeTab);
    this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
  }

  public ngOnInit(): void {
    this.getRejectedCount();
    this.finesService.finesDraftState = FINES_DRAFT_STATE;
    this.finesService.finesDraftFragment.set('');
    this.finesService.finesDraftAmend.set(false);
  }
}
