import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { ActivatedRoute } from '@angular/router';
import { IOpalFinesBusinessUnitRefData } from '../../services/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import {
  CustomInboundFileViewerComponent,
  ICustomFileInterfaceViewerInboundTableWrapperTableData,
} from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import { FinesFinancePayloadService } from '../services/fines-finance-payload.service';
import { IFinesFinanceInboundFilesForm } from '../services/interfaces/fines-finance-inbound-files-form.interface';
import {
  getPathWithFileId,
  OpalFileHandlingService,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { OPAL_FILE_HANDLING_PATHS } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/constants';
import { IOpalFileHandlingInterfaceFilesRefData } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS } from '../constants/fines-finance-inbound-files-source-options.constant';
import { FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS } from '../constants/fines-finance-inbound-files-type-options.constant';
import { FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE } from '../constants/fines-finance-inbound-files-initial-filter-state.constant';

@Component({
  selector: 'app-fines-ext-finance-inbound-files',
  imports: [CustomInboundFileViewerComponent, GovukErrorSummaryComponent],
  templateUrl: './fines-finance-inbound-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceInboundFilesComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly fileService = inject(FileService);
  private readonly payloadService = inject(FinesFinancePayloadService);
  private readonly opalFileHandlingService = inject(OpalFileHandlingService);
  private readonly businessUnitRefData =
    (this.activatedRoute.snapshot.data['businessUnits'] as IOpalFinesBusinessUnitRefData | null)?.refData ?? [];
  private readonly businessUnitDisplayOptions = this.payloadService.mapBusinessUnitsToOptions(this.businessUnitRefData);
  private interfaceFilesRequest?: Subscription;
  private readonly interfaceFilesRefData = signal<IOpalFileHandlingInterfaceFilesRefData | null>(null);

  @ViewChild('fileDownloadLink', { static: true, read: ElementRef })
  private readonly fileDownloadLink!: ElementRef<HTMLAnchorElement>;
  @ViewChild('downloadErrorSummary', { read: ElementRef })
  private readonly errorSummary?: ElementRef<HTMLElement>;

  public readonly source: IAlphagovAccessibleAutocompleteItem[] = FINES_FINANCE_INBOUND_FILES_SOURCE_OPTIONS;
  public readonly sourceList: IAlphagovAccessibleAutocompleteItem[] = FINES_FINANCE_INBOUND_FILES_TYPE_OPTIONS;
  public readonly businessUnits: IAlphagovAccessibleAutocompleteItem[] =
    this.payloadService.getPermittedBusinessUnitOptions(this.businessUnitRefData);
  public readonly downloadErrors = signal<IAbstractFormBaseFormErrorSummaryMessage[]>([]);
  public readonly tableData = computed(() => {
    const response = this.interfaceFilesRefData();
    return response === null
      ? null
      : this.payloadService.mapInboundFilesToTableData(response.interface_files, this.businessUnitDisplayOptions);
  });

  /**
   * Shows a download error and focuses its summary after rendering.
   * @param fileId - The file whose action the summary should reference.
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
   * Requests files for the submitted filters, cancelling any previous pending search.
   *
   * @param form - Submitted inbound-file filter data and form metadata.
   */
  public onFormSubmit(form: IAbstractFormBaseForm<unknown>): void {
    const searchParams = this.payloadService.buildInboundFilesSearchParams(
      form.formData as IFinesFinanceInboundFilesForm,
    );

    this.interfaceFilesRequest?.unsubscribe();
    this.interfaceFilesRequest = this.opalFileHandlingService
      .getInterfaceFilesRefData(searchParams)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => EMPTY),
      )
      .subscribe((response) => this.interfaceFilesRefData.set(response));
  }

  /**
   * Determines whether the current Finance status permits a download action.
   * @param row - Prepared interface-file row.
   * @returns Whether the row has a file ID and is Ready or File failed.
   */
  public canDownload(row: ICustomFileInterfaceViewerInboundTableWrapperTableData): boolean {
    return row['File ID'] !== null && (row.Status === 'Ready' || row.Status === 'File failed');
  }

  /**
   * Builds the content endpoint for the selected interface file.
   * @param fileId - The selected file ID.
   * @returns The file-content URL used by the action link.
   */
  public getDownloadHref(fileId: number): string {
    return getPathWithFileId(OPAL_FILE_HANDLING_PATHS.interfaceFilesContent, fileId);
  }

  /**
   * Downloads a currently eligible file while retaining the displayed results.
   * @param fileId - The interface file selected for download.
   * @param event - The original link click whose default navigation is prevented.
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
   * Returns focus to the failed download action or the results container.
   * @param fieldId - The download action selected from the error summary.
   */
  public onDownloadErrorClick(fieldId: string): void {
    const target =
      this.document.getElementById(fieldId) ?? this.document.getElementById('inbound-interface-files-results');
    target?.focus();
  }

  /**
   * Loads inbound files on page entry using Last 7 days and empty optional filters.
   */
  public ngOnInit(): void {
    this.onFormSubmit({
      formData: { ...FINES_FINANCE_INBOUND_FILES_INITIAL_FILTER_STATE },
      nestedFlow: false,
    });
  }
}
