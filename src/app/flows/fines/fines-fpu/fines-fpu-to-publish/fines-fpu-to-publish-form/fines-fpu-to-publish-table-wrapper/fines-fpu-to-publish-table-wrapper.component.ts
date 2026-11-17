import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
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
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/directives/moj-multi-select';
import { IFinesFpuBusinessUnit } from '../../../interfaces/fines-fpu-business-unit.interface';

@Component({
  selector: 'app-fines-fpu-to-publish-table-wrapper',
  imports: [
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
    GovukTableComponent,
    GovukTableHeadingComponent,
    MojMultiSelectBodyDirective,
    MojMultiSelectHeadDirective,
  ],
  templateUrl: './fines-fpu-to-publish-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFpuToPublishTableWrapperComponent {
  protected readonly businessUnitControls = new Map<number, FormControl<boolean>>();
  protected readonly selectAllControl = new FormControl(false, { nonNullable: true });
  protected readonly selectedIds = computed(() => new Set(this.selectedBusinessUnitIds()));
  protected readonly allBusinessUnitsSelected = computed(() =>
    areAllMultiSelectRowsSelected(this.businessUnits(), this.selectedIds(), this.getBusinessUnitId),
  );
  protected readonly someBusinessUnitsSelected = computed(() =>
    areSomeMultiSelectRowsSelected(this.businessUnits(), this.selectedIds(), this.getBusinessUnitId),
  );

  public readonly businessUnits = input<readonly IFinesFpuBusinessUnit[]>([]);
  public readonly selectedBusinessUnitIds = input<readonly number[]>([]);
  public readonly selectedBusinessUnitIdsChange = output<number[]>();

  constructor() {
    effect(() => this.syncSelectionControls());
  }

  /** Resolves the shared multiselect row identifier. */
  private getBusinessUnitId(businessUnit: IFinesFpuBusinessUnit): number {
    return businessUnit.business_unit_id;
  }

  /** Keeps checkbox controls aligned when the parent replaces the rows or selection. */
  private syncSelectionControls(): void {
    const displayedIds = new Set(this.businessUnits().map(this.getBusinessUnitId));

    for (const businessUnitId of this.businessUnitControls.keys()) {
      if (!displayedIds.has(businessUnitId)) {
        this.businessUnitControls.delete(businessUnitId);
      }
    }

    for (const businessUnitId of displayedIds) {
      const selected = this.selectedIds().has(businessUnitId);
      const control = this.businessUnitControls.get(businessUnitId);

      if (control) {
        control.setValue(selected, { emitEvent: false });
      } else {
        this.businessUnitControls.set(businessUnitId, new FormControl(selected, { nonNullable: true }));
      }
    }

    this.selectAllControl.setValue(this.allBusinessUnitsSelected(), { emitEvent: false });
  }

  /** Emits the displayed business units in table order without changing the input arrays. */
  protected toggleAllBusinessUnits(checked: boolean): void {
    this.selectedBusinessUnitIdsChange.emit(checked ? this.businessUnits().map(this.getBusinessUnitId) : []);
  }

  /** Removes stale selections before emitting the updated selection to the parent. */
  protected toggleBusinessUnit({ rowId, checked }: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    if (typeof rowId !== 'number') {
      return;
    }

    const selectedIds = toggleMultiSelectRow(this.selectedIds(), rowId, checked);
    const displayedSelectedIds = this.businessUnits()
      .map(this.getBusinessUnitId)
      .filter((businessUnitId) => selectedIds.has(businessUnitId));

    this.selectedBusinessUnitIdsChange.emit(displayedSelectedIds);
  }
}
