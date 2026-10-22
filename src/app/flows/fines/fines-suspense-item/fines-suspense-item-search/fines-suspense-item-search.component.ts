import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FinesSuspenseItemSearchFormComponent } from './fines-suspense-item-search-form/fines-suspense-item-search-form.component';

@Component({
  selector: 'app-fines-suspense-item-search',
  imports: [FinesSuspenseItemSearchFormComponent],
  templateUrl: './fines-suspense-item-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemSearchComponent {
  private readonly router = inject(Router);

  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];

  public businessUnitAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];
  public initialBusinessUnitId: number | null = null;

  /**
   * Returns to the Finance dashboard when the search is cancelled.
   */
  public handleCancel(): void {
    void this.router.navigate(this.financeDashboardRoute);
  }
}
