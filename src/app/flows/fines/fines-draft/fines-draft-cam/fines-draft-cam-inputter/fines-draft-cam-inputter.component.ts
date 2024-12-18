import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MojSubNavigationComponent } from '../../../../../components/moj/moj-sub-navigation/moj-sub-navigation.component';
import { MojSubNavigationItemComponent } from '../../../../../components/moj/moj-sub-navigation/moj-sub-navigation-item/moj-sub-navigation-item.component';
import { FinesDraftTableWrapperComponent } from '../../fines-draft-table-wrapper/fines-draft-table-wrapper.component';
import { IFinesDraftTableWrapperTableData } from '../../fines-draft-table-wrapper/interfaces/fines-draft-table-wrapper-table-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_ACCOUNT_TYPES } from '../../../fines-mac/constants/fines-mac-account-types';
import { FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT } from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort-default.constant';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { Router } from '@angular/router';
import { FINES_DRAFT_STATE } from '../../constants/fines-draft-state.constant';
import { IFinesMacAddAccountPayload } from '../../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../fines-mac/routing/constants/fines-mac-routing-paths';

@Component({
  selector: 'app-fines-draft-cam-inputter',
  standalone: true,
  imports: [CommonModule, MojSubNavigationComponent, MojSubNavigationItemComponent, FinesDraftTableWrapperComponent],
  templateUrl: './fines-draft-cam-inputter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftCamInputterComponent implements OnInit {
  private readonly opalFinesService = inject(OpalFines);
  private readonly globalStateService = inject(GlobalStateService);
  private readonly dateService = inject(DateService);
  private readonly finesMacPayloadService = inject(FinesMacPayloadService);
  private readonly finesService = inject(FinesService);
  private readonly router = inject(Router);
  private readonly businessUnitIds = this.globalStateService
    .userState()
    .business_unit_user.map((business_unit_user) => business_unit_user.business_unit_id);

  private readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  private readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  public draftAccounts$!: Observable<IFinesDraftTableWrapperTableData[]>;

  public tableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
  public activeTab!: string;

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
    const params = { businessUnitIds: this.businessUnitIds, statuses };

    if (statuses) {
      this.draftAccounts$ = this.opalFinesService
        .getDraftAccounts(params)
        .pipe(map((response) => this.populateTableData(response)));
    }
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
   * Updates the fines state with the given response.
   *
   * @param response - The response object containing the new fines state.
   *
   * This method updates the `finesDraftState` and `finesMacState` properties
   * of the `finesService` using the provided response. The `finesMacState` is
   * derived by converting the response payload using the `convertPayloadToFinesMacState`
   * method of the `finesMacPayloadService`.
   */
  private updateFinesState(response: IFinesMacAddAccountPayload): void {
    this.finesService.finesDraftState = response;
    this.finesService.finesMacState = this.finesMacPayloadService.convertPayloadToFinesMacState(response);
  }

  /**
   * Navigates to the review account page for manual account creation.
   *
   * This method retrieves the business unit ID from the fines service's
   * state and uses the Angular router to navigate to the review account
   * page, appending the business unit ID to the route.
   *
   * @private
   * @returns {void}
   */
  private navigateToReviewAccount(): void {
    const businessUnitId = this.finesService.finesMacState.accountDetails.formData.fm_create_account_business_unit_id;
    this.router.navigate([
      `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.reviewAccount}`,
      businessUnitId,
    ]);
  }

  /**
   * Handles the click event on a defendant.
   *
   * @param {number} id - The ID of the defendant.
   * @returns {void}
   *
   * This method retrieves the draft account details for the given defendant ID,
   * updates the fines state with the response, and navigates to the review account page.
   */
  public onDefendantClick(id: number): void {
    this.opalFinesService.getDraftAccountById(id).subscribe((response) => {
      this.updateFinesState(response);
      this.navigateToReviewAccount();
    });
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

  public ngOnInit(): void {
    this.finesService.finesDraftState = FINES_DRAFT_STATE;
  }
}
