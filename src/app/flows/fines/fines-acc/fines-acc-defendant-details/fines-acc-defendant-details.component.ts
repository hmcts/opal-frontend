import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, merge, Observable, Subject, takeUntil, tap } from 'rxjs';
// Services
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
// Stores
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from '../stores/fines-acc.store';
// Components
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
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
import { MojButtonMenuComponent } from '@hmcts/opal-frontend-common/components/moj/moj-button-menu';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
// Pipes & Directives
import { AsyncPipe, KeyValuePipe, UpperCasePipe } from '@angular/common';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
// Constants
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constants';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_SA_ROUTING_PATHS } from '../../fines-sa/routing/constants/fines-sa-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_DEFENDANT_DETAILS_TABS } from './constants/fines-acc-defendant-details-tabs.constant';
// Interfaces
import { IOpalFinesAccountDefendantDetailsHeader } from './interfaces/fines-acc-defendant-details-header.interface';
import { IFinesAccountDefendantDetailsTabs } from './interfaces/fines-acc-defendant-details-tabs.interface';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { IOpalFinesAccountDefendantDetailsTabsData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-tabs-data.interface';
import { OPAL_FINES_ACCOUNT_DETAILS_TABS_DATA_EMPTY } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-details-tabs-data.constant';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../constants/fines-acc-summary-tabs-content-styles.constant';
import { IFinesAccSummaryTabsContentStyles } from './interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FinesAccDefendantDetailsDefendantTabComponent } from './fines-acc-defendant-details-defendant-tab/fines-acc-defendant-details-defendant-tab.component';

@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [
    AsyncPipe,
    FinesAccDefendantDetailsAtAGlanceTabComponent,
    FinesAccDefendantDetailsDefendantTabComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    GovukBackLinkComponent,
    CustomSummaryMetricBarComponent,
    CustomSummaryMetricBarItemComponent,
    CustomSummaryMetricBarItemLabelComponent,
    CustomSummaryMetricBarItemValueComponent,
    CustomAccountInformationComponent,
    CustomAccountInformationItemComponent,
    CustomAccountInformationItemLabelComponent,
    CustomAccountInformationItemValueComponent,
    GovukTagComponent,
    MojButtonMenuComponent,
    GovukHeadingWithCaptionComponent,
    CustomPageHeaderComponent,
    UpperCasePipe,
    GovukButtonDirective,
    KeyValuePipe,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertTextComponent,
    MojAlertIconComponent,
  ],
  templateUrl: './fines-acc-defendant-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly opalFinesService = inject(OpalFines);
  private readonly permissionsService = inject(PermissionsService);
  private readonly globalStore = inject(GlobalStore);
  private readonly userState = this.globalStore.userState();
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly destroy$ = new Subject<void>();
  private readonly refreshFragment$ = new Subject<string>();

  public readonly utilsService = inject(UtilsService);
  public accountStore = inject(FinesAccountStore);
  public tabs: IFinesAccountDefendantDetailsTabs = FINES_ACC_DEFENDANT_DETAILS_TABS;
  public tabsData: IOpalFinesAccountDefendantDetailsTabsData = structuredClone(
    OPAL_FINES_ACCOUNT_DETAILS_TABS_DATA_EMPTY,
  );
  public accountData!: IOpalFinesAccountDefendantDetailsHeader;
  public tabContentStyles: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;

  /**
   * Fetches the defendant account heading data and current tab fragment from the route.
   */
  private getHeaderDataFromRoute(): void {
    this.accountData = this.activatedRoute.snapshot.data['defendantAccountHeadingData'];
    this.activeTab = this.activatedRoute.snapshot.fragment || 'at-a-glance';
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
  private setupTabDataStream(): void {
    const fragment$ = merge(
      this.clearCacheOnTabChange(this.getFragmentStream('at-a-glance', this.destroy$), () =>
        this.opalFinesService.clearAccountDetailsCache(),
      ),
      this.refreshFragment$,
    );

    const { business_unit_user_id, business_unit_id, account_id } = this.accountStore.getAccountState();

    fragment$.subscribe((tab) => {
      switch (tab) {
        case 'at-a-glance':
          this.tabsData[tab] = this.fetchTabData(
            this.opalFinesService.getDefendantAccountAtAGlanceTabData(
              account_id,
              business_unit_id,
              business_unit_user_id,
            ),
          );
          break;
        case 'defendant':
          this.tabsData[tab] = this.fetchTabData(
            this.opalFinesService.getDefendantAccountDefendantTabData(
              account_id,
              business_unit_id,
              business_unit_user_id,
            ),
          );
          break;
        case 'payment-terms':
          this.tabsData[tab] = this.fetchTabData(
            this.opalFinesService.getDefendantAccountPaymentTermsTabData(
              account_id,
              business_unit_id,
              business_unit_user_id,
            ),
          );
          break;
        case 'enforcement':
          this.tabsData[tab] = this.fetchTabData(
            this.opalFinesService.getDefendantAccountEnforcementTabData(
              account_id,
              business_unit_id,
              business_unit_user_id,
            ),
          );
          break;
        case 'impositions':
          this.tabsData[tab] = this.fetchTabData(
            this.opalFinesService.getDefendantAccountImpositionsTabData(
              account_id,
              business_unit_id,
              business_unit_user_id,
            ),
          );
          break;
        case 'history-and-notes':
          this.tabsData[tab] = this.fetchTabData(
            this.opalFinesService.getDefendantAccountHistoryAndNotesTabData(
              account_id,
              business_unit_id,
              business_unit_user_id,
            ),
          );
          break;
      }
    });
  }

  /**
   * Fetches the data for a specific tab by calling the provided service function.
   * Compares the version of the fetched data with the current version in the store.
   * @param serviceCall the service function that retrieves the tab data
   * @returns an observable of the tab data
   */
  private fetchTabData<T extends { version: number | undefined }>(serviceCall: Observable<T>): Observable<T> {
    return serviceCall.pipe(
      tap((data) => {
        this.compareVersion(data.version);
      }),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    );
  }

  /**
   * Compares the version of the fetched data with the current version in the store.
   * If there is a mismatch, it triggers a warning banner
   * @param version the version of the fetched data
   */
  private compareVersion(version: number | undefined): void {
    if (version !== this.accountStore.base_version()) {
      this.accountStore.setHasVersionMismatch(true);
    }
  }

  /**
   * Checks if the user has the specified permission in any of their roles.
   * @param permissionKey The key of the permission to check.
   * @returns True if the user has the permission, false otherwise.
   */
  public hasPermission(permissionKey: string): boolean {
    return this.permissionsService.hasPermissionAccess(
      FINES_PERMISSIONS[permissionKey],
      this.userState.business_unit_users,
    );
  }

  /**
   * Navigates to the add account note page.
   */
  public navigateToAddAccountNotePage(): void {
    this['router'].navigate([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Navigates to the add comments page.
   * @param event The click event that triggered the navigation.
   */
  public navigateToAddCommentsPage(event: Event): void {
    event.preventDefault();
    this['router'].navigate([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Handles the page refresh action.
   * Sets the version mismatch state to false.
   * Sets the is refreshed state to true.
   * Refreshes the page.
   * @param event The click event that triggered the refresh.
   */
  public refreshPage(event: Event): void {
    event.preventDefault();
    this.accountStore.setHasVersionMismatch(false);

    this.opalFinesService
      .getDefendantAccountHeadingData(Number(this.accountStore.account_id()))
      .pipe(
        tap((headingData) => {
          this.accountStore.setAccountState(
            this.payloadService.transformAccountHeaderForStore(Number(this.accountStore.account_id()), headingData),
          );
        }),
      )
      .subscribe((res) => {
        this.accountStore.setSuccessMessage('Information is up to date');
        this.accountData = res;
        this.refreshFragment$.next(this.activeTab);
      });
  }

  /**
   * Navigates back to the account search results page.
   */
  public navigateBack(): void {
    this['router'].navigate([
      `/${FINES_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.children.results}`,
    ]);
  }

  public ngOnInit(): void {
    this.getHeaderDataFromRoute();
    this.setupTabDataStream();
  }

  public ngOnDestroy(): void {
    this.accountStore.clearSuccessMessage();
    this.accountStore.setHasVersionMismatch(false);
    this.destroy$.next();
    this.destroy$.complete();
  }

  public navigateToChangeDefendantDetailsPage(event: Event): void {
    event.preventDefault();
    // Navigate to the change defendant details page
  }

  public navigateToConvertAccountPage(event: Event): void {
    event.preventDefault();
    // Navigate to the convert account page
  }
}
