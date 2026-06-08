import { ReportsLocators as L } from '../../../../../shared/selectors/reports.locators';
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
