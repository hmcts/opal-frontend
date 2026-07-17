export const FINES_REPORTS_BUSINESS_UNIT_WARNING_CONTENT = {
  heading: (selectedBusinessUnitCount: number): string =>
    `You have selected ${selectedBusinessUnitCount} business units`,
  description: 'The report creation may time out due to too much data.',
} as const;
