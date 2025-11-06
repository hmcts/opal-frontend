// cypress/e2e/functional/opal/flows/auth.flow.ts
import { performLogin } from '../actions/login.actions';
import { assertDashboard } from '../actions/dashboard.actions';

/** Logs in using SSO or local auth and ensures dashboard is visible. */
export function loginAndLandOnDashboard(email: string): void {
  performLogin(email);
  assertDashboard(email);
}
