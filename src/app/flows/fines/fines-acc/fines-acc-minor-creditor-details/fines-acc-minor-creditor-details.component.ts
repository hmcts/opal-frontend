import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, merge, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
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
import { FINES_ACC_MINOR_CREDITOR_DETAILS_TABS_KEYS } from './constants/fines-acc-minor-creditor-details-tabs-keys.constant';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_ROUTE_DATA_KEYS } from './constants/fines-acc-minor-creditor-details-route-data-keys.constant';
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
import { AbstractCreditorDetailsBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-creditor-details-base';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
import { IOpalFinesVersion } from '../../services/opal-fines-service/interfaces/opal-fines-version.interface';
import { FINES_ACC_BANNER_MESSAGES } from '../stores/constants/fines-acc-store-banner-messages.constant';
import { FinesAccMinorCreditorDetailsCreditorTab } from './fines-acc-minor-creditor-details-creditor-tab/fines-acc-minor-creditor-details-creditor-tab.component';
import { IOpalFinesAccountMinorCreditorCreditor } from '../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';

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
    FinesAccMinorCreditorDetailsCreditorTab,
    AsyncPipe,
  ],
  templateUrl: './fines-acc-minor-creditor-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsComponent
  extends AbstractCreditorDetailsBaseComponent<IOpalFinesAccountMinorCreditorDetailsHeader, IOpalFinesVersion>
  implements OnInit, OnDestroy
{
  private readonly opalFinesService = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);
  protected readonly payloadTransformer = this.payloadService;
  protected readonly headerDataRouteKey = FINES_ACC_MINOR_CREDITOR_DETAILS_ROUTE_DATA_KEYS.headingData;
  protected readonly defaultActiveTab = FINES_ACC_MINOR_CREDITOR_DETAILS_TABS_KEYS['at-a-glance'];
  protected readonly transformItemsConfig = FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG;
  protected readonly latestBannerMessage = FINES_ACC_BANNER_MESSAGES.latest;
  protected readonly permissions = FINES_PERMISSIONS;

  public accountStore = inject(FinesAccountStore);
  public tabs: IFinesAccountMinorCreditorDetailsTabs = FINES_ACC_MINOR_CREDITOR_DETAILS_TABS;
  public tabContentStyles: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  public tabAtAGlance$: Observable<IOpalFinesAccountMinorCreditorAtAGlance> = EMPTY;
  public tabCreditor$: Observable<IOpalFinesAccountMinorCreditorCreditor> = EMPTY;
  public debtorTypes = FINES_ACC_DEBTOR_TYPES;
  public accountTypes = FINES_ACCOUNT_TYPES;
  public lastEnforcement: IOpalFinesResultRefData | null = null;
  public finesPermissions = FINES_PERMISSIONS;

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
      this.clearCacheOnTabChange(this.getFragmentStream(this.defaultActiveTab, this.destroy$), () =>
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
        case FINES_ACC_MINOR_CREDITOR_DETAILS_TABS_KEYS['at-a-glance']:
          this.tabAtAGlance$ = this.fetchTabDataTyped(
            this.opalFinesService.getMinorCreditorAccountAtAGlance(account_id).pipe(
              tap((data) => {
                this.accountStore.setHasPaymentHold(data.payment.hold_payment);
              }),
            ),
          );
          break;
        case FINES_ACC_MINOR_CREDITOR_DETAILS_TABS_KEYS.creditor:
          this.tabCreditor$ = this.fetchTabDataTyped(this.opalFinesService.getMinorCreditorAccount(account_id));
          break;
      }
    });
  }

  /**
   * Fetches the minor creditor account heading data for the specified account ID.
   * @param accountId The ID of the account to fetch the heading data for.
   * @returns An observable of the minor creditor account heading data.
   */
  protected override getHeaderData(accountId: number): Observable<IOpalFinesAccountMinorCreditorDetailsHeader> {
    return this.opalFinesService.getMinorCreditorAccountHeadingData(accountId);
  }

  /**
   * Gets the account ID from the minor creditor details route.
   * @returns The account ID from the route.
   */
  protected override getAccountIdFromRoute(): number {
    return Number(this.activatedRoute.snapshot.paramMap.get('accountId'));
  }

  /**
   * Transforms the minor creditor account heading data for storage in the account store.
   * @param accountId The ID of the account.
   * @param header The minor creditor account heading data.
   */
  protected override transformHeaderForStore(
    accountId: number,
    header: IOpalFinesAccountMinorCreditorDetailsHeader,
  ): void {
    this.accountStore.setAccountState(
      this.payloadService.transformMinorCreditorAccountHeaderForStore(accountId, header),
    );
  }

  /**
   * Navigates to the add payment hold page.
   */
  public navigateToAddPaymentHoldPage(): void {
    if (this.hasBusinessUnitPermissionKey('add-remove-payment-hold')) {
      this['router'].navigate([`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/add`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this['router'].navigate([`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/denied`], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  /**
   * Navigates to the remove payment hold page.
   */
  public navigateToRemovePaymentHoldPage(): void {
    if (this.hasBusinessUnitPermissionKey('add-remove-payment-hold')) {
      this['router'].navigate([`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/remove`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this['router'].navigate([`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/denied`], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  /**
   * Navigates to the defendant account page for the specified account ID in a new browser tab.
   * @param accountId The ID of the defendant account.
   */
  public navigateToDefendantAccountPage(accountId: number): void {
    const url = this['router'].serializeUrl(
      this['router'].createUrlTree([
        FINES_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.children.defendant,
        accountId,
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      ]),
    );
    window.open(url, '_blank');
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
}
