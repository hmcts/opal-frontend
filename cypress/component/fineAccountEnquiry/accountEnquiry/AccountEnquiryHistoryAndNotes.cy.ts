import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_ELEMENTS as HISTORY_AND_NOTES_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.history-and-notes.locators';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from 'src/app/flows/fines/fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from 'src/app/flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import {
  interceptDefendantHeader,
  interceptHistoryAndNotes,
  interceptHistoryAndNotesSequence,
} from './intercept/defendantAccountIntercepts';
import {
  ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_AMOUNT_ACCESSIBILITY_MOCK,
  ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DATE_SORTING_MOCK,
  ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DETAILS_RENDERING_MOCK,
  ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_EDGE_CASE_RENDERING_MOCK,
  ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_EMPTY_RESULTS_MOCK,
  ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_LARGE_RESULTS_MOCK,
  ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_TABLE_CONTENT_MOCK,
} from './mocks/history_and_notes_table_content.mock';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

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

  const setupHistoryAndNotesScreenWithTabData = (
    headerMock: typeof DEFENDANT_HEADER_MOCK,
    tabData: typeof OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
  ) => {
    const accountId = headerMock.defendant_account_party_id;

    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptHistoryAndNotes(accountId, tabData, '123');

    setupAccountEnquiryComponent({ ...componentProperties, accountId });
    cy.get('router-outlet').should('exist');
  };

  const setupHistoryAndNotesScreenWithTabDataSequence = (
    headerMock: typeof DEFENDANT_HEADER_MOCK,
    tabDataResponses: (typeof OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK)[],
  ) => {
    const accountId = headerMock.defendant_account_party_id;

    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptHistoryAndNotesSequence(accountId, tabDataResponses, '123');

    setupAccountEnquiryComponent({ ...componentProperties, accountId });
    cy.get('router-outlet').should('exist');
  };

  const normaliseText = (value: string): string => value.replace(/\s+/g, ' ').trim();

  it(
    'AC2a. will render the history and notes tab shell with the current filter controls',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8303'] },
    () => {
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
    },
  );

  it(
    'AC2a. should send an initial unfiltered history request when the history and notes tab loads',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8304'] },
    () => {
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
    },
  );

  it(
    'AC2b. should send dateFrom and dateTo query params when both dates are entered and Filter is selected',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8305'] },
    () => {
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
    },
  );

  it(
    'AC2b. should omit dateTo when Date to is left blank and Filter is selected',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8306'] },
    () => {
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
    },
  );

  it(
    'AC2b. should omit dateFrom when Date to is left blank and Filter is selected',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8307'] },
    () => {
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
    },
  );

  it(
    'AC2b. should show an error and not send a filtered request when Date from is later than Date to',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8308'] },
    () => {
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
    },
  );

  it(
    'AC2c. should send itemTypes when a single category is selected and Filter is selected',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8309'] },
    () => {
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
    },
  );

  it(
    'AC2c. should send a comma-separated itemTypes list when all categories are selected and Filter is selected',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8310'] },
    () => {
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
    },
  );

  it(
    'AC2d. should not send a filtered request when filter values are changed without selecting Filter',
    { tags: [...buildTags('@JIRA-STORY:PO-2633', '@JIRA-EPIC:PO-2621'), '@JIRA-TEST-KEY:PO-8311'] },
    () => {
      setupHistoryAndNotesScreen(structuredClone(DEFENDANT_HEADER_MOCK));

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear().type('31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).check();

      cy.get('@getHistoryAndNotes.all').should('have.length', 1);
    },
  );

  it(
    'AC1a-AC1d. should treat API dates as UTC RFC3339 timestamps, display them as LTZ dates, and default sort newest first using milliseconds',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DATE_SORTING_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.table).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings).contains('th', 'Date').should('have.attr', 'aria-sort', 'descending');

      cy.get(HISTORY_AND_NOTES_TAB.firstDateCell).should('contain.text', '12 Mar 2025');
      cy.get(HISTORY_AND_NOTES_TAB.secondDateCell).should('contain.text', '12 Mar 2025');
      cy.get(HISTORY_AND_NOTES_TAB.thirdDateCell).should('contain.text', '11 Mar 2025');

      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell).should('contain.text', 'Newest milliseconds user');
      cy.get(HISTORY_AND_NOTES_TAB.secondUserCell).should('contain.text', 'Older milliseconds user');
      cy.get(HISTORY_AND_NOTES_TAB.thirdUserCell).should('contain.text', 'Oldest day user');
    },
  );

  it(
    'AC1e. should toggle the Date column sort direction using the timestamp sort key',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DATE_SORTING_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings).contains('th', 'Date').should('have.attr', 'aria-sort', 'descending');
      cy.get(HISTORY_AND_NOTES_TAB.dateHeaderButton).click();
      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings).contains('th', 'Date').should('have.attr', 'aria-sort', 'ascending');

      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell).should('contain.text', 'Oldest day user');
      cy.get(HISTORY_AND_NOTES_TAB.secondUserCell).should('contain.text', 'Older milliseconds user');
      cy.get(HISTORY_AND_NOTES_TAB.thirdUserCell).should('contain.text', 'Newest milliseconds user');

      cy.get(HISTORY_AND_NOTES_TAB.dateHeaderButton).click();
      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings).contains('th', 'Date').should('have.attr', 'aria-sort', 'descending');

      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell).should('contain.text', 'Newest milliseconds user');
      cy.get(HISTORY_AND_NOTES_TAB.secondUserCell).should('contain.text', 'Older milliseconds user');
      cy.get(HISTORY_AND_NOTES_TAB.thirdUserCell).should('contain.text', 'Oldest day user');
    },
  );

  it(
    'AC2a. should render the read-only history table columns with no inline editing actions',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_TABLE_CONTENT_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings)
        .find('th')
        .then(($headers) => {
          const headers = [...$headers].map((header) => header.textContent?.replace(/\s+/g, ' ').trim() ?? '');
          expect(headers).to.deep.equal(['Date', 'User', 'Type', 'Details', 'Amount']);
        });

      cy.get(HISTORY_AND_NOTES_TAB.tableRows).should('have.length', 2);
      cy.get(HISTORY_AND_NOTES_TAB.firstDateCell).should('contain.text', '12 Mar 2025');
      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell).should('contain.text', 'Finance officer');
      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell)
        .closest('tr')
        .within(() => {
          cy.get('input, select, textarea').should('not.exist');
          cy.get('button').should('not.exist');
        });
      cy.get(HISTORY_AND_NOTES_TAB.detailsLinks).should('have.length', 1).and('contain.text', '2500000BV');
    },
  );

  it(
    'AC2b. should render several hundred history items in a single scrollable table with no pagination controls',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_LARGE_RESULTS_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.scrollPane).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.pagination).should('not.exist');
      cy.get(HISTORY_AND_NOTES_TAB.tableRows).should('have.length', 250);
      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell).should('contain.text', 'Bulk user 250');
      cy.get('#history-and-notes-user-249').scrollIntoView().should('contain.text', 'Bulk user 1');
    },
  );

  it(
    'AC2c. should show the standard no results message and keep filter values visible after an empty filtered response',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabDataSequence(structuredClone(DEFENDANT_HEADER_MOCK), [
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_TABLE_CONTENT_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_EMPTY_RESULTS_MOCK),
      ]);

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear().type('31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.noResultsMessage).should('contain.text', 'No results found.');
      cy.get(HISTORY_AND_NOTES_TAB.tableRows).should('not.exist');
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).should('have.value', '01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).should('have.value', '31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).should('be.checked');
    },
  );

  it(
    'AC3b, AC3c, AC3d, AC3e, AC3f. should render details fragments with pipes, hyphens, bold text, links, and line2 on a new line',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DETAILS_RENDERING_MOCK),
      );

      cy.wait('@getHistoryAndNotes');
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).within(() => {
        cy.root()
          .invoke('text')
          .then((text) => {
            const normalized = normaliseText(text);
            expect(normalized).to.contain('REW | Hearing: - 23/10/2025 - Brent magistrates court Case: 2500000');
            expect(normalized).not.to.contain('REW | |');
            expect(normalized).not.to.contain('| Summoned to give cause for non payment');
          });
        cy.get(HISTORY_AND_NOTES_TAB.detailsLine2)
          .should('exist')
          .invoke('text')
          .then((text) => {
            expect(normaliseText(text)).to.equal('Summoned to give cause for non payment');
          });
      });

      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell).within(() => {
        cy.get('a').should('have.length', 1).and('contain.text', '2500000BV');
      });

      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell).find('a').click();
      const expectedAccountUrl = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.children.defendant}/123123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;
      cy.get('@windowOpen').should('have.been.calledWith', expectedAccountUrl, '_blank');

      cy.get(HISTORY_AND_NOTES_TAB.thirdDetailsCell).within(() => {
        cy.root()
          .invoke('text')
          .then((text) => {
            expect(normaliseText(text)).to.equal('First name | Old: John | New: Johnny');
          });
        cy.get('strong').should('have.length', 3);
        cy.get('strong').eq(0).should('contain.text', 'First name');
        cy.get('strong').eq(1).should('contain.text', 'John');
        cy.get('strong').eq(2).should('contain.text', 'Johnny');
      });
    },
  );

  it(
    'AC3 edge cases. should render large amendment values and literal special characters without breaking the details output',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_EDGE_CASE_RENDERING_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).within(() => {
        cy.root()
          .invoke('text')
          .then((text) => {
            expect(normaliseText(text)).to.equal('Payment terms amount | Old: £100.00 | New: £9999999999.99');
          });
        cy.get('strong').eq(0).should('contain.text', 'Payment terms amount');
        cy.get('strong').eq(1).should('contain.text', '£100.00');
        cy.get('strong').eq(2).should('contain.text', '£9999999999.99');
      });

      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell).within(() => {
        cy.root()
          .invoke('text')
          .then((text) => {
            const normalized = normaliseText(text);
            expect(normalized).to.contain(
              `BWTD | Hearing: - 23/10/2025 - Brent & Harrow <Magistrates> "Court" Case: Case 'A' & B`,
            );
          });
        cy.get(HISTORY_AND_NOTES_TAB.detailsLine2)
          .should('exist')
          .invoke('text')
          .then((text) => {
            expect(normaliseText(text)).to.equal(`Defendant said "can't pay" & requested <review>`);
          });
      });
    },
  );

  it(
    'AC4a. should open account-linked details fragments in a new browser tab using the emitted account identifier',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DETAILS_RENDERING_MOCK),
      );

      cy.wait('@getHistoryAndNotes');
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      const expectedAccountUrl = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.children.defendant}/123123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;

      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell)
        .find('a')
        .should('have.length', 1)
        .and('contain.text', '2500000BV')
        .click();

      cy.get('@windowOpen').should('have.been.calledOnceWith', expectedAccountUrl, '_blank');
    },
  );

  it(
    'AC4b. should render non-linked details fragments as non-interactive text with no link or button styling',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DETAILS_RENDERING_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).within(() => {
        cy.get('a, button').should('not.exist');
        cy.get('.govuk-link').should('not.exist');
      });

      cy.get(HISTORY_AND_NOTES_TAB.thirdDetailsCell).within(() => {
        cy.get('a, button').should('not.exist');
        cy.get('.govuk-link').should('not.exist');
      });
    },
  );

  it(
    'AC5a, AC5b, AC5c. should render CR/DR amounts accessibly and keep tags non-focusable',
    { tags: [...buildTags('@JIRA-STORY:PO-2635', '@JIRA-EPIC:PO-2621')] },
    () => {
      setupHistoryAndNotesScreenWithTabData(
        structuredClone(DEFENDANT_HEADER_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_AMOUNT_ACCESSIBILITY_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.firstAmountCell).within(() => {
        cy.root().should('contain.text', '£50.00').and('contain.text', 'CR').and('contain.text', 'credited');
        cy.get('strong')
          .should('have.class', 'govuk-tag')
          .and('have.class', 'govuk-tag--green')
          .and('contain.text', 'CR')
          .and('have.attr', 'aria-describedby');
        cy.get('strong').should('not.have.attr', 'tabindex');
        cy.get('a, button, input, select, textarea').should('not.exist');
        cy.get('.govuk-visually-hidden').should('contain.text', 'credited');
      });

      cy.get(HISTORY_AND_NOTES_TAB.secondAmountCell).within(() => {
        cy.root().should('contain.text', '£25.00').and('contain.text', 'DR').and('contain.text', 'debited');
        cy.get('strong')
          .should('have.class', 'govuk-tag')
          .and('have.class', 'govuk-tag--red')
          .and('contain.text', 'DR')
          .and('have.attr', 'aria-describedby');
        cy.get('strong').should('not.have.attr', 'tabindex');
        cy.get('a, button, input, select, textarea').should('not.exist');
        cy.get('.govuk-visually-hidden').should('contain.text', 'debited');
      });

      cy.get(HISTORY_AND_NOTES_TAB.thirdAmountCell)
        .invoke('text')
        .then((text) => {
          expect(normaliseText(text)).to.eq('—');
        });
      cy.get(HISTORY_AND_NOTES_TAB.thirdAmountCell).within(() => {
        cy.get('strong').should('not.exist');
        cy.get('.govuk-visually-hidden').should('not.exist');
      });
    },
  );
});
