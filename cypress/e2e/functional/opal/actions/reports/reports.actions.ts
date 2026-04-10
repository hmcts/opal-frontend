import { ReportsLocators as L } from '../../../../../shared/selectors/reports.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';
import { PrimaryNavigationActions } from '../primary-navigation.actions';

const log = createScopedLogger('ReportsActions');

/**
 * Cypress actions for the Reports landing page and related report navigation.
 */
export class ReportsActions {
  private readonly common = new CommonActions();
  private readonly primaryNavigation = new PrimaryNavigationActions();
  private readonly reportsLandingPagePath = '/fines/dashboard/reports';
  private readonly yourReportsSummaryListPath = '/fines/reports/0/summary-list';

  /**
   * Opens the Your reports summary list from the Reports landing page.
   */
  public openYourReportsFromLandingPage(): void {
    log('action', 'Opening Your reports from the Reports landing page');
    this.primaryNavigation.assertLandingPage('Reports', this.reportsLandingPagePath);
    cy.get(L.yourReportsLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Asserts that the Your reports summary list screen is displayed.
   */
  public assertYourReportsSummaryListScreen(): void {
    log('assert', 'Checking the Your reports summary list screen');
    this.common.assertHeaderContains('Your reports');
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('eq', this.yourReportsSummaryListPath);
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
