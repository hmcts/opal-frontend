import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { RELEASE_1C_SUSPENSE_FEATURE_FLAG } from 'src/app/flows/fines/constants/release-feature-flags.constant';
import { accessibilityActions } from '../../../e2e/functional/opal/actions/accessibility/accessibility.actions';
import { FinanceLocators } from '../../../shared/selectors/finance.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';

describe(
  'Finance dashboard accessibility - Manage Suspense Items',
  { tags: ['@JIRA-STORY:PO-9762', '@JIRA-LABEL:navigation', '@R1CSuspense'] },
  () => {
    it('(AC7a, AC7b) has no non-exempt Axe violations with Manage Suspense Items displayed', () => {
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        permissionIds: [
          FINES_PERMISSIONS['view-suspense-items'],
          FINES_PERMISSIONS['manage-suspense-items'],
          FINES_PERMISSIONS['view-interface-files'],
          FINES_PERMISSIONS['create-interface-files'],
        ],
        featureFlags: { [RELEASE_1C_SUSPENSE_FEATURE_FLAG]: true },
      });

      cy.contains('h1', 'Finance').should('be.visible');
      cy.get(FinanceLocators.manageSuspenseItemsLink)
        .should('be.visible')
        .and('have.text', FinanceLocators.labels.manageSuspenseItems);
      cy.get(FinanceLocators.manualCashInputLink).should('be.visible');
      cy.get(FinanceLocators.inboundFilesLink).should('be.visible');

      // The Cypress component document has no language; match the real application's English document.
      cy.document().then((document) => {
        document.documentElement.lang = 'en';
      });

      accessibilityActions().checkAccessibilityOnly('node_modules/axe-core/axe.min.js');
    });
  },
);
