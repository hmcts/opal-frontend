import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
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
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { catchError, defaultIfEmpty, finalize, map, of } from 'rxjs';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_API_PROCESS_ALLOCATE_TABS_KEYS } from '../fines-api-process-allocate/constants/fines-api-process-allocate-tabs-keys.constant';
import { FINES_API_ROUTING_PATHS } from '../routing/constants/fines-api-routing-paths.constant';
import { FinesApiStore } from '../stores/fines-api.store';
import { FINES_API_CONFIRM_PROCESS_CONTENT } from './constants/fines-api-confirm-process-content.constant';
import {
  buildBusinessUnitSummary,
  buildProcessInterfaceJobsPayload,
  enrichInterfaceJobsWithBusinessUnitIds,
  getSelectedInterfaceJobs,
  isDwpAeaSource,
} from './utils/fines-api-confirm-process.utils';

@Component({
  selector: 'app-fines-api-confirm-process',
  imports: [
    GovukCancelLinkComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
    GovukTableComponent,
    GovukTableHeadingComponent,
    MojMultiSelectBodyDirective,
    MojMultiSelectHeadDirective,
  ],
  templateUrl: './fines-api-confirm-process.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiConfirmProcessComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly finesApiStore = inject(FinesApiStore);
  private readonly opalFinesService = inject(OpalFines);
  private readonly router = inject(Router);
  private readonly utilsService = inject(UtilsService);
  private readonly selectedBusinessUnitIds = new Set(this.finesApiStore.selectedBusinessUnitIds());

  protected readonly content = FINES_API_CONFIRM_PROCESS_CONTENT;
  protected readonly isProcessing = signal(false);
  protected readonly overrideInhibitControls = new Map<string, FormControl<boolean>>();
  protected readonly selectAllOverrideInhibitsControl = new FormControl<boolean>(true, { nonNullable: true });
  protected readonly selectedInterfaceJobs = enrichInterfaceJobsWithBusinessUnitIds(
    getSelectedInterfaceJobs(this.finesApiStore.processInterfaceJobs(), this.finesApiStore.selectedFileIds()),
    this.finesApiStore
      .availableBusinessUnits()
      .filter(({ business_unit_id: businessUnitId }) => this.selectedBusinessUnitIds.has(businessUnitId)),
  );
  protected readonly businessUnitSummary = buildBusinessUnitSummary(this.selectedInterfaceJobs);
  protected readonly dwpAeaInterfaceJobs = this.selectedInterfaceJobs.filter(({ source }) => isDwpAeaSource(source));
  protected overrideInhibitFileIds = new Set<string>();

  /** Synchronises every override-inhibits checkbox with the current selection set. */
  private syncOverrideInhibitControls(): void {
    this.dwpAeaInterfaceJobs.forEach((interfaceJob) => {
      const interfaceFileId = this.getInterfaceFileId(interfaceJob);
      const selected = this.overrideInhibitFileIds.has(interfaceFileId);
      const control = this.overrideInhibitControls.get(interfaceFileId);

      if (control) {
        if (control.value !== selected) {
          control.setValue(selected, { emitEvent: false });
        }
        return;
      }

      this.overrideInhibitControls.set(interfaceFileId, new FormControl<boolean>(selected, { nonNullable: true }));
    });

    this.selectAllOverrideInhibitsControl.setValue(this.allOverrideInhibitsSelected, { emitEvent: false });
  }

  /** Persists override-inhibits selections in the flow store. */
  private updateOverrideInhibitSelection(selectedFileIds: Set<string>): void {
    this.overrideInhibitFileIds = selectedFileIds;
    this.syncOverrideInhibitControls();
    this.finesApiStore.setOverrideInhibitFileIds(
      this.dwpAeaInterfaceJobs
        .map((interfaceJob) => this.getInterfaceFileId(interfaceJob))
        .filter((interfaceFileId) => selectedFileIds.has(interfaceFileId)),
    );
  }

  /** Returns the displayed count, including every non-DWP/AEA file and checked DWP/AEA file. */
  protected get selectedFilesCount(): number {
    return this.selectedInterfaceJobs.length - this.dwpAeaInterfaceJobs.length + this.overrideInhibitFileIds.size;
  }

  /** Returns whether every DWP/AEA file is selected to override inhibits. */
  protected get allOverrideInhibitsSelected(): boolean {
    return areAllMultiSelectRowsSelected(
      this.dwpAeaInterfaceJobs,
      this.overrideInhibitFileIds,
      this.getInterfaceFileId,
    );
  }

  /** Returns whether some, but not all, DWP/AEA files are selected to override inhibits. */
  protected get someOverrideInhibitsSelected(): boolean {
    return areSomeMultiSelectRowsSelected(
      this.dwpAeaInterfaceJobs,
      this.overrideInhibitFileIds,
      this.getInterfaceFileId,
    );
  }

  /** Returns the stable string identifier used by the override-inhibits table. */
  protected getInterfaceFileId(interfaceJob: IOpalFinesInterfaceJobSummary): string {
    return interfaceJob.interface_file_id.toString();
  }

  /** Returns the checkbox control associated with a DWP/AEA file. */
  protected getOverrideInhibitControl(interfaceJob: IOpalFinesInterfaceJobSummary): FormControl<boolean> {
    return this.overrideInhibitControls.get(this.getInterfaceFileId(interfaceJob))!;
  }

  /** Selects or deselects override inhibits for every DWP/AEA file. */
  protected toggleAllOverrideInhibits(checked: boolean): void {
    this.updateOverrideInhibitSelection(
      toggleAllMultiSelectRows(
        this.dwpAeaInterfaceJobs,
        this.overrideInhibitFileIds,
        this.getInterfaceFileId,
        checked,
      ) as Set<string>,
    );
  }

  /** Updates override inhibits for one DWP/AEA file. */
  protected toggleOverrideInhibits(event: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    const interfaceFileId = event.rowId.toString();

    if (!this.dwpAeaInterfaceJobs.some((interfaceJob) => this.getInterfaceFileId(interfaceJob) === interfaceFileId)) {
      return;
    }

    this.updateOverrideInhibitSelection(
      toggleMultiSelectRow(this.overrideInhibitFileIds, interfaceFileId, event.checked) as Set<string>,
    );
  }

  /** Clears confirmation state and returns to a freshly loaded Process tab. */
  protected cancel(): void {
    if (this.isProcessing()) {
      return;
    }

    this.finesApiStore.setActiveTab(FINES_API_PROCESS_ALLOCATE_TABS_KEYS.process);
    this.finesApiStore.setSelectedFileIds([]);
    this.finesApiStore.clearProcessInterfaceJobs();
    this.finesApiStore.setUnsavedChanges(false);

    void this.router.navigate([FINES_API_ROUTING_PATHS.children.processAllocate], {
      relativeTo: this.activatedRoute.parent,
      fragment: FINES_API_PROCESS_ALLOCATE_TABS_KEYS.process,
    });
  }

  /** Submits all originally selected jobs and opens the Allocate tab after a successful response. */
  protected process(): void {
    if (this.isProcessing()) {
      return;
    }

    this.isProcessing.set(true);
    this.opalFinesService
      .processInterfaceJobs(buildProcessInterfaceJobsPayload(this.selectedInterfaceJobs, this.overrideInhibitFileIds))
      .pipe(
        map(() => true),
        catchError(() => of(false)),
        // The shared interceptor intentionally completes retriable 409 responses without an error.
        defaultIfEmpty(false),
        finalize(() => this.isProcessing.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((processed) => {
        if (!processed) {
          this.utilsService.scrollToTop();
          return;
        }

        this.finesApiStore.setActiveTab(FINES_API_PROCESS_ALLOCATE_TABS_KEYS.allocate);
        this.finesApiStore.setSelectedFileIds([]);
        this.finesApiStore.clearProcessInterfaceJobs();
        this.finesApiStore.setUnsavedChanges(false);

        void this.router.navigate([FINES_API_ROUTING_PATHS.children.processAllocate], {
          relativeTo: this.activatedRoute.parent,
          fragment: FINES_API_PROCESS_ALLOCATE_TABS_KEYS.allocate,
        });
      });
  }

  public ngOnInit(): void {
    this.updateOverrideInhibitSelection(
      new Set(this.dwpAeaInterfaceJobs.map((interfaceJob) => this.getInterfaceFileId(interfaceJob))),
    );
  }
}
