/**
 * @file global-api-interceptor.steps.ts
 * @description Step definitions for global API interceptor scenarios.
 */
import { When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { GlobalApiInterceptorFlow } from '../../e2e/functional/opal/flows/global-api-interceptor.flow';
import { GlobalApiInterceptorActions } from '../../e2e/functional/opal/actions/global-api-interceptor.actions';
import { log } from '../utils/log.helper';

const flow = () => new GlobalApiInterceptorFlow();
const actions = () => new GlobalApiInterceptorActions();

When(
  'I attempt to open Manual Account Creation and the business units request fails with {int}',
  (statusCode: number) => {
    log('step', 'Attempting Manual Account Creation with business units error', { statusCode });
    flow().openManualAccountCreationWithBusinessUnitsError(statusCode);
  },
);

When(
  'I attempt to open Manual Account Creation and the business units request fails with a retriable {int} error',
  (statusCode: number) => {
    log('step', 'Attempting Manual Account Creation with retriable business units error', { statusCode });
    flow().openManualAccountCreationWithRetriableBusinessUnitsError(statusCode);
  },
);

When('I attempt to open Manual Account Creation and the business units request fails due to a network error', () => {
  log('step', 'Attempting Manual Account Creation with business units network error');
  flow().openManualAccountCreationWithBusinessUnitsNetworkFailure();
});

When('I click the Cancel button and the Cancel confirmation popup is displayed with:', (table: DataTable) => {
  log('step', 'Clicking Cancel and asserting Cancel confirmation popup', { rows: table.raw() });
  actions().clickCancelAndAssertConfirmationPopupFromTable(table);
});

When(
  'I attempt to open Manual Account Creation and the business units request fails with a non-retriable {int} error',
  (statusCode: number) => {
    log('step', 'Attempting Manual Account Creation with non-retriable business units error', { statusCode });
    flow().openManualAccountCreationWithNonRetriableBusinessUnitsError(statusCode);
  },
);

When(
  'I attempt a Companies account search for reference {string} with a retriable {int} error',
  (reference: string, statusCode: number) => {
    log('step', 'Attempting Companies search with retriable error', { reference, statusCode });
    flow().searchCompaniesWithRetriableError(reference, statusCode);
  },
);

When(
  'I attempt a Companies account search for reference {string} with a non-retriable {int} error',
  (reference: string, statusCode: number) => {
    log('step', 'Attempting Companies search with non-retriable error', { reference, statusCode });
    flow().searchCompaniesWithNonRetriableError(reference, statusCode);
  },
);

Then('the global error banner is displayed', () => {
  log('assert', 'Asserting global error banner is visible');
  actions().assertGlobalErrorBanner();
});

Then('the global warning banner is displayed with:', (table: DataTable) => {
  log('assert', 'Asserting global warning banner', { rows: table.raw() });
  actions().assertGlobalWarningBannerFromTable(table);
});

Then('the global banner clears after refresh on the {string} page', (expectedHeader: string) => {
  log('assert', 'Refreshing and confirming global banner cleared', { expectedHeader });
  flow().refreshAndAssertBannerCleared(expectedHeader);
});

Then('the error page shows:', (table: DataTable) => {
  log('assert', 'Asserting error page content', { rows: table.raw() });
  actions().assertErrorPageContent(table);
});
