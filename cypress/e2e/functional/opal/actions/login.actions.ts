/**
 * @file login.actions.ts
 * @description
 * Cypress **Action module** for performing login in the HMCTS Opal application.
 * Handles both local/PR environment authentication and Microsoft SSO login,
 * using Cypress session caching for performance optimization.
 */

import { LoginLocators as L } from '../../../../shared/selectors/login.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { isLocalOrPrEnvironment } from './auth-environment.actions';
import { requestLoggedInUserState } from './user-state.actions';

const log = createScopedLogger('LoginActions');
const AUTHENTICATED_ENDPOINT = '/sso/authenticated';
const DEFAULT_LANDING_PATH = '/';
export const SEARCH_LANDING_PATH = '/fines/dashboard/search';
const SEARCH_BUSINESS_UNITS_ENDPOINT = '/opal-fines-service/business-units';

interface IPerformLoginOptions {
  landingPath?: string;
  validateSearchLandingDependencies?: boolean;
}

/**
 * Requests an endpoint expected to return 200 for a valid authenticated session.
 *
 * @param endpoint - Endpoint path to validate.
 * @returns Cypress response chainable.
 */
function requestEndpointOk(endpoint: string): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy
    .request({
      method: 'GET',
      url: endpoint,
      retryOnStatusCodeFailure: true,
    })
    .then((response) => {
      expect(response.status, `GET ${endpoint}`).to.eq(200);
      return response;
    });
}

/**
 * Validates the frontend authenticated endpoint used by the common UI auth guard.
 *
 * @returns Cypress response chainable.
 */
function assertSessionAuthenticated(): Cypress.Chainable<Cypress.Response<unknown>> {
  log('assert', 'Validating restored session via authenticated endpoint');
  return requestEndpointOk(AUTHENTICATED_ENDPOINT);
}

/**
 * Validates the API dependency required by the Search landing route resolver.
 *
 * @returns Cypress response chainable.
 */
function assertSearchLandingDependenciesAvailable(): Cypress.Chainable<Cypress.Response<unknown>> {
  log('assert', 'Validating Search landing dependencies');
  return requestEndpointOk(SEARCH_BUSINESS_UNITS_ENDPOINT);
}

/**
 * Performs the full login flow for the given user.
 *
 * @param email - The email address of the user to log in.
 * @param options - Optional post-session landing and validation settings.
 */
export function performLogin(email: string, options: IPerformLoginOptions = {}): void {
  const password = Cypress.env('CYPRESS_TEST_PASSWORD') || '';
  const landingPath = options.landingPath ?? DEFAULT_LANDING_PATH;
  const validateSearchLandingDependencies = options.validateSearchLandingDependencies ?? false;

  log('action', 'Logging in', { email });

  cy.session(
    email,
    () => {
      cy.visit('/');

      cy.location('href').then((href) => {
        const isLocalOrPR = isLocalOrPrEnvironment();

        if (isLocalOrPR) {
          // Local / PR environment login (form-based)
          log('navigate', 'Detected Local/PR environment → using form-based login', { href });

          cy.wait(50);
          cy.get(L.usernameInput).type(email, { delay: 0 });
          cy.get(L.submitBtn).click();

          log('assert', 'Verifying login success (Local/PR)');
          cy.get(L.signOutLink).should('exist');
          log('done', 'Login successful (Local/PR)', { email });
        } else {
          // Microsoft SSO login
          log('navigate', 'Detected non-local environment → using Microsoft SSO', { href });

          cy.origin('https://login.microsoftonline.com', { args: { email, password } }, ({ email, password }) => {
            cy.wait(500);

            // Email step
            cy.get('input[type="email"]', { timeout: 12_000 }).type(email, { delay: 0 });
            cy.get('input[type="submit"]').click();

            // Password step (never log password)
            cy.get('input[type="password"]', { timeout: 12_000 }).type(password, { log: false, delay: 0 });
            cy.get('input[type="submit"]').click();

            // “Stay signed in?” prompt
            cy.get('#idBtn_Back', { timeout: 12_000 }).click();
          });

          log('assert', 'Verifying login success (SSO)');
          cy.get(L.signOutLink).should('exist');
          log('done', 'Login successful (SSO)', { email });
        }
      });
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        log('assert', 'Validating restored session via signed-in user API', { email });

        assertSessionAuthenticated()
          .then(() => captureSignedInUserEmail())
          .then((signedInEmail) => {
            expect(signedInEmail.trim().toLowerCase()).to.eq(email.trim().toLowerCase());
          })
          .then(() => {
            if (validateSearchLandingDependencies) {
              return assertSearchLandingDependenciesAvailable();
            }

            return undefined;
          })
          .then(() => {
            log('done', 'Session validation succeeded', { email });
          });
      },
    },
  );

  log('navigate', `Navigating to ${landingPath} after session setup`);
  cy.visit(landingPath);
}

/**
 * Performs login and opens the default Fines Search landing page.
 *
 * @param email - The email address of the user to log in.
 */
export function performLoginAndLandOnSearch(email: string): void {
  performLogin(email, { landingPath: SEARCH_LANDING_PATH, validateSearchLandingDependencies: true });
}

/**
 * Asserts the "Sign out" link is visible in the global header.
 */
export function assertSignOutLinkVisible(): void {
  log('assert', 'Verifying sign out link is visible');
  cy.get(L.signOutLink, { timeout: 10_000 }).should('be.visible');
  log('done', 'Sign out link is visible');
}

/**
 * Captures the signed-in user's email from the global header via API.
 *
 * @returns Cypress.Chainable<string> - The email of the currently signed-in user.
 */
export function captureSignedInUserEmail(): Cypress.Chainable<string> {
  log('action', 'Capturing signed-in user email from global header');
  return requestLoggedInUserState().then((body) => {
    const username = body['username'];
    expect(username, 'signed-in username').to.be.a('string').and.not.be.empty;
    return username as string;
  });
}
