import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { FinesConStore } from '../../stores/fines-con.store';
import { FINES_CON_CONSOLIDATE_ACC_TABS } from './constants/fines-con-consolidate-acc-tabs.constant';
import { FINES_CON_ROUTING_PATHS } from '../../routing/constants/fines-con-routing-paths.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { IFinesConConsolidateAccTabs } from './interfaces/fines-con-consolidate-acc-tabs.interface';
import { FinesConSearchAccountComponent } from '../fines-con-search-account/fines-con-search-account.component';
import { IFinesConDefendantType } from '../../interfaces/fines-con-defendant-type.interface';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';

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
    FinesConSearchAccountComponent,
  ],
  templateUrl: './fines-con-consolidate-acc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConConsolidateAccComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesConStore = inject(FinesConStore);
  protected readonly tabs: IFinesConConsolidateAccTabs = FINES_CON_CONSOLIDATE_ACC_TABS;
  protected activeTab: string = 'search';

  /**
   * Gets the defendant type from the store
   */
  protected getDefendantType(): IFinesConDefendantType {
    return this.finesConStore.getDefendantType() as IFinesConDefendantType;
  }

  /**
   * Navigates back to the select business unit page
   */
  navigateBack(): void {
    this.router.navigate([FINES_CON_ROUTING_PATHS.children.selectBusinessUnit], {
      relativeTo: this.activatedRoute.parent,
    });
  }

  /**
   * Handles tab switch by updating the active tab
   */
  handleTabSwitch(tabFragment: string): void {
    this.activeTab = tabFragment;
  }
  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there are unsaved changes -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateTypes {
    return !this.finesConStore.unsavedChanges();
  }

  /**
   * Cancels the consolidation process by resetting the store and navigating to the dashboard
   */
  cancelConsolidation(): void {
    this.finesConStore.resetConsolidationState();
    this.router.navigate([PAGES_ROUTING_PATHS.children.dashboard]);
  }
}
