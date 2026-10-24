import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { mount } from 'cypress/angular';

import { FinesReportsReportSummaryComponent } from 'src/app/flows/fines/fines-reports/fines-reports-report-summary/fines-reports-report-summary.component';
import { type IFinesReportsReportSummaryViewModel } from 'src/app/flows/fines/fines-reports/fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';
import { ReportSummaryLocators as L } from '../../../../shared/selectors/report-summary.locators';
import { REPORT_SUMMARY_MOCK } from './mocks/report-summary.mock';

describe('Report summary', { tags: ['@JIRA-STORY:PO-2306', '@JIRA-EPIC:PO-2248'] }, () => {
  const setupComponent = (reportSummary: IFinesReportsReportSummaryViewModel | null = REPORT_SUMMARY_MOCK) => {
    const reportTypeRoute = {
      snapshot: { paramMap: convertToParamMap({ reportTypeId: reportSummary?.reportId ?? '' }) },
    };

    return mount(FinesReportsReportSummaryComponent, {
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { reportSummary }, paramMap: convertToParamMap({}) },
            parent: reportTypeRoute,
          },
        },
      ],
    });
  };

  const getRows = (section: string) =>
    cy
      .get(section)
      .find(L.summaryRows)
      .then(($rows) =>
        Cypress.$.makeArray($rows).map((row) => ({
          key: row.querySelector('.govuk-summary-list__key')?.textContent?.trim(),
          value: row.querySelector('.govuk-summary-list__value')?.textContent?.trim(),
        })),
      );

  it(
    'AC3: shows Status, Date Created, Business Units, No. of Records and Created By in the General section',
    { tags: ['@JIRA-STORY:PO-2306', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent();

      cy.get(L.pageHeader).should('have.text', `${REPORT_SUMMARY_MOCK.reportName} - ${REPORT_SUMMARY_MOCK.reportType}`);
      cy.contains('h2', 'General').should('be.visible');
      getRows(L.general).then((rows) => {
        expect(rows.map((row) => row.key)).to.deep.equal([
          'Status',
          'Date Created',
          'Business Units',
          'No. of Records',
          'Created By',
        ]);
        expect(rows).to.deep.include.members([
          { key: 'Status', value: REPORT_SUMMARY_MOCK.general.status },
          { key: 'Business Units', value: REPORT_SUMMARY_MOCK.general.businessUnits },
          { key: 'No. of Records', value: REPORT_SUMMARY_MOCK.general.numberOfRecords?.toLocaleString('en-GB') },
          { key: 'Created By', value: REPORT_SUMMARY_MOCK.general.createdBy },
        ]);
        expect(rows[1].value).to.match(/^\d{2} [A-Z][a-z]{2} \d{4} at \d{2}:\d{2}$/);
      });
    },
  );

  it(
    'AC7b, AC7c and AC7d: shows Report criteria names and values in the same order as returned by the API',
    { tags: ['@JIRA-STORY:PO-2306', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent();

      getRows(L.criteria).should('deep.equal', [
        { key: 'Report Type', value: 'Summary' },
        { key: 'Enforcement', value: 'Last enforcement action' },
        { key: 'Minimum account balance', value: '£120.50' },
      ]);
    },
  );

  it(
    'AC4 and AC5: shows Requested as In progress and No. of Records as a dash',
    { tags: ['@JIRA-STORY:PO-2306', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent({
        ...REPORT_SUMMARY_MOCK,
        general: { ...REPORT_SUMMARY_MOCK.general, status: 'In progress', numberOfRecords: null },
      });

      cy.contains(L.general, 'In progress').should('be.visible');
      cy.get(L.general).contains('No. of Records').closest(L.summaryRows).should('contain.text', '—');
    },
  );

  it(
    'AC6: shows a Ready report with zero records as No content',
    { tags: ['@JIRA-STORY:PO-2306', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent({
        ...REPORT_SUMMARY_MOCK,
        general: { ...REPORT_SUMMARY_MOCK.general, status: 'No content', numberOfRecords: 0 },
      });

      cy.contains(L.general, 'No content').should('be.visible');
      cy.contains(L.general, 'No. of Records').parent().should('contain.text', '0');
    },
  );

  it(
    'AC9 and AC11: does not list unused optional parameters or show Errors when Status is not Error',
    { tags: ['@JIRA-STORY:PO-2306', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent({ ...REPORT_SUMMARY_MOCK, criteriaRows: [], errorRows: [] });

      cy.get(L.criteria).should('not.exist');
      cy.get(L.errors).should('not.exist');
    },
  );

  it(
    'AC10b, AC10c and AC10d: shows Errors names and values in the same order as returned by the API',
    { tags: ['@JIRA-STORY:PO-2306', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent({
        ...REPORT_SUMMARY_MOCK,
        general: { ...REPORT_SUMMARY_MOCK.general, status: 'Error', numberOfRecords: null },
        errorRows: [
          { key: 'Error Description', value: 'Report generation timed out' },
          { key: 'Report service', value: 'Reporting engine did not respond' },
        ],
      });

      getRows(L.errors).should('deep.equal', [
        { key: 'Error Description', value: 'Report generation timed out' },
        { key: 'Report service', value: 'Reporting engine did not respond' },
      ]);
    },
  );

  it(
    'renders absent general information as Not provided',
    { tags: ['@JIRA-STORY:PO-2306', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent({
        ...REPORT_SUMMARY_MOCK,
        general: {
          status: 'Error',
          dateCreated: null,
          businessUnits: null,
          numberOfRecords: null,
          createdBy: null,
        },
      });

      cy.get(L.general).find(L.notProvided).should('have.length', 4);
    },
  );
});
