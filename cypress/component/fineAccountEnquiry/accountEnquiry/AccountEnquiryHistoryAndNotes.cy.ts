import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_ELEMENTS as HISTORY_AND_NOTES_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.history-and-notes.locators';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import { interceptDefendantHeader, interceptHistoryAndNotes } from './intercept/defendantAccountIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Account Enquiry History and notes', () => {
  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'history-and-notes',
    interceptedRoutes: ['/access-denied'],
  };

  const setupHistoryAndNotesScreen = (headerMock: typeof DEFENDANT_HEADER_MOCK) => {
    const accountId = headerMock.defendant_account_party_id;

    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptHistoryAndNotes(
      accountId,
      OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
      '123',
    );

    setupAccountEnquiryComponent({ ...componentProperties, accountId });
    cy.get('router-outlet').should('exist');
  };

  it('AC2a. will render the history and notes tab shell with the current filter controls', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8303'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.get(HISTORY_AND_NOTES_TAB.pageHeader).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.headingWithCaption).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.headingName).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.accountInfo).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.summaryMetricBar).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.tabName).should('exist').and('contain.text', 'History and notes');
      cy.get(HISTORY_AND_NOTES_TAB.tabHeading).should('contain.text', 'History and notes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).should('be.visible');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).should('be.visible');
      cy.get(HISTORY_AND_NOTES_TAB.categoriesFieldset).should('be.visible');
      cy.get(HISTORY_AND_NOTES_TAB.amendmentsCheckbox).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.enforcementActionsCheckbox).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.financialCheckbox).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.paymentTermsCheckbox).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).should('be.visible').and('contain.text', 'Filter');
    });

  it('AC2a. should send an initial unfiltered history request when the history and notes tab loads', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8304'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain('/defendant-accounts/77/history');
        expect(request.query['dateFrom']).to.be.undefined;
        expect(request.query['dateTo']).to.be.undefined;
        expect(request.query['itemTypes']).to.be.undefined;

        expect(response?.statusCode).to.equal(200);
        expect(response?.body).to.deep.equal(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
      });
    });

  it('AC2b. should send dateFrom and dateTo query params when both dates are entered and Filter is selected', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8305'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear().type('31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain('/defendant-accounts/77/history');
        expect(request.query['dateFrom']).to.equal('2024-01-01');
        expect(request.query['dateTo']).to.equal('2024-01-31');
        expect(request.query['itemTypes']).to.be.undefined;

        expect(response?.statusCode).to.equal(200);
        expect(response?.body).to.deep.equal(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
      });
    });

  it('AC2b. should omit dateTo when Date to is left blank and Filter is selected', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8306'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear();
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain('/defendant-accounts/77/history');
        expect(request.query['dateFrom']).to.equal('2024-01-01');
        expect(request.query['dateTo']).to.be.undefined;
        expect(request.query['itemTypes']).to.be.undefined;

        expect(response?.statusCode).to.equal(200);
        expect(response?.body).to.deep.equal(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
      });
    });

  it('AC2b. should omit dateFrom when Date to is left blank and Filter is selected', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8307'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear();
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain('/defendant-accounts/77/history');
        expect(request.query['dateFrom']).to.be.undefined;
        expect(request.query['dateTo']).to.equal('2024-01-01');
        expect(request.query['itemTypes']).to.be.undefined;

        expect(response?.statusCode).to.equal(200);
        expect(response?.body).to.deep.equal(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
      });
    });

  it('AC2b. should show an error and not send a filtered request when Date from is later than Date to', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8308'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.get(HISTORY_AND_NOTES_TAB.errorSummary)
        .should('be.visible')
        .and('contain.text', 'There is a problem')
        .and('contain.text', 'Date from must be the same as or earlier than Date to');
      cy.get(HISTORY_AND_NOTES_TAB.dateToErrorMessage)
        .should('be.visible')
        .and('contain.text', 'Date from must be the same as or earlier than Date to');

      cy.get('@getHistoryAndNotes.all').should('have.length', 1);
    });

  it('AC2c. should send itemTypes when a single category is selected and Filter is selected', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8309'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.amendmentsCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain('/defendant-accounts/77/history');
        expect(request.query['dateFrom']).to.be.undefined;
        expect(request.query['dateTo']).to.be.undefined;
        expect(request.query['itemTypes']).to.equal('amendment');

        expect(response?.statusCode).to.equal(200);
        expect(response?.body).to.deep.equal(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
      });
    });

  it('AC2c. should send a comma-separated itemTypes list when all categories are selected and Filter is selected', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8310'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.amendmentsCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.enforcementActionsCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.financialCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.paymentTermsCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain('/defendant-accounts/77/history');
        expect(request.query['dateFrom']).to.be.undefined;
        expect(request.query['dateTo']).to.be.undefined;
        expect(request.query['itemTypes']).to.equal('amendment,enforcement,financial,note,paymentTerm');

        expect(response?.statusCode).to.equal(200);
        expect(response?.body).to.deep.equal(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
      });
    });

  it('AC2d. should not send a filtered request when filter values are changed without selecting Filter', { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8311'] }, () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear().type('31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).check();

      cy.get('@getHistoryAndNotes.all').should('have.length', 1);
    });
});
