export const FINES_API_CONFIRM_PROCESS_CONTENT = {
  heading: 'Confirm before processing',
  selectedFiles: (selectedCount: number, totalCount: number) =>
    `You have selected ${selectedCount} of ${totalCount} files to process`,
  totalFilesCaption: 'Total files to process',
  totalFilesColumns: {
    businessUnit: 'Business unit',
    files: 'Files',
  },
  overrideInhibitsHeading: 'Override inhibits for DWP/AEA files',
  overrideInhibitsHint:
    'Only selected DWP/AEA files will be processed. Inhibits will be overridden for every selected file.',
  overrideInhibitsCaption: 'DWP/AEA files with override inhibits options',
  overrideInhibitsColumns: {
    select: 'Override inhibits',
    file: 'File',
    businessUnit: 'Business unit',
  },
  selectAllOverrideInhibits: 'Select all DWP/AEA files to process and override inhibits',
  overrideInhibitsForFile: (fileName: string) => `Process ${fileName} and override inhibits`,
  processButton: 'Process',
} as const;
