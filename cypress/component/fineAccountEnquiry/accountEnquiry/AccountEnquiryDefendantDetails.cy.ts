import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import {
  DEFENDANT_HEADER_MOCK,
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from './mocks/defendant_details_mock';
import { interceptDefendantHeader, interceptDefendantDetails } from './intercept/defendantAccountIntercepts';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as HEADER } from './constants/account_enquiry_header_elements';
import { DEFENDANT_DETAILS } from './constants/defendant_details_elements';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { setLanguagePref } from './Utils/SharedFunctions';

/**
 * Local implementation of setLanguagePref to avoid injection context errors
 */
// const setLanguagePref = (langPref: any, code: string = 'EN', displayName: string = 'English') => {
//   if (langPref) {
//     langPref.language_code = code;
//     langPref.language_display_name = displayName;
//   }
// };

const componentProperties: IComponentProperties = {
  accountId: '77',
  fragments: 'defendant',
  interceptedRoutes: [
    '/access-denied',
    '../note/add',
    '../debtor/individual/amend',
    '../debtor/company/amend',
    '../debtor/parentGuardian/amend',
    // Add more routes here as needed
  ],
};

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
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);

    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(HEADER.pageHeader).should('exist');
    cy.get(HEADER.headingWithCaption).should('exist');
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
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = false;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(HEADER.pageHeader).should('exist');
    cy.get(HEADER.headingWithCaption).should('exist');
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
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    defendantDetailsMock.defendant_account_party.contact_details!.secondary_email_address = null;
    defendantDetailsMock.defendant_account_party.employer_details!.employer_telephone_number = null;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.defendantSecondaryEmail).should('exist').and('contain.text', '—');
    cy.get(DEFENDANT_DETAILS.defendantEmployerPhone).should('exist').and('contain.text', '—');
  });

  it('AC1bi. Should display language preferences sub-section when applicable', { tags: ['PO-784'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference, 'CY', 'Welsh and English');
    setLanguagePref(language_preferences!.hearing_language_preference, 'CY', 'Welsh and English');
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.documentLanguage).should('exist').and('contain.text', 'Welsh and English');
    cy.get(DEFENDANT_DETAILS.courtHearingLanguage).should('exist').and('contain.text', 'Welsh and English');
  });

  it('AC2. Account maintenance permission true, BU associated with account', { tags: ['PO-784'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.defendantChange).should('exist').click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../debtor/individual/amend']);
  });

  it('AC2a. Account maintenance permission true, BU not associated with account', { tags: ['PO-784'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.defendantChange).should('exist').click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['/access-denied']);
  });

  it('AC2b. Account maintenance permission false', { tags: ['PO-784'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.defendantChange).should('not.exist');
  });

  it('Company - Defendant details tab layout', { tags: ['PO-790'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(HEADER.pageHeader).should('exist');
    cy.get(HEADER.headingWithCaption).should('exist');
    cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
    cy.get(DEFENDANT_DETAILS.companyTitle).should('exist').and('contain.text', 'Company details');
    cy.get(DEFENDANT_DETAILS.companyName).should('exist').and('contain.text', 'Acme Corporation');
    cy.get(DEFENDANT_DETAILS.companyAlias).should('exist').and('contain.text', 'Acme Corp');
    cy.get(DEFENDANT_DETAILS.companyAddress)
      .should('exist')
      .invoke('text')
      .then((text) => {
        expect(text.trim().replace(/\s+/g, ' ')).to.eq('45 High Street Flat 2B AB1 2CD');
      });
    cy.get(DEFENDANT_DETAILS.companyVehicle).should('exist').and('contain.text', 'Ford Focus');
    cy.get(DEFENDANT_DETAILS.companyVehicleReg).should('exist').and('contain.text', 'XY21 ABC');

    cy.get(DEFENDANT_DETAILS.companyPrimaryEmail).should('exist').and('contain.text', 'sarah.thompson@example.com');
    cy.get(DEFENDANT_DETAILS.companySecondaryEmail).should('exist').and('contain.text', 'sarah.t@example.com');
    cy.get(DEFENDANT_DETAILS.companyMobilePhone).should('exist').and('contain.text', '07123 456789');
    cy.get(DEFENDANT_DETAILS.companyHomePhone).should('exist').and('contain.text', '01234 567890');
    cy.get(DEFENDANT_DETAILS.companyWorkPhone).should('exist').and('contain.text', '09876 543210');
  });

  it('AC1ciii. Company - Should display em-dash for blank row', { tags: ['PO-790'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    defendantDetailsMock.defendant_account_party.contact_details!.secondary_email_address = null;
    defendantDetailsMock.defendant_account_party.employer_details!.employer_telephone_number = null;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.defendantSecondaryEmail).should('exist').and('contain.text', '—');
  });

  it('AC1b. Company - Should display language preferences sub-section when applicable', { tags: ['PO-790'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference, 'CY', 'Welsh and English');
    setLanguagePref(language_preferences!.hearing_language_preference, 'CY', 'Welsh and English');
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.documentLanguage).should('exist').and('contain.text', 'Welsh and English');
    cy.get(DEFENDANT_DETAILS.courtHearingLanguage).should('exist').and('contain.text', 'Welsh and English');
  });

  it('AC2. Company - Account maintenance permission true, BU associated with account', { tags: ['PO-790'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.defendantChange).should('exist').click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../debtor/company/amend']);
  });

  it(
    'AC2a. Company - Account maintenance permission true, BU not associated with account',
    { tags: ['PO-790'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      const accountId = headerMock.defendant_party_id;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(accountId, headerMock, accountId);
      interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

      cy.get(DEFENDANT_DETAILS.defendantChange).should('exist').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['/access-denied']);
    },
  );

  it('AC2b. Company - Account maintenance permission false', { tags: ['PO-790'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
    let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
    defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
    defendantDetailsMock.defendant_account_party.is_debtor = true;
    const { language_preferences } = defendantDetailsMock.defendant_account_party;
    const accountId = headerMock.defendant_party_id;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
    interceptDefendantHeader(accountId, headerMock, accountId);
    interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

    cy.get(DEFENDANT_DETAILS.defendantChange).should('not.exist');
  });
});
