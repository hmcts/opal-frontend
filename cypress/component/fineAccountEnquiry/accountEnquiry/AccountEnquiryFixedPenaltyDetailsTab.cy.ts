import { interceptAuthenticatedUser, interceptUserState } from '../../CommonIntercepts/CommonIntercepts';
import { DEFENDANT_HEADER_ORG_MOCK, createDefendantHeaderMockWithName } from './mocks/defendant_details_mock';

import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';

import { interceptDefendantHeader, interceptFixedPenaltyDetails } from './intercept/defendantAccountIntercepts';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-fixed-penalty.mock';
import { ACCOUNT_ENQUIRY_FIXED_PENALTY_ELEMENTS as FIXED_PENALTY_TAB } from './constants/account_enquiry_fixed_penalty_elements';
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

      cy.contains(FIXED_PENALTY_TAB.headerLabel, 'PCR or ticket number')
        .should('be.visible')
        .next(FIXED_PENALTY_TAB.headerValue)
        .should('contain.text', headerMock.fixed_penalty_ticket_number);
      cy.get(FIXED_PENALTY_TAB.headerLabel).should('not.contain', 'PCR or case number');
      cy.contains(FIXED_PENALTY_TAB.headerLabel, 'Account type')
        .should('be.visible')
        .next(FIXED_PENALTY_TAB.headerValue)
        .should('contain.text', headerMock.account_type);
      cy.get(FIXED_PENALTY_TAB.tabName).should('exist').and('contain.text', 'Fixed penalty');
      cy.get(FIXED_PENALTY_TAB.tableTitle).should('exist').and('contain.text', 'Fixed Penalty details');
      cy.get(FIXED_PENALTY_TAB.labelIssuingAuthority).should('exist').and('contain.text', 'City of Metropolis');
      cy.get(FIXED_PENALTY_TAB.labelTicketNumber).should('exist').and('contain.text', 'FP-123456');
      cy.get(FIXED_PENALTY_TAB.labelRegistrationNumber).should('exist').and('contain.text', 'XY21 ABC');
      cy.get(FIXED_PENALTY_TAB.labelDrivingLicence).should('exist').and('contain.text', 'LIC-789012');
      cy.get(FIXED_PENALTY_TAB.labelNoticeNumber).should('exist').and('contain.text', 'NT-345678');
      cy.get(FIXED_PENALTY_TAB.labelNoticeDate).should('exist').and('contain.text', '01 May 2023');
      cy.get(FIXED_PENALTY_TAB.labelTimeOfOffence).should('exist').and('contain.text', '14:30');
      cy.get(FIXED_PENALTY_TAB.labelPlaceOfOffence).should('exist').and('contain.text', 'Main Street, Metropolis');
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

      cy.get(FIXED_PENALTY_TAB.tableTitle).should('exist').and('contain.text', 'Fixed Penalty details');
      cy.get(FIXED_PENALTY_TAB.labelIssuingAuthority).should('exist').and('contain.text', 'City of Metropolis');
      cy.get(FIXED_PENALTY_TAB.labelTicketNumber).should('exist').and('contain.text', 'FP-123456');
      cy.get(FIXED_PENALTY_TAB.labelRegistrationNumber).should('not.exist');
      cy.get(FIXED_PENALTY_TAB.labelDrivingLicence).should('not.exist');
      cy.get(FIXED_PENALTY_TAB.labelNoticeNumber).should('not.exist');
      cy.get(FIXED_PENALTY_TAB.labelNoticeDate).should('not.exist');
      cy.get(FIXED_PENALTY_TAB.labelTimeOfOffence).should('exist').and('contain.text', '14:30');
      cy.get(FIXED_PENALTY_TAB.labelPlaceOfOffence).should('exist').and('contain.text', 'Main Street, Metropolis');
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

      cy.get(FIXED_PENALTY_TAB.tableTitle).should('exist').and('contain.text', 'Fixed Penalty details');
      cy.get(FIXED_PENALTY_TAB.labelRegistrationNumber).should('exist').and('contain.text', '—');
      cy.get(FIXED_PENALTY_TAB.labelDrivingLicence).should('exist').and('contain.text', '—');
      cy.get(FIXED_PENALTY_TAB.labelNoticeNumber).should('exist').and('contain.text', '—');
      cy.get(FIXED_PENALTY_TAB.labelNoticeDate).should('exist').and('contain.text', '—');
    },
  );

  it(
    'AC2: Company - Fixed Penalty details tab, vehicle fixed penalty, all fields shown',
    { tags: ['@PO-994', '@PO-1818'] },
    () => {
      let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
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

      cy.contains(FIXED_PENALTY_TAB.headerLabel, 'PCR or ticket number')
        .should('be.visible')
        .next(FIXED_PENALTY_TAB.headerValue)
        .should('contain.text', headerMock.fixed_penalty_ticket_number);
      cy.get(FIXED_PENALTY_TAB.headerLabel).should('not.contain', 'PCR or case number');
      cy.contains(FIXED_PENALTY_TAB.headerLabel, 'Account type')
        .should('be.visible')
        .next(FIXED_PENALTY_TAB.headerValue)
        .should('contain.text', headerMock.account_type);
      cy.get(FIXED_PENALTY_TAB.tabName).should('exist').and('contain.text', 'Fixed penalty');
      cy.get(FIXED_PENALTY_TAB.tableTitle).should('exist').and('contain.text', 'Fixed Penalty details');
      cy.get(FIXED_PENALTY_TAB.labelIssuingAuthority).should('exist').and('contain.text', 'City of Metropolis');
      cy.get(FIXED_PENALTY_TAB.labelTicketNumber).should('exist').and('contain.text', 'FP-123456');
      cy.get(FIXED_PENALTY_TAB.labelRegistrationNumber).should('exist').and('contain.text', 'XY21 ABC');
      cy.get(FIXED_PENALTY_TAB.labelDrivingLicence).should('exist').and('contain.text', 'LIC-789012');
      cy.get(FIXED_PENALTY_TAB.labelNoticeNumber).should('exist').and('contain.text', 'NT-345678');
      cy.get(FIXED_PENALTY_TAB.labelNoticeDate).should('exist').and('contain.text', '01 May 2023');
      cy.get(FIXED_PENALTY_TAB.labelTimeOfOffence).should('exist').and('contain.text', '14:30');
      cy.get(FIXED_PENALTY_TAB.labelPlaceOfOffence).should('exist').and('contain.text', 'Main Street, Metropolis');
    },
  );

  it('AC2: Company - Fixed Penalty details tab, non-vehicle fixed penalty, partial view', { tags: ['@PO-994'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
    headerMock.account_type = 'Fixed Penalty';
    let fixedPenaltyDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_FIXED_PENALTY_MOCK);

    const accountId = headerMock.defendant_account_party_id;
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptFixedPenaltyDetails(accountId, fixedPenaltyDetailsMock, '123');
    setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId });
    cy.get('router-outlet').should('exist');

    cy.get(FIXED_PENALTY_TAB.tableTitle).should('exist').and('contain.text', 'Fixed Penalty details');
    cy.get(FIXED_PENALTY_TAB.labelIssuingAuthority).should('exist').and('contain.text', 'City of Metropolis');
    cy.get(FIXED_PENALTY_TAB.labelTicketNumber).should('exist').and('contain.text', 'FP-123456');
    cy.get(FIXED_PENALTY_TAB.labelRegistrationNumber).should('not.exist');
    cy.get(FIXED_PENALTY_TAB.labelDrivingLicence).should('not.exist');
    cy.get(FIXED_PENALTY_TAB.labelNoticeNumber).should('not.exist');
    cy.get(FIXED_PENALTY_TAB.labelNoticeDate).should('not.exist');
    cy.get(FIXED_PENALTY_TAB.labelTimeOfOffence).should('exist').and('contain.text', '14:30');
    cy.get(FIXED_PENALTY_TAB.labelPlaceOfOffence).should('exist').and('contain.text', 'Main Street, Metropolis');
  });

  it('AC2: Company - Fixed Penalty details tab, show em-dash for missing fields', { tags: ['@PO-994'] }, () => {
    let headerMock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
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

    cy.get(FIXED_PENALTY_TAB.tableTitle).should('exist').and('contain.text', 'Fixed Penalty details');
    cy.get(FIXED_PENALTY_TAB.labelRegistrationNumber).should('exist').and('contain.text', '—');
    cy.get(FIXED_PENALTY_TAB.labelDrivingLicence).should('exist').and('contain.text', '—');
    cy.get(FIXED_PENALTY_TAB.labelNoticeNumber).should('exist').and('contain.text', '—');
    cy.get(FIXED_PENALTY_TAB.labelNoticeDate).should('exist').and('contain.text', '—');
  });
});
