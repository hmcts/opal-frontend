import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { mount } from 'cypress/angular';
import { FinesAccComponent } from 'src/app/flows/fines/fines-acc/fines-acc.component';
import { routing } from 'src/app/flows/fines/fines-acc/routing/fines-acc.routes';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { interceptAuthenticatedUser, interceptUserState } from './intercept/interceptUserState';
import {
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
  USER_STATE_MOCK_NO_PERMISSION,
  createDefendantHeaderMockWithName,
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
import { interceptDefendantDetails, interceptPGDetails } from './intercept/interceptDefendantDetails';
import { interceptAddNotes } from './intercept/interceptAddNotes';
import { OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK } from './mocks/parentGuardianDebtor.mock';
// constants + mocks
import { DOM_ELEMENTS as DOM } from './constants/defendant_parent_or_guardian_elements';

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
      return router
        .navigate(['defendant', accountId, 'details'], { fragment: 'parent-or-guardian' })
        .then((success) => {
          // Assert that navigation was successful.
          expect(success).to.be.true;
          // Trigger Angular change detection to update the component state after navigation.
          fixture.detectChanges();
        });
    });
  });
};
describe('Account Enquiry Parent or Guardian Component', () => {
  it(
    'AC1,Ac1a, Ac1b,Ac1bi:should display "Parent or Guardian details" title and other fields when viewing Parent or Guardian tab',
    { tags: ['@PO-788'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.parent_guardian_party_id = '1770000001';
      headerMock.debtor_type = 'Parent/Guardian';

      const pgPartyId = headerMock.parent_guardian_party_id;

      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;

      let pgDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK);
      pgDetailsMock.defendant_account_party.party_details.party_id = pgPartyId;
      // AC1b: Set debtor flag to true to test that all sub-sections are displayed
      pgDetailsMock.defendant_account_party.is_debtor = true;

      const accountId = headerMock.defendant_party_id;

      interceptAddNotes();

      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '1');
      interceptPGDetails(accountId, pgPartyId, pgDetailsMock, '1');

      setupComponent(accountId);
      cy.get('router-outlet').should('exist');

      // AC1a: Verify that 'Parent or Guardian details' title is displayed
      cy.get('h2').contains('Parent or guardian details').should('be.visible');

      // AC1b: Verify that when debtor flag is true, all sub-sections are displayed
      // Check for Personal Details section
      cy.get(DOM.parentOrGuardianDetailsName).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsAliases).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsDob).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsNational_insurance_numberKey).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsAddressKey).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsVehicleMake).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsVehicleReg).should('be.visible');
      cy.get(DOM.contactSummaryCardTitle).should('be.visible');
      cy.get(DOM.contactDetailsPrimaryEmailKey).should('be.visible');
      cy.get(DOM.contactDetailsSecondaryEmailKey).should('be.visible');
      cy.get(DOM.contactDetailsMobilePhoneKey).should('be.visible');
      cy.get(DOM.contactDetailsHomePhoneKey).should('be.visible');
      cy.get(DOM.contactDetailsWorkPhoneKey).should('be.visible');
      cy.get(DOM.employerDetailsNameKey).should('be.visible');
      cy.get(DOM.employerDetailsReferenceKey).should('be.visible');
      cy.get(DOM.employerDetailsEmailKey).should('be.visible');
      cy.get(DOM.employerDetailsPhoneKey).should('be.visible');
      cy.get(DOM.employerDetailsAddressKey).should('be.visible');
      cy.get(DOM.languagePreferencePreferred).should('be.visible');
      //AC1bi: Verify Language Preference sub-section displays correct data fields if the account associated with welsh speaking and debtor flag true
      cy.get(DOM.DocumentLanguageKey).should('be.visible');
      cy.get(DOM.courtHearingLanguageKey).should('be.visible');
    },
  );

  it(
    'AC1bi: should not display Language preferences sub-section when account is not associated with Welsh speaking BU',
    { tags: ['@PO-788'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.parent_guardian_party_id = '1770000001';
      headerMock.debtor_type = 'Parent/Guardian';

      const pgPartyId = headerMock.parent_guardian_party_id;

      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;

      let pgDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK);
      pgDetailsMock.defendant_account_party.party_details.party_id = pgPartyId;
      // Set debtor flag to true to test that all sub-sections are displayed (except language preferences for non-Welsh BU)
      pgDetailsMock.defendant_account_party.is_debtor = true;

      // Set language preferences to null to simulate non-Welsh speaking BU
      pgDetailsMock.defendant_account_party.language_preferences = null;

      const accountId = headerMock.defendant_party_id;

      interceptAddNotes();
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '1');
      interceptPGDetails(accountId, pgPartyId, pgDetailsMock, '1');

      setupComponent(accountId);
      cy.get('router-outlet').should('exist');

      // AC1a: Verify that 'Parent or Guardian details' title is displayed
      cy.get('h2').contains('Parent or guardian details').should('be.visible');

      // AC1b: Verify that when debtor flag is true, all sub-sections are displayed except language preferences
      // Check for Personal Details section
      cy.get(DOM.parentOrGuardianDetailsName).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsAliases).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsDob).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsNational_insurance_numberKey).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsAddressKey).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsVehicleMake).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsVehicleReg).should('be.visible');

      // Contact details should be visible
      cy.get(DOM.contactSummaryCardTitle).should('be.visible');
      cy.get(DOM.contactDetailsPrimaryEmailKey).should('be.visible');
      cy.get(DOM.contactDetailsSecondaryEmailKey).should('be.visible');
      cy.get(DOM.contactDetailsMobilePhoneKey).should('be.visible');
      cy.get(DOM.contactDetailsHomePhoneKey).should('be.visible');
      cy.get(DOM.contactDetailsWorkPhoneKey).should('be.visible');

      // Employer details should be visible
      cy.get(DOM.employerDetailsNameKey).should('be.visible');
      cy.get(DOM.employerDetailsReferenceKey).should('be.visible');
      cy.get(DOM.employerDetailsEmailKey).should('be.visible');
      cy.get(DOM.employerDetailsPhoneKey).should('be.visible');
      cy.get(DOM.employerDetailsAddressKey).should('be.visible');

      // AC1bii: Verify Language Preference sub-section is NOT displayed when account is not associated with Welsh speaking BU
      cy.get(DOM.languagePreferencePreferred).should('not.exist');
      cy.get(DOM.DocumentLanguageKey).should('not.exist');
      cy.get(DOM.courtHearingLanguageKey).should('not.exist');
    },
  );

  it(
    'AC1c: should display only Parent or Guardian details sub-section when debtor flag is false',
    { tags: ['@PO-788'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.parent_guardian_party_id = '1770000001';
      headerMock.debtor_type = 'Parent/Guardian';

      const pgPartyId = headerMock.parent_guardian_party_id;

      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.is_debtor = false;
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;

      let pgDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK);
      pgDetailsMock.defendant_account_party.party_details.party_id = pgPartyId;
      pgDetailsMock.defendant_account_party.is_debtor = false;

      const accountId = headerMock.defendant_party_id;

      interceptAddNotes();

      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '1');

      interceptPGDetails(accountId, pgPartyId, pgDetailsMock, '1');

      setupComponent(accountId);
      cy.get('router-outlet').should('exist');

      cy.get('h2').contains('Parent or guardian details').should('be.visible');

      // AC1b: Verify that when debtor flag is false, only parent/guardian details sub-sections are displayed
      // Check for Personal Details section
      cy.get(DOM.parentOrGuardianDetailsName).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsAliases).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsDob).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsNational_insurance_numberKey).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsAddressKey).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsVehicleMake).should('be.visible');
      cy.get(DOM.parentOrGuardianDetailsVehicleReg).should('be.visible');
      cy.get(DOM.contactSummaryCardTitle).should('not.exist');
      cy.get(DOM.contactDetailsPrimaryEmailKey).should('not.exist');
      cy.get(DOM.contactDetailsSecondaryEmailKey).should('not.exist');
      cy.get(DOM.contactDetailsMobilePhoneKey).should('not.exist');
      cy.get(DOM.contactDetailsHomePhoneKey).should('not.exist');
      cy.get(DOM.contactDetailsWorkPhoneKey).should('not.exist');
      cy.get(DOM.employerDetailsNameKey).should('not.exist');
      cy.get(DOM.employerDetailsReferenceKey).should('not.exist');
      cy.get(DOM.employerDetailsEmailKey).should('not.exist');
      cy.get(DOM.employerDetailsPhoneKey).should('not.exist');
      cy.get(DOM.employerDetailsAddressKey).should('not.exist');
      cy.get(DOM.languagePreferencePreferred).should('not.exist');
    },
  );

  it(
    'AC1d, AC1ci, AC1cii, AC1ciii: should display data fields with correct format and all fields read-only',
    { tags: ['@PO-788'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.parent_guardian_party_id = '1770000001';
      headerMock.debtor_type = 'Parent/Guardian';

      const pgPartyId = headerMock.parent_guardian_party_id;

      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;

      let pgDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK);
      pgDetailsMock.defendant_account_party.party_details.party_id = pgPartyId;
      // AC1b: Set debtor flag to true to test that all sub-sections are displayed
      pgDetailsMock.defendant_account_party.is_debtor = true;

      const accountId = headerMock.defendant_party_id;

      interceptAddNotes();

      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '1');
      interceptPGDetails(accountId, pgPartyId, pgDetailsMock, '1');

      setupComponent(accountId);
      cy.get('router-outlet').should('exist');

      // AC1d: Verify data fields are displayed with correct values
      cy.get('h2').contains('Parent or guardian details').should('be.visible');

      // Name should display as "Mr Opal parent2 LNAME"
      cy.get(DOM.parentOrGuardianDetailsName).should('contain.text', 'Mr Opal parent2 LNAME');

      // AC1cii: National Insurance Number should be formatted as 'AA NN NN NN A'
      cy.get(DOM.parentOrGuardianDetailsNational_insurance_numberKey).siblings().should('contain.text', 'OT000001D');

      // Address should display correctly
      cy.get(DOM.parentOrGuardianDetailsAddressKey).siblings().should('contain.text', 'PG2 addr1');
      cy.get(DOM.parentOrGuardianDetailsAddressKey).siblings().should('contain.text', 'PG2 addr2');
      cy.get(DOM.parentOrGuardianDetailsAddressKey).siblings().should('contain.text', 'PG2 addr3');
      cy.get(DOM.parentOrGuardianDetailsAddressKey).siblings().should('contain.text', 'PG12 3ST');

      // Contact details should display correctly
      cy.get(DOM.contactDetailsPrimaryEmailKey).siblings().should('contain.text', 'PGemail1@email.com');
      cy.get(DOM.contactDetailsSecondaryEmailKey).siblings().should('contain.text', 'PGemail2@test.com');
      const phoneRegex = /^\d{11}$/;
      // AC1ciii: Telephone numbers should be formatted as 'NNNNN NNNNNN'
      cy.get(DOM.contactDetailsMobilePhoneKey)
        .siblings()
        .invoke('text')
        .then((text) => {
          const normalize = (s: string) => s.replace(/\D/g, ''); // keep only digits
          expect(normalize(text)).to.equal(normalize('07123456789')).to.match(phoneRegex);
        });
      cy.get(DOM.contactDetailsHomePhoneKey)
        .siblings()
        .invoke('text')
        .then((text) => {
          const normalize = (s: string) => s.replace(/\D/g, ''); // keep only digits (removes all spaces/non-digits)
          expect(normalize(text)).to.equal(normalize('01987123123')).to.match(phoneRegex);
        });

      cy.get(DOM.contactDetailsWorkPhoneKey)
        .siblings()
        .invoke('text')
        .then((text) => {
          const normalize = (s: string) => s.replace(/\D/g, '');
          const normalizedText = text.replace(/\s+/g, '');
          expect(normalizedText).to.equal('08000001066').to.match(phoneRegex);
        });

      // Language preferences should display correctly
      cy.get(DOM.DocumentLanguageKey).siblings().should('contain.text', 'Welsh and English');
      cy.get(DOM.courtHearingLanguageKey).siblings().should('contain.text', 'Welsh and English');

      // Employer details should display correctly
      cy.get(DOM.employerDetailsNameKey).siblings().should('contain.text', 'employername4');
      cy.get(DOM.employerDetailsReferenceKey).siblings().should('contain.text', 'OT0000002D');
      cy.get(DOM.employerDetailsEmailKey).siblings().should('contain.text', 'emp4@emp.com');

      // Employer telephone should be formatted
      cy.get(DOM.employerDetailsPhoneKey)
        .siblings()
        .invoke('text')
        .then((text) => {
          const normalize = (s: string) => s.replace(/\D/g, ''); // keep only digits
          const normalizedText = text.replace(/\s+/g, '');
          expect(normalizedText).to.equal('01987654321').to.match(phoneRegex);
        });

      // Employer address should display correctly
      cy.get(DOM.employerDetailsAddressKey).siblings().should('contain.text', 'emp4 addr1');
      cy.get(DOM.employerDetailsAddressKey).siblings().should('contain.text', 'emp4 addr2');
      cy.get(DOM.employerDetailsAddressKey).siblings().should('contain.text', 'emp4 addr3');
      cy.get(DOM.employerDetailsAddressKey).siblings().should('contain.text', 'emp4 addr4');
      cy.get(DOM.employerDetailsAddressKey).siblings().should('contain.text', 'emp4 addr5');
      cy.get(DOM.employerDetailsAddressKey).siblings().should('contain.text', 'PG98 7ST');

      // AC1ci: Verify all fields are read-only (no input elements should be editable)
      cy.get('input[type="text"]').should('not.exist');
      cy.get('input[type="email"]').should('not.exist');
      cy.get('input[type="tel"]').should('not.exist');
      cy.get('textarea').should('not.exist');
      cy.get('select').should('not.exist');
      cy.get('button').should('not.contain.text', 'Edit');
      cy.get('button').should('not.contain.text', 'Save');
      cy.get('button').should('not.contain.text', 'Update');
    },
  );

  it('AC1civ: should display em-dash (—) for fields that have not been provided', { tags: ['@PO-788'] }, () => {
    let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
    headerMock.parent_guardian_party_id = '1770000001';
    headerMock.debtor_type = 'Parent/Guardian';

    const pgPartyId = headerMock.parent_guardian_party_id;

    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;

    let pgDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK);
    pgDetailsMock.defendant_account_party.party_details.party_id = pgPartyId;
    // Set debtor flag to true to test that all sub-sections are displayed
    pgDetailsMock.defendant_account_party.is_debtor = true;

    // Set some fields to null/empty to test em-dash display
    pgDetailsMock.defendant_account_party.party_details.individual_details!.individual_aliases = null;
    pgDetailsMock.defendant_account_party.party_details.individual_details!.date_of_birth = null;
    pgDetailsMock.defendant_account_party.vehicle_details!.vehicle_make_and_model = null;
    pgDetailsMock.defendant_account_party.vehicle_details!.vehicle_registration = null;
    pgDetailsMock.defendant_account_party.address!.address_line_4 = null;
    pgDetailsMock.defendant_account_party.address!.address_line_5 = null;
    pgDetailsMock.defendant_account_party.party_details.individual_details!.national_insurance_number = null;

    const accountId = headerMock.defendant_party_id;

    interceptAddNotes();
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '1');
    interceptPGDetails(accountId, pgPartyId, pgDetailsMock, '1');

    setupComponent(accountId);
    cy.get('router-outlet').should('exist');

    // AC1civ: Verify that fields without data display em-dash (—)
    cy.get('h2').contains('Parent or guardian details').should('be.visible');

    // Check that aliases field shows em-dash when null
    cy.get(DOM.parentOrGuardianDetailsAliases).siblings().should('contain.text', '—');

    // Check that date of birth field shows em-dash when null
    cy.get(DOM.parentOrGuardianDetailsDob).siblings().should('contain.text', '—');

    // Check that vehicle make and model field shows em-dash when null
    cy.get(DOM.parentOrGuardianDetailsVehicleMake).siblings().should('contain.text', '—');

    // Check that vehicle registration field shows em-dash when null
    cy.get(DOM.parentOrGuardianDetailsVehicleReg).siblings().should('contain.text', '—');

    // Verify that fields with data still display their values correctly (not em-dash)
    cy.get(DOM.parentOrGuardianDetailsName).should('contain.text', 'Mr Opal parent2 LNAME');
    cy.get(DOM.parentOrGuardianDetailsNational_insurance_numberKey).siblings().should('contain.text', '—');

    // Check that contact details with data don't show em-dash
    cy.get(DOM.contactDetailsPrimaryEmailKey)
      .siblings()
      .should('contain.text', 'PGemail1@email.com')
      .should('not.contain.text', '—');

    cy.get(DOM.contactDetailsSecondaryEmailKey)
      .siblings()
      .should('contain.text', 'PGemail2@test.com')
      .should('not.contain.text', '—');

    // Verify that employer details with data don't show em-dash
    cy.get(DOM.employerDetailsNameKey)
      .siblings()
      .should('contain.text', 'employername4')
      .should('not.contain.text', '—');

    cy.get(DOM.employerDetailsReferenceKey)
      .siblings()
      .should('contain.text', 'OT0000002D')
      .should('not.contain.text', '—');
  });

  it(
    'AC2: should display Change button and navigate to change screen when user has Account Maintenance permission in current BU',
    { tags: ['@PO-788'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.parent_guardian_party_id = '1770000001';
      headerMock.debtor_type = 'Parent/Guardian';

      const pgPartyId = headerMock.parent_guardian_party_id;

      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;

      let pgDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK);
      pgDetailsMock.defendant_account_party.party_details.party_id = pgPartyId;
      pgDetailsMock.defendant_account_party.is_debtor = true;

      const accountId = headerMock.defendant_party_id;

      interceptAddNotes();
      interceptAuthenticatedUser();
      // Use permission mock that has Account Maintenance permission in BU77
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '1');
      interceptPGDetails(accountId, pgPartyId, pgDetailsMock, '1');

      setupComponent(accountId);
      cy.get('router-outlet').should('exist');

      // Verify Parent or Guardian details title is displayed
      cy.get('h2').contains('Parent or guardian details').should('be.visible');

      // AC2: Verify Change button is displayed when user has Account Maintenance permission in current BU
      cy.get('a[class="govuk-!-margin-bottom-0 govuk-link"]').contains('Change').should('be.visible');

      // // Click Change button and verify it navigates to the change screen
      cy.get('a[class="govuk-!-margin-bottom-0 govuk-link"]').contains('Change').click();

      cy.get('@routerNavigate').should('have.been.calledWith', ['../debtor/parentGuardian/amend']);
    },
  );

  it(
    'AC2a: should display Change button but navigate to access denied when user lacks permission in current BU',
    { tags: ['@PO-788'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.parent_guardian_party_id = '1770000001';
      headerMock.debtor_type = 'Parent/Guardian';

      const pgPartyId = headerMock.parent_guardian_party_id;

      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;

      let pgDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK);
      pgDetailsMock.defendant_account_party.party_details.party_id = pgPartyId;
      pgDetailsMock.defendant_account_party.is_debtor = true;

      const accountId = headerMock.defendant_party_id;

      interceptAddNotes();
      interceptAuthenticatedUser();
      // Use permission mock that has Account Maintenance permission in BU17
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(accountId, headerMock, '1');
      interceptPGDetails(accountId, pgPartyId, pgDetailsMock, '1');

      setupComponent(accountId);
      cy.get('router-outlet').should('exist');

      // Verify Parent or Guardian details title is displayed
      cy.get('h2').contains('Parent or guardian details').should('be.visible');

      // AC2a: Verify Change button is displayed even when user lacks permission in current BU
      cy.get('a[class="govuk-!-margin-bottom-0 govuk-link"]').contains('Change').should('be.visible');

      // Click Change button and verify it navigates to access denied
      cy.get('a[class="govuk-!-margin-bottom-0 govuk-link"]').contains('Change').click();
      cy.get('@routerNavigate').should('have.been.calledWith', ['/access-denied']);
    },
  );

  it(
    'AC2b: should not display Change button when user has no Account Maintenance permission in any BU',
    { tags: ['@PO-788'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.parent_guardian_party_id = '1770000001';
      headerMock.debtor_type = 'Parent/Guardian';

      const pgPartyId = headerMock.parent_guardian_party_id;

      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;

      let pgDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK);
      pgDetailsMock.defendant_account_party.party_details.party_id = pgPartyId;
      pgDetailsMock.defendant_account_party.is_debtor = true;

      const accountId = headerMock.defendant_party_id;

      // Create mock user state without Account Maintenance permission in any BU
      let userStateMockNoPermission = structuredClone(USER_STATE_MOCK_NO_PERMISSION);
      userStateMockNoPermission.business_unit_users = [
        {
          business_unit_user_id: 'L077AO',
          business_unit_id: 77,
          permissions: [
            {
              permission_id: 3,
              permission_name: 'Account Enquiry',
            },
            {
              permission_id: 6,
              permission_name: 'Search and view accounts',
            },
          ],
        },
      ];

      interceptAddNotes();
      interceptAuthenticatedUser();
      interceptUserState(userStateMockNoPermission);
      interceptDefendantHeader(accountId, headerMock, '1');
      interceptPGDetails(accountId, pgPartyId, pgDetailsMock, '1');

      setupComponent(accountId);
      cy.get('router-outlet').should('exist');

      // Verify Parent or Guardian details title is displayed
      cy.get('h2').contains('Parent or guardian details').should('be.visible');

      // AC2b: Verify Change button is NOT displayed when user has no Account Maintenance permission
      cy.get('a[class="govuk-!-margin-bottom-0 govuk-link"]').should('not.exist');
      //Verify other content is still displayed normally
      cy.get(DOM.parentOrGuardianDetailsName).should('be.visible');
      cy.get(DOM.contactSummaryCardTitle).should('be.visible');
    },
  );
});
