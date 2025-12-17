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
import { FIXED_PENALTY_FAILED_DEFENDANT_MOCK } from 'cypress/component/manualAccountCreation/FinesFixedPenalty/FinesMacReviewFixedPenalty/mocks/fines_mac_failed_account_mock';
import { BUSINESS_UNIT_77_MOCK } from 'cypress/component/CommonIntercepts/CommonIntercept.mocks';
import { DOM_ELEMENTS } from './constants/fixed_penalty_review_submitted';
import { interceptCourtsByBU } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { FIXED_PENALTY_FAILED_DRAFT_COMPANY_MOCK } from '../../FinesFixedPenalty/FinesMacReviewFixedPenalty/mocks/fines_mac_failed_company_mock';
describe('Fixed Penalty failed- Review Account Details', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnitById(77, BUSINESS_UNIT_77_MOCK);
    interceptRefDataForReviewAccount(77);
    // ensure courts and LJAs are available for the BU used by the draft account
    interceptCourtsByBU(77);
    interceptOffences();
  });
  it(
    '(AC.1) should display failed defendant account details correctly for individual defendant in Review',
    { tags: ['@PO-1816'] },
    () => {
      const draftAccountId = '1003';
      const props: IFinesComponentProperties = {
        draftAccountId: draftAccountId,
        fragments: undefined,
        componentUrl: `${FINES_MAC_ROUTING_PATHS.children.reviewAccount}/${draftAccountId}`,
        interceptedRoutes: [],
        isCheckerUser: true,
      };

      interceptGetDraftAccountById(draftAccountId, FIXED_PENALTY_FAILED_DEFENDANT_MOCK);

      interceptOffencesById(FIXED_PENALTY_FAILED_DEFENDANT_MOCK.account.offences[0].offence_id);

      setupFinesMacComponent(props);

      // AC2b - Defendant name in bold
      cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'Mr Oliver GREEN').and('be.visible');
      // Verify the sections are displayed in the correct order (2e,AC4 a-f)
      // AC4a: Business Unit, Account Type, Defendant type (no heading)
      // AC4b: Issuing Authority and court details
      // AC4c: Personal Details
      // AC4e: Offence Details
      // AC4f: Comments and notes
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

      // Ac4b - Issuing Authority and court details - AC4b
      cy.get(DOM_ELEMENTS.issuingAuthority).should('exist').and('be.visible');
      cy.get(DOM_ELEMENTS.enforcementCourt).should('contain', 'Camberwell Green Magistrates Court (104)');

      // Ac4a - Account Details (No heading) - AC4a
      cy.get(DOM_ELEMENTS.businessUnit).should('contain', 'Camberwell Green');
      cy.get(DOM_ELEMENTS.accountType).should('contain', 'Fixed Penalty');
      cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Adult or youth only');

      // Ac4c- Personal Details - AC4c
      cy.get(DOM_ELEMENTS.title).should('contain', 'Mr');
      cy.get(DOM_ELEMENTS.forenames).should('contain', 'Oliver');
      cy.get(DOM_ELEMENTS.surname).should('contain', 'GREEN');
      cy.get(DOM_ELEMENTS.dateOfBirth).should('contain', '01 November 2004 (Adult)');
      cy.get(DOM_ELEMENTS.address).should('contain', 'Kempton Avenue').and('contain', 'UB34DF');

      // Ac4e - Offence Details (Individual defendant with vehicle data) - AC4e
      cy.get(DOM_ELEMENTS.noticeNumber).should('contain', '12345');
      cy.get(DOM_ELEMENTS.offenceType).should('contain', 'Vehicle');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'FV53TCO');
      cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', 'ABCDE123456AA1B1');
      cy.get(DOM_ELEMENTS.noticeDate).should('contain', '13 November 2025');
      cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '01 November 2025');
      cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '05:00');
      cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', 'William Street');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£2000.00');

      // Ac4f - Account comments and notes
      cy.get(DOM_ELEMENTS.accountComment).should('contain', 'Add comment');
      cy.get(DOM_ELEMENTS.accountNote).should('contain', 'Add Account Notes');

      // AC2a - Publish error banner
      cy.get(DOM_ELEMENTS.publishErrorBanner)
        .should('exist')
        .find('opal-lib-moj-alert-content-text')
        .should('have.text', 'There was a problem publishing this account. Please contact your line manager.');

      // AC2c - Red status label 'Failed'
      cy.get(DOM_ELEMENTS.statusLabel).should('exist').and('contain', 'Failed').and('have.class', 'govuk-tag--red');

      // AC2d - Review History section exists and has at least one entry
      cy.get('h2').contains('Review history').should('exist').and('be.visible');
      cy.get(DOM_ELEMENTS.reviewHistoryEntries).should('exist').and('be.visible').its('length').should('be.gte', 1);
    },
  );
  it(
    '(AC.1) should display failed defendant account details correctly for company defendant in Review',
    { tags: ['@PO-1816'] },
    () => {
      const draftAccountId = '1004';
      const props: IFinesComponentProperties = {
        draftAccountId: draftAccountId,
        fragments: undefined,
        componentUrl: `${FINES_MAC_ROUTING_PATHS.children.reviewAccount}/${draftAccountId}`,
        interceptedRoutes: [],
        isCheckerUser: true,
      };

      interceptGetDraftAccountById(draftAccountId, FIXED_PENALTY_FAILED_DRAFT_COMPANY_MOCK);
      interceptOffencesById((FIXED_PENALTY_FAILED_DRAFT_COMPANY_MOCK as any).account.offences[0].offence_id);

      setupFinesMacComponent(props);

      // AC2b - Defendant name in bold
      cy.get(DOM_ELEMENTS.pageHeading).should('contain', 'Argent Oak Solutions Ltd').and('be.visible');
      // Verify the sections are displayed in the correct order (AC2e,AC4 a-f)
      // AC4a: Business Unit, Account Type, Defendant type (no heading)
      // AC4b: Issuing Authority and court details
      // AC4c: Personal Details
      // AC4e: Offence Details
      // AC4f: Comments and notes
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
      // Issuing authority and enforcement court
      cy.get(DOM_ELEMENTS.issuingAuthority).should('exist').and('be.visible');
      cy.get(DOM_ELEMENTS.enforcementCourt).should('contain', 'Camberwell Green Magistrates Court (104)');

      // Account details and defendant type
      cy.get(DOM_ELEMENTS.businessUnit).should('contain', 'Camberwell Green');
      cy.get(DOM_ELEMENTS.accountType).should('contain', 'Fixed Penalty');
      cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Company');

      // Offence details exist
      cy.get(DOM_ELEMENTS.noticeNumber).should('exist').and('be.visible');
      cy.get(DOM_ELEMENTS.amountImposed).should('exist').and('be.visible');

      // Company details and specific offence assertions (added for company defendant checks)
      cy.get(DOM_ELEMENTS.address).should('contain', 'Fake company').and('contain', 'AB12CD');

      cy.get(DOM_ELEMENTS.noticeNumber).should('contain', '12345');
      cy.get(DOM_ELEMENTS.offenceType).should('contain', 'Vehicle');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'FV53RTO');
      cy.get(DOM_ELEMENTS.drivingLicenceNumber).should('contain', 'ABCDE123456AA1B1');
      cy.get(DOM_ELEMENTS.noticeDate).should('contain', '01 November 2025');
      cy.get(DOM_ELEMENTS.dateOfOffence).should('contain', '01 November 2025');
      cy.get(DOM_ELEMENTS.timeOfOffence).should('contain', '05:40');
      cy.get(DOM_ELEMENTS.placeOfOffence).should('contain', 'Fake Street');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£200.00');

      // Account comments and notes for company
      cy.get(DOM_ELEMENTS.accountComment).should('contain', 'Add Comment');
      cy.get(DOM_ELEMENTS.accountNote).should('contain', 'Add Account note');

      // AC2a - Publish error banner
      cy.get(DOM_ELEMENTS.publishErrorBanner)
        .should('exist')
        .and('contain', 'There was a problem publishing this account. Please contact your line manager.');

      // AC2c - Red status label 'Failed'
      cy.get(DOM_ELEMENTS.statusLabel).should('exist').and('contain', 'Failed').and('have.class', 'govuk-tag--red');

      // AC2d - Review History section exists and has at least one entry
      cy.get('h2').contains('Review history').should('exist').and('be.visible');
      cy.get(DOM_ELEMENTS.reviewHistoryEntries).its('length').should('be.gte', 1);
    },
  );
});
