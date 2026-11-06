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
  overrideInhibitsHint: 'If any files are from DWP/AEA, unselect them below to include the inhibits',
  overrideInhibitsCaption: 'DWP/AEA files with override inhibits options',
  overrideInhibitsColumns: {
    select: 'Override inhibits',
    file: 'File',
    businessUnit: 'Business unit',
  },
  selectAllOverrideInhibits: 'Override inhibits for all DWP/AEA files',
  overrideInhibitsForFile: (fileName: string) => `Override inhibits for ${fileName}`,
  processButton: 'Process',
} as const;
