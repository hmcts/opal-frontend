import { ChangeDetectionStrategy, Component, DOCUMENT, inject, OnInit } from '@angular/core';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { CommonModule } from '@angular/common';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesSaSearchFilterBusinessUnitForm } from './fines-sa-search-filter-business-unit-form/fines-sa-search-filter-business-unit-form.component';
import { IFinesSaSearchFilterBusinessUnitForm } from './interfaces/fines-sa-search-filter-business-unit-form.interface';

@Component({
  selector: 'app-fines-sa-search-filter-business-unit',
  imports: [CommonModule, FinesSaSearchFilterBusinessUnitForm],
  templateUrl: './fines-sa-search-filter-business-unit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaSearchFilterBusinessUnitComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly finesSaStore = inject(FinesSaStore);
  private readonly finesSaSearchAccountRoutingPaths = FINES_SA_ROUTING_PATHS;

  public readonly document = inject(DOCUMENT);
  public businessUnits!: IOpalFinesBusinessUnit[];

  /**
   * Populates the component's businessUnits from the route resolver.
   *
   * Reads the resolver payload at `activatedRoute.snapshot.data['businessUnits']`, expects a
   * `refData` property of type `IOpalFinesBusinessUnit[] | undefined`, and sets `this.businessUnits`
   * to the filtered array of business units that have `Accounting Division` as their type of `business_unit_type`.
   * If `refData` is not an array or is undefined, `this.businessUnits` is set to an empty array.
   *
   * @private
   * @returns void
   */
  private populateBusinessUnitFromResolver(): void {
    const resolverData = this['activatedRoute']?.snapshot?.data?.['businessUnits'];
    const refData = resolverData?.refData as IOpalFinesBusinessUnit[] | undefined;
    this.businessUnits = Array.isArray(refData)
      ? refData.filter((bu) => bu.business_unit_type === 'Accounting Division')
      : [];
  }

  /**
   * Builds and returns the subset of business units from this.businessUnits that correspond to the
   * provided selected ids.
   *
   * The method:
   * - Iterates over the provided selection records to collect keys whose values are truthy.
   * - Converts those keys (object keys are strings at runtime) to numeric ids using Number(...).
   * - Filters this.businessUnits to include only units whose business_unit_id is present in the collected ids.
   *
   * @private
   * @param selectedBusinessUnitIds - An array of selection maps (Record<number, boolean>[]). Each map's
   *   keys represent business unit ids (stringified at runtime) and the boolean value indicates whether
   *   the id is selected.
   * @returns An array of IOpalFinesBusinessUnit objects from this.businessUnits whose business_unit_id
   *   matches any of the selected ids. If no ids are selected or no matches are found, an empty array is returned.
   * @remarks
   * - Non-numeric keys converted with Number(...) will produce NaN and will not match any business_unit_id.
   * - Duplicate ids across records are naturally deduplicated by the includes check on the collected ids array.
   */
  private getBusinessUnitsFromSelectedIds(
    selectedBusinessUnitIds: Record<number, boolean>[],
  ): IOpalFinesBusinessUnit[] {
    // Convert selected keys (object keys are strings) into a Set of numeric IDs
    const selectedIds = new Set(
      Object.entries(selectedBusinessUnitIds)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => Number(id)),
    );
    return this.businessUnits.filter((unit) => selectedIds.has(unit.business_unit_id));
  }

  /**
   * Handle submission of the business unit filter form.
   *
   * Updates the finesSaStore with the selected business unit IDs extracted from
   * the provided form, then navigates back to the fines search route while
   * preserving the current active tab as a URL fragment.
   *
   * Side effects:
   * - Calls finesSaStore.setBusinessUnitIds(...) with the mapped business_unit_id values.
   * - Calls router.navigate(...) to the search child route relative to the parent activated route.
   *
   * @param form - The filter form containing fsa_search_account_business_unit_ids selected by the user.
   * @returns void
   */
  public handleFilterBusinessUnitSubmit(form: IFinesSaSearchFilterBusinessUnitForm): void {
    this.finesSaStore.setBusinessUnitIds(
      this.getBusinessUnitsFromSelectedIds(form.formData.fsa_search_account_business_unit_ids!).map(
        (unit) => unit.business_unit_id,
      ),
    );
    this['router'].navigate([this.finesSaSearchAccountRoutingPaths.children.search], {
      relativeTo: this['activatedRoute'].parent,
      fragment: this.finesSaStore.activeTab(),
    });
  }

  /**
   * Update the unsaved-changes indicator for both the component and the shared fines store.
   *
   * @param unsavedChanges - True if there are unsaved changes that should be tracked; false to clear the flag.
   * @returns void
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesSaStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Angular lifecycle method called after the component is initialized.
   * Initializes the business unit selection by populating it from the route resolver.
   */
  public ngOnInit(): void {
    this.populateBusinessUnitFromResolver();
  }
}
