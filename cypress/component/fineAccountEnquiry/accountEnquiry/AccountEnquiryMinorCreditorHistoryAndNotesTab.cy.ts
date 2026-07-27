import { provideRouter } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';
import { mount } from 'cypress/angular';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import { ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_ELEMENTS as HISTORY_AND_NOTES_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.history-and-notes.locators';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from 'src/app/flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from 'src/app/flows/fines/fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-details/fines-acc-minor-creditor-details-history-and-notes-tab/fines-acc-minor-creditor-details-history-and-notes-table/fines-acc-minor-creditor-details-history-and-notes-table.component';
import {
  interceptMinorCreditorHeader,
  interceptMinorCreditorHistoryAndNotes,
  interceptMinorCreditorHistoryAndNotesSequence,
} from './intercept/defendantAccountIntercepts';
import {
  ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_AMOUNT_ACCESSIBILITY_MOCK,
  ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_DATE_SORTING_MOCK,
  ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_EDGE_CASE_RENDERING_MOCK,
  ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_EMPTY_RESULTS_MOCK,
  ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_FILTERED_NOTES_MOCK,
  ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK,
  ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_LARGE_RESULTS_MOCK,
  ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSFORMED_DETAILS_MOCK,
} from './mocks/minor_creditor_history_and_notes_table_content.mock';
import { createMinorCreditorHeaderMock, MINOR_CREDITOR_ACCOUNT_ID } from './mocks/minor_creditor_at_a_glance.mock';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const MINOR_CREDITOR_HISTORY_STORY_TAG = '@JIRA-STORY:PO-2640';
const MINOR_CREDITOR_HISTORY_EPIC_TAG = '@JIRA-EPIC:PO-2653';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

const componentProperties: IComponentProperties = {
  accountId: MINOR_CREDITOR_ACCOUNT_ID.toString(),
  routeRoot: 'minor-creditor',
  fragments: 'history-and-notes',
  interceptedRoutes: ['/access-denied'],
};

const normaliseText = (value: string): string => value.replace(/\s+/g, ' ').trim();

const setupMinorCreditorHistoryAndNotesScreenWithTabData = (
  tabData: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData,
) => {
  const header = createMinorCreditorHeaderMock();
  const accountId = header.creditor.account_id;

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptMinorCreditorHeader(accountId, header, '123');
  interceptMinorCreditorHistoryAndNotes(accountId, tabData, '123');

  setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId.toString() });
  cy.get('router-outlet').should('exist');
};

const setupMinorCreditorHistoryAndNotesScreenWithTabDataSequence = (
  tabDataResponses: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData[],
) => {
  const header = createMinorCreditorHeaderMock();
  const accountId = header.creditor.account_id;

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptMinorCreditorHeader(accountId, header, '123');
  interceptMinorCreditorHistoryAndNotesSequence(accountId, tabDataResponses, '123');

  setupAccountEnquiryComponent({ ...componentProperties, accountId: accountId.toString() });
  cy.get('router-outlet').should('exist');
};

const mountMinorCreditorHistoryTable = (tabData: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData) => {
  return mount(FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent, {
    providers: [provideRouter([])],
    componentProperties: {
      tabData,
    },
  });
};

