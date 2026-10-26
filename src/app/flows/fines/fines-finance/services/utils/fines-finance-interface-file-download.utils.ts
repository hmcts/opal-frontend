import type { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';

/**
 * Applies Finance's download eligibility rule to the mapped file identifier and status.
 * @param row - Prepared file metadata containing its identifier and display status.
 * @returns Whether the file has a non-null identifier and a Ready or File failed status.
 */
export function canDownloadInterfaceFile(
  row: Pick<ICustomFileInterfaceViewerTableData, 'File ID' | 'Status'>,
): boolean {
  return row['File ID'] !== null && (row.Status === 'Ready' || row.Status === 'File failed');
}
