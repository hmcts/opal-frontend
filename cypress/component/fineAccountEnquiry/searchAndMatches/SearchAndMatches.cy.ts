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
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { IFinesMacOriginatorTypeForm } from 'src/app/flows/fines/fines-mac/fines-mac-originator-type/interfaces/fines-mac-originator-type-form.interface';
import { IFinesMacOffenceDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { MacAccountDetailsLocators as selectors } from 'cypress/shared/selectors/manual-account-creation/mac.account-details.locators';
import { IFinesMacPersonalDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-personal-details/interfaces/fines-mac-personal-details-form.interface';
import { IFinesMacPersonalDetailsState } from 'src/app/flows/fines/fines-mac/fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';

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
    originatorType: 'NEW' | 'TFO';
    businessUnitId?: number;
    accountType: 'Fine' | 'FixedPenalty' | 'Confiscation';
    defendantType: 'adultOrYouthOnly' | 'pgToPay' | 'company';
    personalDetails?: IFinesMacPersonalDetailsForm;
    offenceDetails?: IFinesMacOffenceDetailsForm[];
  }

  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'individual',
    targetPath: 'fines/dashboard',
    interceptedRoutes: [],
    originatorType: 'NEW',
    businessUnitId: 77,
    defendantType: 'adultOrYouthOnly',
    accountType: 'Fine',
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
  const buildFinesMacStore = (componentProperties: IComponentProperties): InstanceType<typeof FinesMacStore> => {
    const store = new FinesMacStore();
    store.setBusinessUnitId(componentProperties.businessUnitId ?? 77);
    store.businessUnit().business_unit_id = componentProperties.businessUnitId ?? 77;
    store.businessUnit().business_unit_name = 'Test Business Unit';
    const originatorType: IFinesMacOriginatorTypeForm = {
      formData: {
        fm_originator_type_originator_type: componentProperties.originatorType,
      },
      nestedFlow: false,
    };
    store.setOriginatorType(originatorType);
    store.accountDetails().formData = {
      fm_create_account_account_type: componentProperties.accountType,
      fm_create_account_business_unit_id: componentProperties.businessUnitId ?? null,
      fm_create_account_defendant_type: componentProperties.defendantType,
    };
    if (componentProperties.personalDetails) {
      store.setPersonalDetails(componentProperties.personalDetails);
    }
    if (componentProperties.offenceDetails) {
      store.setOffenceDetails(componentProperties.offenceDetails);
    }

    cy.log('store', store.getFinesMacStore());
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
          { provide: FinesMacStore, useFactory: () => buildFinesMacStore(componentProperties) },
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
      { heading: 'Individuals', selector: '#tab-individuals', hash: '#individuals', time: 0 },
      { heading: 'Companies', selector: '#tab-companies', hash: '#companies', time: 0 },
      { heading: 'Minor creditors', selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { heading: 'Major creditors', selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
      { heading: 'Minor creditors', selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { heading: 'Major creditors', selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
      { heading: 'Minor creditors', selector: '#tab-minor-creditors', hash: '#minor-creditor', time: 0 },
      { heading: 'Major creditors', selector: '#tab-major-creditors', hash: '#major-creditor', time: 0 },
    ];

    cy.wrap(tabs).each((tab: { selector: string; hash: string; time: number }) => {
      let start = 0;

      cy.window().then((win) => {
        start = win.performance.now();
      });

      cy.get(tab.selector).should('exist').should('be.visible').click();

      cy.window().then((win) => {
        cy.get('opal-lib-govuk-tabs-panel > * > h1').should('have.text', tab.heading);
        const elapsed = win.performance.now() - start;

        tab.time = elapsed;

        expect(elapsed, ``).to.be.lessThan(250);
      });
    });

    cy.then(() => {
      cy.log(tabs.map((tab) => `${tab.hash}: ${tab.time.toFixed(2)}ms`).join('\n'));
    });
  });
  it('Time between tab changes should be less than 250ms', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    setupComponent(componentProperties);

    const headingSelector = 'opal-lib-govuk-tabs-panel > * > h1';
    const tabs = [
      { selector: '#tab-companies', hash: '#companies', heading: 'Companies' },
      { selector: '#tab-minor-creditors', hash: '#minor-creditor', heading: 'Minor creditors' },
      { selector: '#tab-major-creditors', hash: '#major-creditor', heading: 'Major creditors' },
      { selector: '#tab-minor-creditors', hash: '#minor-creditor', heading: 'Minor creditors' },
      { selector: '#tab-major-creditors', hash: '#major-creditor', heading: 'Major creditors' },
      { selector: '#tab-minor-creditors', hash: '#minor-creditor', heading: 'Minor creditors' },
      { selector: '#tab-individuals', hash: '#individuals', heading: 'Individuals' },
    ];

    cy.get(headingSelector).should('have.text', 'Individuals');

    cy.wrap(tabs).each((tab: { selector: string; hash: string; heading: string }) => {
      cy.window().then((win) => {
        const element = win.document.querySelector(tab.selector) as HTMLElement;

        expect(element, `${tab.selector} should exist`).to.not.be.null;

        const start = win.performance.now();

        element.click();

        cy.get(headingSelector)
          .should('have.text', tab.heading)
          .then(() => {
            const elapsed = win.performance.now() - start;

            expect(elapsed, `${tab.selector} should complete within 250ms`).to.be.lessThan(250);
          });
      });
    });
  });

  it.only('Simple page changes should be less than 250ms - Personal Details Page', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    componentProperties.targetPath = 'fines/manual-account-creation/account-details';

    componentProperties.personalDetails = {
      formData: {
        fm_personal_details_title: 'Mr',
        fm_personal_details_forenames: 'John',
        fm_personal_details_surname: 'Doe',
        fm_personal_details_add_alias: false,
        fm_personal_details_aliases: [],
        fm_personal_details_dob: '1990-01-01',
        fm_personal_details_national_insurance_number: 'AB123456C',
        fm_personal_details_address_line_1: '123 Main Street',
        fm_personal_details_address_line_2: null,
        fm_personal_details_address_line_3: null,
        fm_personal_details_post_code: null,
        fm_personal_details_vehicle_make: null,
        fm_personal_details_vehicle_registration_mark: null,
      },
      nestedFlow: false,
    };

    componentProperties.offenceDetails = [
      {
        formData: {
          fm_offence_details_id: 1,
          fm_offence_details_date_of_sentence: '2023-01-01',
          fm_offence_details_offence_cjs_code: '12345',
          fm_offence_details_offence_id: 1,
          fm_offence_details_impositions: [],
        },
        nestedFlow: false,
      },
    ];

    setupComponent(componentProperties);

    // Defining selectors rather than re-using due to directly accessing DOM for more accurate performance measurements.
    const personalDetailsTabSelector = selectors.personalDetails + ' > * > * > .govuk-link';
    const cancelLinkSelector = '.govuk-link';

    cy.get(selectors.pageTitle).should('have.text', 'Account details');

    cy.window().then((win) => {
      const start = win.performance.now();

      const element = win.document.querySelector(personalDetailsTabSelector) as HTMLElement;

      expect(element, `${personalDetailsTabSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(selectors.pageTitle)
        .should('have.text', 'Personal details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Personal Details page should load within 250ms`).to.be.lessThan(250);
        });
    });

    cy.window().then((win) => {
      const start = win.performance.now();

      const element = win.document.querySelector(cancelLinkSelector) as HTMLElement;

      expect(element, `${cancelLinkSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(selectors.pageTitle)
        .should('have.text', 'Account details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Account Details page should load within 250ms`).to.be.lessThan(250);
        });
    });
  });
});
