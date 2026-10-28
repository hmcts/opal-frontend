import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { defer, finalize, Subscription } from 'rxjs';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAbstractMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/abstract/abstract-multi-file-upload/interfaces';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../../constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FinesFinanceUploadVariantBankingFilesFormComponent } from './fines-finance-upload-variant-banking-files-form/fines-finance-upload-variant-banking-files-form.component';
import { FINES_FINANCE_VARIANT_BANKING_UPLOAD } from './constants/fines-finance-variant-banking-upload.constant';

@Component({
  selector: 'app-fines-ext-finance-upload-variant-banking-files',
  imports: [FinesFinanceUploadVariantBankingFilesFormComponent, GovukBackLinkComponent],
  templateUrl: './fines-finance-upload-variant-banking-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFinanceUploadVariantBankingFilesComponent
  extends AbstractFormParentBaseComponent
  implements OnDestroy
{
  private readonly fileService = inject(FileService);
  private readonly opalFileHandlingService = inject(OpalFileHandlingService);
  private readonly utilsService = inject(UtilsService);
  private readonly permissionsService = inject(PermissionsService);
  private readonly globalStore = inject(GlobalStore);
  private activeUpload?: { id: string; subscription: Subscription };
  private nextId = 0;
  private destroyed = false;

  public readonly fileUploads = signal<readonly IAbstractMultiFileUploadItem[]>([]);
  public readonly announcement = signal('');
  /** Matches the inbound route's view permission independently of permission to upload. */
  public readonly canViewInboundFiles = computed(() =>
    this.permissionsService
      .getUniquePermissions(this.globalStore.userState())
      .includes(FINES_PERMISSIONS['view-interface-files']),
  );

  /**
   * Validates a file against the Variant Banking selection policy.
   * @param file - Original browser file selected by the user.
   * @param index - Zero-based position within this picker or dropped selection.
   * @returns All local rejection messages, or an empty array for a valid file.
   */
  private validateFile(file: File, index: number): readonly string[] {
    const errors: string[] = [];
    if (!this.fileService.hasFileExtension(file.name, FINES_FINANCE_VARIANT_BANKING_UPLOAD.acceptedTypes[0])) {
      errors.push('The selected file must be a .DAT.');
    } else if (!FINES_FINANCE_VARIANT_BANKING_UPLOAD.filenamePattern.test(file.name)) {
      errors.push('The selected file name must follow the format a121_yymmdd_VB_XXX_nn.dat.');
    }
    if (!this.fileService.isFileWithinSizeLimit(file, FINES_FINANCE_VARIANT_BANKING_UPLOAD.maxFileSize)) {
      errors.push('The selected file must be smaller than 2MB.');
    }
    if (index >= FINES_FINANCE_VARIANT_BANKING_UPLOAD.maxFiles) {
      errors.push('You can only select up to 6 files at the same time.');
    }
    return errors;
  }

  /**
   * Replaces a row so the shared OnPush uploader receives progress and status changes.
   * @param id - Stable identifier of the row to update.
   * @param update - Changes to apply without replacing the original file.
   * @returns void
   */
  private updateFile(id: string, update: Partial<IAbstractMultiFileUploadItem>): void {
    this.fileUploads.update((items) => items.map((item) => (item.id === id ? { ...item, ...update } : item)));
  }

  /**
   * Keeps a readable error alongside the file that failed and announces it.
   * @param item - Upload row associated with the failure.
   * @param error - HTTP, ingestion or request-creation error; null uses the fallback message.
   * @returns void
   */
  private failUpload(item: IAbstractMultiFileUploadItem, error: unknown): void {
    const message = this.fileService.getFileUploadErrorMessage(error, 'The file could not be uploaded. Try again.');
    this.updateFile(item.id, { status: 'failed', errors: [message] });
    this.announcement.set(`${item.name}: ${message}`);
  }

  /**
   * Resolves ingestion errors that can accompany an HTTP 201 response.
   * @param errors - JSON or plain-text ingestion errors returned by the API.
   * @returns The ingestion message as an Error, or null when no error was supplied.
   */
  private getIngestionError(errors: string | null): Error | null {
    if (!errors?.trim()) {
      return null;
    }
    try {
      const details: unknown = JSON.parse(errors);
      if (details && typeof details === 'object' && 'message' in details && typeof details.message === 'string') {
        return new Error(details.message);
      }
    } catch {
      // Some API failures supply plain text instead of the ingestion error JSON.
    }
    return new Error(errors);
  }

  /**
   * Applies the final server response after all request bytes have been sent.
   * @param item - Upload row receiving its confirmed server outcome.
   * @param response - Created interface-file record, or null for an empty response.
   * @returns void
   */
  private handleUploadResponse(
    item: IAbstractMultiFileUploadItem,
    response: IOpalFileHandlingInterfaceFile | null,
  ): void {
    if (!response) {
      this.failUpload(item, null);
      return;
    }
    const ingestionError = this.getIngestionError(response.errors);
    const status = this.utilsService.upperCaseAllLetters(response.status ?? '');
    if (ingestionError || ['FAILED', 'FAILURE', 'DUPLICATE'].includes(status)) {
      this.failUpload(item, ingestionError);
      return;
    }
    this.updateFile(item.id, { status: 'success', progress: 100 });
    this.announcement.set(`${item.name} uploaded.`);
  }

  /**
   * Starts the next valid queued file while retaining rejected rows as feedback.
   * @returns void
   */
  private startNextUpload(): void {
    if (this.destroyed || this.activeUpload) {
      return;
    }
    const item = this.fileUploads().find((file) => file.status === 'pending');
    if (!item) {
      return;
    }
    this.startUpload(item);
  }

  /**
   * Owns one request's progress, final response and completion before advancing the queue.
   * @param item - Pending row whose original binary file will be uploaded.
   * @returns void
   */
  private startUpload(item: IAbstractMultiFileUploadItem): void {
    let responseReceived = false;
    const subscription = new Subscription();
    this.activeUpload = { id: item.id, subscription };
    this.updateFile(item.id, { status: 'uploading' });
    subscription.add(
      defer(() =>
        this.opalFileHandlingService.uploadInterfaceFile(item.file, {
          file_name: item.name,
          source: 'VARIANT_BANKING',
          target: 'OPAL',
          type: 'SOURCE',
          domain: 'FINES',
          should_pre_process_file: true,
        }),
      )
        .pipe(
          finalize(() => {
            if (this.activeUpload?.id === item.id) {
              this.activeUpload = undefined;
              this.startNextUpload();
            }
          }),
        )
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.updateFile(item.id, {
                progress: this.fileService.getFileUploadProgress(event.loaded, event.total),
              });
            } else if (event.type === HttpEventType.Response) {
              responseReceived = true;
              this.handleUploadResponse(item, event.body);
            }
          },
          error: (error: unknown) => this.failUpload(item, error),
          complete: () => {
            if (!responseReceived) {
              this.failUpload(item, null);
            }
          },
        }),
    );
  }

  /**
   * Stops the active request without starting another queued file on page exit.
   * @returns void
   */
  private cancelActiveUpload(): void {
    const activeUpload = this.activeUpload;
    this.activeUpload = undefined;
    activeUpload?.subscription.unsubscribe();
  }

  /**
   * Appends a picker or dropped selection and immediately queues its valid files.
   * @param files - Original files from this selection; the six-file limit applies to this batch.
   * @returns void
   */
  public selectFiles(files: readonly File[]): void {
    if (!files.length) {
      return;
    }
    const added = files.map<IAbstractMultiFileUploadItem>((file, index) => {
      const errors = this.validateFile(file, index);
      return {
        id: `variant-banking-file-${this.nextId++}`,
        name: file.name,
        file,
        progress: null,
        errors,
        status: errors.length ? 'rejected' : 'pending',
      };
    });
    this.fileUploads.update((items) => [...items, ...added]);
    this.announcement.set(`${added.length} files selected. Check their upload status and any errors.`);
    this.startNextUpload();
  }

  /**
   * Returns to Finance through the standard leave-page guard.
   * @param event - Back-link click whose native navigation is prevented.
   * @returns void
   */
  public navigateBack(event: Event): void {
    this.routerNavigate(
      `/${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.finance}`,
      true,
      event,
    );
  }

  /**
   * Allows navigation without confirmation once every queued file has a terminal result.
   * @returns True when no files are waiting or uploading.
   */
  public override canDeactivate(): boolean {
    return !this.fileUploads().some((file) => file.status === 'pending' || file.status === 'uploading');
  }

  /**
   * Requests the browser's leave-page warning while upload work is outstanding.
   * @param event - Browser close, refresh or external-navigation event.
   * @returns void
   */
  @HostListener('window:beforeunload', ['$event'])
  public handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.canDeactivate()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  /** Cancels the active upload and prevents queued files from starting when the page is destroyed. */
  public ngOnDestroy(): void {
    this.destroyed = true;
    this.cancelActiveUpload();
  }
}
