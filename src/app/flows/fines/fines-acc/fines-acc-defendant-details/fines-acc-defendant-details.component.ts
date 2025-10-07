import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, EMPTY, map, merge, Observable, Subject, takeUntil, tap } from 'rxjs';
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
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_DEFENDANT_DETAILS_TABS } from './constants/fines-acc-defendant-details-tabs.constant';
import { FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES } from '../fines-acc-debtor-add-amend/constants/fines-acc-debtor-add-amend-party-types.constant';
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
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../constants/fines-acc-summary-tabs-content-styles.constant';
import { IFinesAccSummaryTabsContentStyles } from './interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FinesAccDefendantDetailsDefendantTabComponent } from './fines-acc-defendant-details-defendant-tab/fines-acc-defendant-details-defendant-tab.component';
import { FinesAccDefendantDetailsParentOrGuardianTabComponent } from './fines-acc-defendant-details-parent-or-guardian-tab/fines-acc-defendant-details-parent-or-guardian-tab.component';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-transform-items-config.constant';

@Component({
  selector: 'app-fines-acc-defendant-details',
  imports: [
    AsyncPipe,
    FinesAccDefendantDetailsAtAGlanceTabComponent,
    FinesAccDefendantDetailsDefendantTabComponent,
    FinesAccDefendantDetailsParentOrGuardianTabComponent,
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
  public accountData!: IOpalFinesAccountDefendantDetailsHeader;
  public tabContentStyles: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  public tabAtAGlance$: Observable<IOpalFinesAccountDefendantAtAGlance> = EMPTY;
  public tabDefendant$: Observable<IOpalFinesAccountDefendantAccountParty> = EMPTY;
  public tabParentOrGuardian$: Observable<IOpalFinesAccountDefendantAccountParty> = EMPTY;
  public tabPaymentTerms$: Observable<IOpalFinesAccountDefendantDetailsPaymentTermsTabRefData> = EMPTY;
  public tabEnforcement$: Observable<IOpalFinesAccountDefendantDetailsEnforcementTabRefData> = EMPTY;
  public tabImpositions$: Observable<IOpalFinesAccountDefendantDetailsImpositionsTabRefData> = EMPTY;
  public tabHistoryAndNotes$: Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> = EMPTY;

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

    const { defendant_party_id, parent_guardian_party_id } = this.accountData;
    const { account_id } = this.accountStore.getAccountState();

    fragment$.subscribe((tab) => {
      switch (tab) {
        case 'at-a-glance':
          this.tabAtAGlance$ = this.fetchTabData(this.opalFinesService.getDefendantAccountAtAGlance(account_id));
          break;
        case 'defendant':
          this.tabDefendant$ = this.fetchTabData(
            this.opalFinesService.getDefendantAccountParty(account_id, defendant_party_id),
          );
          break;
        case 'parent-or-guardian':
          this.tabParentOrGuardian$ = this.fetchTabData(
            this.opalFinesService.getParentOrGuardianAccountParty(account_id, parent_guardian_party_id),
          );
          break;
        case 'payment-terms':
          this.tabPaymentTerms$ = this.fetchTabData(this.opalFinesService.getDefendantAccountPaymentTermsTabData());
          break;
        case 'enforcement':
          this.tabEnforcement$ = this.fetchTabData(this.opalFinesService.getDefendantAccountEnforcementTabData());
          break;
        case 'impositions':
          this.tabImpositions$ = this.fetchTabData(this.opalFinesService.getDefendantAccountImpositionsTabData());
          break;
        case 'history-and-notes':
          this.tabHistoryAndNotes$ = this.fetchTabData(
            this.opalFinesService.getDefendantAccountHistoryAndNotesTabData(),
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
  private fetchTabData<T extends { version: string | null }>(serviceCall: Observable<T>): Observable<T> {
    return serviceCall.pipe(
      map((data) => this.payloadService.transformPayload(data, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG)),
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
  private compareVersion(version: string | null): void {
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

  /**
   * Navigates to the add comments page.
   * @param event The click event that triggered the navigation.
   */
  public navigateToAddCommentsPage(event: Event): void {
    event.preventDefault();
    if (
      this.permissionsService.hasBusinessUnitPermissionAccess(
        FINES_PERMISSIONS['account-maintenance'],
        Number(this.accountStore.business_unit_id()!),
        this.userState.business_unit_users,
      )
    ) {
      this['router'].navigate([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`], {
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
    if (
      this.permissionsService.hasBusinessUnitPermissionAccess(
        FINES_PERMISSIONS['account-maintenance'],
        Number(this.accountStore.business_unit_id()!),
        this.userState.business_unit_users,
      )
    ) {
      let partyType: string;

      if (this.accountData.debtor_type === 'Parent/Guardian') {
        partyType = FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.PARENT_GUARDIAN;
      } else if (this.accountData.party_details.organisation_flag) {
        partyType = FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.COMPANY;
      } else {
        partyType = FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.INDIVIDUAL;
      }

      this['router'].navigate([`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.debtor}/${partyType}/amend`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this['router'].navigate(['/access-denied'], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
