import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-impositions.mock';
import {
  ACCOUNT_ENQUIRY_IMPOSITIONS_ELEMENTS as IMPOSITIONS,
  getImpositionsCell,
  getImpositionsPaginationItem,
} from '../../../shared/selectors/account-enquiry/account.enquiry.impositions.locators';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/defendant_details_at_glance_mock';
import { DEFENDANT_HEADER_MOCK } from './mocks/defendant_details_mock';
import {
  interceptAtAGlance,
  interceptDefendantHeader,
  interceptImpositions,
} from './intercept/defendantAccountIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const IMPOSITIONS_STORY_TAG = '@JIRA-STORY:PO-2079';
const IMPOSITIONS_EPIC_TAG = '@JIRA-EPIC:PO-979';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

const componentProperties: IComponentProperties = {
  accountId: '77',
  fragments: 'at-a-glance',
  interceptedRoutes: ['/access-denied', '../note/add', '../debtor/individual/amend', '../debtor/parentGuardian/amend'],
};

const normalizeText = (text: string): string =>
  text
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const expectCellText = (selector: string, expected: string) => {
  cy.get(selector)
    .invoke('text')
    .then((text) => {
      expect(normalizeText(text)).to.eq(expected);
    });
};

const stubRouterNavigateByUrl = () => {
  cy.get('@router').then((router) => {
    cy.stub(router as unknown as { navigateByUrl: (url: unknown) => Promise<boolean> }, 'navigateByUrl')
      .as('routerNavigateByUrl')
      .resolves(true);
  });
};

const setupImpositionsScreen = (
  fragments: IComponentProperties['fragments'] = 'at-a-glance',
  headerMock = structuredClone(DEFENDANT_HEADER_MOCK),
  atAGlanceMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK),
  impositionsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK),
) => {
  const accountId = headerMock.defendant_account_party_id;

  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptDefendantHeader(accountId, headerMock, '123');
  interceptAtAGlance(Number(accountId), atAGlanceMock, '123');
  interceptImpositions(accountId, impositionsMock, '123');

  setupAccountEnquiryComponent({ ...componentProperties, accountId, fragments });
  cy.get(IMPOSITIONS.routerOutlet).should('exist');
};

