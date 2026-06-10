import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, map, merge, Observable, of, switchMap, takeUntil, tap } from 'rxjs';
// Services
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
// Stores
import { FinesAccountStore } from '../stores/fines-acc.store';
// Components
import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab/fines-acc-defendant-details-at-a-glance-tab.component';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { CustomSummaryMetricBarComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar';
import { CustomSummaryMetricBarItemComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item';
import { CustomSummaryMetricBarItemLabelComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-label';
import { CustomSummaryMetricBarItemValueComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-value';
import { CustomAccountInformationComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information';
import { CustomAccountInformationItemComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item';
import { CustomAccountInformationItemLabelComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item/custom-account-information-item-label';
import { CustomAccountInformationItemValueComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item/custom-account-information-item-value';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
// Pipes & Directives
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';
// Constants
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_DEFENDANT_DETAILS_TABS } from './constants/fines-acc-defendant-details-tabs.constant';
// Interfaces
import { IOpalFinesAccountDefendantDetailsHeader } from './interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountDefendantDetailsTabs } from './interfaces/fines-acc-defendant-details-tabs.interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../constants/fines-acc-summary-tabs-content-styles.constant';
import { IFinesAccSummaryTabsContentStyles } from './interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FinesAccDefendantDetailsDefendantTabComponent } from './fines-acc-defendant-details-defendant-tab/fines-acc-defendant-details-defendant-tab.component';
import { FinesAccDefendantDetailsParentOrGuardianTabComponent } from './fines-acc-defendant-details-parent-or-guardian-tab/fines-acc-defendant-details-parent-or-guardian-tab.component';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { FINES_ACC_DEBTOR_TYPES } from '../constants/fines-acc-debtor-types.constant';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-map-transform-items-config.constant';
import { FinesAccDefendantDetailsPaymentTermsTabComponent } from './fines-acc-defendant-details-payment-terms-tab/fines-acc-defendant-details-payment-terms-tab.component';
import { FINES_ACC_DEFENDANT_ACCOUNT_TABS_CACHE_MAP } from './constants/fines-acc-defendant-account-tabs-cache-map.constant';
import { IFinesAccDefendantAccountTabsCacheMap } from './interfaces/fines-acc-defendant-account-tabs-cache-map.interface';
import { FinesAccDefendantDetailsFixedPenaltyTabComponent } from './fines-acc-defendant-details-fixed-penalty-tab/fines-acc-defendant-details-fixed-penalty-tab.component';
import { IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-fixed-penalty-tab-ref-data.interface';
import { FINES_ACCOUNT_TYPES } from '../../constants/fines-account-types.constant';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { FinesAccDefendantDetailsEnforcementTab } from './fines-acc-defendant-details-enforcement-tab/fines-acc-defendant-details-enforcement-tab.component';
import { FinesAccDefendantDetailsImpositionsTabComponent } from './fines-acc-defendant-details-impositions-tab/fines-acc-defendant-details-impositions-tab.component';
import { FinesAccSummaryHeaderComponent } from '../fines-acc-summary-header/fines-acc-summary-header.component';
import { AbstractAccountSummaryBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-account-summary-base';
import { IOpalFinesVersion } from '../../services/opal-fines-service/interfaces/opal-fines-version.interface';
import { FINES_ACC_BANNER_MESSAGES } from '../stores/constants/fines-acc-store-banner-messages.constant';

@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [
    AsyncPipe,
    FinesAccDefendantDetailsAtAGlanceTabComponent,
    FinesAccDefendantDetailsDefendantTabComponent,
    FinesAccDefendantDetailsParentOrGuardianTabComponent,
    FinesAccDefendantDetailsPaymentTermsTabComponent,
    FinesAccDefendantDetailsFixedPenaltyTabComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    CustomSummaryMetricBarComponent,
    CustomSummaryMetricBarItemComponent,
    CustomSummaryMetricBarItemLabelComponent,
    CustomSummaryMetricBarItemValueComponent,
    CustomAccountInformationComponent,
    CustomAccountInformationItemComponent,
    CustomAccountInformationItemLabelComponent,
    CustomAccountInformationItemValueComponent,
    GovukTagComponent,
    UpperCasePipe,
    FinesAccDefendantDetailsEnforcementTab,
    FinesAccDefendantDetailsImpositionsTabComponent,
    MonetaryPipe,
    FinesAccSummaryHeaderComponent,
  ],
  templateUrl: './fines-acc-defendant-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsComponent
  extends AbstractAccountSummaryBaseComponent<IOpalFinesAccountDefendantDetailsHeader, IOpalFinesVersion>
  implements OnInit, OnDestroy
{
  private readonly opalFinesService = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);

  public accountStore = inject(FinesAccountStore);
  public tabs: IFinesAccountDefendantDetailsTabs = FINES_ACC_DEFENDANT_DETAILS_TABS;
  public accountId: number = Number(this.activatedRoute.snapshot.paramMap.get('accountId'));
  public tabContentStyles: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  public tabAtAGlance$: Observable<IOpalFinesAccountDefendantAtAGlance> = EMPTY;
  public tabDefendant$: Observable<IOpalFinesAccountDefendantAccountParty> = EMPTY;
  public tabParentOrGuardian$: Observable<IOpalFinesAccountDefendantAccountParty> = EMPTY;
  public tabPaymentTerms$: Observable<IOpalFinesAccountDefendantDetailsPaymentTermsLatest> = EMPTY;
  public tabEnforcement$: Observable<IOpalFinesAccountDefendantDetailsEnforcementTabRefData> = EMPTY;
  public tabImpositions$: Observable<IOpalFinesAccountDefendantDetailsImpositionsTabRefData> = EMPTY;
  public tabHistoryAndNotes$: Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> = EMPTY;
  public tabFixedPenalty$: Observable<IOpalFinesAccountDefendantDetailsFixedPenaltyTabRefData> = EMPTY;
  public debtorTypes = FINES_ACC_DEBTOR_TYPES;
  public accountTypes = FINES_ACCOUNT_TYPES;
  public lastEnforcement: IOpalFinesResultRefData | null = null;
  public finesPermissions = FINES_PERMISSIONS;
  private fetchTabDataTyped<T extends IOpalFinesVersion>(serviceCall: Observable<T>): Observable<T> {
    return this.fetchTabData(serviceCall, (version) => this.accountStore.compareVersion(version)) as Observable<T>;
  }

  /**
   * Initializes and sets up the observable data stream for the fines draft tab component.
   *
   * This method listens to changes in either the route fragment (representing the active tab)
   * or the refreshFragment (triggered when a user refreshes the current tab),
   * and updates the tab data stream accordingly. It uses the provided initial tab,
   * and constructs the necessary parameters for fetching and populating the tab's table data.
   *
   */
  protected override setupTabDataStream(): void {
    const fragment$ = merge(
      this.clearCacheOnTabChange(this.getFragmentStream('at-a-glance', this.destroy$), () =>
        this.opalFinesService.clearCache(
          FINES_ACC_DEFENDANT_ACCOUNT_TABS_CACHE_MAP[this.activeTab as keyof IFinesAccDefendantAccountTabsCacheMap],
        ),
      ),
      this.refreshFragment$,
    );

    const { defendant_account_party_id, parent_guardian_party_id } = this.accountData;
    const { account_id } = this.accountStore.getAccountState();

    fragment$.pipe(takeUntil(this.destroy$)).subscribe((tab) => {
      switch (tab) {
        case 'at-a-glance':
          this.tabAtAGlance$ = this.fetchTabDataTyped(this.opalFinesService.getDefendantAccountAtAGlance(account_id));
          break;
        case 'defendant':
          this.tabDefendant$ = this.fetchTabDataTyped(
            this.opalFinesService.getDefendantAccountParty(account_id, defendant_account_party_id),
          );
          break;
        case 'parent-or-guardian':
          this.tabParentOrGuardian$ = this.fetchTabDataTyped(
            this.opalFinesService.getParentOrGuardianAccountParty(account_id, parent_guardian_party_id),
          );
          break;
        case 'fixed-penalty':
          this.tabFixedPenalty$ = this.fetchTabDataTyped(
            this.opalFinesService.getDefendantAccountFixedPenalty(account_id),
          );
          break;
        case 'payment-terms':
          this.tabPaymentTerms$ = this.fetchTabDataTyped(
            this.opalFinesService.getDefendantAccountPaymentTermsLatest(account_id).pipe(
              switchMap(
                (data): Observable<IOpalFinesAccountDefendantDetailsPaymentTermsLatest> =>
                  (data.last_enforcement
                    ? this.opalFinesService.getResult(data.last_enforcement)
                    : of<IOpalFinesResultRefData | null>(null)
                  ).pipe(
                    tap((result: IOpalFinesResultRefData | null) => {
                      this.lastEnforcement = result;
                    }),
                    map((): IOpalFinesAccountDefendantDetailsPaymentTermsLatest => data),
                  ),
              ),
            ),
          );
          break;
        case 'enforcement':
          this.tabEnforcement$ = this.fetchTabDataTyped(
            this.opalFinesService.getDefendantAccountEnforcementStatus(account_id),
          );
          break;
        case 'impositions':
          this.tabImpositions$ = this.fetchTabDataTyped(
            this.opalFinesService.getDefendantAccountImpositionsTabData(account_id),
          );
          break;
        case 'history-and-notes':
          this.tabHistoryAndNotes$ = this.fetchTabDataTyped(
            this.opalFinesService.getDefendantAccountHistoryAndNotesTabData(),
          );
          break;
      }
    });
  }

  /**
   * Fetches the defendant account heading data and current tab fragment from the route.
   */
  protected override getHeaderDataFromRoute(): void {
    const headingData = this.activatedRoute.snapshot.data['defendantAccountHeadingData'];
    this.accountData = this.transformHeaderForView(headingData);
    this.transformHeaderForStore(this.accountId, this.accountData);
    this.activeTab = this.activatedRoute.snapshot.fragment || 'at-a-glance';
  }

  protected override getHeaderData(accountId: number): Observable<IOpalFinesAccountDefendantDetailsHeader> {
    return this.opalFinesService.getDefendantAccountHeadingData(accountId);
  }

  protected override transformHeaderForStore(accountId: number, header: IOpalFinesAccountDefendantDetailsHeader): void {
    this.accountStore.setAccountState(this.payloadService.transformDefendantAccountHeaderForStore(accountId, header));
  }

  protected override transformHeaderForView(
    header: IOpalFinesAccountDefendantDetailsHeader,
  ): IOpalFinesAccountDefendantDetailsHeader {
    return this.payloadService.transformPayload(header, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG);
  }

  protected override transformTabData<T extends IOpalFinesVersion>(data: T): T {
    return this.payloadService.transformPayload(data, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG);
  }

  /**
   *
   * Calculates if the user can amend payment terms based on account status and permissions.
   * @returns boolean indicating if the user can amend payment terms
   */
  public canAmendPaymentTerms(): boolean {
    const accountStatusCode = this.accountData.account_status_reference.account_status_code;
    const invalidCodes = ['CS', 'WO', 'TO', 'TS', 'TA'];

    return (
      !this.lastEnforcement?.extend_ttp_disallow &&
      !invalidCodes.includes(accountStatusCode) &&
      this.hasBusinessUnitPermissionKey('amend-payment-terms') &&
      this.accountData.payment_state_summary.account_balance > 0
    );
  }

  /**
   *
   * Calculates if the user can request a payment card based on account status and permissions.
   * @returns boolean indicating if the user can request a payment card
   */
  public canRequestPaymentCard(): boolean {
    return !this.lastEnforcement?.prevent_payment_card && this.hasBusinessUnitPermissionKey('amend-payment-terms');
  }

  /**
   * Determines the type of denial for amending payment terms based on permission, account status and enforcement details.
   * @returns A string representing the denial type: 'enforcement', 'permission', 'balance' or 'account-status'
   */
  public getAmendPaymentTermsDeniedType(): string {
    if (this.lastEnforcement?.extend_ttp_disallow) {
      return 'enforcement';
    } else if (!this.hasBusinessUnitPermissionKey('amend-payment-terms')) {
      return 'permission';
    } else if (this.accountData.payment_state_summary.account_balance <= 0) {
      return 'balance';
    } else {
      return 'account-status';
    }
  }

  /**
   * Determines the type of denial for requesting a payment card based on permission, account status and enforcement details.
   * @returns A string representing the denial type: 'enforcement' or 'permission'
   */
  public getRequestPaymentCardDeniedType(): string {
    if (this.lastEnforcement?.prevent_payment_card) {
      return 'enforcement';
    } else {
      return 'permission';
    }
  }

  /**
   * Checks if the user has the specified permission within the business unit related to the account.
   * @param permissionKey The key of the permission to check.
   * @returns True if the user has the permission, false otherwise.
   */
  public hasBusinessUnitPermissionKey(permissionKey: string): boolean {
    return super.hasBusinessUnitPermission(
      FINES_PERMISSIONS[permissionKey],
      Number(this.accountStore.business_unit_id()!),
    );
  }

  /**
   * Navigates to the add account note page.
   * If the user lacks the required permission in this BU, navigates to the access-denied page instead.
   */
  public navigateToAddAccountNotePage(): void {
    if (this.hasBusinessUnitPermissionKey('add-account-activity-notes')) {
      this['router'].navigate([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this['router'].navigate(['/access-denied'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  /**
   * Handles the page refresh action.
   * Sets the version mismatch state to false.
   * Sets the is refreshed state to true.
   * Refreshes the page.
   * @param event The user event that triggered the refresh action.
   */
  public override refreshPage(): void {
    this.accountStore.setHasVersionMismatch(false);

    super.refreshPage(Number(this.accountStore.account_id()), (header) => {
      this.accountStore.setSuccessMessage(FINES_ACC_BANNER_MESSAGES.latest);
      this.accountData = header;
    });
  }

  public override ngOnDestroy(): void {
    this.accountStore.clearSuccessMessage();
    this.accountStore.setHasVersionMismatch(false);
    super.ngOnDestroy();
  }

  /**
   * Determines whether the Defendant tab should show the add parent/guardian link.
   *
   * The link is only available for youth-only accounts where the defendant is the
   * debtor and no parent or guardian party is currently attached to the account.
   */
  public get canAddParentOrGuardianDetails(): boolean {
    return (
      this.accountData.is_youth &&
      this.accountData.debtor_type === this.debtorTypes.defendant &&
      !this.accountData.parent_guardian_party_id
    );
  }

  /**
   * Determines whether the Parent or guardian tab should be shown.
   */
  public get hasParentOrGuardianDetails(): boolean {
    return (
      this.accountData.debtor_type === this.debtorTypes.parentGuardian || !!this.accountData.parent_guardian_party_id
    );
  }
}
