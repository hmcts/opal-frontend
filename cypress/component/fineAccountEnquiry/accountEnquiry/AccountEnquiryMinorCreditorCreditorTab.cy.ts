import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as HEADER } from '../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { MINOR_CREDITOR_CREDITOR_DETAILS as CREDITOR_TAB } from '../../../shared/selectors/account-enquiry/account.enquiry.minor-creditor-creditor.locators';
import {
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../CommonIntercepts/CommonUserState.mocks';
import { interceptAuthenticatedUser, interceptUserState } from '../../CommonIntercepts/CommonIntercepts';
import { interceptMinorCreditorCreditor, interceptMinorCreditorHeader } from './intercept/defendantAccountIntercepts';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';
import {
  createIndividualMinorCreditorCreditorMock,
  createMinorCreditorHeaderMock,
  createUserStateWithViewCreditorBacsPermission,
  MINOR_CREDITOR_ACCOUNT_ID,
} from './mocks/minor_creditor_at_a_glance.mock';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const CREDITOR_TAB_STORY_TAG = '@JIRA-STORY:PO-1979';
const CHANGE_BUTTON_STORY_TAG = '@JIRA-STORY:PO-1983';
const CHANGE_BUTTON_EPIC_TAG = '@JIRA-EPIC:PO-1285';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

const componentProperties: IComponentProperties = {
  accountId: MINOR_CREDITOR_ACCOUNT_ID.toString(),
  routeRoot: 'minor-creditor',
  fragments: 'creditor',
};

const setupMinorCreditorCreditorTab = (
  userState: typeof USER_STATE_MOCK_NO_PERMISSION,
  header = createMinorCreditorHeaderMock(),
  creditorTabData = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK),
) => {
  interceptUserState(userState);
  interceptMinorCreditorHeader(MINOR_CREDITOR_ACCOUNT_ID, header, '1');
  interceptMinorCreditorCreditor(MINOR_CREDITOR_ACCOUNT_ID, creditorTabData, '1');
  setupAccountEnquiryComponent(componentProperties);
};

const normalizeText = (text: string): string =>
  text
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const stubRouterNavigateByUrl = () => {
  cy.get('@router').then((router) => {
    const typedRouter = router as unknown as { navigateByUrl: Function; serializeUrl: (value: unknown) => string };
    const originalNavigateByUrl = typedRouter.navigateByUrl.bind(router);

    cy.stub(router as unknown as object, 'navigateByUrl' as keyof object)
      .as('routerNavigateByUrl')
      .callsFake((url, extras) => {
        const path = typeof url === 'string' ? url : typedRouter.serializeUrl(url);

        if (path.includes('/access-denied') || path.includes('/amend')) {
          return Promise.resolve(true);
        }

        return originalNavigateByUrl(url, extras);
      });
  });
};

