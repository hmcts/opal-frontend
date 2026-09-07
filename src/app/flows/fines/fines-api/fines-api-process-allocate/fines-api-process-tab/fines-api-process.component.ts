import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_API_ROUTING_PATHS } from '../../routing/constants/fines-api-routing-paths.constant';
import { FinesApiStore } from '../../stores/fines-api.store';
import { FINES_API_PROCESS_CONTENT } from './constants/fines-api-process-content.constant';
import { FINES_API_PROCESS_ERRORS } from './constants/fines-api-process-errors.constant';
import { FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './fines-api-process-files-table-wrapper/constants/fines-api-process-files-table-wrapper-table-sort-default.constant';
import { FinesApiProcessFilesTableWrapperComponent } from './fines-api-process-files-table-wrapper/fines-api-process-files-table-wrapper.component';
import { IFinesApiProcessData } from './interfaces/fines-api-process-data.interface';

@Component({
  selector: 'app-fines-api-process',
  imports: [FinesApiProcessFilesTableWrapperComponent, GovukErrorSummaryComponent],
  templateUrl: './fines-api-process.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiProcessComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly utilsService = inject(UtilsService);

  protected readonly finesApiStore = inject(FinesApiStore);
  protected readonly content = FINES_API_PROCESS_CONTENT;
  protected readonly processFilesSort = FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  protected readonly selectAtLeastOneFileMessage = FINES_API_PROCESS_ERRORS.selectAtLeastOneFile;
  protected formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] = [];
  protected hasFileSelectionError = false;

  @Input({ required: true }) public tabData!: IFinesApiProcessData;
  @Output() public readonly refreshRequested = new EventEmitter<void>();

  /** Clears the selection validation state. */
  private clearFileSelectionError(): void {
    this.formErrorSummaryMessage = [];
    this.hasFileSelectionError = false;
  }

  /** Shows the required selection validation state. */
  private setFileSelectionError(): void {
    this.formErrorSummaryMessage = [
      {
        fieldId: 'fines-api-process-files-select-all-checkbox',
        message: this.selectAtLeastOneFileMessage,
      },
    ];
    this.hasFileSelectionError = true;
    this.utilsService.scrollToTop();
  }

  /** Persists stable interface job IDs emitted by the Process table. */
  protected handleSelectedInterfaceJobIdsChange(selectedInterfaceJobIds: string[]): void {
    this.finesApiStore.setSelectedFileIds(selectedInterfaceJobIds);

    if (selectedInterfaceJobIds.length > 0) {
      this.clearFileSelectionError();
    }
  }

  /** Clears current selections and asks the parent tab shell to reload Process data. */
  protected refresh(): void {
    this.finesApiStore.setSelectedFileIds([]);
    this.clearFileSelectionError();
    this.refreshRequested.emit();
  }

  /** Validates the file selection and navigates to Confirm Process. */
  protected process(): void {
    if (!this.finesApiStore.hasSelectedFiles()) {
      this.setFileSelectionError();
      return;
    }

    this.clearFileSelectionError();
    void this.router.navigate([FINES_API_ROUTING_PATHS.children.confirmProcess], {
      relativeTo: this.activatedRoute.parent,
    });
  }
}
