import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { mapAllocateRequest } from '../../services/utils/fines-api-payload-map-allocate-request.utils';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
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
    GovukErrorSummaryComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    FinesApiAllocateTillsTableWrapperComponent,
  ],
  templateUrl: './fines-api-allocate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiAllocateComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly utilsService = inject(UtilsService);
  private readonly opalFines = inject(OpalFines);
  private readonly table = viewChild(FinesApiAllocateTillsTableWrapperComponent);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectionError = computed(() => this.errorMessage() === this.content.selectAtLeastOneTill);
  protected readonly errors = computed(() => {
    const message = this.errorMessage();
    return message
      ? [{ fieldId: this.selectionError() ? 'fines-api-allocate-select-all' : 'fines-api-allocate-refresh', message }]
      : [];
  });
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

  /** Cancels older reads in the parent before a validated allocation request starts. */
  @Output() public readonly allocationStarted = new EventEmitter<void>();

  /** Reports the accepted till count to the page; zero clears previous feedback. */
  @Output() public readonly allocationCountChanged = new EventEmitter<number>();

  /** Emits without a payload after selection is cleared, requesting fresh processing and till data. */
  @Output() public readonly refreshRequested = new EventEmitter<void>();

  /**
   * Clears table selection, when a table is present, before requesting fresh data from the parent.
   *
   * @returns Nothing; emits refreshRequested without a payload for both populated and empty states.
   */
  protected refresh(): void {
    if (this.submitting()) return;
    this.errorMessage.set(null);
    this.allocationCountChanged.emit(0);
    this.table()?.clearSelection();
    this.refreshRequested.emit();
  }

  /** Clears selection feedback when the user changes the selection. */
  protected selectionChanged(): void {
    this.errorMessage.set(null);
  }

  /** Moves keyboard focus to the control referenced by an error summary link. */
  protected scrollTo(fieldId: string): void {
    this.document.getElementById(fieldId)?.focus();
  }

  /** Submits a snapshot of selected tills and acknowledges acceptance, not completed allocation. */
  protected allocate(): void {
    if (this.submitting()) return;
    this.allocationCountChanged.emit(0);
    const selectedIds = this.table()?.getSelectedIds() ?? [];
    const payload = mapAllocateRequest(this.data().tills, selectedIds);
    if (!payload) {
      this.errorMessage.set(selectedIds.length ? this.content.invalidSelection : this.content.selectAtLeastOneTill);
      this.utilsService.scrollToTop();
      return;
    }

    this.errorMessage.set(null);
    this.submitting.set(true);
    this.allocationStarted.emit();
    this.opalFines
      .allocateTills(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: () => {
          const submittedIds = new Set(selectedIds);
          this.data.update((data) => ({ ...data, tills: data.tills.filter((row) => !submittedIds.has(row.tillId)) }));
          this.table()?.clearSelection();
          this.allocationCountChanged.emit(payload.tills.length);
          this.utilsService.scrollToTop();
        },
        // The common interceptor presents immediate API failures. Keep rows and selection for reconciliation.
        error: () => {},
      });
  }
}
