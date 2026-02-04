import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, map, takeUntil } from 'rxjs/operators';
// Services
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
// Stores
import { FinesAccountStore } from '../stores/fines-acc.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
// Components
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
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
import { MojButtonMenuComponent } from '@hmcts/opal-frontend-common/components/moj/moj-button-menu';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import { CustomPageHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-page-header';
// Pipes & Directives
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
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
import { FinesAccBannerMessagesComponent } from '../fines-acc-banner-messages/fines-acc-banner-messages-component';

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
    MojButtonMenuComponent,
    GovukHeadingWithCaptionComponent,
    CustomPageHeaderComponent,
    GovukButtonDirective,
    MonetaryPipe,
    FinesAccBannerMessagesComponent,
  ],
  templateUrl: './fines-acc-minor-creditor-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsComponent extends AbstractTabData implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly refreshFragment$ = new Subject<string>();
  private readonly permissionsService = inject(PermissionsService);
  private readonly globalStore = inject(GlobalStore);
  private readonly userState = this.globalStore.userState();
  private readonly opalFinesService = inject(OpalFines);
  private readonly payloadService = inject(FinesAccPayloadService);

  public accountStore = inject(FinesAccountStore);
  public tabs: IFinesAccountMinorCreditorDetailsTabs = FINES_ACC_MINOR_CREDITOR_DETAILS_TABS;
  public accountData!: IOpalFinesAccountMinorCreditorDetailsHeader;
  public tabContentStyles: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  public debtorTypes = FINES_ACC_DEBTOR_TYPES;
  public accountTypes = FINES_ACCOUNT_TYPES;
  public lastEnforcement: IOpalFinesResultRefData | null = null;

  /**
   * Fetches the minor creditor account heading data and current tab fragment from the route.
   */
  private getHeaderDataFromRoute(): void {
    this.accountData = this.activatedRoute.snapshot.data['minorCreditorAccountHeadingData'];
    this.activeTab = this.activatedRoute.snapshot.fragment || 'at-a-glance';
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
   * If the user lacks the required permission in this BU, navigates to the access-denied page instead.
   */
  public navigateToAddAccountNotePage(): void {
    if (
      this.permissionsService.hasBusinessUnitPermissionAccess(
        FINES_PERMISSIONS['add-account-activity-notes'],
        Number(this.accountStore.business_unit_id()!),
        this.userState.business_unit_users,
      )
    ) {
      this['router'].navigate([`../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.note}/add`], {
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
  public refreshPage(): void {
    this.accountStore.setHasVersionMismatch(false);

    this.opalFinesService
      .getMinorCreditorAccountHeadingData(Number(this.accountStore.account_id()))
      .pipe(
        tap((headingData) => {
          this.accountStore.setAccountState(
            this.payloadService.transformMinorCreditorAccountHeaderForStore(
              Number(this.accountStore.account_id()),
              headingData,
            ),
          );
        }),
        map((headingData) => this.payloadService.transformPayload(headingData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG)),
        takeUntil(this.destroy$),
      )
      .subscribe((res) => {
        this.accountStore.setSuccessMessage('Information is up to date');
        this.accountData = res;
        this.refreshFragment$.next(this.activeTab);
      });
  }

  public ngOnInit(): void {
    this.getHeaderDataFromRoute();
  }

  public ngOnDestroy(): void {
    this.accountStore.clearSuccessMessage();
    this.accountStore.setHasVersionMismatch(false);
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshFragment$.complete();
  }
}
