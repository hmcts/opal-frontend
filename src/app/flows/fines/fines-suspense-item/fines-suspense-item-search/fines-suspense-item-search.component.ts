import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { FinesSuspenseItemStore } from '../stores/fines-suspense-item.store';
import { IFinesSuspenseItemSearchFormState } from './interfaces/fines-suspense-item-search-form-state.interface';
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
export class FinesSuspenseItemSearchComponent implements OnInit {
  private readonly suspenseItemStore = inject(FinesSuspenseItemStore);
  private readonly router = inject(Router);

  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];

  public businessUnitAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];
  public initialBusinessUnitId: number | null = null;

  private initialiseBusinessUnit(): void {
    const retainedId = this.suspenseItemStore.selectedBusinessUnitId();
    const soleBusinessUnit =
      this.businessUnitAutoCompleteItems.length === 1 ? this.businessUnitAutoCompleteItems[0] : null;

    this.initialBusinessUnitId = retainedId;
    if (retainedId === null && soleBusinessUnit && typeof soleBusinessUnit.value === 'number') {
      this.initialBusinessUnitId = soleBusinessUnit.value;
    }
    this.suspenseItemStore.setSelectedBusinessUnitId(this.initialBusinessUnitId);
  }

  public handleBusinessUnitChange(businessUnitId: number | null): void {
    this.suspenseItemStore.setSelectedBusinessUnitId(businessUnitId);
  }

  public handleFormSubmit(form: IAbstractFormBaseForm<IFinesSuspenseItemSearchFormState>): void {
    this.suspenseItemStore.setSubmittedCriteria(form.formData);
  }

  public ngOnInit(): void {
    this.initialiseBusinessUnit();
  }

  /**
   * Returns to the Finance dashboard when the search is cancelled.
   */
  public handleCancel(): void {
    void this.router.navigate(this.financeDashboardRoute);
  }
}
