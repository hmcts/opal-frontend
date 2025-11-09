import { interceptAuthenticatedUser, interceptUserState } from '../../CommonIntercepts/CommonIntercepts';
import {
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_ORG_MOCK,
  USER_STATE_MOCK_PERMISSION_BU77,
  createDefendantHeaderMockWithName,
} from './mocks/defendant_details_mock';
import { interceptDefendantHeader, interceptFixedPenaltyDetails } from './intercept/defendantAccountIntercepts';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-fixed-penalty.mock';
import {
  ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS,
  ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS as DOM,
} from './constants/account_enquiry_fixed_penalty_elements';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';

const componentProperties: IComponentProperties = {
  accountId: '77',
  fragments: 'fixed-penalty',
  interceptedRoutes: [
    '/access-denied',
    '../note/add',
    '../individual/amend',
    '../company/amend',
    // Add more routes here as needed
  ],
};
describe('Account Enquiry Fixed Penalty', () => {
  it(
    'AC1a: Adult/Youth only - Fixed Penalty details tab, vehicle fixed penalty, all fields shown',
    { tags: ['@PO-994', '@PO-1818'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      // TODO: Change to company for other tests, change above to add company name
      headerMock.debtor_type = 'individual';
      headerMock.account_type = 'Fixed Penalty';
      let fixedPenaltyDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK);
      fixedPenaltyDetailsMock.vehicle_fixed_penalty_flag = true;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptFixedPenaltyDetails(accountId, fixedPenaltyDetailsMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get('h3').contains('PCR or ticket number').should('be.visible').next().should('contain.text', '888');
      cy.get('h3').should('not.contain', 'PCR or case number');
      cy.get('h2').contains('Account type').should('be.visible').next().should('contain.text', 'Fixed Penalty');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.tabName).should('exist').and('contain.text', 'Fixed penalty');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.tableTitle)
        .should('exist')
        .and('contain.text', 'Fixed Penalty details');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelIssuingAuthority)
        .should('exist')
        .and('contain.text', 'City of Metropolis');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelTicketNumber).should('exist').and('contain.text', 'FP-123456');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelRegistrationNumber)
        .should('exist')
        .and('contain.text', 'XY21 ABC');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelDrivingLicence)
        .should('exist')
        .and('contain.text', 'LIC-789012');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeNumber).should('exist').and('contain.text', 'NT-345678');
      //cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeDate).should('exist').and('contain.text', '01/05/2023');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelTimeOfOffence).should('exist').and('contain.text', '14:30');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelPlaceOfOffence)
        .should('exist')
        .and('contain.text', 'Main Street, Metropolis');
    },
  );

  it(
    'AC1b: Adult/Youth only - Fixed Penalty details tab, non-vehicle fixed penalty, partial view',
    { tags: ['@PO-994'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.account_type = 'Fixed Penalty';
      let fixedPenaltyDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK);

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptFixedPenaltyDetails(accountId, fixedPenaltyDetailsMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.tableTitle)
        .should('exist')
        .and('contain.text', 'Fixed Penalty details');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelIssuingAuthority)
        .should('exist')
        .and('contain.text', 'City of Metropolis');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelTicketNumber).should('exist').and('contain.text', 'FP-123456');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelRegistrationNumber).should('not.exist');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelDrivingLicence).should('not.exist');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeNumber).should('not.exist');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeDate).should('not.exist');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelTimeOfOffence).should('exist').and('contain.text', '14:30');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelPlaceOfOffence)
        .should('exist')
        .and('contain.text', 'Main Street, Metropolis');
    },
  );

  it(
    'AC1c: Adult/Youth only - Fixed Penalty details tab, show em-dash for missing fields',
    { tags: ['@PO-994'] },
    () => {
      let headerMock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
      headerMock.debtor_type = 'individual';
      headerMock.account_type = 'Fixed Penalty';
      let fixedPenaltyDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK);
      fixedPenaltyDetailsMock.vehicle_fixed_penalty_flag = true;

      // Used to test null fields without errors
      const nullFields = fixedPenaltyDetailsMock.vehicle_fixed_penalty_details as any;
      nullFields.vehicle_registration_number = null;
      nullFields.vehicle_drivers_license = null;
      nullFields.notice_number = null;
      nullFields.date_notice_issued = null;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptFixedPenaltyDetails(accountId, fixedPenaltyDetailsMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.tableTitle)
        .should('exist')
        .and('contain.text', 'Fixed Penalty details');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelRegistrationNumber).should('exist').and('contain.text', '—');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelDrivingLicence).should('exist').and('contain.text', '—');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeNumber).should('exist').and('contain.text', '—');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeDate).should('exist').and('contain.text', '—');
    },
  );

  it(
    'AC2: Company - Fixed Penalty details tab, vehicle fixed penalty, all fields shown',
    { tags: ['@PO-994', '@PO-1818'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      // TODO: Change to company for other tests, change above to add company name
      //headerMock.debtor_type = 'company';
      headerMock.account_type = 'Fixed Penalty';
      let fixedPenaltyDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK);
      //headerMock.party_details.organisation_flag = true;
      fixedPenaltyDetailsMock.vehicle_fixed_penalty_flag = true;

      const accountId = headerMock.defendant_account_party_id;
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(accountId, headerMock, '123');
      interceptFixedPenaltyDetails(accountId, fixedPenaltyDetailsMock, '123');
      setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
      cy.get('router-outlet').should('exist');

      cy.get('h3').contains('PCR or ticket number').should('be.visible').next().should('contain.text', '888');
      cy.get('h3').should('not.contain', 'PCR or case number');
      cy.get('h2').contains('Account type').should('be.visible').next().should('contain.text', 'Fixed Penalty');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.tabName).should('exist').and('contain.text', 'Fixed penalty');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.tableTitle)
        .should('exist')
        .and('contain.text', 'Fixed Penalty details');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelIssuingAuthority)
        .should('exist')
        .and('contain.text', 'City of Metropolis');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelTicketNumber).should('exist').and('contain.text', 'FP-123456');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelRegistrationNumber)
        .should('exist')
        .and('contain.text', 'XY21 ABC');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelDrivingLicence)
        .should('exist')
        .and('contain.text', 'LIC-789012');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeNumber).should('exist').and('contain.text', 'NT-345678');
      //cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeDate).should('exist').and('contain.text', '01/05/2023');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelTimeOfOffence).should('exist').and('contain.text', '14:30');
      cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelPlaceOfOffence)
        .should('exist')
        .and('contain.text', 'Main Street, Metropolis');
    },
  );

  it('AC2: Company - Fixed Penalty details tab, non-vehicle fixed penalty, partial view', { tags: ['@PO-994'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
    // TODO: Change to company for other tests, change above to add company name
    //headerMock.debtor_type = 'company';
    headerMock.account_type = 'Fixed Penalty';
    let fixedPenaltyDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK);
    //headerMock.party_details.organisation_flag = true;

    const accountId = headerMock.defendant_account_party_id;
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptFixedPenaltyDetails(accountId, fixedPenaltyDetailsMock, '123');
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
    cy.get('router-outlet').should('exist');

    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.tableTitle)
      .should('exist')
      .and('contain.text', 'Fixed Penalty details');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelIssuingAuthority)
      .should('exist')
      .and('contain.text', 'City of Metropolis');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelTicketNumber).should('exist').and('contain.text', 'FP-123456');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelRegistrationNumber).should('not.exist');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelDrivingLicence).should('not.exist');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeNumber).should('not.exist');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeDate).should('not.exist');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelTimeOfOffence).should('exist').and('contain.text', '14:30');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelPlaceOfOffence)
      .should('exist')
      .and('contain.text', 'Main Street, Metropolis');
  });

  it('AC2: Company - Fixed Penalty details tab, show em-dash for missing fields', { tags: ['@PO-994'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
    // TODO: Change to company for other tests, change above to add company name
    //headerMock.debtor_type = 'company';
    headerMock.account_type = 'Fixed Penalty';
    let fixedPenaltyDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK);
    //headerMock.party_details.organisation_flag = true;
    fixedPenaltyDetailsMock.vehicle_fixed_penalty_flag = true;

    // Used to test null fields without errors
    const nullFields = fixedPenaltyDetailsMock.vehicle_fixed_penalty_details as any;
    nullFields.vehicle_registration_number = null;
    nullFields.vehicle_drivers_license = null;
    nullFields.notice_number = null;
    nullFields.date_notice_issued = null;

    const accountId = headerMock.defendant_account_party_id;
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptFixedPenaltyDetails(accountId, fixedPenaltyDetailsMock, '123');
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
    cy.get('router-outlet').should('exist');

    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.tableTitle)
      .should('exist')
      .and('contain.text', 'Fixed Penalty details');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelRegistrationNumber).should('exist').and('contain.text', '—');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelDrivingLicence).should('exist').and('contain.text', '—');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeNumber).should('exist').and('contain.text', '—');
    cy.get(ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS.labelNoticeDate).should('exist').and('contain.text', '—');
  });
});
