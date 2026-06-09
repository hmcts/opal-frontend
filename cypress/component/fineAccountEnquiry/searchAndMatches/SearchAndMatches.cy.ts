import { AccountSearchCommonLocators as CommonLocators } from '../../../shared/selectors/account-search/account.search.common.locators';
import { AccountSearchCompaniesLocators as CompanyLocators } from '../../../shared/selectors/account-search/account.search.companies.locators';
import { Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { mount } from 'cypress/angular';
import { FinesComponent } from 'src/app/flows/fines/fines.component';
import { finesRouting as routing } from 'src/app/flows/fines/routing/fines.routes';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import {
  DEFAULT_USER_STATE_DOMAIN,
  interceptAuthenticatedUser,
  interceptBusinessUnits,
  interceptUserState,
} from '../../CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Search Account Component', () => {
  interface IComponentProperties {
    accountId: string | `${number}`;
    routeRoot?: 'defendant' | 'minor-creditor';
    routeSegments?: string[];
    targetPath?: string;
    routerConfig?: Routes;
    additionalProviders?: Provider[];
    globalStoreFactory?: () => InstanceType<typeof GlobalStore>;
    userStateDomain?: string;
    fragments: 'individual' | 'companies' | 'majorCreditor' | 'minorCreditors' | undefined;
    interceptedRoutes?: string[];
  }

  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'individual',
    targetPath: 'fines/dashboard',
    interceptedRoutes: [
      '../note/add',
      '../debtor/individual/amend',
      '../debtor/parentGuardian/amend',
      '../payment-terms/amend',
      '../payment-terms/amend-denied',
      '../payment-card/request',
      '../payment-card/denied/enforcement',
      // Add more routes here as needed
    ],
  };

  const buildGlobalStore = (componentProperties: IComponentProperties): InstanceType<typeof GlobalStore> => {
    const store = componentProperties.globalStoreFactory ? componentProperties.globalStoreFactory() : new GlobalStore();
    store.setUserStateDomain(componentProperties.userStateDomain ?? DEFAULT_USER_STATE_DOMAIN);
    store.setFeatureFlags({
      'release-1a': true,
      'release-1b': true,
      'release-1c-write-off': false,
      'release-1c-enforcement-operational-reporting': false,
    });
    return store;
  };

  const setupComponent = (componentProperties: IComponentProperties) => {
    cy.then(() => {
      mount(FinesComponent, {
        providers: [
          provideHttpClient(),
          // Provides the Angular Router with the application's routing configuration.
          provideRouter(componentProperties.routerConfig ?? [...routing]),
          FinesAccPayloadService,
          OpalFines,
          PermissionsService,
          UtilsService,
          FinesAccountStore,
          {
            provide: GlobalStore,
            useFactory: () => buildGlobalStore(componentProperties),
          },
          ...(componentProperties.additionalProviders ?? []),
          // {
          //   // prevents the auth guard from hard-redirecting the test runner
          //   provide: REDIRECT_TO_SSO,
          //   useValue: cy.stub().as('redirectToSso'),
          // },
        ],
      }).then(({ fixture }) => {
        // Get the Angular Router instance from the test fixture's injector.
        // This allows us to control and observe navigation during the test.
        const router = fixture.debugElement.injector.get(Router);
        cy.wrap(router).as('router');

        // Save the original navigate method so we can call it for non-intercepted routes.
        const originalNavigate = router.navigate.bind(router);

        // Use Cypress to stub the router's navigate method.
        // This lets us intercept navigation attempts and control their behavior in the test.
        cy.stub(router, 'navigate')
          .as('routerNavigate') // Give the stub a name for easier reference in assertions.
          .callsFake((commands, extras) => {
            // If the navigation is trying to go to '/access-denied', intercept and resolve immediately.
            // This prevents the actual redirect during the test, allowing us to test other logic.

            if (Array.isArray(commands) && componentProperties.interceptedRoutes?.includes(commands[0])) {
              return Promise.resolve(true); // Swallow the redirect, simulating a successful navigation.
            }
            // For all other routes, call the original navigate method to allow normal navigation.
            return originalNavigate(commands, extras);
          });

        const navigateToComponent = componentProperties.targetPath
          ? router.navigateByUrl(componentProperties.targetPath)
          : router.navigate(['fines', 'dashboard'], {});

        // Attempt to navigate to the requested route using the router.
        // This triggers the stub above, which will allow this navigation to proceed normally.
        return navigateToComponent.then((success) => {
          // Assert that navigation was successful.
          expect(success).to.be.true;
          // Trigger Angular change detection to update the component state after navigation.
          fixture.detectChanges();
        });
      });
    });
  };

  it('Time between tab changes should be less than 250ms cy.wrap', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    setupComponent(componentProperties);

    const tabs = [
      { selector: '#tab-individuals', hash: '#individuals', time: 0 },
      { selector: '#tab-companies', hash: '#companies', time: 0 },
      { selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
      { selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
      { selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
    ];

    cy.wrap(tabs).each((tab: { selector: string; hash: string; time: number }) => {
      let start = 0;

      cy.window().then((win) => {
        start = win.performance.now();
      });

      cy.get(tab.selector).should('exist').should('be.visible').click();

      cy.window().then((win) => {
        const elapsed = win.performance.now() - start;

        tab.time = elapsed;

        expect(elapsed, ``).to.be.lessThan(250);
      });
    });

    cy.then(() => {
      cy.log(tabs.map((tab) => `${tab.hash}: ${tab.time.toFixed(2)}ms`).join('\n'));
    });
  });
  it.only('Time between tab changes should be less than 250ms', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    setupComponent(componentProperties);

    const tabs = [
      '#tab-individuals',
      '#tab-companies',
      '#tab-minor-creditors',
      '#tab-major-creditors',
      '#tab-minor-creditors',
      '#tab-major-creditors',
      '#tab-minor-creditors',
      '#tab-individuals',
    ];

    cy.window().then((win) => {
      const results: string[] = [];
      const doc = win.document;

      for (const selector of tabs) {
        const element = doc.querySelector<HTMLElement>(selector);

        expect(element, `${selector} exists`).to.not.be.null;

        const start = performance.now();

        element!.click();

        const elapsed = performance.now() - start;

        results.push(`${selector}: ${elapsed.toFixed(2)}ms`);

        expect(elapsed).to.be.lessThan(250);
      }

      cy.log(results.join('\n'));
    });
  });
});
