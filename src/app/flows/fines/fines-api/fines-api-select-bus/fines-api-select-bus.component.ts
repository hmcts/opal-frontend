import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukTableBodyRowComponent,
  GovukTableBodyRowDataComponent,
  GovukTableComponent,
  GovukTableHeadingComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import {
  areAllMultiSelectRowsSelected,
  areSomeMultiSelectRowsSelected,
  MojMultiSelectBodyDirective,
  MojMultiSelectHeadDirective,
  MultiSelectRowIdentifier,
  toggleAllMultiSelectRows,
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/directives/moj-multi-select';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../../constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { IOpalFinesBusinessUnitOutstandingAutoPaymentCount } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-outstanding-auto-payment-count.interface';
import { IOpalFinesBusinessUnitOutstandingAutoPaymentCounts } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-outstanding-auto-payment-counts.interface';
import { FinesApiStore } from '../stores/fines-api.store';
import { FINES_API_ROUTING_PATHS } from '../routing/constants/fines-api-routing-paths.constant';
import { FINES_API_SELECT_BUS_ERRORS } from './constants/fines-api-select-bus-errors.constant';

@Component({
  selector: 'app-fines-api-select-bus',
  imports: [
    CommonModule,
    GovukCancelLinkComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukErrorSummaryComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
    GovukTableComponent,
    GovukTableHeadingComponent,
    MojMultiSelectBodyDirective,
    MojMultiSelectHeadDirective,
  ],
  templateUrl: './fines-api-select-bus.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiSelectBusComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly selectBusinessUnitsErrorMessage = FINES_API_SELECT_BUS_ERRORS.selectAtLeastOneBusinessUnit;

  protected readonly finesApiStore = inject(FinesApiStore);
  protected readonly businessUnitControls = new Map<number, FormControl<boolean>>();
  protected businessUnits: IOpalFinesBusinessUnitOutstandingAutoPaymentCount[] = [];
  protected selectedBusinessUnitIds = new Set<number>();
  protected formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] = [];
  protected hasBusinessUnitSelectionError = false;
  protected readonly selectAllControl = new FormControl<boolean>(false, { nonNullable: true });

  /**
   * Returns whether every displayed business unit is currently selected.
   */
  public get allBusinessUnitsSelected(): boolean {
    return areAllMultiSelectRowsSelected(this.businessUnits, this.selectedBusinessUnitIds, this.getBusinessUnitId);
  }

  /**
   * Returns whether some, but not all, displayed business units are selected.
   */
  public get someBusinessUnitsSelected(): boolean {
    return areSomeMultiSelectRowsSelected(this.businessUnits, this.selectedBusinessUnitIds, this.getBusinessUnitId);
  }

  /**
   * Returns whether the resolver supplied any selectable business units.
   */
  public get hasBusinessUnits(): boolean {
    return this.businessUnits.length > 0;
  }

  /**
   * Returns selected business unit IDs in the same order as the resolver payload.
   */
  private get selectedIdsInDisplayOrder(): number[] {
    return this.businessUnits
      .filter(({ business_unit_id: businessUnitId }) => this.selectedBusinessUnitIds.has(businessUnitId))
      .map(({ business_unit_id: businessUnitId }) => businessUnitId);
  }

  /**
   * Builds the absolute Finance dashboard route used when cancelling the journey.
   */
  private get financeDashboardRoute(): string[] {
    return [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    ];
  }

  /**
   * Builds the absolute Process and Allocate route used after a valid BU selection.
   */
  private get processAllocateRoute(): string[] {
    return [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_API_ROUTING_PATHS.root,
      FINES_API_ROUTING_PATHS.children.processAllocate,
    ];
  }

  /**
   * Updates the local selection set and persists the selected IDs to the ACI store.
   *
   * @param selectedBusinessUnitIds - Business unit IDs selected by the user.
   */
  private setSelectedBusinessUnitIds(selectedBusinessUnitIds: number[]): void {
    this.selectedBusinessUnitIds = new Set(selectedBusinessUnitIds);
    this.finesApiStore.setSelectedBusinessUnitIds(this.selectedIdsInDisplayOrder);
    this.syncSelectionControls();
    this.clearValidationError();
  }

  /**
   * Clears the select business units validation state.
   */
  private clearValidationError(): void {
    this.formErrorSummaryMessage = [];
    this.hasBusinessUnitSelectionError = false;
  }

  /**
   * Sets the validation error shown when the user continues without selecting a BU.
   */
  private setValidationError(): void {
    this.formErrorSummaryMessage = [
      {
        fieldId: 'fines-api-select-business-units',
        message: this.selectBusinessUnitsErrorMessage,
      },
    ];
    this.hasBusinessUnitSelectionError = true;
  }

  /**
   * Loads business unit counts from route resolver data.
   */
  private initialiseBusinessUnits(): void {
    const resolverData = this.activatedRoute.snapshot.data[
      'businessUnitCounts'
    ] as IOpalFinesBusinessUnitOutstandingAutoPaymentCounts | null;
    this.businessUnits = Array.isArray(resolverData?.business_units) ? resolverData.business_units : [];
  }

  /**
   * Returns stored business unit IDs that still exist in the latest resolver payload.
   */
  private getValidStoredBusinessUnitIds(): number[] {
    const availableBusinessUnitIds = new Set(this.businessUnits.map(({ business_unit_id }) => business_unit_id));

    return this.finesApiStore
      .selectedBusinessUnitIds()
      .filter((businessUnitId) => availableBusinessUnitIds.has(businessUnitId));
  }

  /**
   * Updates the ACI store when stale stored business unit IDs were removed.
   *
   * @param selectedBusinessUnitIds - Valid selected business unit IDs after filtering against resolver data.
   * @param storedBusinessUnitIds - Business unit IDs currently held in the store.
   */
  private updateStoreWhenStoredSelectionsChanged(
    selectedBusinessUnitIds: number[],
    storedBusinessUnitIds: number[],
  ): void {
    if (selectedBusinessUnitIds.length === storedBusinessUnitIds.length) {
      return;
    }

    if (selectedBusinessUnitIds.length === 0) {
      this.finesApiStore.clearSelectedBusinessUnitIds();
    } else {
      this.finesApiStore.setSelectedBusinessUnitIds(selectedBusinessUnitIds);
    }
  }

  /**
   * Restores valid BU selections from the store and clears any stale selections.
   */
  private restoreValidBusinessUnitSelections(): void {
    const storedBusinessUnitIds = this.finesApiStore.selectedBusinessUnitIds();
    const selectedBusinessUnitIds = this.getValidStoredBusinessUnitIds();

    this.selectedBusinessUnitIds = new Set(selectedBusinessUnitIds);
    this.updateStoreWhenStoredSelectionsChanged(selectedBusinessUnitIds, storedBusinessUnitIds);
    this.syncSelectionControls();
  }

  /**
   * Synchronises checkbox controls with the current selected business units.
   */
  private syncSelectionControls(): void {
    const displayedBusinessUnitIds = new Set(this.businessUnits.map(({ business_unit_id }) => business_unit_id));

    this.businessUnits.forEach(({ business_unit_id: businessUnitId }) => {
      const selected = this.selectedBusinessUnitIds.has(businessUnitId);
      const control = this.businessUnitControls.get(businessUnitId);

      if (control) {
        if (control.value !== selected) {
          control.setValue(selected, { emitEvent: false });
        }
        return;
      }

      this.businessUnitControls.set(businessUnitId, new FormControl<boolean>(selected, { nonNullable: true }));
    });

    Array.from(this.businessUnitControls.keys()).forEach((businessUnitId) => {
      if (!displayedBusinessUnitIds.has(businessUnitId)) {
        this.businessUnitControls.delete(businessUnitId);
      }
    });

    const allSelected = this.allBusinessUnitsSelected;
    if (this.selectAllControl.value !== allSelected) {
      this.selectAllControl.setValue(allSelected, { emitEvent: false });
    }
  }

  /**
   * Returns the stable multi-select row identifier for a business unit.
   *
   * @param businessUnit - Business unit row data.
   * @returns Business unit ID.
   */
  protected getBusinessUnitId(businessUnit: IOpalFinesBusinessUnitOutstandingAutoPaymentCount): number {
    return businessUnit.business_unit_id;
  }

  /**
   * Returns whether the supplied business unit ID is selected.
   *
   * @param businessUnitId - Business unit ID to check.
   */
  protected isBusinessUnitSelected(businessUnitId: number): boolean {
    return this.selectedBusinessUnitIds.has(businessUnitId);
  }

  /**
   * Moves focus to the field associated with an error summary link.
   *
   * @param fieldId - Element ID to focus.
   */
  protected scrollTo(fieldId: string): void {
    this.document.getElementById(fieldId)?.focus();
  }

  /**
   * Handles an individual business unit checkbox change.
   *
   * @param businessUnitId - Business unit ID represented by the checkbox.
   * @param event - Checkbox change event.
   */
  protected toggleBusinessUnit(event: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    const businessUnitId = Number(event.rowId);

    if (!Number.isFinite(businessUnitId)) {
      return;
    }

    const selectedBusinessUnitIds = toggleMultiSelectRow(
      this.selectedBusinessUnitIds,
      businessUnitId,
      event.checked,
    ) as Set<number>;

    this.setSelectedBusinessUnitIds([...selectedBusinessUnitIds]);
  }

  /**
   * Handles the top-level checkbox used to select or clear all displayed business units.
   *
   * @param event - Checkbox change event.
   */
  protected toggleAllBusinessUnits(checked: boolean): void {
    const selectedBusinessUnitIds = toggleAllMultiSelectRows(
      this.businessUnits,
      this.selectedBusinessUnitIds,
      this.getBusinessUnitId,
      checked,
    ) as Set<number>;

    this.setSelectedBusinessUnitIds([...selectedBusinessUnitIds]);
  }

  /**
   * Validates the selection and navigates to Process and Allocate when at least one BU is selected.
   */
  protected continue(): void {
    if (!this.hasBusinessUnits) {
      return;
    }

    if (this.selectedBusinessUnitIds.size === 0) {
      this.setValidationError();
      return;
    }

    this.clearValidationError();
    void this.router.navigate(this.processAllocateRoute);
  }

  /**
   * Navigates back to the Finance tab and clears ACI state only when navigation succeeds.
   */
  protected cancel(): void {
    void this.router.navigate(this.financeDashboardRoute).then((navigated) => {
      if (navigated) {
        this.finesApiStore.resetFinesApiState();
      }
    });
  }

  /**
   * Loads resolved business unit counts and restores any valid existing BU selections from the store.
   */
  public ngOnInit(): void {
    this.initialiseBusinessUnits();
    this.restoreValidBusinessUnitSelections();
  }
}
