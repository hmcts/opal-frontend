import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import { GovukCheckboxesItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import {
  MojMultiSelectBodyDirective,
  MojMultiSelectHeadDirective,
  MultiSelectRowIdentifier,
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/directives/moj-multi-select';
import { FINES_API_ALLOCATE_CONTENT } from './constants/fines-api-allocate-content.constant';
import { IFinesApiAllocateData } from './interfaces/fines-api-allocate-data.interface';
import { FINES_ROUTING_PATHS } from '../../../routing/constants/fines-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from '../../routing/constants/fines-api-routing-paths.constant';

@Component({
  selector: 'app-fines-api-allocate',
  imports: [
    RouterLink,
    CustomHorizontalScrollPaneComponent,
    GovukCheckboxesItemComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojMultiSelectBodyDirective,
    MojMultiSelectHeadDirective,
  ],
  templateUrl: './fines-api-allocate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiAllocateComponent {
  private readonly selectedIds = signal(new Set<string>());
  protected readonly data = signal<IFinesApiAllocateData>({
    processingTotal: 0,
    processingByBusinessUnit: [],
    tills: [],
  });
  protected readonly content = FINES_API_ALLOCATE_CONTENT;
  protected readonly tillSummaryRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.children.tillSummary}`;
  protected readonly rowControls = new Map<string, FormControl<boolean>>();
  protected readonly selectAllControl = new FormControl(false, { nonNullable: true });
  protected readonly selectedCount = computed(() => this.selectedIds().size);
  protected readonly someSelected = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.data().tills.length,
  );
  protected readonly processingAnnouncement = computed(() =>
    [
      this.content.processingTotal(this.data().processingTotal),
      ...this.data().processingByBusinessUnit.map((unit) => `${unit.businessUnitName} (${unit.count})`),
    ].join(' '),
  );

  /** Every replacement response starts a new selection, even when IDs are unchanged. */
  @Input({ required: true }) public set tabData(value: IFinesApiAllocateData) {
    this.data.set(value);
    this.rowControls.clear();
    value.tills.forEach((row) => this.rowControls.set(row.tillId, new FormControl(false, { nonNullable: true })));
    this.clearSelection();
  }

  @Output() public readonly refreshRequested = new EventEmitter<void>();

  private syncControls(): void {
    this.rowControls.forEach((control, id) => control.setValue(this.selectedIds().has(id), { emitEvent: false }));
    this.selectAllControl.setValue(this.data().tills.length > 0 && this.selectedCount() === this.data().tills.length, {
      emitEvent: false,
    });
  }

  private clearSelection(): void {
    this.selectedIds.set(new Set());
    this.syncControls();
  }

  protected toggleAll(checked: boolean): void {
    this.selectedIds.set(new Set(checked ? this.data().tills.map((row) => row.tillId) : []));
    this.syncControls();
  }

  protected toggleRow(event: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    const id = String(event.rowId);
    if (!this.rowControls.has(id)) {
      return;
    }
    this.selectedIds.set(toggleMultiSelectRow(this.selectedIds(), id, event.checked));
    this.syncControls();
  }

  protected refresh(): void {
    this.clearSelection();
    this.refreshRequested.emit();
  }
}
