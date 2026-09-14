import { provideRouter } from '@angular/router';
import { mount } from 'cypress/angular';
import { ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_ELEMENTS as HISTORY } from '../../../../shared/selectors/account-enquiry/account.enquiry.history-and-notes.locators';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../../CommonIntercepts/CommonUserState.mocks';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-major-creditor-details/mocks/fines-acc-major-creditor-details-header.mock';
import { FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent } from 'src/app/flows/fines/fines-acc/fines-acc-major-creditor-details/fines-acc-major-creditor-details-history-and-notes-tab/fines-acc-major-creditor-details-history-and-notes-table/fines-acc-major-creditor-details-history-and-notes-table.component';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import {
  interceptMajorCreditorHeader,
  interceptMajorCreditorHistoryAndNotes,
} from './intercept/defendantAccountIntercepts';
import { IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.interface';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from 'src/app/flows/fines/fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from 'src/app/flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const MAJOR_CREDITOR_HISTORY_STORY_TAG = '@JIRA-STORY:PO-2658';
const MAJOR_CREDITOR_HISTORY_EPIC_TAG = '@JIRA-EPIC:PO-2655';
const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

const MAJOR_CREDITOR_ACCOUNT_ID = FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK.major_creditor.creditor_account_id;

const historyData = (
  historyItems: Record<string, unknown>[],
): IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData => ({
  version: '1',
  historyItems,
});

const INITIAL_HISTORY = historyData([
  {
    type: 'Financial',
    amount: '50',
    postedDetails: { posted_by_name: 'Finance officer', posted_date: '2025-03-12T08:30:00.900Z' },
    details: {
      transactionType: { transactionType: 'PAYMNT' },
      defendantAccountNumber: '2500000BV',
      defendantAccountId: '123123',
    },
  },
  {
    type: 'Financial',
    amount: '-25',
    postedDetails: { posted_by_name: 'Older finance officer', posted_date: '2025-03-12T08:30:00.100Z' },
    details: { transactionType: { transactionType: 'BACS' }, paymentReference: 'MJH0000004' },
  },
  {
    type: 'Financial',
    amount: '-10',
    postedDetails: { posted_by_name: 'Oldest finance officer', posted_date: '2025-03-11T08:30:00.000Z' },
    details: { transactionType: { transactionType: 'BACS' }, paymentReference: 'MJH0000003' },
  },
]);

const EMPTY_HISTORY = historyData([]);

const LARGE_HISTORY = historyData(
  Array.from({ length: 250 }, (_, index) => ({
    type: 'Financial',
    amount: '1',
    postedDetails: {
      posted_by_name: `Bulk user ${250 - index}`,
      posted_date: new Date(Date.UTC(2025, 2, 12, 12, 0, 0, 250 - index)).toISOString(),
    },
    details: { transactionType: { transactionType: 'BACS' }, paymentReference: `REF-${index}` },
  })),
);

const TABLE_FRAGMENT_TAB_DATA = historyData([
  {
    type: 'Rendered details',
    postedDetails: { posted_by_name: 'Case worker', posted_date: '2025-03-10T09:00:00.000Z' },
    details: {
      line1: [
        {
          fragments: [
            { text: 'Amendment', bold: true, hyphen: false },
            { text: 'Brent magistrates court', bold: false, hyphen: true },
          ],
        },
        {
          fragments: [
            {
              text: '2500000BV',
              bold: false,
              hyphen: false,
              link: { type: 'account', emit: '123123' },
            },
          ],
        },
      ],
      line2: [
        {
          fragments: [
            { text: 'Reason', bold: true, hyphen: false },
            { text: 'Special characters & £100.00 -> £9999999999.99', bold: false, hyphen: true },
          ],
        },
      ],
    },
  },
]);

const setupMajorCreditorHistory = (data: IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData) => {
  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptMajorCreditorHeader(
    MAJOR_CREDITOR_ACCOUNT_ID,
    structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK),
    '1',
  );
  interceptMajorCreditorHistoryAndNotes(MAJOR_CREDITOR_ACCOUNT_ID, data, '1');

  setupAccountEnquiryComponent({
    accountId: MAJOR_CREDITOR_ACCOUNT_ID.toString(),
    targetPath: `/major-creditor/${MAJOR_CREDITOR_ACCOUNT_ID}/details#history-and-notes`,
    fragments: 'history-and-notes',
    interceptedRoutes: ['/access-denied'],
  });
};

