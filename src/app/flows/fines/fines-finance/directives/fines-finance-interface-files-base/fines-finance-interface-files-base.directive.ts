import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { catchError, EMPTY, Subscription } from 'rxjs';

import type { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import type { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import type { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import {
  getPathWithFileId,
  OpalFileHandlingService,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { OPAL_FILE_HANDLING_PATHS } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/constants';
import type {
  IOpalFileHandlingInterfaceFile,
  IOpalFileHandlingInterfaceFileParams,
  IOpalFileHandlingInterfaceFilesRefData,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import type { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

import type { IFinesFinanceInterfaceFilesForm } from '../../interfaces/fines-finance-interface-files-form.interface';
import { FinesFinanceInterfaceFilesPayloadService } from '../../services/fines-finance-interface-files-payload.service';
import { canDownloadInterfaceFile } from '../../services/utils/fines-finance-interface-file-download.utils';

/**
 * Shares business-unit choices, searches, result state and downloads between the two Finance file pages.
 * Subclasses supply direction, request parameters, response selection and row mapping. Their templates render
 * the library viewer, action template, download error summary and dedicated save anchor.
 */
@Directive()
export abstract class FinesFinanceInterfaceFilesBaseDirective<
  TForm extends IFinesFinanceInterfaceFilesForm,
  TRow extends ICustomFileInterfaceViewerTableData,
> implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly fileService = inject(FileService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly opalFileHandlingService = inject(OpalFileHandlingService);
  private readonly businessUnitRefData =
    (this.activatedRoute.snapshot.data['businessUnits'] as IOpalFinesBusinessUnitRefData | null)?.refData ?? [];
  private readonly businessUnitDisplayOptions = computed(() =>
    this.payloadService.mapBusinessUnitsToOptions(this.businessUnitRefData),
  );
  private interfaceFilesRequest?: Subscription;
  private readonly interfaceFilesRefData = signal<IOpalFileHandlingInterfaceFilesRefData | null>(null);

  @ViewChild('fileDownloadLink', { static: true, read: ElementRef })
  private readonly fileDownloadLink!: ElementRef<HTMLAnchorElement>;
  @ViewChild('downloadErrorSummary', { read: ElementRef })
  private readonly errorSummary?: ElementRef<HTMLElement>;

  protected readonly payloadService = inject(FinesFinanceInterfaceFilesPayloadService);
  protected abstract readonly initialFilterState: TForm;

  public abstract readonly isInbound: boolean;
  public readonly downloadErrors = signal<IAbstractFormBaseFormErrorSummaryMessage[]>([]);
  public readonly businessUnits = this.payloadService.getPermittedBusinessUnitOptions(this.businessUnitRefData);
  public readonly tableData = computed(() => {
    const response = this.interfaceFilesRefData();
    return response === null
      ? null
      : this.mapFilesToTableData(response.interface_files, this.businessUnitDisplayOptions());
  });

  /**
   * Replaces the download error and focuses its GOV.UK summary after the new message has rendered.
   * @param fileId - File whose action the summary links to when it remains in the rendered results.
   */
  private showDownloadError(fileId: number): void {
    this.downloadErrors.set([
      { fieldId: `interface-file-download-${fileId}`, message: 'The file could not be downloaded. Try again.' },
    ]);
    afterNextRender(
      () => this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus(),
      { injector: this.injector },
    );
  }

  /**
   * Builds direction-specific API restrictions and date/filter parameters for one submitted search.
   * @param formData - Snapshot of the validated UI form values.
   * @returns Parameters sent unchanged by the shared File Handling service.
   */
  protected abstract buildSearchParams(formData: TForm): IOpalFileHandlingInterfaceFileParams;

  /**
   * Selects metadata after a successful response, before it becomes the current table result set.
   * @param files - Metadata returned by the current search.
   * @param formData - Snapshot of its submitted filter values.
   * @returns Metadata to map into table rows.
   */
  protected abstract selectFiles(
    files: IOpalFileHandlingInterfaceFile[] | null | undefined,
    formData: TForm,
  ): IOpalFileHandlingInterfaceFile[] | null | undefined;

  /**
   * Maps the selected metadata into the corresponding viewer's display and sort fields.
   * @param files - Selected metadata, or an absent result list.
   * @param businessUnits - Names for all resolved business units, rather than only permitted filter choices.
   * @returns Prepared rows for the current direction.
   */
  protected abstract mapFilesToTableData(
    files: IOpalFileHandlingInterfaceFile[] | null | undefined,
    businessUnits: IAlphagovAccessibleAutocompleteItem[],
  ): TRow[];

  /**
   * Captures the submitted filters and cancels the previous search so only the latest response is applied.
   * Successful responses pass through the subclass selector; failures retain the last successful rows.
   * Existing HTTP interceptors handle request errors, and destruction cancels any pending subscription.
   * @param form - Valid filter data and submission metadata emitted by the viewer.
   */
  public onFormSubmit(form: IAbstractFormBaseForm<unknown>): void {
    const formData = { ...(form.formData as TForm) };
    const searchParams = this.buildSearchParams(formData);
    this.interfaceFilesRequest?.unsubscribe();
    this.interfaceFilesRequest = this.opalFileHandlingService
      .getInterfaceFilesRefData(searchParams)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY),
      )
      .subscribe((response) => {
        const files = this.selectFiles(response.interface_files, formData);
        this.interfaceFilesRefData.set({
          ...response,
          interface_files: files ?? null,
          number_of_results: files?.length ?? 0,
        });
      });
  }

  /**
   * Applies Finance's display-status eligibility rule to a prepared row.
   * @param row - Current row containing a file ID and the mapped status label.
   * @returns Whether the row has a non-null ID and a status of Ready or File failed.
   */
  public canDownload(row: ICustomFileInterfaceViewerTableData): boolean {
    return canDownloadInterfaceFile(row);
  }

  /**
   * Builds the File Handling content URL supplied to the visible action link.
   * @param fileId - Selected interface-file ID.
   * @returns File Handling content URL.
   */
  public getDownloadHref(fileId: number): string {
    return getPathWithFileId(OPAL_FILE_HANDLING_PATHS.interfaceFilesContent, fileId);
  }

  /**
   * Prevents navigation immediately and rechecks the latest row before requesting its original content.
   * Eligible responses are saved through the dedicated anchor without replacing the rows or resetting pagination.
   * Unknown or newly ineligible IDs make no request; request/save failures use the local error summary.
   * @param fileId - Interface file selected for download.
   * @param event - Link click whose navigation must be prevented synchronously.
   */
  public onDownloadFile(fileId: number, event: Event): void {
    event.preventDefault();
    const file = this.tableData()?.find((row) => row['File ID'] === fileId);
    if (!file || !this.canDownload(file)) {
      return;
    }

    this.downloadErrors.set([]);
    this.fileService
      .downloadFile(this.opalFileHandlingService.getInterfaceFileContent(fileId), {
        link: this.fileDownloadLink.nativeElement,
        fallbackFilename: file.Title || `interface-file-${fileId}`,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => this.showDownloadError(fileId) });
  }

  /**
   * Focuses the failed action, falling back to the direction's results container after pagination or refresh.
   * @param fieldId - Download-action ID selected from the error summary.
   */
  public onDownloadErrorClick(fieldId: string): void {
    const target =
      this.document.getElementById(fieldId) ??
      this.document.getElementById(
        this.isInbound ? 'inbound-interface-files-results' : 'outbound-interface-files-results',
      );
    target?.focus();
  }

  /**
   * Starts the initial search after Angular initializes the page and its direction-specific defaults.
   * The submitted copy preserves the original defaults for subsequent use.
   */
  public ngOnInit(): void {
    this.onFormSubmit({ formData: { ...this.initialFilterState }, nestedFlow: false });
  }
}
