import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
// Pipes & Directives
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
// Constants
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constants';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
// Interfaces
import { IOpalFinesAccountDefendantDetailsHeader } from './interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-tab-ref-data.interface';

@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [
    AsyncPipe,
    FinesAccDefendantDetailsAtAGlanceTabComponent,
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
    MojButtonMenuComponent,
    GovukHeadingWithCaptionComponent,
    CustomPageHeaderComponent,
    UpperCasePipe,
    GovukButtonDirective,
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

  public readonly utilsService = inject(UtilsService);
  public accountStore = inject(FinesAccountStore);
  public tabData$ = new Observable<IOpalFinesAccountDetailsAtAGlanceTabRefData>();
  public accountData!: IOpalFinesAccountDefendantDetailsHeader;

  /**
   * Fetches the defendant account heading data and current tab fragment from the route.
   */
  private getDataFromRoute(): void {
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
    const fragment$ = this.clearCacheOnTabChange(this.getFragmentStream('at-a-glance', this.destroy$), () =>
      this.opalFinesService.clearAccountDetailsCache(),
    );

    this.tabData$ = this.createTabDataStream<
      IOpalFinesAccountDetailsAtAGlanceTabRefData,
      IOpalFinesAccountDetailsAtAGlanceTabRefData
    >(
      fragment$,
      (tab) => tab,
      () => this.opalFinesService.getDefendantAccountAtAGlance(),
      (res) => res,
    );
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
      this['router'].navigate([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this['router'].navigate(['/access-denied'], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  public ngOnInit(): void {
    this.getDataFromRoute();
    this.setupTabDataStream();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
