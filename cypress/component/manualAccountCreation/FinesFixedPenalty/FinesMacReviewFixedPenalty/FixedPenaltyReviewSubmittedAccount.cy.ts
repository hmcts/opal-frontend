import { IFinesComponentProperties } from '../../setup/FinesComponent.interface';
import { FINES_MAC_ROUTING_PATHS } from 'src/app/flows/fines/fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { setupFinesMacComponent } from '../../setup/FinesComponent.setup';
import {
  interceptAuthenticatedUser,
  interceptBusinessUnitById,
  interceptOffences,
  interceptOffencesById,
  interceptRefDataForReviewAccount,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import { interceptGetDraftAccountById } from 'cypress/component/manualAccountCreation/setup/FineAccount.intercepts';
import { FIXED_PENALTY_AY_MOCK } from 'cypress/component/manualAccountCreation/FinesFixedPenalty/FinesMacReviewFixedPenalty/mocks/fixedPenalty.api.mock';
import { FIXED_PENALTY_DEFENDANT_MOCK } from 'cypress/component/manualAccountCreation/FinesFixedPenalty/FinesMacReviewFixedPenalty/mocks/fixedPenaltyDefendant.api.mock';
import { BUSINESS_UNIT_77_MOCK } from 'cypress/component/CommonIntercepts/CommonIntercept.mocks';
import { DOM_ELEMENTS } from './constants/fixed_penalty_review_submitted';

describe('Fixed Penalty - Review Account Details', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnitById(77, BUSINESS_UNIT_77_MOCK);
    interceptRefDataForReviewAccount(77);
    interceptOffences();
  });
  it(
    '(AC.1)should display submitted account details correctly for company in Review  ',
    { tags: ['@PO-1804 '] },
    () => {
      const draftAccountId = '1002';
      const props: IFinesComponentProperties = {
        draftAccountId: draftAccountId,
        fragments: undefined,
        componentUrl: `${FINES_MAC_ROUTING_PATHS.children.reviewAccount}/${draftAccountId}`,
        interceptedRoutes: [],
        isCheckerUser: true,
      };

      interceptGetDraftAccountById(draftAccountId, FIXED_PENALTY_AY_MOCK);
      interceptOffencesById(FIXED_PENALTY_AY_MOCK.account.offences[0].offence_id);

      setupFinesMacComponent(props);

      // Check the page heading for company
      cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'OPAL E TO E S SCENARIO eleven').and('be.visible');

      // Verify the sections are displayed in the correct order for company
      const expectedSections = [
        'Issuing authority and court details',
        'Company details',
        'Offence Details',
        'Account comments and notes',
      ];
      // Get all section headings and check they appear in order
      cy.get(DOM_ELEMENTS.summaryCardTitles).each(($el, index) => {
        cy.wrap($el).should('contain', expectedSections[index]);
      });
      // Section 1 - Account Details (No heading)
      cy.get(DOM_ELEMENTS.businessUnit).should('contain', 'Camberwell Green');
      cy.get(DOM_ELEMENTS.accountType).should('contain', 'Fixed Penalty');
      cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Company');

      // Section 2 - Issuing Authority and Court Details
      cy.get(DOM_ELEMENTS.issuingAuthority).should('exist').and('contain', "Avon & Somerset Magistrates' Court (5735)");
      cy.get(DOM_ELEMENTS.enforcementCourt).should('exist').and('contain', 'Camberwell Green Magistrates Court (104)');

      // Section 3 - Company Details
      cy.get(DOM_ELEMENTS.companyName).should('contain', 'OPAL E TO E S SCENARIO eleven');
      cy.get(DOM_ELEMENTS.companyAddress)
        .should('contain', 'addr1 10')
        .and('contain', 'addr2 10')
        .and('contain', 'addr3 10')
        .and('contain', 'TE1 3ST');

      // Section 4 - Offence Details (Company with vehicle data) - Match actual UI display
      cy.get(DOM_ELEMENTS.noticeNumber).should('contain', '101010');
      cy.get(DOM_ELEMENTS.offenceType).should('contain', 'Vehicle');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'REG1');
      cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', 'SMITH001010JO9MS');
      cy.get(DOM_ELEMENTS.noticeDate).should('contain', '01 August 2025');
      cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '01 August 2025');
      cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '11:35');
      cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', 'Camberwell Green');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£3002.00');

      // Section 5 - Account comments and notes
      cy.get(DOM_ELEMENTS.accountComment).should('contain', 'Scenario 10 account comment');
      cy.get(DOM_ELEMENTS.accountNote).should('contain', 'Scenario 10 account note');
    },
  );

  it(
    '(AC.1) should display submitted defendant account details correctly for individual defendant in Review',
    { tags: ['@PO-1804'] },
    () => {
      const draftAccountId = '1003';
      const props: IFinesComponentProperties = {
        draftAccountId: draftAccountId,
        fragments: undefined,
        componentUrl: `${FINES_MAC_ROUTING_PATHS.children.reviewAccount}/${draftAccountId}`,
        interceptedRoutes: [],
        isCheckerUser: true,
      };

      interceptGetDraftAccountById(draftAccountId, FIXED_PENALTY_DEFENDANT_MOCK);
      interceptOffencesById(FIXED_PENALTY_DEFENDANT_MOCK.account.offences[0].offence_id);

      setupFinesMacComponent(props);

      // Check the page heading for individual defendant
      cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'FakeFixed FAKELAST').and('be.visible');

      // Verify the sections are displayed in the correct order for individual defendant
      const expectedSections = [
        'Issuing authority and court details',
        'Personal details',
        'Offence Details',
        'Account comments and notes',
      ];
      // Get all section headings and check they appear in order
      cy.get(DOM_ELEMENTS.summaryCardTitles).each(($el, index) => {
        cy.wrap($el).should('contain', expectedSections[index]);
      });

      // Section 1 - Account Details (No heading)
      cy.get(DOM_ELEMENTS.businessUnit).should('contain', 'Camberwell Green');
      cy.get(DOM_ELEMENTS.accountType).should('contain', 'Fixed Penalty');
      cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Adult or youth only');

      // Section 2 - Issuing Authority and Court Details
      cy.get(DOM_ELEMENTS.issuingAuthority).should('exist');
      cy.get(DOM_ELEMENTS.enforcementCourt).should('exist').and('contain', 'Camberwell Green Magistrates Court (104)');

      // Section 3 - Personal Details
      cy.get(DOM_ELEMENTS.title).should('contain', 'Mr');
      cy.get(DOM_ELEMENTS.forenames).should('contain', 'FakeFixed');
      cy.get(DOM_ELEMENTS.surname).should('contain', 'FAKELAST');
      cy.get(DOM_ELEMENTS.dateOfBirth).should('contain', '02 November 2005 (Adult)');
      cy.get(DOM_ELEMENTS.address).should('contain', '63 Fake Street').and('contain', 'AB12FD');

      // Section 4 - Offence Details (Individual defendant with vehicle data)
      cy.get(DOM_ELEMENTS.noticeNumber).should('contain', '12344');
      cy.get(DOM_ELEMENTS.offenceType).should('contain', 'Vehicle');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'AB12CD');
      cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', 'ABCDE123456AA1B1');
      cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '06 November 2025');
      cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '10:15');
      cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', 'Fake Street');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£100.00');

      // Section 5 - Account comments and notes
      cy.get(DOM_ELEMENTS.accountComment).should('contain', 'Defendant scenario account comment');
      cy.get(DOM_ELEMENTS.accountNote).should('contain', 'Defendant scenario account note');
    },
  );

  it('(AC.1) should display "To review" defendant account details correctly', { tags: ['@PO-1804'] }, () => {
    const draftAccountId = '1004';
    const props: IFinesComponentProperties = {
      draftAccountId: draftAccountId,
      fragments: undefined,
      componentUrl: `${FINES_MAC_ROUTING_PATHS.children.reviewAccount}/${draftAccountId}`,
      interceptedRoutes: [],
      isCheckerUser: true,
    };

    // Override only the required fields for "To review" status
    const toReviewMock = {
      ...FIXED_PENALTY_DEFENDANT_MOCK,
      draft_account_id: 1004,
      account_status: 'To review',
      timeline_data: [
        {
          username: 'opal-test',
          status: 'To review',
          status_date: '2025-11-22',
          reason_text: 'Account requires review',
        },
      ],
      account: {
        ...FIXED_PENALTY_DEFENDANT_MOCK.account,
        account_notes: [
          { note_type: 'AC', account_note_text: 'To review scenario account comment', account_note_serial: 3 },
          { note_type: 'AA', account_note_text: 'To review scenario account note', account_note_serial: 2 },
        ],
      },
    };

    interceptGetDraftAccountById(draftAccountId, toReviewMock);
    interceptOffencesById(FIXED_PENALTY_DEFENDANT_MOCK.account.offences[0].offence_id);

    setupFinesMacComponent(props);

    // Check the page heading for individual defendant in "To review" status
    cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'FakeFixed FAKELAST').and('be.visible');

    // Verify the sections are displayed in the correct order for individual defendant
    const expectedSections = [
      'Issuing authority and court details',
      'Personal details',
      'Offence Details',
      'Account comments and notes',
    ];
    // Get all section headings and check they appear in order
    cy.get(DOM_ELEMENTS.summaryCardTitles).each(($el, index) => {
      cy.wrap($el).should('contain', expectedSections[index]);
    });

    // Section 1 - Account Details (No heading)
    cy.get(DOM_ELEMENTS.businessUnit).should('contain', 'Camberwell Green');
    cy.get(DOM_ELEMENTS.accountType).should('contain', 'Fixed Penalty');
    cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Adult or youth only');

    // Section 2 - Issuing Authority and Court Details
    cy.get(DOM_ELEMENTS.issuingAuthority).should('exist');
    cy.get(DOM_ELEMENTS.enforcementCourt).should('exist').and('contain', 'Camberwell Green Magistrates Court (104)');

    // Section 3 - Personal Details
    cy.get(DOM_ELEMENTS.title).should('contain', 'Mr');
    cy.get(DOM_ELEMENTS.forenames).should('contain', 'FakeFixed');
    cy.get(DOM_ELEMENTS.surname).should('contain', 'FAKELAST');
    cy.get(DOM_ELEMENTS.dateOfBirth).should('contain', '02 November 2005 (Adult)');
    cy.get(DOM_ELEMENTS.address).should('contain', '63 Fake Street').and('contain', 'AB12FD');

    // Section 4 - Offence Details (Individual defendant with vehicle data)
    cy.get(DOM_ELEMENTS.noticeNumber).should('contain', '12344');
    cy.get(DOM_ELEMENTS.offenceType).should('contain', 'Vehicle');
    cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'AB12CD');
    cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', 'ABCDE123456AA1B1');
    cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '06 November 2025');
    cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '10:15');
    cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', 'Fake Street');
    cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£100.00');

    // Section 5 - Account comments and notes
    cy.get(DOM_ELEMENTS.accountComment).should('contain', 'To review scenario account comment');
    cy.get(DOM_ELEMENTS.accountNote).should('contain', 'To review scenario account note');
  });

  it('(AC.1) should display "To review" company account details correctly', { tags: ['@PO-1804'] }, () => {
    const draftAccountId = '1005';
    const props: IFinesComponentProperties = {
      draftAccountId: draftAccountId,
      fragments: undefined,
      componentUrl: `${FINES_MAC_ROUTING_PATHS.children.reviewAccount}/${draftAccountId}`,
      interceptedRoutes: [],
      isCheckerUser: true,
    };

    // Override only the required fields for company "To review" status
    const toReviewCompanyMock = {
      ...FIXED_PENALTY_AY_MOCK,
      draft_account_id: 1005,
      account_status: 'To review',
      timeline_data: [
        {
          username: 'opal-test',
          status: 'To review',
          status_date: '2025-11-22',
          reason_text: 'Company account requires review',
        },
      ],
      account: {
        ...FIXED_PENALTY_AY_MOCK.account,
        account_notes: [
          { note_type: 'AC', account_note_text: 'Company to review scenario account comment', account_note_serial: 3 },
          { note_type: 'AA', account_note_text: 'Company to review scenario account note', account_note_serial: 2 },
        ],
      },
    };

    interceptGetDraftAccountById(draftAccountId, toReviewCompanyMock);
    interceptOffencesById(FIXED_PENALTY_AY_MOCK.account.offences[0].offence_id);

    setupFinesMacComponent(props);

    // Check the page heading for company in "To review" status
    cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'OPAL E TO E S SCENARIO eleven').and('be.visible');

    // Verify the sections are displayed in the correct order for company
    const expectedSections = [
      'Issuing authority and court details',
      'Company details',
      'Offence Details',
      'Account comments and notes',
    ];
    // Get all section headings and check they appear in order
    cy.get(DOM_ELEMENTS.summaryCardTitles).each(($el, index) => {
      cy.wrap($el).should('contain', expectedSections[index]);
    });

    // Section 1 - Account Details (No heading)
    cy.get(DOM_ELEMENTS.businessUnit).should('contain', 'Camberwell Green');
    cy.get(DOM_ELEMENTS.accountType).should('contain', 'Fixed Penalty');
    cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Company');

    // Section 2 - Issuing Authority and Court Details
    cy.get(DOM_ELEMENTS.issuingAuthority).should('exist').and('contain', "Avon & Somerset Magistrates' Court (5735)");
    cy.get(DOM_ELEMENTS.enforcementCourt).should('exist').and('contain', 'Camberwell Green Magistrates Court (104)');

    // Section 3 - Company Details
    cy.get(DOM_ELEMENTS.companyName).should('contain', 'OPAL E TO E S SCENARIO eleven');
    cy.get(DOM_ELEMENTS.companyAddress)
      .should('contain', 'addr1 10')
      .and('contain', 'addr2 10')
      .and('contain', 'addr3 10')
      .and('contain', 'TE1 3ST');

    // Section 4 - Offence Details (Company with vehicle data)
    cy.get(DOM_ELEMENTS.noticeNumber).should('contain', '101010');
    cy.get(DOM_ELEMENTS.offenceType).should('contain', 'Vehicle');
    cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'REG1');
    cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', 'SMITH001010JO9MS');
    cy.get(DOM_ELEMENTS.noticeDate).should('contain', '01 August 2025');
    cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '01 August 2025');
    cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '11:35');
    cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', 'Camberwell Green');
    cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£3002.00');

    // Section 5 - Account comments and notes
    cy.get(DOM_ELEMENTS.accountComment).should('contain', 'Company to review scenario account comment');
    cy.get(DOM_ELEMENTS.accountNote).should('contain', 'Company to review scenario account note');
  });
});
