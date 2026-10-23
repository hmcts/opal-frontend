import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { ChangeDetectionStrategy, Component, OnInit, inject, DestroyRef } from '@angular/core';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { FinesSuspenseItemStore } from '../stores/fines-suspense-item.store';
import { IFinesSuspenseItemSearchFormState } from './interfaces/fines-suspense-item-search-form-state.interface';
import { ActivatedRoute, Router } from '@angular/router';
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
  private readonly opalFines = inject(OpalFines);
  private readonly destroyRef = inject(DestroyRef);
  private readonly suspenseItemStore = inject(FinesSuspenseItemStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly financeDashboardRoute = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.root,
    FINES_DASHBOARD_ROUTING_PATHS.children.finance,
  ];

  public businessUnitAutoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];
  public initialBusinessUnitId: number | null = null;
  public stateUnsavedChanges = false;

  /**
   * Uses the BUs already loaded by the route resolver. Build the options before
   * restoring the selection so a sole BU can be selected on the first visit.
   */
  private initialiseBusinessUnits(): void {
    const businessUnits: IOpalFinesBusinessUnitRefData = this.activatedRoute.snapshot.data['businessUnits'];
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
    this.suspenseItemStore.setSelectedBusinessUnitId(this.initialBusinessUnitId);
  }

  public handleBusinessUnitChange(businessUnitId: number | null): void {
    this.suspenseItemStore.setSelectedBusinessUnitId(businessUnitId);
  }

  /**
   * Starts a fresh lookup and temporarily logs the response for browser inspection.
   * @param form - Validated values emitted by the search form.
   * @returns Nothing; the response is logged to the browser console.
   */
  public handleFormSubmit(form: IAbstractFormBaseForm<IFinesSuspenseItemSearchFormState>): void {
    const criteria = { ...form.formData };
    if (criteria.fsis_business_unit_id === null) {
      return;
    }

    // Strip leading zeroes as text: references have no length limit, so Number() could lose precision.
    const reference = criteria.fsis_suspense_reference_number.replace(/^0+(?=\d)/, '');
    this.opalFines.clearCache('suspenseItemSummaryCache$');
    this.opalFines.clearCache('suspenseItemHistoryCache$');
    this.opalFines
      .getSuspenseItemSummary(criteria.fsis_business_unit_id, reference)
      .pipe(
        // The shared HTTP interceptor displays and logs errors; complete without emitting a result.
        catchError(() => EMPTY),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        // TODO(PO-9764, PO-9765): Replace console logging with results navigation and resolver-provided route data.
        next: (summary) => console.log('Suspense item summary:', summary),
      });
  }

  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /** Allows the shared route guard to confirm leaving after the user edits the form. */
  public canDeactivate(): boolean {
    return !this.stateUnsavedChanges;
  }

  public ngOnInit(): void {
    this.initialiseBusinessUnits();
  }

  /**
   * Returns to the Finance dashboard when the search is cancelled.
   */
  public handleCancel(): void {
    void this.router.navigate(this.financeDashboardRoute);
  }
}
