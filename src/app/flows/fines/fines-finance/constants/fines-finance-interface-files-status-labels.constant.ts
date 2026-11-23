import { InterfaceFileViewerFileStatus } from './fines-finance-interface-file-status.constant';

export const FINES_FINANCE_INTERFACE_FILES_STATUS_LABELS: Record<string, string> = {
  [InterfaceFileViewerFileStatus.Success]: 'Ready',
  [InterfaceFileViewerFileStatus.SuccessNoTransactions]: 'Ready',
  [InterfaceFileViewerFileStatus.Duplicate]: 'Ready',
  [InterfaceFileViewerFileStatus.Superseded]: 'Ready',
  [InterfaceFileViewerFileStatus.Failed]: 'File failed',
  [InterfaceFileViewerFileStatus.FailedSuperseded]: 'File failed',
  [InterfaceFileViewerFileStatus.Ingested]: 'In-Progress',
};