const setupMajorCreditorHistoryTable = (data: IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData) =>
  mount(FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent, {
    componentProperties: {
      tabData: data,
    },
    providers: [provideRouter([])],
  });

describe('Major Creditor Account Enquiry - History and notes tab', () => {
  it(
    'AC2a, AC6a. loads the major creditor history API and renders the read-only table',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMajorCreditorHistory(structuredClone(INITIAL_HISTORY));

      cy.wait('@getMajorCreditorHistoryAndNotes').then(({ request, response }) => {
        expect(request.method).to.equal('GET');
        expect(request.url).to.contain(`/major-creditor-accounts/${MAJOR_CREDITOR_ACCOUNT_ID}/history`);
        expect(request.query['dateFrom']).to.be.undefined;
        expect(request.query['dateTo']).to.be.undefined;
        expect(request.query['itemTypes']).to.be.undefined;
        expect(response?.statusCode).to.equal(200);
      });

      cy.get(HISTORY.tabHeading).should('contain.text', 'History and notes');
      cy.get(HISTORY.tableHeadings)
        .find('th')
        .then(($headers) => {
          expect([...$headers].map((header) => header.textContent?.replace(/\s+/g, ' ').trim())).to.deep.equal([
            'Date',
            'User',
            'Type',
            'Details',
            'Amount',
          ]);
        });
      cy.get(HISTORY.tableRows).should('have.length', 3);
      cy.get(HISTORY.firstUserCell).should('contain.text', 'Finance officer');
      cy.get(HISTORY.firstDetailsCell).should('contain.text', 'Payment received');
      cy.get(HISTORY.firstDetailsCell).find('a').should('contain.text', '2500000BV');
    },
  );

  it(
    'AC1a-AC1e. displays local dates and toggles date sorting using the UTC timestamp',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMajorCreditorHistory(structuredClone(INITIAL_HISTORY));
      cy.wait('@getMajorCreditorHistoryAndNotes');

      cy.get(HISTORY.firstDateCell).should('contain.text', '12 Mar 2025');
      cy.get(HISTORY.secondDateCell).should('contain.text', '12 Mar 2025');
      cy.get(HISTORY.thirdDateCell).should('contain.text', '11 Mar 2025');
      cy.get(HISTORY.dateHeader).should('have.attr', 'aria-sort', 'descending');
      cy.get(HISTORY.dateHeaderButton).click();
      cy.get(HISTORY.dateHeader).should('have.attr', 'aria-sort', 'ascending');
      cy.get(HISTORY.firstUserCell).should('contain.text', 'Oldest finance officer');
    },
  );

  it(
    'AC4a, AC5a. renders account links and CR/DR labels',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMajorCreditorHistory(structuredClone(INITIAL_HISTORY));
      cy.wait('@getMajorCreditorHistoryAndNotes');

      cy.get(HISTORY.firstAmountCell).should('contain.text', '£50.00').and('contain.text', 'CR');
      cy.get(HISTORY.firstAmountCell).find('strong').should('have.attr', 'aria-describedby');
      cy.get(HISTORY.firstAmountCell).find('.govuk-visually-hidden').should('contain.text', 'credited');
      cy.get(HISTORY.firstAmountCell).find('strong').should('not.have.attr', 'tabindex');
      cy.get(HISTORY.secondAmountCell).should('contain.text', '£25.00').and('contain.text', 'DR');
      cy.get(HISTORY.secondAmountCell).find('strong').should('have.attr', 'aria-describedby');
      cy.get(HISTORY.secondAmountCell).find('.govuk-visually-hidden').should('contain.text', 'debited');
      cy.get(HISTORY.secondAmountCell).find('strong').should('not.have.attr', 'tabindex');
      cy.window().then((win) => cy.stub(win, 'open').as('windowOpen'));
      cy.get(HISTORY.firstDetailsCell).find('a').click();
      const expectedAccountUrl = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.children.defendant}/123123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;
      cy.get('@windowOpen').should('have.been.calledWith', expectedAccountUrl, '_blank');
      cy.get(HISTORY.secondDetailsCell).find('a, button').should('not.exist');
    },
  );

  it(
    'AC6a. maps date filters to the major creditor history API query',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMajorCreditorHistory(structuredClone(INITIAL_HISTORY));
      cy.wait('@getMajorCreditorHistoryAndNotes');

      cy.get(HISTORY.filterSummaryText).click();
      cy.get(HISTORY.dateFromInput).type('01/01/2024');
      cy.get(HISTORY.dateToInput).type('31/01/2024');
      cy.get(HISTORY.filterButton).click();
      cy.wait('@getMajorCreditorHistoryAndNotes').then(({ request }) => {
        expect(request.query['dateFrom']).to.equal('2024-01-01');
        expect(request.query['dateTo']).to.equal('2024-01-31');
      });
    },
  );

  it(
    'AC2b. renders hundreds of history items in one scrollable table without pagination',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMajorCreditorHistory(structuredClone(LARGE_HISTORY));
      cy.wait('@getMajorCreditorHistoryAndNotes');

      cy.get(HISTORY.scrollPane).should('exist');
      cy.get(HISTORY.pagination).should('not.exist');
      cy.get(HISTORY.tableRows).should('have.length', 250);
      cy.get(HISTORY.firstUserCell).should('contain.text', 'Bulk user 250');
      cy.get('#history-and-notes-user-249').scrollIntoView().should('contain.text', 'Bulk user 1');
    },
  );

  it(
    'AC3b, AC3e. renders transformed major-creditor details with separators and links',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMajorCreditorHistory(structuredClone(INITIAL_HISTORY));
      cy.wait('@getMajorCreditorHistoryAndNotes');

      cy.get(HISTORY.secondDetailsCell)
        .invoke('text')
        .then((text) => {
          const normalised = text.replace(/\s+/g, ' ').trim();
          expect(normalised).to.contain('BACS payment | Payment reference: MJH0000004');
          expect(normalised).not.to.contain('BACS payment | |');
        });
      cy.get(HISTORY.firstDetailsCell).find('a').should('contain.text', '2500000BV');
    },
  );

  it(
    'AC3c-AC3f. renders hyphenated, bold, linked and second-line details fragments',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      setupMajorCreditorHistoryTable(structuredClone(TABLE_FRAGMENT_TAB_DATA));

      cy.get(HISTORY.firstDetailsCell)
        .invoke('text')
        .then((text) => {
          const normalised = text.replace(/\s+/g, ' ').trim();
          expect(normalised).to.contain('Amendment - Brent magistrates court | 2500000BV');
          expect(normalised).to.contain('Reason - Special characters & £100.00 -> £9999999999.99');
          expect(normalised).not.to.contain('| Reason');
        });
      cy.get(HISTORY.firstDetailsCell).find('strong').first().should('contain.text', 'Amendment');
      cy.get(HISTORY.firstDetailsCell).find(HISTORY.detailsLine2).find('strong').should('contain.text', 'Reason');
      cy.get(HISTORY.firstDetailsCell).find('a').should('contain.text', '2500000BV');
    },
  );

  it(
    'AC2c, AC8. keeps existing rows while refreshing, then shows no results with the submitted filter visible',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      interceptAuthenticatedUser();
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMajorCreditorHeader(
        MAJOR_CREDITOR_ACCOUNT_ID,
        structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK),
        '1',
      );
      let calls = 0;
      cy.intercept(
        'GET',
        `/opal-fines-service/major-creditor-accounts/${MAJOR_CREDITOR_ACCOUNT_ID}/history*`,
        (request) => {
          calls += 1;
          request.reply({
            statusCode: 200,
            headers: { ETag: '1' },
            body: calls === 1 ? INITIAL_HISTORY : EMPTY_HISTORY,
            delay: calls === 1 ? 0 : 1000,
          });
        },
      ).as('getMajorCreditorHistoryAndNotes');
      setupAccountEnquiryComponent({
        accountId: MAJOR_CREDITOR_ACCOUNT_ID.toString(),
        targetPath: `/major-creditor/${MAJOR_CREDITOR_ACCOUNT_ID}/details#history-and-notes`,
        fragments: 'history-and-notes',
        interceptedRoutes: ['/access-denied'],
      });
      cy.wait('@getMajorCreditorHistoryAndNotes');
      cy.get(HISTORY.filterSummaryText).click();
      cy.get(HISTORY.dateFromInput).type('01/01/2024');
      cy.get(HISTORY.filterButton).click();
      cy.get(HISTORY.firstUserCell).should('contain.text', 'Finance officer');
      cy.wait('@getMajorCreditorHistoryAndNotes');
      cy.get(HISTORY.noResultsMessage).should('contain.text', 'No results found.');
      cy.get(HISTORY.tableRows).should('not.exist');
      cy.get(HISTORY.dateFromInput).should('have.value', '01/01/2024');
    },
  );
});
