import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ReportsActions } from '../../e2e/functional/opal/actions/reports/reports.actions';
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
