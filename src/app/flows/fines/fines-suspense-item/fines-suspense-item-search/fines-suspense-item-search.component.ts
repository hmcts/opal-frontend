import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesSuspenseItemStore } from '../stores/fines-suspense-item.store';
import { IFinesSuspenseItemSearchFormState } from './interfaces/fines-suspense-item-search-form-state.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FinesSuspenseItemSearchFormComponent } from './fines-suspense-item-search-form/fines-suspense-item-search-form.component';
import { navigateToSuspenseItemResults } from '../utils/fines-suspense-item-navigate-to-results.utils';

@Component({
  selector: 'app-fines-suspense-item-search',
  imports: [FinesSuspenseItemSearchFormComponent],
  templateUrl: './fines-suspense-item-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemSearchComponent extends AbstractFormParentBaseComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly suspenseItemStore = inject(FinesSuspenseItemStore);
  private readonly navigationRouter = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];

  public businessUnitAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];
  public initialBusinessUnitId: number | null = null;
  public override stateUnsavedChanges = false;

  /**
   * Uses the BUs already loaded by the route resolver. Build the options before
   * restoring the selection so a sole BU can be selected on the first visit.
   */
  private initialiseBusinessUnits(): void {
    const businessUnits: IOpalFinesBusinessUnitRefData = this.route.snapshot.data['businessUnits'];
    this.businessUnitAutoCompleteItems = businessUnits.refData.map((businessUnit) => ({
      value: businessUnit.business_unit_id,
      name: businessUnit.business_unit_name,
    }));
    this.initialiseBusinessUnit();
  }

  /**
   * Preserves the BU selected earlier in the journey. The sole available BU is
   * used as a default only when the user has no saved selection.
   */
  private initialiseBusinessUnit(): void {
    const retainedId = this.suspenseItemStore.selectedBusinessUnitId();
    const soleBusinessUnit =
      this.businessUnitAutoCompleteItems.length === 1 ? this.businessUnitAutoCompleteItems[0] : null;

    this.initialBusinessUnitId = retainedId;
    if (retainedId === null && soleBusinessUnit && typeof soleBusinessUnit.value === 'number') {
      this.initialBusinessUnitId = soleBusinessUnit.value;
    }
    this.handleBusinessUnitChange(this.initialBusinessUnitId);
  }

  /**
   * Retains the selected business unit for the current Suspense journey.
   * @param businessUnitId - The selected business unit ID, or null when cleared.
   */
  public handleBusinessUnitChange(businessUnitId: number | null): void {
    const selectedBusinessUnit = this.businessUnitAutoCompleteItems.find((item) => item.value === businessUnitId);
    this.suspenseItemStore.setSelectedBusinessUnit(businessUnitId, selectedBusinessUnit?.name ?? null);
  }

  /**
   * Opens the results route, which resolves the summary before displaying an outcome.
   * @param form - Validated values emitted by the search form.
   */
  public handleFormSubmit(form: IAbstractFormBaseForm<IFinesSuspenseItemSearchFormState>): void {
    const criteria = form.formData;
    if (criteria.fsis_business_unit_id === null) {
      return;
    }

    this.handleBusinessUnitChange(criteria.fsis_business_unit_id);
    const reference = criteria.fsis_suspense_reference_number;
    navigateToSuspenseItemResults(this.navigationRouter, reference, () => {
      if (!this.destroyRef.destroyed) {
        this.handleUnsavedChanges(true);
      }
    });
  }

  /**
   * Updates the navigation and browser refresh warnings for the search form.
   * @param unsavedChanges - Whether the form has unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
    this.suspenseItemStore.setUnsavedChanges(unsavedChanges);
  }

  public ngOnInit(): void {
    this.initialiseBusinessUnits();
  }

  public ngOnDestroy(): void {
    // Only clear after leaving succeeds; cancelling the route guard keeps the warning active.
    this.suspenseItemStore.setUnsavedChanges(false);
  }

  /**
   * Returns to the Finance dashboard when the search is cancelled.
   */
  public handleCancel(): void {
    void this.navigationRouter.navigate(this.financeDashboardRoute);
  }
}
