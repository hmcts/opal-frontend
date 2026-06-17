import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, merge, Observable, of } from 'rxjs';
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
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../constants/fines-acc-summary-tabs-content-styles.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../constants/fines-acc-debtor-types.constant';
import { FINES_ACCOUNT_TYPES } from '../../constants/fines-account-types.constant';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-map-transform-items-config.constant';
// Interfaces
import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { IFinesAccSummaryTabsContentStyles } from '../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccSummaryHeaderComponent } from '../fines-acc-summary-header/fines-acc-summary-header.component';
import { AbstractCreditorDetailsBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-creditor-details-base';
import { IOpalFinesVersion } from '../../services/opal-fines-service/interfaces/opal-fines-version.interface';
import { FINES_ACC_BANNER_MESSAGES } from '../stores/constants/fines-acc-store-banner-messages.constant';
import { IOpalFinesAccountMajorCreditorDetailsHeader } from './interfaces/fines-acc-major-creditor-details-header.interface';
import { IFinesAccountMajorCreditorDetailsTabs } from './interfaces/fines-acc-major-creditor-details-tabs.interface';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_TABS } from './constants/fines-acc-major-creditor-details-tabs.constant';
import { IFinesAccMajorCreditorAccountTabsCacheMap } from './interfaces/fines-acc-major-creditor-account-tabs-cache-map.interface';
import { FINES_ACC_MAJOR_CREDITOR_ACCOUNT_TABS_CACHE_MAP } from './constants/fines-acc-major-creditor-account-tabs-cache-map.constant';
import { IOpalFinesAccountMajorCreditorAtAGlance } from '../../services/opal-fines-service/interfaces/opal-fines-account-major-creditor-at-a-glance.interface';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-major-creditor-at-a-glance-with-defendant.mock';

@Component({
  selector: 'app-fines-acc-major-creditor-details',
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
  ],
  templateUrl: './fines-acc-major-creditor-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMajorCreditorDetailsComponent
  extends AbstractCreditorDetailsBaseComponent<IOpalFinesAccountMajorCreditorDetailsHeader, IOpalFinesVersion>
  implements OnInit, OnDestroy
{
  private readonly opalFinesService = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);
  protected readonly payloadTransformer = this.payloadService;
  protected readonly headerDataRouteKey = 'majorCreditorAccountHeadingData';
  protected readonly defaultActiveTab = 'at-a-glance';
  protected readonly transformItemsConfig = FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG;
  protected readonly latestBannerMessage = FINES_ACC_BANNER_MESSAGES.latest;
  protected readonly permissions = FINES_PERMISSIONS;

  public accountStore = inject(FinesAccountStore);
  public tabs: IFinesAccountMajorCreditorDetailsTabs = FINES_ACC_MAJOR_CREDITOR_DETAILS_TABS;
  public tabContentStyles: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  public debtorTypes = FINES_ACC_DEBTOR_TYPES;
  public accountTypes = FINES_ACCOUNT_TYPES;
  public lastEnforcement: IOpalFinesResultRefData | null = null;
  public finesPermissions = FINES_PERMISSIONS;
  public tabAtAGlance$: Observable<IOpalFinesAccountMajorCreditorAtAGlance> = EMPTY;

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
          FINES_ACC_MAJOR_CREDITOR_ACCOUNT_TABS_CACHE_MAP[
            this.activeTab as keyof IFinesAccMajorCreditorAccountTabsCacheMap
          ],
        ),
      ),
      this.refreshFragment$,
    );
    fragment$.pipe(takeUntil(this.destroy$)).subscribe((tab) => {
      switch (tab) {
        case 'at-a-glance':
          this.tabAtAGlance$ = this.fetchTabDataTyped(
            of(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK).pipe(
              tap((data) => {
                this.accountStore.setHasPaymentHold(data.payment.hold_payment);
              }),
            ),
          );
          break;
      }
    });
  }

  /**
   * Fetches the major creditor account heading data for the specified account ID.
   * @param accountId The ID of the account to fetch the heading data for.
   * @returns An observable of the major creditor account heading data.
   */
  protected override getHeaderData(accountId: number): Observable<IOpalFinesAccountMajorCreditorDetailsHeader> {
    return this.opalFinesService.getMajorCreditorAccountHeadingData(accountId);
  }

  /**
   * Gets the account ID from the major creditor details route.
   * @returns The account ID from the route.
   */
  protected override getAccountIdFromRoute(): number {
    return Number(this.activatedRoute.snapshot.paramMap.get('accountId'));
  }

  /**
   * Transforms the major creditor account heading data for storage in the account store.
   * @param accountId The ID of the account.
   * @param header The major creditor account heading data.
   */
  protected override transformHeaderForStore(
    accountId: number,
    header: IOpalFinesAccountMajorCreditorDetailsHeader,
  ): void {
    this.accountStore.setAccountState(
      this.payloadService.transformMajorCreditorAccountHeaderForStore(accountId, header),
    );
  }
}
