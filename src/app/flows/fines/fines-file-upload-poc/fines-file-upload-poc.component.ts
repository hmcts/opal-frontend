import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { MultiFileUpload } from '@ministryofjustice/frontend/moj/components/multi-file-upload/multi-file-upload.mjs';
import { Observable, concat, map, of, timer } from 'rxjs';

const MAX_FILE_SIZE_BYTES = 1024 * 1024;
const INVALID_FILE_EXTENSION = '.mov';
const MOCK_UPLOAD_INTERVAL_MS = 120;
const MOCK_UPLOAD_PROGRESS_STEPS = [20, 40, 60, 80, 100];

type UploadFile = (file: File) => void;
type FileUploadStatus = 'pending' | 'uploading' | 'complete';

interface IFileUploadPocItem {
  id: number;
  name: string;
  progress: number;
  status: FileUploadStatus;
  valid: boolean;
  validationMessages: string[];
}

class FinesFileUploadPocMultiFileUpload extends MultiFileUpload {
  private readonly uploadFileCallback: UploadFile;

  constructor($root: Element | null, uploadFileCallback: UploadFile) {
    super($root, {
      dropzoneButtonText: 'Choose files',
      dropzoneHintText: 'Drag and drop files here or',
      uploadStatusText: 'Checking files',
    });
    this.uploadFileCallback = uploadFileCallback;
  }

  public override uploadFile(file: File): void {
    this.uploadFileCallback(file);
  }

  public override uploadFiles(files: FileList): void {
    Array.from(files).forEach((file) => {
      this.uploadFile(file);
    });
  }

  public override onFileDeleteClick(event: MouseEvent): void {
    const button = event.target;

    if (button instanceof HTMLButtonElement && button.classList.contains('moj-multi-file-upload__delete')) {
      event.preventDefault();
    }
  }
}

@Component({
  selector: 'app-fines-file-upload-poc',
  templateUrl: './fines-file-upload-poc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesFileUploadPocComponent implements AfterViewInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private nextFileId = 0;
  private uploadQueue = Promise.resolve();

  public readonly fileUploads = signal<IFileUploadPocItem[]>([]);

  private addFileToList(file: File): IFileUploadPocItem {
    const fileUpload = {
      id: this.nextFileId++,
      name: file.name,
      progress: 0,
      status: 'pending' as FileUploadStatus,
      valid: false,
      validationMessages: this.getValidationMessages(file),
    };

    this.fileUploads.update((fileUploads) => [...fileUploads, fileUpload]);
    this.changeDetectorRef.markForCheck();

    return fileUpload;
  }

  private getValidationMessages(file: File): string[] {
    const validationMessages: string[] = [];

    if (file.size > MAX_FILE_SIZE_BYTES) {
      validationMessages.push('File must be no larger than 1MB');
    }

    if (file.name.toLowerCase().endsWith(INVALID_FILE_EXTENSION)) {
      validationMessages.push('MOV files are not accepted');
    }

    return validationMessages;
  }

  private mockUploadFile(file: File): Observable<HttpEvent<unknown>> {
    const formData = new FormData();
    formData.append('file', file);

    const request = new HttpRequest('POST', '/api/upload', formData, {
      reportProgress: true,
    });
    const total = file.size || 1;
    const progressEvents = MOCK_UPLOAD_PROGRESS_STEPS.map((percentComplete) =>
      timer(MOCK_UPLOAD_INTERVAL_MS).pipe(
        map(
          () =>
            ({
              type: HttpEventType.UploadProgress,
              loaded: Math.round(total * (percentComplete / 100)),
              total,
            }) as HttpEvent<unknown>,
        ),
      ),
    );

    return concat(
      ...progressEvents,
      of(
        new HttpResponse({
          status: 200,
          body: {
            fileName: file.name,
            uploadUrl: request.url,
          },
        }),
      ),
    );
  }

  private queueFileUpload(file: File): void {
    const fileUpload = this.addFileToList(file);
    this.uploadQueue = this.uploadQueue.then(() => this.uploadFile(fileUpload.id, file));
  }

  private updateFileUpload(id: number, update: Partial<IFileUploadPocItem>): void {
    this.fileUploads.update((fileUploads) =>
      fileUploads.map((fileUpload) => (fileUpload.id === id ? { ...fileUpload, ...update } : fileUpload)),
    );
    this.changeDetectorRef.markForCheck();
  }

  private uploadFile(id: number, file: File): Promise<void> {
    return new Promise((resolve) => {
      this.updateFileUpload(id, { status: 'uploading' });

      this.mockUploadFile(file).subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = event.total ?? 0;
          const progress = total > 0 ? Math.round((100 * event.loaded) / total) : 0;
          this.updateFileUpload(id, { progress });
        }

        if (event.type === HttpEventType.Response) {
          const fileUpload = this.fileUploads().find((item) => item.id === id);
          this.updateFileUpload(id, {
            progress: 100,
            status: 'complete',
            valid: fileUpload?.validationMessages.length === 0,
          });
          resolve();
        }
      });
    });
  }

  public ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const multiFileUploadElement = this.elementRef.nativeElement.querySelector('[data-module="moj-multi-file-upload"]');

    if (multiFileUploadElement) {
      new FinesFileUploadPocMultiFileUpload(multiFileUploadElement, (file) => this.queueFileUpload(file));
    }
  }

  public removeFile(id: number): void {
    this.fileUploads.update((fileUploads) => fileUploads.filter((fileUpload) => fileUpload.id !== id));
  }
}
