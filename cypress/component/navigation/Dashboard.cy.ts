import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { NEVER } from 'rxjs';
import { USER_STATE_MOCK_NO_PERMISSION } from '../CommonIntercepts/CommonUserState.mocks';
import { PrimaryNavigationLocators as L } from '../../shared/selectors/primary-navigation.locators';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { AppComponent } from 'src/app/app.component';

const NAVIGATION_JIRA_LABEL = '@JIRA-LABEL:primary-nav-and-dashboards';
const NAVIGATION_STORY_TAG = '@JIRA-STORY:PO-2613';
const NAVIGATION_EPIC_TAG = '@JIRA-EPIC:PO-2627';

const withReportPermission = (userState: IOpalUserState): IOpalUserState => {
  const nextUserState = structuredClone(userState);

  nextUserState.business_unit_users[0].permissions.push({
    permission_id: FINES_PERMISSIONS['operational-report-by-enforcement'],
    permission_name: 'Operational report by enforcement',
  });

  return nextUserState;
};

describe(
  'Primary navigation report access',
  { tags: [NAVIGATION_STORY_TAG, NAVIGATION_EPIC_TAG, NAVIGATION_JIRA_LABEL] },
  () => {
    const setupComponent = (userState: IOpalUserState) =>
      mount(AppComponent, {
        providers: [
          provideHttpClient(),
          provideRouter([]),
          {
            provide: GlobalStore,
            useFactory: () => {
              const store = new GlobalStore();
              store.setAuthenticated(true);
              store.setUserState(userState);
              return store;
            },
          },
          {
            provide: SessionService,
            useValue: {
              getTokenExpiry: () => NEVER,
            },
          },
          {
            provide: AppInsightsService,
            useValue: {
              logPageView: () => null,
            },
          },
          {
            provide: LaunchDarklyService,
            useValue: {
              initializeLaunchDarklyClient: () => null,
              initializeLaunchDarklyFlags: () => Promise.resolve(),
              initializeLaunchDarklyChangeListener: () => null,
            },
          },
        ],
      });

    it('AC4e hides Reports from the primary navigation when the user has no report permissions in any business unit', {tags: ['@JIRA-KEY:POT-4784']}, () => {
      setupComponent(USER_STATE_MOCK_NO_PERMISSION);

      cy.get(L.container).should('be.visible');
      cy.get(L.items)
        .should('have.length', L.expectedItemsWithoutReports.length)
        .then(($items) => {
          const labels = [...$items].map((item) => item.textContent?.trim() ?? '');

          expect(labels).to.deep.equal(L.expectedItemsWithoutReports);
        });
      cy.get(L.itemByText(L.labels.reports)).should('not.exist');
    });

    it('shows Reports in the primary navigation when the user has a report permission in any business unit', {tags: ['@JIRA-KEY:POT-4785']}, () => {
      setupComponent(withReportPermission(USER_STATE_MOCK_NO_PERMISSION));

      cy.get(L.container).should('be.visible');
      cy.get(L.items)
        .should('have.length', L.expectedItemsWithReports.length)
        .then(($items) => {
          const labels = [...$items].map((item) => item.textContent?.trim() ?? '');

          expect(labels).to.deep.equal(L.expectedItemsWithReports);
        });
    });
  },
);
