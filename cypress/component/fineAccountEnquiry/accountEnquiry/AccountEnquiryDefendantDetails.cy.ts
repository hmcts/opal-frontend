import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as HEADER } from '../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { DEFENDANT_DETAILS } from '../../../shared/selectors/account-enquiry/account.enquiry.defendant-details.locators';

import {
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../CommonIntercepts/CommonUserState.mocks';
import { mount } from 'cypress/angular';

import { interceptDefendantHeader, interceptDefendantDetails } from './intercept/defendantAccountIntercepts';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { setLanguagePref } from './Utils/SharedFunctions';
import { FinesAccDefendantDetailsDefendantTabComponent } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details-defendant-tab/fines-acc-defendant-details-defendant-tab.component';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];
type DefendantDetailsMock = typeof OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK;

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
    '../individual/amend',
    '../company/amend',
    '../parentGuardian/amend',
    // Add more routes here as needed
  ],
};

describe('Account Enquiry Defendant Details Tab', () => {
  const mountDefendantTab = ({
    defendantDetailsMock,
    hasAccountMaintenencePermission = false,
    canAddParentOrGuardianDetails = false,
  }: {
    defendantDetailsMock: DefendantDetailsMock;
    hasAccountMaintenencePermission?: boolean;
    canAddParentOrGuardianDetails?: boolean;
  }) => {
    mount(FinesAccDefendantDetailsDefendantTabComponent, {
      componentProperties: {
        tabData: defendantDetailsMock,
        hasAccountMaintenencePermission,
        canAddParentOrGuardianDetails,
      },
    });
  };

  // it.skip('example test setup', { tags: [...buildTags('@JIRA-STORY:PO-784')] }, () => {
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

  it(
    'AC1a, AC1b, AC1d. Defendant details tab layout, debtor flag true',
    { tags: [...buildTags('@JIRA-STORY:PO-784'), '@JIRA-EPIC:PO-976'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      const accountId = headerMock.defendant_account_party_id;
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
      cy.get(DEFENDANT_DETAILS.detailsTitle).should('exist').and('contain.text', 'Defendant details');
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
      cy.get(DEFENDANT_DETAILS.vehicle).should('exist').and('contain.text', 'Ford Focus');
      cy.get(DEFENDANT_DETAILS.vehicleReg).should('exist').and('contain.text', 'XY21 ABC');

      cy.get(DEFENDANT_DETAILS.primaryEmail).should('exist').and('contain.text', 'sarah.thompson@example.com');
      cy.get(DEFENDANT_DETAILS.secondaryEmail).should('exist').and('contain.text', 'sarah.t@example.com');
      cy.get(DEFENDANT_DETAILS.mobilePhone).should('exist').and('contain.text', '07123 456789');
      cy.get(DEFENDANT_DETAILS.homePhone).should('exist').and('contain.text', '01234 567890');
      cy.get(DEFENDANT_DETAILS.workPhone).should('exist').and('contain.text', '09876 543210');

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
    },
  );

  it(
    'AC1a, AC1c, AC1d. Defendant details tab layout, debtor flag false',
    { tags: [...buildTags('@JIRA-STORY:PO-784', '@JIRA-STORY:PO-2365'), '@JIRA-EPIC:PO-976'] },
    () => {
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
      defendantDetailsMock.defendant_account_party.is_debtor = false;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);

      mountDefendantTab({ defendantDetailsMock });

      cy.get(DEFENDANT_DETAILS.detailsTitle).should('exist').and('contain.text', 'Defendant details');
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
      cy.get(DEFENDANT_DETAILS.vehicle).should('not.exist');
      cy.get(DEFENDANT_DETAILS.vehicleReg).should('not.exist');
      cy.get('h2').contains('Contact details').should('not.exist');
      cy.get('h2').contains('Employer details').should('not.exist');
    },
  );

  it(
    'AC1div. Should display em-dash for blank row',
    { tags: [...buildTags('@JIRA-STORY:PO-784'), '@JIRA-EPIC:PO-976'] },
    () => {
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      defendantDetailsMock.defendant_account_party.contact_details!.secondary_email_address = null;
      defendantDetailsMock.defendant_account_party.employer_details!.employer_telephone_number = null;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);

      mountDefendantTab({ defendantDetailsMock });

      cy.get(DEFENDANT_DETAILS.secondaryEmail).should('exist').and('contain.text', '—');
      cy.get(DEFENDANT_DETAILS.defendantEmployerPhone).should('exist').and('contain.text', '—');
    },
  );

  it(
    'AC1bi. Should display language preferences sub-section when applicable',
    { tags: [...buildTags('@JIRA-STORY:PO-784'), '@JIRA-EPIC:PO-976'] },
    () => {
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      setLanguagePref(language_preferences!.document_language_preference, 'CY', 'Welsh and English');
      setLanguagePref(language_preferences!.hearing_language_preference, 'CY', 'Welsh and English');

      mountDefendantTab({ defendantDetailsMock });

      cy.get(DEFENDANT_DETAILS.documentLanguage).should('exist').and('contain.text', 'Welsh and English');
      cy.get(DEFENDANT_DETAILS.courtHearingLanguage).should('exist').and('contain.text', 'Welsh and English');
    },
  );

  it(
    'AC2. Account maintenance permission true, BU associated with account',
    { tags: [...buildTags('@JIRA-STORY:PO-784'), '@JIRA-EPIC:PO-976'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      const accountId = headerMock.defendant_account_party_id;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, accountId);
      interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

      cy.get(DEFENDANT_DETAILS.defendantChange).should('exist').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../party/individual/amend']);
    },
  );

  it(
    'AC2a. Account maintenance permission true, BU not associated with account',
    { tags: [...buildTags('@JIRA-STORY:PO-784'), '@JIRA-EPIC:PO-976'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      const accountId = headerMock.defendant_account_party_id;
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

  it(
    'AC2b. Account maintenance permission false',
    { tags: [...buildTags('@JIRA-STORY:PO-784'), '@JIRA-EPIC:PO-976'] },
    () => {
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);

      mountDefendantTab({ defendantDetailsMock });

      cy.get(DEFENDANT_DETAILS.defendantChange).should('not.exist');
    },
  );

  it(
    'Company - Defendant details tab layout',
    { tags: [...buildTags('@JIRA-STORY:PO-790'), '@JIRA-EPIC:PO-976'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      const accountId = headerMock.defendant_account_party_id;
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
      cy.get(DEFENDANT_DETAILS.detailsTitle).should('exist').and('contain.text', 'Company details');
      cy.get(DEFENDANT_DETAILS.companyName).should('exist').and('contain.text', 'Acme Corporation');
      cy.get(DEFENDANT_DETAILS.companyAlias).should('exist').and('contain.text', 'Acme Corp');
      cy.get(DEFENDANT_DETAILS.companyAddress)
        .should('exist')
        .invoke('text')
        .then((text) => {
          expect(text.trim().replace(/\s+/g, ' ')).to.eq('45 High Street Flat 2B AB1 2CD');
        });
      cy.get(DEFENDANT_DETAILS.vehicle).should('exist').and('contain.text', 'Ford Focus');
      cy.get(DEFENDANT_DETAILS.vehicleReg).should('exist').and('contain.text', 'XY21 ABC');

      cy.get(DEFENDANT_DETAILS.primaryEmail).should('exist').and('contain.text', 'sarah.thompson@example.com');
      cy.get(DEFENDANT_DETAILS.secondaryEmail).should('exist').and('contain.text', 'sarah.t@example.com');
      cy.get(DEFENDANT_DETAILS.mobilePhone).should('exist').and('contain.text', '07123 456789');
      cy.get(DEFENDANT_DETAILS.homePhone).should('exist').and('contain.text', '01234 567890');
      cy.get(DEFENDANT_DETAILS.workPhone).should('exist').and('contain.text', '09876 543210');
    },
  );

  it(
    'AC1ciii. Company - Should display em-dash for blank row',
    { tags: [...buildTags('@JIRA-STORY:PO-790'), '@JIRA-EPIC:PO-976'] },
    () => {
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      defendantDetailsMock.defendant_account_party.contact_details!.secondary_email_address = null;
      defendantDetailsMock.defendant_account_party.employer_details!.employer_telephone_number = null;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);

      mountDefendantTab({ defendantDetailsMock });

      cy.get(DEFENDANT_DETAILS.secondaryEmail).should('exist').and('contain.text', '—');
    },
  );

  it(
    'AC1b. Company - Should display language preferences sub-section when applicable',
    { tags: [...buildTags('@JIRA-STORY:PO-790'), '@JIRA-EPIC:PO-976'] },
    () => {
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      setLanguagePref(language_preferences!.document_language_preference, 'CY', 'Welsh and English');
      setLanguagePref(language_preferences!.hearing_language_preference, 'CY', 'Welsh and English');

      mountDefendantTab({ defendantDetailsMock });

      cy.get(DEFENDANT_DETAILS.documentLanguage).should('exist').and('contain.text', 'Welsh and English');
      cy.get(DEFENDANT_DETAILS.courtHearingLanguage).should('exist').and('contain.text', 'Welsh and English');
    },
  );

  it(
    'AC2. Company - Account maintenance permission true, BU associated with account',
    { tags: [...buildTags('@JIRA-STORY:PO-790'), '@JIRA-EPIC:PO-976'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      const accountId = headerMock.defendant_account_party_id;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, accountId);
      interceptDefendantDetails(accountId, defendantDetailsMock, accountId);
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });

      cy.get(DEFENDANT_DETAILS.defendantChange).should('exist').click();
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../party/company/amend']);
    },
  );

  it(
    'AC2a. Company - Account maintenance permission true, BU not associated with account',
    { tags: [...buildTags('@JIRA-STORY:PO-790'), '@JIRA-EPIC:PO-976'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      const accountId = headerMock.defendant_account_party_id;
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

  it(
    'AC2b. Company - Account maintenance permission false',
    { tags: [...buildTags('@JIRA-STORY:PO-790'), '@JIRA-EPIC:PO-976'] },
    () => {
      let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = true;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      const { language_preferences } = defendantDetailsMock.defendant_account_party;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);

      mountDefendantTab({ defendantDetailsMock });

      cy.get(DEFENDANT_DETAILS.defendantChange).should('not.exist');
    },
  );

  it(
    'AC1, AC1a, AC1b. Youth-only accounts show the Add parent or guardian details action',
    { tags: [...buildTags('@JIRA-STORY:PO-1874'), '@JIRA-EPIC:PO-1875'] },
    () => {
      const defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      const { language_preferences } = defendantDetailsMock.defendant_account_party;

      defendantDetailsMock.defendant_account_party.party_details.organisation_flag = false;
      defendantDetailsMock.defendant_account_party.is_debtor = true;
      setLanguagePref(language_preferences!.document_language_preference);
      setLanguagePref(language_preferences!.hearing_language_preference);

      mountDefendantTab({
        defendantDetailsMock,
        canAddParentOrGuardianDetails: true,
      });

      cy.contains(DEFENDANT_DETAILS.linkText, 'Add parent or guardian details').should('be.visible');
    },
  );

  it(
    'AC2. Non youth-only accounts do not show the Add parent or guardian details action',
    { tags: [...buildTags('@JIRA-STORY:PO-1874'), '@JIRA-EPIC:PO-1875'] },
    () => {
      const adultDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      setLanguagePref(adultDetailsMock.defendant_account_party.language_preferences!.document_language_preference);
      setLanguagePref(adultDetailsMock.defendant_account_party.language_preferences!.hearing_language_preference);

      mountDefendantTab({ defendantDetailsMock: adultDetailsMock });
      cy.contains(DEFENDANT_DETAILS.linkText, 'Add parent or guardian details').should('not.exist');

      const companyDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
      companyDetailsMock.defendant_account_party.party_details.organisation_flag = true;
      setLanguagePref(companyDetailsMock.defendant_account_party.language_preferences!.document_language_preference);
      setLanguagePref(companyDetailsMock.defendant_account_party.language_preferences!.hearing_language_preference);

      mountDefendantTab({ defendantDetailsMock: companyDetailsMock });
      cy.contains(DEFENDANT_DETAILS.linkText, 'Add parent or guardian details').should('not.exist');
    },
  );
});
