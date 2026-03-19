import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, merge, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
// Stores
import { FinesAccountStore } from '../stores/fines-acc.store';
// Components
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
// Pipes & Directives
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';
// Constants
import { FINES_ACC_MINOR_CREDITOR_DETAILS_TABS } from './constants/fines-acc-minor-creditor-details-tabs.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../constants/fines-acc-summary-tabs-content-styles.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../constants/fines-acc-debtor-types.constant';
import { FINES_ACCOUNT_TYPES } from '../../constants/fines-account-types.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-map-transform-items-config.constant';
// Interfaces
import { IOpalFinesAccountMinorCreditorDetailsHeader } from './interfaces/fines-acc-minor-creditor-details-header.interface';
import { IFinesAccountMinorCreditorDetailsTabs } from './interfaces/fines-acc-minor-creditor-details-tabs.interface';
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { IFinesAccSummaryTabsContentStyles } from '../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccSummaryHeaderComponent } from '../fines-acc-summary-header/fines-acc-summary-header.component';
import { FinesAccMinorCreditorDetailsAtAGlanceTabComponent } from './fines-acc-minor-creditor-details-at-a-glance-tab/fines-acc-minor-creditor-details-at-a-glance-tab.component';
import { AsyncPipe } from '@angular/common';
import { IOpalFinesAccountMinorCreditorAtAGlance } from '../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';
import { FINES_ACC_MINOR_CREDITOR_ACCOUNT_TABS_CACHE_MAP } from './constants/fines-acc-minor-creditor-account-tabs-cache-map.constant';
import { IFinesAccMinorCreditorAccountTabsCacheMap } from './interfaces/fines-acc-minor-creditor-account-tabs-cache-map.interface';
import { AbstractAccountSummaryBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-account-summary-base';

@Component({
  selector: 'app-fines-acc-minor-creditor-details',
  imports: [
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
    MonetaryPipe,
    FinesAccSummaryHeaderComponent,
    FinesAccMinorCreditorDetailsAtAGlanceTabComponent,
    AsyncPipe,
  ],
  templateUrl: './fines-acc-minor-creditor-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsComponent
  extends AbstractAccountSummaryBaseComponent<IOpalFinesAccountMinorCreditorDetailsHeader, { version: string | null }>
  implements OnInit, OnDestroy
{
  private readonly opalFinesService = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);

  public accountStore = inject(FinesAccountStore);
  public tabs: IFinesAccountMinorCreditorDetailsTabs = FINES_ACC_MINOR_CREDITOR_DETAILS_TABS;
  public tabContentStyles: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  public tabAtAGlance$: Observable<IOpalFinesAccountMinorCreditorAtAGlance> = EMPTY;
  public debtorTypes = FINES_ACC_DEBTOR_TYPES;
  public accountTypes = FINES_ACCOUNT_TYPES;
  public lastEnforcement: IOpalFinesResultRefData | null = null;
  public finesPermissions = FINES_PERMISSIONS;

  /**
   * Fetches the tab data and ensures it is typed correctly.
   * @param serviceCall The observable service call to fetch the tab data.
   * @returns An observable of the typed tab data.
   */
  private fetchTabDataTyped<T extends { version: string | null }>(serviceCall: Observable<T>): Observable<T> {
    return this.fetchTabData(serviceCall, (version) => this.accountStore.compareVersion(version)) as Observable<T>;
  }

  /**
   * Checks if the current user has the specified business unit permission.
   * @param permissionKey The key of the permission to check.
   * @returns A boolean indicating whether the user has the permission.
   */
  private hasBusinessUnitPermissionKey(permissionKey: string): boolean {
    return super.hasBusinessUnitPermission(
      FINES_PERMISSIONS[permissionKey],
      Number(this.accountStore.business_unit_id()!),
    );
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
          FINES_ACC_MINOR_CREDITOR_ACCOUNT_TABS_CACHE_MAP[
            this.activeTab as keyof IFinesAccMinorCreditorAccountTabsCacheMap
          ],
        ),
      ),
      this.refreshFragment$,
    );

    const { account_id } = this.accountStore.getAccountState();

    fragment$.pipe(takeUntil(this.destroy$)).subscribe((tab) => {
      switch (tab) {
        case 'at-a-glance':
          this.tabAtAGlance$ = this.fetchTabDataTyped(
            this.opalFinesService.getMinorCreditorAccountAtAGlance(account_id),
          );
          break;
      }
    });
  }

  /**
   * Fetches the minor creditor account heading data and current tab fragment from the route.
   */
  protected override getHeaderDataFromRoute(): void {
    const headingData = this.activatedRoute.snapshot.data['minorCreditorAccountHeadingData'];
    this.accountData = this.transformHeaderForView(headingData);
    this.activeTab = this.activatedRoute.snapshot.fragment || 'at-a-glance';
  }

  /**
   * Fetches the minor creditor account heading data for the specified account ID.
   * @param accountId The ID of the account to fetch the heading data for.
   * @returns An observable of the minor creditor account heading data.
   */
  protected override getHeaderData(accountId: number): Observable<IOpalFinesAccountMinorCreditorDetailsHeader> {
    return this.opalFinesService.getMinorCreditorAccountHeadingData(accountId);
  }

  protected override transformHeaderForStore(
    accountId: number,
    header: IOpalFinesAccountMinorCreditorDetailsHeader,
  ): void {
    this.accountStore.setAccountState(
      this.payloadService.transformAccountHeaderForStore(accountId, header, 'minorCreditor'),
    );
  }

  protected override transformHeaderForView(
    header: IOpalFinesAccountMinorCreditorDetailsHeader,
  ): IOpalFinesAccountMinorCreditorDetailsHeader {
    return this.payloadService.transformPayload(header, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG);
  }

  protected override transformTabData<T extends { version: string | null }>(data: T): T {
    return this.payloadService.transformPayload(data, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG);
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
      this.accountStore.setSuccessMessage('Information is up to date');
      this.accountData = header;
    });
  }

  public navigateToAddPaymentHoldPage(): void {
    this['router'].navigate([`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/add`], {
      relativeTo: this.activatedRoute,
    });
  }

  public navigateToRemovePaymentHoldPage(): void {
    this['router'].navigate([`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/remove`], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Navigates to the add account note page.
   * If the user lacks the required permission in this BU, navigates to the access-denied page instead.
   */
  public navigateToAddAccountNotePage(): void {
    if (this.hasBusinessUnitPermissionKey('add-account-activity-notes')) {
      this['router'].navigate([`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.note}/add`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this['router'].navigate(['/access-denied'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  public override ngOnDestroy(): void {
    this.accountStore.clearSuccessMessage();
    this.accountStore.setHasVersionMismatch(false);
    super.ngOnDestroy();
  }
}
