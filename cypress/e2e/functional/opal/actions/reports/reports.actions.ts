import { ReportsLocators as L } from '../../../../../shared/selectors/reports.locators';
import { ReportSummaryLocators as SummaryLocators } from '../../../../../shared/selectors/report-summary.locators';
import { ReportsSummaryListLocators as SummaryListLocators } from '../../../../../shared/selectors/reports-summary-list.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';
import { PrimaryNavigationActions } from '../primary-navigation.actions';

const log = createScopedLogger('ReportsActions');

export type ReportsLandingPageLink =
  | 'Your reports'
  | 'Operational reports (by enforcement)'
  | 'Operational reports (by payments)';

export type ReportsEntryPoint = 'Reports dashboard' | ReportsLandingPageLink;

type ReportsLinkConfig = {
  selector: string;
  path: string;
  heading: string;
};

const REPORTS_LINK_CONFIG: Record<ReportsLandingPageLink, ReportsLinkConfig> = {
  'Your reports': {
    selector: L.yourReportsLink,
    path: '/fines/reports/0/summary-list',
    heading: 'Your reports',
  },
  'Operational reports (by enforcement)': {
    selector: L.operationalReportsByEnforcementLink,
    path: '/fines/reports/operational_report_enforcement/summary-list',
    heading: 'Operational reports (by enforcement)',
  },
  'Operational reports (by payments)': {
    selector: L.operationalReportsByPaymentsLink,
    path: '/fines/reports/operational_report_payment/summary-list',
    heading: 'Operational reports (by payments)',
  },
};

/**
 * Cypress actions for the Reports landing page and related report navigation.
 */
export class ReportsActions {
  private readonly common = new CommonActions();
  private readonly primaryNavigation = new PrimaryNavigationActions();
  private readonly reportsLandingPagePath = '/fines/dashboard/reports';

  /**
   * Returns the configured link metadata for the requested Reports landing page entry point.
   * @param reportLink - Visible Reports landing page link label.
   * @returns Selector, expected path, and heading for the report.
   */
  private getReportsLinkConfig(reportLink: ReportsLandingPageLink): ReportsLinkConfig {
    return REPORTS_LINK_CONFIG[reportLink];
  }

  /**
   * Opens the Your reports summary list from the Reports landing page.
   */
  public openYourReportsFromLandingPage(): void {
    this.openLandingPageLink('Your reports');
  }

  /**
   * Asserts that the Your reports summary list screen is displayed.
   */
  public assertYourReportsSummaryListScreen(): void {
    this.assertSummaryListScreen('Your reports');
  }

  /**
   * Opens the requested report entry point from the Reports landing page.
   * @param reportLink - Visible Reports landing page link label.
   */
  public openLandingPageLink(reportLink: ReportsLandingPageLink): void {
    const { selector, path, heading } = this.getReportsLinkConfig(reportLink);

    log('action', 'Opening Reports landing page link', { reportLink });
    this.primaryNavigation.assertLandingPageHeader('Reports');
    cy.get(selector, this.common.getTimeoutOptions()).should('be.visible').click();
    this.common.assertHeaderContains(heading);
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('eq', path);
  }

  /**
   * Asserts that the requested Reports summary list screen is displayed.
   * @param reportLink - Visible Reports landing page link label.
   */
  public assertSummaryListScreen(reportLink: ReportsLandingPageLink): void {
    const { heading, path } = this.getReportsLinkConfig(reportLink);

    log('assert', 'Checking Reports summary list screen', { reportLink, path });
    this.common.assertHeaderContains(heading);
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('eq', path);
  }

  /**
   * Opens the first report summary available in the current summary list.
   * The Date and time link must be present for the PO-9738 seeded report data
   * to be discoverable through the default date filter.
   */
  public openFirstReportSummary(): void {
    log('action', 'Opening the first report summary from the Date and time link');
    cy.get(SummaryListLocators.page, this.common.getPathTimeoutOptions()).then(($page) => {
      if ($page.text().includes('No reports found')) {
        throw new Error(
          'No report is available in this summary list. Verify that the seeded report instance has a generation date and that the logged-in user has access to its Business Unit.',
        );
      }
    });
    cy.get(SummaryListLocators.table.dateTime(0), this.common.getPathTimeoutOptions())
      .find('a')
      .should('be.visible')
      .click();
  }

  /** Asserts that a selected Date and time link opened a report summary. */
  public assertReportSummaryScreen(): void {
    log('assert', 'Checking Report summary screen');
    cy.location('pathname', this.common.getPathTimeoutOptions()).should(
      'match',
      /\/fines\/reports\/[^/]+\/summary\/[^/]+$/,
    );
    this.common.assertPageHeadingVisible();
    cy.get(SummaryLocators.general, this.common.getPathTimeoutOptions()).should('be.visible');
  }

  /**
   * Visits the requested Reports route directly.
   * @param entryPoint - Reports dashboard or summary-list entry point.
   */
  public visitEntryPointDirectly(entryPoint: ReportsEntryPoint): void {
    const path =
      entryPoint === 'Reports dashboard' ? this.reportsLandingPagePath : this.getReportsLinkConfig(entryPoint).path;

    log('navigate', 'Visiting Reports entry point directly', { entryPoint, path });
    cy.visit(path);
  }

  /**
   * Asserts that Reports remains the active primary navigation item.
   */
  public assertReportsNavigationItemRemainsSelected(): void {
    log('assert', 'Checking Reports stays selected in the primary navigation');
    this.primaryNavigation.assertVisible();
    this.primaryNavigation.assertActiveItem('Reports');
    this.common.assertHeaderContains('Reports');
  }
}
