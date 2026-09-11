import { FINES_API_PROCESS_CONTENT } from '../../constants/fines-api-process-content.constant';

export const FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT = {
  announcement: `${FINES_API_PROCESS_CONTENT.heading}. ${FINES_API_PROCESS_CONTENT.hint}.`,
  selectedFiles: (selectedFiles: number, totalFiles: number): string =>
    `${selectedFiles} of ${totalFiles} files selected`,
  caption: 'Files available to process',
  selectColumn: 'Select files to process',
  selectionLegend: FINES_API_PROCESS_CONTENT.hint,
  selectAll: 'Select all files',
  selectFile: (fileName: string): string => `Select ${fileName}`,
  columns: {
    fileName: 'File name',
    source: 'Source',
    businessUnit: 'Business unit',
    dateUploaded: 'Date uploaded',
  },
  unavailableDate: '—',
} as const;
