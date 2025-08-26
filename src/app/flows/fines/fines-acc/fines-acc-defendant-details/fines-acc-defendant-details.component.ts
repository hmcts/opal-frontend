import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, Observable, of, Subject, takeUntil, tap } from 'rxjs';
// Services
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
// Stores
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
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
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
// Interfaces
import { IOpalFinesDefendantAccountHeader } from './interfaces/fines-acc-defendant-account-header.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { IFinesAccountDetailsTabs } from '../interfaces/fines-acc-tab-data-types.interface';
import { FINES_ACC_DEFENDANT_ACCOUNT_TABS } from './constants/fines-acc-defendant-account-tabs-data.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [
    AsyncPipe,
    FinesAccDefendantDetailsAtAGlanceTabComponent,
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
    KeyValuePipe
  ],
  templateUrl: './fines-acc-defendant-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly opalFinesService = inject(OpalFines);
  private readonly permissionsService = inject(PermissionsService);
  private readonly globalStore = inject(GlobalStore);
  private readonly userState = this.globalStore.userState();
  private readonly destroy$ = new Subject<void>();
  private fragment$ = this.clearCacheOnTabChange(this.getFragmentStream('at-a-glance', this.destroy$), () =>
      this.opalFinesService.clearAccountDetailsCache(),
    );

  public readonly utilsService = inject(UtilsService);
  public accountStore = inject(FinesAccountStore);
  public tabs: IFinesAccountDetailsTabs = FINES_ACC_DEFENDANT_ACCOUNT_TABS;
  public accountData!: IOpalFinesDefendantAccountHeader;

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
   * This method listens to changes in the route fragment (representing the active tab),
   * and updates the tab data stream accordingly. It uses the provided initial tab,
   * and constructs the necessary parameters for fetching and populating the tab's table data.
   *
   */
  private setupTabDataStream(): void {


    const { defendant_account_id, business_unit_id, business_unit_user_id } = this.accountData;

    this.fragment$.subscribe((tab) => {
      switch (tab) {
        case 'at-a-glance':
          this.tabs[tab].data = this.fetchTabData(
            this.opalFinesService.getDefendantAccountAtAGlance(tab, defendant_account_id, business_unit_id, business_unit_user_id)
          );
          break;
        case 'defendant':
          this.tabs[tab].data = this.fetchTabData(
            of({ version: 3 })
          );
          break;
        case 'payment-terms':
          this.tabs[tab].data = this.fetchTabData(
            of({ version: 1 })
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
    if (version !== this.accountStore.version()) {
      // ToDo
      console.error('version mismatch', version, this.accountStore.version());
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
      this.userState.business_unit_user,
    );
  }

  /**
   * Navigates to the add account note page.
   */
  public navigateToAddAccountNotePage(): void {
    this['router'].navigate([`../${FINES_ACC_ROUTING_PATHS.children.note}/add`], { relativeTo: this.activatedRoute });
  }

  /**
   * Navigates to the add comments page.
   * @param event The click event that triggered the navigation.
   */
  public navigateToAddCommentsPage(event: Event): void {
    event.preventDefault();
    this['router'].navigate([`../${FINES_ACC_ROUTING_PATHS.children.comments}/add`], {
      relativeTo: this.activatedRoute,
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
