declare module '@ministryofjustice/frontend/moj/components/multi-file-upload/multi-file-upload.mjs' {
  interface IMultiFileUploadConfig {
    dropzoneButtonText?: string;
    dropzoneHintText?: string;
    feedbackContainer?: {
      selector?: string;
      element?: Element | null;
    };
    uploadStatusText?: string;
  }

  export class MultiFileUpload {
    constructor($root: Element | null, config?: IMultiFileUploadConfig);

    public $feedbackContainer: HTMLElement;

    public getDeleteButton(file: { filename: string; originalname: string }): HTMLButtonElement;
    public getFileRow(file: File): HTMLDivElement;
    public onFileDeleteClick(event: MouseEvent): void;
    public uploadFile(file: File): void;
    public uploadFiles(files: FileList): void;
  }
}
