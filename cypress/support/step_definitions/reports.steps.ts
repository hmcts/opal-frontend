import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
  ReportsActions,
  type ReportsEntryPoint,
  type ReportsLandingPageLink,
} from '../../e2e/functional/opal/actions/reports/reports.actions';
import { log } from '../utils/log.helper';

const reportsActions = () => new ReportsActions();

When('I open Your reports from the Reports landing page', () => {
  log('step', 'Opening Your reports from the Reports landing page');
  reportsActions().openYourReportsFromLandingPage();
});

Then('I am taken to the Your reports summary list screen', () => {
  log('assert', 'Checking the Your reports summary list screen');
  reportsActions().assertYourReportsSummaryListScreen();
});

Then('the Reports item remains selected in the primary navigation', () => {
  log('assert', 'Checking Reports stays selected in the primary navigation');
  reportsActions().assertReportsNavigationItemRemainsSelected();
});

When('I open the Reports landing page link {string}', (reportLink: ReportsLandingPageLink) => {
  log('step', 'Opening Reports landing page link', { reportLink });
  reportsActions().openLandingPageLink(reportLink);
});

Then('I am taken to the Reports summary list screen for {string}', (reportLink: ReportsLandingPageLink) => {
  log('assert', 'Checking Reports summary list screen', { reportLink });
  reportsActions().assertSummaryListScreen(reportLink);
});

When('I navigate directly to the Reports entry point {string}', (entryPoint: ReportsEntryPoint) => {
  log('step', 'Navigating directly to a Reports entry point', { entryPoint });
  reportsActions().visitEntryPointDirectly(entryPoint);
});