describe('Minor Creditor Account Enquiry - History and notes tab', () => {
  it(
    'AC1. sends the initial unfiltered history request and renders the returned table rows',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK),
      );

      cy.wait('@getHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain(`/minor-creditor-accounts/${MINOR_CREDITOR_ACCOUNT_ID}/history`);
        expect(request.query['dateFrom']).to.be.undefined;
        expect(request.query['dateTo']).to.be.undefined;
        expect(request.query['itemTypes']).to.be.undefined;
        expect(response?.statusCode).to.equal(200);
      });

      cy.get(HISTORY_AND_NOTES_TAB.pageHeader).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.accountInfo).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.summaryMetricBar).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.tabName).should('contain.text', 'History and notes');
      cy.get(HISTORY_AND_NOTES_TAB.tabHeading).should('contain.text', 'History and notes');
      cy.get(HISTORY_AND_NOTES_TAB.tableRows).should('have.length', 2);
      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell).should('contain.text', 'Finance officer');
      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).should('contain.text', 'Payment received');
      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell).should('contain.text', 'Minor creditor account note');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).should('be.visible');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).should('be.visible');
      cy.get(HISTORY_AND_NOTES_TAB.categoriesFieldset).should('be.visible');
      cy.get(HISTORY_AND_NOTES_TAB.amendmentsCheckbox).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.financialCheckbox).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.enforcementActionsCheckbox).should('not.exist');
      cy.get(HISTORY_AND_NOTES_TAB.paymentTermsCheckbox).should('not.exist');
    },
  );

  it(
    'AC2. maps a Date from filter to the expected query parameter and keeps the value visible',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain(`/minor-creditor-accounts/${MINOR_CREDITOR_ACCOUNT_ID}/history`);
        expect(request.query['dateFrom']).to.equal('2024-01-01');
        expect(request.query['dateTo']).to.be.undefined;
        expect(request.query['itemTypes']).to.be.undefined;
      });
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).should('have.value', '01/01/2024');
    },
  );

  it(
    'AC2. maps a Date to filter to the expected query parameter and keeps the value visible',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear().type('31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain(`/minor-creditor-accounts/${MINOR_CREDITOR_ACCOUNT_ID}/history`);
        expect(request.query['dateFrom']).to.be.undefined;
        expect(request.query['dateTo']).to.equal('2024-01-31');
        expect(request.query['itemTypes']).to.be.undefined;
      });
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).should('have.value', '31/01/2024');
    },
  );

  it(
    'AC2. sends date range and category itemTypes when filters are applied',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabDataSequence([
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_FILTERED_NOTES_MOCK),
      ]);

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).clear().type('31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain(`/minor-creditor-accounts/${MINOR_CREDITOR_ACCOUNT_ID}/history`);
        expect(request.query['dateFrom']).to.equal('2024-01-01');
        expect(request.query['dateTo']).to.equal('2024-01-31');
        expect(request.query['itemTypes']).to.equal('note');
        expect(response?.body).to.deep.equal(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_FILTERED_NOTES_MOCK);
      });

      cy.get(HISTORY_AND_NOTES_TAB.tableRows).should('have.length', 1);
      cy.get(HISTORY_AND_NOTES_TAB.firstTypeCell).should('contain.text', 'Notes');
      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).should('contain.text', 'Filtered minor creditor note.');
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).should('have.value', '01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.dateToInput).should('have.value', '31/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).should('be.checked');
    },
  );

  it(
    'AC2. maps multiple selected categories to the expected comma-separated itemTypes value',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.amendmentsCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.financialCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes').then(({ request }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain(`/minor-creditor-accounts/${MINOR_CREDITOR_ACCOUNT_ID}/history`);
        expect(request.query['dateFrom']).to.be.undefined;
        expect(request.query['dateTo']).to.be.undefined;
        expect(request.query['itemTypes']).to.equal('amendment,note,financial');
      });
    },
  );

  it(
    'AC2. shows the standard no-results state while keeping selected filters visible',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabDataSequence([
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK),
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_EMPTY_RESULTS_MOCK),
      ]);

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.filterSummaryText).should('contain.text', 'Show filter').click();
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).clear().type('01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).check();
      cy.get(HISTORY_AND_NOTES_TAB.filterButton).click();

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.noResultsMessage).should('contain.text', 'No results found.');
      cy.get(HISTORY_AND_NOTES_TAB.tableRows).should('not.exist');
      cy.get(HISTORY_AND_NOTES_TAB.filterDetails).should('be.visible');
      cy.get(HISTORY_AND_NOTES_TAB.dateFromInput).should('have.value', '01/01/2024');
      cy.get(HISTORY_AND_NOTES_TAB.notesCheckbox).should('be.checked');
    },
  );

  it(
    'AC1. displays LTZ-formatted dates and sorts newest first using millisecond timestamps',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_DATE_SORTING_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.table).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings).contains('th', 'Date').should('have.attr', 'aria-sort', 'descending');
      cy.get(HISTORY_AND_NOTES_TAB.firstDateCell).should('contain.text', '12 Mar 2025');
      cy.get(HISTORY_AND_NOTES_TAB.secondDateCell).should('contain.text', '12 Mar 2025');
      cy.get(HISTORY_AND_NOTES_TAB.thirdDateCell).should('contain.text', '11 Mar 2025');
      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).should('contain.text', 'Newest same-day note');
      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell).should('contain.text', 'Older same-day note');
      cy.get(HISTORY_AND_NOTES_TAB.thirdDetailsCell).should('contain.text', 'Oldest day note');
    },
  );

  it(
    'AC1. toggles Date sorting using the underlying timestamp rather than the displayed date text',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_DATE_SORTING_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.dateHeaderButton).click();
      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings).contains('th', 'Date').should('have.attr', 'aria-sort', 'ascending');
      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).should('contain.text', 'Oldest day note');
      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell).should('contain.text', 'Older same-day note');
      cy.get(HISTORY_AND_NOTES_TAB.thirdDetailsCell).should('contain.text', 'Newest same-day note');

      cy.get(HISTORY_AND_NOTES_TAB.dateHeaderButton).click();
      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings).contains('th', 'Date').should('have.attr', 'aria-sort', 'descending');
      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).should('contain.text', 'Newest same-day note');
      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell).should('contain.text', 'Older same-day note');
      cy.get(HISTORY_AND_NOTES_TAB.thirdDetailsCell).should('contain.text', 'Oldest day note');
    },
  );

  it(
    'AC3. renders the read-only table columns with no inline editing or action controls',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.tableHeadings)
        .find('th')
        .then(($headers) => {
          const headers = [...$headers].map((header) => normaliseText(header.textContent ?? ''));
          expect(headers).to.deep.equal(['Date', 'User', 'Type', 'Details', 'Amount']);
        });

      cy.get(HISTORY_AND_NOTES_TAB.tableRows).should('have.length', 2);
      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell)
        .closest('tr')
        .within(() => {
          cy.get('input, select, textarea, button').should('not.exist');
        });
      cy.get(HISTORY_AND_NOTES_TAB.tableRows).find('a, button, input, select, textarea').should('not.exist');
    },
  );

  it(
    'AC4 and AC7. renders details fragments with pipes, hyphens, bold link text, line2, and account link events',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      mountMinorCreditorHistoryTable(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSFORMED_DETAILS_MOCK),
      ).then(({ component }) => {
        cy.spy(component, 'handleHistoryLinkClicked').as('historyLinkClicked');
      });
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.get(HISTORY_AND_NOTES_TAB.firstDetailsCell).within(() => {
        cy.get('div')
          .first()
          .invoke('text')
          .then((text) => {
            const normalized = normaliseText(text);
            expect(normalized).to.equal('Repayment | Defendant account: - 2500000BV');
            expect(normalized).not.to.match(/^\|/);
            expect(normalized).not.to.match(/\|$/);
          });
        cy.get(HISTORY_AND_NOTES_TAB.detailsLine2).should('contain.text', 'Additional repayment note');
        cy.get('a')
          .should('have.length', 1)
          .and('have.class', 'govuk-link')
          .and('contain.text', '2500000BV')
          .find('strong')
          .should('contain.text', '2500000BV');
      });

      cy.get(HISTORY_AND_NOTES_TAB.secondDetailsCell).within(() => {
        cy.get('a, button').should('not.exist');
        cy.get('.govuk-link').should('not.exist');
        cy.get(HISTORY_AND_NOTES_TAB.detailsLine2).should('not.exist');
        cy.root()
          .invoke('text')
          .then((text) => {
            const normalized = normaliseText(text);
            expect(normalized).to.equal('Plain note part 1 | Plain note part 2');
            expect(normalized).not.to.match(/^\|/);
            expect(normalized).not.to.match(/\|$/);
          });
      });

      cy.get(HISTORY_AND_NOTES_TAB.detailsLinks).click();
      const expectedAccountUrl = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.children.defendant}/123123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;

      cy.get('@historyLinkClicked').should('have.been.calledWithMatch', {
        emit: '123123',
        rowId: 'history-and-notes-row-0',
        type: 'account',
      });
      cy.get('@windowOpen').should('have.been.calledOnceWith', expectedAccountUrl, '_blank');
    },
  );

  it(
    'AC5. renders representative minor creditor amendments, notes, financial details, and special characters',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_EDGE_CASE_RENDERING_MOCK),
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
            expect(normaliseText(text)).to.equal(
              'Template-like text: {section} <value> [optional] | pipe - hyphen "quote" & apostrophe',
            );
          });
        cy.get('script, style').should('not.exist');
      });

      cy.get(HISTORY_AND_NOTES_TAB.thirdDetailsCell)
        .invoke('text')
        .then((text) => {
          expect(normaliseText(text)).to.equal('BACS payment | Payment reference: BACS123');
        });
    },
  );

  it(
    'AC6. renders CR and DR amounts accessibly and keeps the visual tags non-focusable',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_AMOUNT_ACCESSIBILITY_MOCK),
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

  it(
    'AC8. renders several hundred history items in one scrollable table without pagination',
    { tags: buildTags(MINOR_CREDITOR_HISTORY_STORY_TAG, MINOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMinorCreditorHistoryAndNotesScreenWithTabData(
        structuredClone(ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_LARGE_RESULTS_MOCK),
      );

      cy.wait('@getHistoryAndNotes');

      cy.get(HISTORY_AND_NOTES_TAB.scrollPane).should('exist');
      cy.get(HISTORY_AND_NOTES_TAB.pagination).should('not.exist');
      cy.get(HISTORY_AND_NOTES_TAB.tableRows).should('have.length', 250);
      cy.get(HISTORY_AND_NOTES_TAB.firstUserCell).should('contain.text', 'Bulk user 250');
      cy.get('#history-and-notes-user-249').scrollIntoView().should('contain.text', 'Bulk user 1');
    },
  );
});
