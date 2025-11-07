// cypress/e2e/functional/opal/flows/auth.flow.ts
import { performLogin } from '../actions/login.actions';
import { DashboardActions } from '../actions/dashboard.actions';

/** Logs in using SSO or local auth and ensures dashboard is visible. */
export function loginAndLandOnDashboard(email: string): void {
  performLogin(email);
  new DashboardActions().assertDashboard(email);
}
