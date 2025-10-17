import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { mount } from 'cypress/angular';
import { FinesAccComponent } from 'src/app/flows/fines/fines-acc/fines-acc.component';
import { routing } from 'src/app/flows/fines/fines-acc/routing/fines-acc.routes';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { interceptAuthenticatedUser, interceptUserState } from './intercept/interceptUserState';
import {
  DEFENDANT_HEADER_MOCK,
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from './mocks/defendant_details_mock';
import { REDIRECT_TO_SSO } from '@hmcts/opal-frontend-common/guards/auth';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { interceptDefendantHeader } from './intercept/interceptDefendantHeader';
import { interceptAtAGlance } from './intercept/interceptAtAGlance';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { interceptDefendantDetails } from './intercept/interceptDefendantDetails';
import { interceptAddNotes } from './intercept/interceptAddNotes';
import { DOM_ELEMENTS as DOM } from './constants/account_enquiry_header_elements';
import { DEFENDANT_DETAILS } from './constants/defendant_details_elements';

/**
 * Sets up and mounts the `FinesAccComponent` for Cypress component testing.
 *
 * This function configures the necessary Angular providers, stubs out authentication redirects,
 * and overrides router navigation to prevent hard redirects during tests. It then navigates to
 * the defendant details route for the specified account ID and ensures the fixture is updated.
 *
 * @param accountId - The account ID to use for navigation. Defaults to `'77'` if not provided.
 * @returns A Cypress chainable that completes after the component is mounted and navigation is performed.
 */
const setupComponent = (accountId: string | null = '77') => {
  cy.then(() => {
    mount(FinesAccComponent, {
      providers: [
        provideHttpClient(),
        // Provides the Angular Router with the application's routing configuration.
        provideRouter([...routing]),
        FinesAccPayloadService,
        OpalFines,
        PermissionsService,
        UtilsService,
        GlobalStore,
        FinesAccountStore,
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

      // Save the original navigate method so we can call it for non-intercepted routes.
      const originalNavigate = router.navigate.bind(router);

      // Use Cypress to stub the router's navigate method.
      // This lets us intercept navigation attempts and control their behavior in the test.
      cy.stub(router, 'navigate')
        .as('routerNavigate') // Give the stub a name for easier reference in assertions.
        .callsFake((commands, extras) => {
          // If the navigation is trying to go to '/access-denied', intercept and resolve immediately.
          // This prevents the actual redirect during the test, allowing us to test other logic.
          const interceptedRoutes = [
            '/access-denied',
            '../note/add',
            '../debtor/individual/amend',
            '../debtor/parentGuardian/amend',
            // Add more routes here as needed
          ];
          if (Array.isArray(commands) && interceptedRoutes.includes(commands[0])) {
            return Promise.resolve(true); // Swallow the redirect, simulating a successful navigation.
          }
          // For all other routes, call the original navigate method to allow normal navigation.
          return originalNavigate(commands, extras);
        });

      // Attempt to navigate to the defendant details page using the router.
      // This triggers the stub above, which will allow this navigation to proceed normally.
      return router.navigate(['defendant', accountId, 'details'], { fragment: 'defendant' }).then((success) => {
        // Assert that navigation was successful.
        expect(success).to.be.true;
        // Trigger Angular change detection to update the component state after navigation.
        fixture.detectChanges();
      });
    });
  });
};

/**
 * Sets the language preference properties on the provided preference object.
 *
 * @param pref - The preference object to update.
 * @param code - The language code to set. Defaults to `'EN'`.
 * @param name - The display name for the language. Defaults to `'English only'`.
 */
function setLanguagePref(pref: any, code = 'EN', name = 'English only') {
  Object.assign(pref!, {
    language_code: code,
    language_display_name: name,
  });
}

describe('Account Enquiry Defendant Details Tab', () => {
  // it.skip('example test setup', { tags: ['@PO-784'] }, () => {
  //   let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);

  //   let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
  //   defendantDetailsMock.defendant_account_party.is_debtor = true;

  //   interceptAddNotes();

  //   interceptAuthenticatedUser();
  //   interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  //   interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
  //   interceptAtAGlance(1, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');
  //   interceptDefendantDetails(1, defendantDetailsMock, '1');

  //   setupComponent('1');
  //   cy.get('router-outlet').should('exist');
  //   cy.get('a').contains('Defendant').click();
  // });

  it('AC1a, AC1b, AC1d. Defendant details tab layout, debtor flag true', { tags: ['PO-784'] }, () => {
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
    interceptDefendantDetails(1, defendantDetailsMock, '1');
    setupComponent('1');

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.headingWithCaption).should('exist');
    cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantTitle).should('exist').and('contain.text', 'Defendant details');
    cy.get(DEFENDANT_DETAILS.defendantName).should('exist').and('contain.text', 'Ms Sarah Jane THOMPSON');
    cy.get(DEFENDANT_DETAILS.defendantAlias).should('exist').and('contain.text', 'S. J. TAYLOR John PETERS');
    cy.get(DEFENDANT_DETAILS.defendantDOB).should('exist').and('contain.text', '12 April 1988');
    cy.get(DEFENDANT_DETAILS.defendantNI).should('exist').and('contain.text', 'QQ 12 34 56 C');
    cy.get(DEFENDANT_DETAILS.defendantAddress)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.trim().replace(/\s+/g, ' ')).to.eq('45 High Street Flat 2B AB1 2CD');
      });
    cy.get(DEFENDANT_DETAILS.defendantVehicle).should('exist').and('contain.text', 'Ford Focus');
    cy.get(DEFENDANT_DETAILS.defendantVehicleReg).should('exist').and('contain.text', 'XY21 ABC');

    cy.get(DEFENDANT_DETAILS.defendantPrimaryEmail).should('exist').and('contain.text', 'sarah.thompson@example.com');
    cy.get(DEFENDANT_DETAILS.defendantSecondaryEmail).should('exist').and('contain.text', 'sarah.t@example.com');
    cy.get(DEFENDANT_DETAILS.defendantMobilePhone).should('exist').and('contain.text', '07123 456789');
    cy.get(DEFENDANT_DETAILS.defendantHomePhone).should('exist').and('contain.text', '01234 567890');
    cy.get(DEFENDANT_DETAILS.defendantWorkPhone).should('exist').and('contain.text', '09876 543210');

    cy.get(DEFENDANT_DETAILS.defendantEmployerName).should('exist').and('contain.text', 'Tech Solutions Ltd');
    cy.get(DEFENDANT_DETAILS.defendantEmployerReference).should('exist').and('contain.text', 'EMP-001234');
    cy.get(DEFENDANT_DETAILS.defendantEmployerEmail).should('exist').and('contain.text', 'hr@techsolutions.com');
    cy.get(DEFENDANT_DETAILS.defendantEmployerPhone).should('exist').and('contain.text', '01234 567890');
    cy.get(DEFENDANT_DETAILS.defendantEmployerAddress)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.trim().replace(/\s+/g, ' ')).to.eq('200 Innovation Park CD3 4EF');
      });
  });

  it('AC1a, AC1c, AC1d. Defendant details tab layout, debtor flag false', { tags: ['PO-784'] }, () => {
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = false;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
    interceptDefendantDetails(1, defendantDetailsMock, '1');
    setupComponent('1');

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.headingWithCaption).should('exist');
    cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantTitle).should('exist').and('contain.text', 'Defendant details');
    cy.get(DEFENDANT_DETAILS.defendantName).should('exist').and('contain.text', 'Ms Sarah Jane THOMPSON');
    cy.get(DEFENDANT_DETAILS.defendantAlias).should('exist').and('contain.text', 'S. J. TAYLOR John PETERS');
    cy.get(DEFENDANT_DETAILS.defendantDOB).should('exist').and('contain.text', '12 April 1988');
    cy.get(DEFENDANT_DETAILS.defendantNI).should('exist').and('contain.text', 'QQ 12 34 56 C');
    cy.get(DEFENDANT_DETAILS.defendantAddress)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.trim().replace(/\s+/g, ' ')).to.eq('45 High Street Flat 2B AB1 2CD');
      });
    cy.get(DEFENDANT_DETAILS.defendantVehicle).should('exist').and('contain.text', 'Ford Focus');
    cy.get(DEFENDANT_DETAILS.defendantVehicleReg).should('exist').and('contain.text', 'XY21 ABC');

    cy.get(DEFENDANT_DETAILS.defendantPrimaryEmail).should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantSecondaryEmail).should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantMobilePhone).should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantHomePhone).should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantWorkPhone).should('not.exist');

    cy.get(DEFENDANT_DETAILS.defendantEmployerName).should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantEmployerReference).should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantEmployerEmail).should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantEmployerPhone).should('not.exist');
    cy.get(DEFENDANT_DETAILS.defendantEmployerAddress).should('not.exist');
  });

  it('AC1div. Should display em-dash for blank row', { tags: ['PO-784'] }, () => {
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    defendantDetailsMock.defendant_account_party.contact_details!.secondary_email_address = null;
    defendantDetailsMock.defendant_account_party.employer_details!.employer_telephone_number = null;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
    interceptDefendantDetails(1, defendantDetailsMock, '1');
    setupComponent('1');

    cy.get(DEFENDANT_DETAILS.defendantSecondaryEmail).should('exist').and('contain.text', '—');
    cy.get(DEFENDANT_DETAILS.defendantEmployerPhone).should('exist').and('contain.text', '—');
  });

  it('AC1bi. Should display language preferences sub-section when applicable', { tags: ['PO-784'] }, () => {
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    setLanguagePref(language_preferences!.document_language_preference, 'CY', 'Welsh and English');
    setLanguagePref(language_preferences!.hearing_language_preference, 'CY', 'Welsh and English');
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
    interceptDefendantDetails(1, defendantDetailsMock, '1');
    setupComponent('1');

    cy.get(DEFENDANT_DETAILS.documentLanguage).should('exist').and('contain.text', 'Welsh and English');
    cy.get(DEFENDANT_DETAILS.courtHearingLanguage).should('exist').and('contain.text', 'Welsh and English');
  });

  it('AC2. Account maintenance permission true, BU associated with account', { tags: ['PO-784'] }, () => {
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
    interceptDefendantDetails(1, defendantDetailsMock, '1');
    setupComponent('1');

    cy.get(DEFENDANT_DETAILS.defendantChange).should('exist').click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../debtor/individual/amend']);
  });

  it('AC2a. Account maintenance permission true, BU not associated with account', { tags: ['PO-784'] }, () => {
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
    interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
    interceptDefendantDetails(1, defendantDetailsMock, '1');
    setupComponent('1');

    cy.get(DEFENDANT_DETAILS.defendantChange).should('exist').click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['/access-denied']);
  });

  it('AC2b. Account maintenance permission false', { tags: ['PO-784'] }, () => {
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
    interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
    interceptDefendantDetails(1, defendantDetailsMock, '1');
    setupComponent('1');

    cy.get(DEFENDANT_DETAILS.defendantChange).should('not.exist');
  });

  it('Company test', { tags: ['PO-790'] }, () => {
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
    interceptDefendantDetails(1, defendantDetailsMock, '1');
    setupComponent('1');
  });
});
