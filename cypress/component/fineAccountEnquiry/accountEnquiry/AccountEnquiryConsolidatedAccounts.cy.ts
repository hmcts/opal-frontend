import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_CONSOLIDATED_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-consolidated-accounts.mock';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import { interceptDefendantHeader } from './intercept/defendantAccountIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

const componentProperties: IComponentProperties = {
  accountId: '77',
  fragments: 'consolidated-accounts',
  interceptedRoutes: ['/access-denied'],
};

const tab = 'app-fines-acc-defendant-details-consolidated-accounts-tab';
const rows = `${tab} tbody tr.govuk-table__row`;
type ConsolidatedAccountsMock = typeof OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_CONSOLIDATED_ACCOUNTS_MOCK;

const cell = (columnKey: string, rowIndex: number): string => `#consolidated-account-${columnKey}-${rowIndex}`;
const normaliseText = (value: string): string =>
  value
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const expectCellText = (selector: string, expected: string) => {
  cy.get(selector)
    .invoke('text')
    .then((text) => {
      expect(normaliseText(text)).to.eq(expected);
    });
};

const consolidatedAccountsMock: ConsolidatedAccountsMock = {
  ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_CONSOLIDATED_ACCOUNTS_MOCK),
  consolidated_accounts: [
    {
      account_id: 99000000990002,
      account_number: '99009902C',
      date_imposed: '2025-01-12',
      first_name: 'Casey',
      imposed_by: 'Seed Child Court',
      last_name: 'Child',
      reference: 'LOCAL-CONSOL-CHILD',
    },
    {
      account_id: 99000000990003,
      account_number: '99009903D',
      date_imposed: '2026-02-03',
      first_name: 'Robin',
      imposed_by: 'Central London Magistrates Court',
      last_name: 'Bridge',
      reference: 'Ref/Mixed-Case/123',
    },
  ],
};

const setupConsolidatedAccountsScreen = (mockData: ConsolidatedAccountsMock = consolidatedAccountsMock) => {
  const headerMock = {
    ...structuredClone(DEFENDANT_HEADER_MOCK),
    has_consolidated_accounts: true,
  };
  const accountId = headerMock.defendant_account_party_id;

  interceptAuthenticatedUser();
  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(accountId, headerMock, '123');
  cy.intercept('GET', `/opal-fines-service/defendant-accounts/${accountId}/consolidated-accounts`, {
    statusCode: 200,
    headers: { ETag: '123' },
    body: mockData.consolidated_accounts,
  }).as('getConsolidatedAccounts');

  setupAccountEnquiryComponent({ ...componentProperties, accountId });
  cy.wait('@getConsolidatedAccounts').its('response.body').should('have.length', 2);
};

describe('Account Enquiry Consolidated Accounts Tab', () => {
  it(
    'AC1a, AC1b, AC1c, AC1d, AC1e, AC1f: fetches consolidated child accounts and renders the read-only table',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2391'), '@JIRA-EPIC:PO-2332'],
    },
    () => {
      setupConsolidatedAccountsScreen();

      cy.get('[subnavitemid="consolidated-accounts-tab"] > .moj-sub-navigation__link')
        .should('have.attr', 'aria-current', 'page')
        .and('contain.text', 'Consolidated accounts');
      cy.get(`${tab} h2`).should('contain.text', 'Consolidated accounts');
      cy.get(`${tab} th.govuk-table__header`).then((headers) => {
        expect([...headers].map((header) => normaliseText(header.textContent ?? ''))).to.deep.eq([
          'Account',
          'Name',
          'Date imposed',
          'Imposed by',
          'Reference',
        ]);
      });
      cy.get(rows).should('have.length', 2);
      cy.get(tab).within(() => {
        cy.get('input, textarea, select, button, [contenteditable="true"]').should('not.exist');
      });

      expectCellText(cell('name', 0), 'CHILD, Casey');
      expectCellText(cell('date-imposed', 0), '12 Jan 2025');
      expectCellText(cell('imposed-by', 0), 'Seed Child Court');
      expectCellText(cell('reference', 0), 'LOCAL-CONSOL-CHILD');
      expectCellText(cell('name', 1), 'BRIDGE, Robin');
      expectCellText(cell('date-imposed', 1), '03 Feb 2026');
      expectCellText(cell('imposed-by', 1), 'Central London Magistrates Court');
      expectCellText(cell('reference', 1), 'Ref/Mixed-Case/123');

      cy.get(cell('number', 0))
        .find('a')
        .should(($link) => {
          expect(normaliseText($link.text())).to.eq('99009902C');
        })
        .and('have.attr', 'href', '/fines/account/defendant/99000000990002/details#at-a-glance')
        .and('have.attr', 'target', '_blank');
    },
  );
});