describe('Account Enquiry Impositions', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  it(
    'AC1a, AC1b, AC1c, AC1d, AC1e: fetches impositions when the tab is selected and renders the read-only table with zero-balance formatting',
    { tags: [...buildTags(IMPOSITIONS_STORY_TAG), IMPOSITIONS_EPIC_TAG] },
    () => {
      setupImpositionsScreen();

      cy.wait('@getAtAGlance');
      cy.get('@getImpositions.all').should('have.length', 0);

      cy.get(IMPOSITIONS.tabName).click();
      cy.wait('@getImpositions');

      cy.get(IMPOSITIONS.pageHeader).should('exist');
      cy.get(IMPOSITIONS.accountInfo).should('exist');
      cy.get(IMPOSITIONS.summaryMetricBar).should('exist');
      cy.get(IMPOSITIONS.tabName).should('have.attr', 'aria-current', 'page');
      cy.get(IMPOSITIONS.component).should('exist');
      cy.get(IMPOSITIONS.heading).should('contain.text', 'Impositions');
      cy.get(IMPOSITIONS.table).should('exist');
      cy.get(IMPOSITIONS.rows).should('have.length', 25);
      cy.get(IMPOSITIONS.component).within(() => {
        cy.get(IMPOSITIONS.readOnlyInputs).should('not.exist');
      });

      expectCellText(getImpositionsCell('date-added', 0), '31 Jan 2025');
      expectCellText(getImpositionsCell('result', 0), 'FO');
      expectCellText(getImpositionsCell('creditor', 0), 'Central Funds');
      expectCellText(getImpositionsCell('imposed-amount', 0), '£200.00');
      expectCellText(getImpositionsCell('paid-amount', 0), '£50.00');
      expectCellText(getImpositionsCell('balance', 0), '£150.00');
      expectCellText(getImpositionsCell('date-imposed', 0), '30 Jan 2025');
      expectCellText(getImpositionsCell('offence', 0), 'Speeding - exceed 30mph on restricted road');
      expectCellText(getImpositionsCell('id', 0), '111111111111');

      cy.get(getImpositionsCell('balance', 1))
        .closest('tr')
        .should('have.class', 'govuk-light-grey-background-colour')
        .and('contain.text', 'Minor Creditor Test Ltd');
      expectCellText(getImpositionsCell('balance', 1), '—');

      expectCellText(getImpositionsCell('date-added', 2), '—');
      expectCellText(getImpositionsCell('date-imposed', 2), '—');
    },
  );

  it(
    'AC2a, AC2b: displays the sentencing court name only when the imposition includes an imposing court',
    { tags: [...buildTags(IMPOSITIONS_STORY_TAG), IMPOSITIONS_EPIC_TAG] },
    () => {
      setupImpositionsScreen('impositions');

      cy.wait('@getImpositions');

      expectCellText(getImpositionsCell('imposed-by', 0), 'West London Magistrates Court');
      cy.get(getImpositionsCell('imposed-by', 1)).should('be.empty');
      cy.get(getImpositionsCell('imposed-by', 2)).should('be.empty');
    },
  );

  it(
    'AC3a: clicking a Minor Creditor link routes to the Minor Creditor Details page',
    { tags: [...buildTags(IMPOSITIONS_STORY_TAG), IMPOSITIONS_EPIC_TAG] },
    () => {
      setupImpositionsScreen('impositions');

      cy.wait('@getImpositions');
      stubRouterNavigateByUrl();

      cy.get(IMPOSITIONS.minorCreditorLink).should('contain.text', 'Minor Creditor Test Ltd').click();

      cy.get('@routerNavigateByUrl')
        .its('lastCall.args.0')
        .then((urlTree) => {
          cy.get('@router').then((router) => {
            const url =
              typeof urlTree === 'string'
                ? urlTree
                : (router as unknown as { serializeUrl: (value: unknown) => string }).serializeUrl(urlTree);

            expect(url).to.eq('/fines/account/minor-creditor/660000000001/details');
          });
        });
    },
  );

  it(
    'AC3b: clicking a Major Creditor link routes to the Major Creditor Details page',
    { tags: [...buildTags(IMPOSITIONS_STORY_TAG), IMPOSITIONS_EPIC_TAG] },
    () => {
      setupImpositionsScreen('impositions');

      cy.wait('@getImpositions');
      stubRouterNavigateByUrl();

      cy.get(getImpositionsCell('creditor', 0)).find('a').click();

      cy.get('@routerNavigateByUrl')
        .its('lastCall.args.0')
        .then((urlTree) => {
          cy.get('@router').then((router) => {
            const url =
              typeof urlTree === 'string'
                ? urlTree
                : (router as unknown as { serializeUrl: (value: unknown) => string }).serializeUrl(urlTree);

            expect(url).to.contain('/major-creditor/');
          });
        });
    },
  );

  it(
    'AC3c: paginates the impositions table to 25 results per page',
    { tags: [...buildTags(IMPOSITIONS_STORY_TAG), IMPOSITIONS_EPIC_TAG] },
    () => {
      setupImpositionsScreen('impositions');

      cy.wait('@getImpositions');

      cy.get(IMPOSITIONS.rows).should('have.length', 25);
      cy.get(IMPOSITIONS.pagination).should('exist');
      cy.get(getImpositionsPaginationItem(1)).should('exist');
      cy.get(getImpositionsPaginationItem(2)).should('exist');
      cy.get(IMPOSITIONS.paginationText).should('contain', 'Showing 1 to 25 of 33 total results');
      cy.get(IMPOSITIONS.nextPageButton).click({ force: true });

      cy.get(IMPOSITIONS.rows).should('have.length', 8);
      cy.get(IMPOSITIONS.paginationCurrentPage).should('contain', '2');
      cy.get(IMPOSITIONS.paginationText).should('contain', 'Showing 26 to 33 of 33 total results');
      expectCellText(getImpositionsCell('creditor', 0), 'Major Creditor 23');
      cy.get(IMPOSITIONS.component).should('not.contain.text', 'Central Funds');
    },
  );
});
