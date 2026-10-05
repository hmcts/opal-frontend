import { type IFinesReportsReportSummaryViewModel } from 'src/app/flows/fines/fines-reports/fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';

export const REPORT_SUMMARY_MOCK: IFinesReportsReportSummaryViewModel = {
  reportId: 'operational_report_enforcement',
  reportTitle: 'Operational reports (by enforcement)',
  reportName: 'Operational report (by enforcement) - CLAMPO',
  reportType: 'Summary',
  general: {
    status: 'Ready',
    dateCreated: Date.UTC(2026, 6, 21, 9, 15),
    businessUnits: 'London Central & South East',
    numberOfRecords: 1_250,
    createdBy: 'Olivia Smith',
  },
  criteriaRows: [
    { key: 'Report Type', value: 'Summary' },
    { key: 'Enforcement', value: 'Last enforcement action' },
    { key: 'Minimum account balance', value: 120.5, isCurrency: true },
  ],
  errorRows: [],
};
