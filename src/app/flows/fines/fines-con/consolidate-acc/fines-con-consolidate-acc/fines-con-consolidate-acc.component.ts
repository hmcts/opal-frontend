import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { FinesConStore } from '../../stores/fines-con.store';
import { FINES_CON_CONSOLIDATE_ACC_TABS } from './constants/fines-con-consolidate-acc-tabs.constant';
import { FINES_CON_ROUTING_PATHS } from '../../routing/constants/fines-con-routing-paths.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { IFinesConConsolidateAccTabs } from './interfaces/fines-con-consolidate-acc-tabs.interface';
import { FinesConSearchAccountComponent } from '../fines-con-search-account/fines-con-search-account.component';
import { FinesConDefendant } from '../../types/fines-con-defendant.type';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';

@Component({
  selector: 'app-fines-con-consolidate-acc',
  standalone: true,
  imports: [
    CommonModule,
    MojSubNavigationComponent,
    MojSubNavigationItemComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukBackLinkComponent,
    GovukCancelLinkComponent,
    FinesConSearchAccountComponent,
  ],
  templateUrl: './fines-con-consolidate-acc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConConsolidateAccComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesConStore = inject(FinesConStore);
  protected readonly tabs: IFinesConConsolidateAccTabs = FINES_CON_CONSOLIDATE_ACC_TABS;
  protected businessUnitRefData: IOpalFinesBusinessUnit[] = [];

  /**
   * Retrieves business unit reference data from the route resolver.
   *
   * - Reads resolver data from the activated route snapshot.
   * - Extracts the refData array from the resolver payload.
   * - Assigns the entire businessUnits array to `this.businessUnitRefData`.
   * - If the resolver data does not contain businessUnits, initializes as an empty array.
   *
   * @private
   * @returns void
   */
  private getBusinessUnits(): void {
    const resolverData = this.activatedRoute.snapshot.data['businessUnits'];
    const refData = resolverData?.refData as IOpalFinesBusinessUnit[] | undefined;
    this.businessUnitRefData = Array.isArray(refData) ? refData : [];
  }

  /**
   * Returns a human-readable label for the currently selected business unit.
   *
   * If every business unit is selected, returns "All business units".
   * Otherwise returns a comma-separated list of the selected business unit names
   * by mapping the ID from finesConStore.getBusinessUnitId()
   * against businessUnitRefData.
   *
   * @returns A string describing the selected business unit.
   */
  public get businessUnitText(): string | null {
    const selectedBusinessUnitId = this.finesConStore.getBusinessUnitId();
    const businessUnit = this.businessUnitRefData.find((bu) => bu.business_unit_id === selectedBusinessUnitId);
    return businessUnit?.business_unit_name ?? null;
  }

  /**
   * Gets the defendant type from the store
   */
  protected getDefendantType(): FinesConDefendant {
    return this.finesConStore.getDefendantType() as FinesConDefendant;
  }

  /**
   * Navigates back to the select business unit page
   */
  protected navigateBack(): void {
    this.router.navigate([FINES_CON_ROUTING_PATHS.children.selectBusinessUnit], {
      relativeTo: this.activatedRoute.parent,
    });
    this.finesConStore.resetSearchAccountForm();
  }

  /**
   * Handles tab switch by updating the active tab in the store
   */
  public handleTabSwitch(tabFragment: string): void {
    this.finesConStore.setActiveTab(tabFragment);
  }

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there are unsaved changes -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  public canDeactivate(): CanDeactivateTypes {
    if (this.finesConStore.unsavedChanges()) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Cancels the consolidation process by resetting the store and navigating to the dashboard
   */
  public cancelConsolidation(): void {
    this.finesConStore.resetConsolidationState();
    this.router.navigate([PAGES_ROUTING_PATHS.children.dashboard]);
  }

  public ngOnInit(): void {
    this.getBusinessUnits();
  }
}
