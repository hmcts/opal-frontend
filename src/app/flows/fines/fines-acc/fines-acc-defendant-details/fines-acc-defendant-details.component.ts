import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// Services
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
// Stores
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
// Components
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data';
import { FinesAccDetailsAccountInfoComponent } from '../components/fines-acc-details-account-info/fines-acc-details-account-info.component';
import { FinesAccDetailsAccountInfoBlockComponent } from '../components/fines-acc-details-account-info-block/fines-acc-details-account-info-block.component';
import { FinesAccDetailsAccountHeadingComponent } from '../components/fines-acc-details-account-heading/fines-acc-details-account-heading.component';
import { FinesAccDefendantDetailsAtAGlanceTabComponent } from './fines-acc-defendant-details-at-a-glance-tab/fines-acc-defendant-details-at-a-glance-tab.component';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
// Pipes
import { AsyncPipe } from '@angular/common';
// Constants
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constants';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_SA_ROUTING_PATHS } from '../../fines-sa/routing/constants/fines-sa-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../routing/constants/fines-acc-routing-paths.constant';
// Interfaces
import { IOpalFinesDefendantAccountHeader } from './interfaces/fines-acc-defendant-account-header.interface';
import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-tab-ref-data.interface';

@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [
    AsyncPipe,
    FinesAccDetailsAccountInfoComponent,
    FinesAccDetailsAccountInfoBlockComponent,
    FinesAccDetailsAccountHeadingComponent,
    FinesAccDefendantDetailsAtAGlanceTabComponent,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    GovukBackLinkComponent,
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
  public tabData$ = new Observable<IOpalFinesAccountDetailsAtAGlanceTabRefData>();
  public accountData!: IOpalFinesDefendantAccountHeader;

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

    const { defendant_account_id, business_unit_id, business_unit_user_id } = this.accountData;

    this.tabData$ = this.createTabDataStream<
      IOpalFinesAccountDetailsAtAGlanceTabRefData,
      IOpalFinesAccountDetailsAtAGlanceTabRefData
    >(
      fragment$,
      (tab) => tab,
      (tab) =>
        this.opalFinesService.getDefendantAccountAtAGlance(
          tab,
          defendant_account_id,
          business_unit_id,
          business_unit_user_id,
        ),
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
   * Navigates back to the account search results page.
   */
  public navigateBack(): void {
    this['router'].navigate([
      `/${FINES_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.children.results}`,
    ]);
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
