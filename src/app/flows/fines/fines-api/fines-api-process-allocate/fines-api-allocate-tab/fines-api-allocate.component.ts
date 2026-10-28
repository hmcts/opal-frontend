import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
  viewChild,
} from '@angular/core';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { FINES_API_ALLOCATE_CONTENT } from './constants/fines-api-allocate-content.constant';
import { IFinesApiAllocateData } from './interfaces/fines-api-allocate-data.interface';
import { FinesApiAllocateTillsTableWrapperComponent } from './fines-api-allocate-tills-table-wrapper/fines-api-allocate-tills-table-wrapper.component';

@Component({
  selector: 'app-fines-api-allocate',
  imports: [
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    FinesApiAllocateTillsTableWrapperComponent,
  ],
  templateUrl: './fines-api-allocate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiAllocateComponent {
  private readonly table = viewChild(FinesApiAllocateTillsTableWrapperComponent);
  protected readonly data = signal<IFinesApiAllocateData>({
    processingTotal: 0,
    processingByBusinessUnit: [],
    tills: [],
  });
  protected readonly content = FINES_API_ALLOCATE_CONTENT;
  protected readonly processingAnnouncement = computed(() =>
    [
      this.content.processingTotal(this.data().processingTotal),
      ...this.data().processingByBusinessUnit.map((unit) => `${unit.businessUnitName} (${unit.count})`),
    ].join(' '),
  );

  /**
   * Supplies the latest processing summary and rows to render on the Allocate tab.
   *
   * @param value The mapped processing totals, business-unit counts and available tills.
   */
  @Input({ required: true }) public set tabData(value: IFinesApiAllocateData) {
    this.data.set(value);
  }

  /** Emits without a payload after selection is cleared, requesting fresh processing and till data. */
  @Output() public readonly refreshRequested = new EventEmitter<void>();

  /**
   * Clears table selection, when a table is present, before requesting fresh data from the parent.
   *
   * @returns Nothing; emits refreshRequested without a payload for both populated and empty states.
   */
  protected refresh(): void {
    this.table()?.clearSelection();
    this.refreshRequested.emit();
  }
}