describe('Minor Creditor Account Summary - Creditor Tab', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  it(
    'AC1a, AC1b, AC2a, AC2ai: builds the creditor tab as a read-only view and replaces bank details with the permission message when the user only has Search and view accounts',
    { tags: buildTags(CREDITOR_TAB_STORY_TAG, CHANGE_BUTTON_EPIC_TAG) },
    () => {
      const creditorTabData = createIndividualMinorCreditorCreditorMock(false);

      setupMinorCreditorCreditorTab(USER_STATE_MOCK_NO_PERMISSION, createMinorCreditorHeaderMock(), creditorTabData);

      cy.get(HEADER.pageHeader).should('exist');
      cy.get(CREDITOR_TAB.component).should('exist');
      cy.get(CREDITOR_TAB.sectionHeading).should('be.visible').and('have.text', 'Creditor Details');
      cy.get(CREDITOR_TAB.summaryCardTitle).should('be.visible').and('have.text', 'Minor creditor details');
      cy.get(HEADER.readOnlyFields).should('not.exist');

      cy.get(CREDITOR_TAB.nameRow)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('Name Mrs Jane Amelia BLOGGS');
        });

      cy.get(CREDITOR_TAB.addressRow)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('Address 1 High Street Town Centre Westminster SW1A 1AA');
        });

      cy.get(CREDITOR_TAB.paymentMethodRow).should('contain.text', 'Payment method').and('contain.text', 'Cheque');
      cy.get(CREDITOR_TAB.nameOnAccountRow).should('not.exist');
      cy.get(CREDITOR_TAB.sortCodeRow).should('not.exist');
      cy.get(CREDITOR_TAB.accountNumberRow).should('not.exist');
      cy.get(CREDITOR_TAB.paymentReferenceRow).should('not.exist');
      cy.get(CREDITOR_TAB.permissionMessage)
        .should('be.visible')
        .and('contain.text', 'You do not have permission to view payment details on this account');
      cy.get(CREDITOR_TAB.changeLink).should('not.exist');
    },
  );

  it(
    'AC1a, AC1b, AC2b: shows BACS payment details when the user has Search and view accounts and View Creditor BACS permission',
    { tags: buildTags(CREDITOR_TAB_STORY_TAG, CHANGE_BUTTON_EPIC_TAG) },
    () => {
      const creditorTabData = createIndividualMinorCreditorCreditorMock(true);

      setupMinorCreditorCreditorTab(
        createUserStateWithViewCreditorBacsPermission(),
        createMinorCreditorHeaderMock(),
        creditorTabData,
      );

      cy.get(CREDITOR_TAB.component).should('exist');
      cy.get(CREDITOR_TAB.nameRow)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('Name Mrs Jane Amelia BLOGGS');
        });

      cy.get(CREDITOR_TAB.addressRow)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('Address 1 High Street Town Centre Westminster SW1A 1AA');
        });

      cy.get(CREDITOR_TAB.paymentMethodRow).should('contain.text', 'Payment method').and('contain.text', 'BACS');
      cy.get(CREDITOR_TAB.nameOnAccountRow)
        .should('contain.text', 'Name on account')
        .and('contain.text', 'Test Account');
      cy.get(CREDITOR_TAB.sortCodeRow).should('contain.text', 'Sort code').and('contain.text', '12-34-56');
      cy.get(CREDITOR_TAB.accountNumberRow).should('contain.text', 'Account number').and('contain.text', '12345678');
      cy.get(CREDITOR_TAB.paymentReferenceRow)
        .should('contain.text', 'Payment reference')
        .and('contain.text', 'REF-001');
      cy.get(CREDITOR_TAB.permissionMessage).should('not.exist');
      cy.get(CREDITOR_TAB.changeLink).should('not.exist');
    },
  );

  it(
    'AC1, AC2a: displays the Change button and navigates to Change creditor details when the user has Account Maintenance permission in the account BU',
    { tags: buildTags(CHANGE_BUTTON_STORY_TAG, CHANGE_BUTTON_EPIC_TAG) },
    () => {
      setupMinorCreditorCreditorTab(USER_STATE_MOCK_PERMISSION_BU77);
      stubRouterNavigateByUrl();

      cy.get(HEADER.pageHeader).should('exist');
      cy.get(CREDITOR_TAB.component).should('exist');
      cy.get(CREDITOR_TAB.changeLink).should('be.visible').and('have.text', 'Change').click();
      cy.get('@router').then((router) => {
        cy.get('@routerNavigateByUrl')
          .its('lastCall.args.0')
          .then((url) => {
            const path =
              typeof url === 'string'
                ? url
                : (router as unknown as { serializeUrl: (value: unknown) => string }).serializeUrl(url);

            expect(path).to.contain(`/minor-creditor/${MINOR_CREDITOR_ACCOUNT_ID}/amend`);
          });
      });
    },
  );

  it(
    'AC1, AC2b: displays the Change button and routes to access denied when the user only has Account Maintenance permission in a different BU',
    { tags: buildTags(CHANGE_BUTTON_STORY_TAG, CHANGE_BUTTON_EPIC_TAG) },
    () => {
      setupMinorCreditorCreditorTab(USER_STATE_MOCK_PERMISSION_BU17);
      stubRouterNavigateByUrl();

      cy.get(CREDITOR_TAB.changeLink)
        .should('be.visible')
        .and('have.attr', 'href')
        .and('match', /\/access-denied$/);
      cy.get(CREDITOR_TAB.changeLink).click();

      cy.get('@router').then((router) => {
        cy.get('@routerNavigateByUrl')
          .its('lastCall.args.0')
          .then((url) => {
            const path =
              typeof url === 'string'
                ? url
                : (router as unknown as { serializeUrl: (value: unknown) => string }).serializeUrl(url);

            expect(path).to.eq('/access-denied');
          });
      });
    },
  );

  it(
    'AC1: does not display the Change button when the user has no Account Maintenance permission in any BU',
    { tags: buildTags(CHANGE_BUTTON_STORY_TAG, CHANGE_BUTTON_EPIC_TAG) },
    () => {
      setupMinorCreditorCreditorTab(USER_STATE_MOCK_NO_PERMISSION);

      cy.get(CREDITOR_TAB.component).should('exist');
      cy.get(CREDITOR_TAB.changeLink).should('not.exist');
    },
  );
});
