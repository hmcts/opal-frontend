import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as DOM } from '../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-major-creditor-details/mocks/fines-acc-major-creditor-details-header.mock';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-major-creditor-at-a-glance-with-defendant.mock';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_NO_PERMISSION } from '../../CommonIntercepts/CommonUserState.mocks';
import { interceptMajorCreditorAtAGlance, interceptMajorCreditorHeader } from './intercept/defendantAccountIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const MAJOR_CREDITOR_AT_A_GLANCE_COMPONENT = 'app-fines-acc-major-creditor-details-at-a-glance-tab';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

const normalizeText = (text: string): string =>
  text
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

describe('Major Creditor Account Summary - At a Glance Tab', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  const majorCreditorAccountId = FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK.major_creditor.creditor_account_id;

  const componentProperties: IComponentProperties = {
    accountId: majorCreditorAccountId.toString(),
    targetPath: `/major-creditor/${majorCreditorAccountId}/details`,
    fragments: 'at-a-glance',
    interceptedRoutes: ['/access-denied'],
  };

  const setupMajorCreditorAtAGlance = (
    header = structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK),
    atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK),
  ) => {
    interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
    interceptMajorCreditorHeader(majorCreditorAccountId, header, '1');
    interceptMajorCreditorAtAGlance(majorCreditorAccountId, atAGlance, '1');
    setupAccountEnquiryComponent(componentProperties);
  };

  it('AC1a: builds the major creditor at a glance tab in line with the design artefact', { tags: buildTags() }, () => {
    const header = structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
    const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK);

    header.major_creditor.account_reference.display_name = 'Major Creditor';
    atAGlance.major_creditor.name = 'CPS Crown Prosecution Service';
    atAGlance.major_creditor.code = '9001';
    atAGlance.major_creditor.address.line_1 = '1 Test Road';
    atAGlance.major_creditor.address.line_2 = 'Suite 2';
    atAGlance.major_creditor.address.line_3 = 'Hertford';
    atAGlance.major_creditor.address.postcode = 'sg13 8dq';
    atAGlance.major_creditor.pay_by_bacs = true;

    setupMajorCreditorAtAGlance(header, atAGlance);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.accountInfo).should('exist');
    cy.get(DOM.summaryMetricBar).should('exist');
    cy.get(DOM.subnav).should('exist');
    cy.get(MAJOR_CREDITOR_AT_A_GLANCE_COMPONENT).should('exist');

    cy.get(MAJOR_CREDITOR_AT_A_GLANCE_COMPONENT).find(DOM.sectionHeading).should('have.length', 2);
    cy.contains(DOM.sectionHeading, 'Major creditor').should('be.visible');
    cy.contains(DOM.sectionHeading, 'Payout status').should('be.visible');
    cy.get(DOM.readOnlyFields).should('not.exist');
  });

  it(
    'AC1b, AC2a: displays the configured major creditor details and shows BACS details as provided',
    { tags: buildTags() },
    () => {
      const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK);

      atAGlance.major_creditor.name = 'CPS Crown Prosecution Service';
      atAGlance.major_creditor.code = '9001';
      atAGlance.major_creditor.address.line_1 = '1 Test Road';
      atAGlance.major_creditor.address.line_2 = 'Suite 2';
      atAGlance.major_creditor.address.line_3 = 'Hertford';
      atAGlance.major_creditor.address.postcode = 'sg13 8dq';
      atAGlance.major_creditor.pay_by_bacs = true;

      setupMajorCreditorAtAGlance(undefined, atAGlance);

      cy.get(MAJOR_CREDITOR_AT_A_GLANCE_COMPONENT).within(() => {
        cy.contains(DOM.fieldHeading, DOM.labelName)
          .next(DOM.fieldValue)
          .invoke('text')
          .then((text) => {
            expect(normalizeText(text)).to.eq('CPS Crown Prosecution Service (9001)');
          });

        cy.contains(DOM.fieldHeading, DOM.labelAddress)
          .next(DOM.fieldValue)
          .invoke('text')
          .then((text) => {
            expect(normalizeText(text)).to.eq('1 Test Road Suite 2 Hertford SG13 8DQ');
          });

        cy.contains(DOM.fieldHeading, DOM.labelBacsDetails).should('be.visible');
      });

      cy.get(DOM.badgeBlue).should('contain.text', DOM.labelProvided).and('have.class', 'moj-badge--blue');
    },
  );

  it('AC2a: displays BACS details as not provided when pay by bacs is false', { tags: buildTags() }, () => {
    const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK);

    atAGlance.major_creditor.pay_by_bacs = false;

    setupMajorCreditorAtAGlance(undefined, atAGlance);

    cy.contains(DOM.fieldHeading, DOM.labelBacsDetails).should('be.visible');
    cy.get(DOM.badgeRed).should('contain.text', DOM.labelNotProvided).and('have.class', 'moj-badge--red');
  });

  it(
    'AC1b: hides the code, postcode, and payout status section for a central fund account',
    { tags: buildTags() },
    () => {
      const header = structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
      const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK);

      header.major_creditor.account_reference.account_type = 'CF';
      header.major_creditor.account_reference.display_name = 'Central Fund';
      atAGlance.major_creditor.name = 'Central Fund';
      atAGlance.major_creditor.code = '9001';
      atAGlance.major_creditor.address.line_1 = '1 Test Road';
      atAGlance.major_creditor.address.line_2 = 'Suite 2';
      atAGlance.major_creditor.address.line_3 = 'Hertford';
      atAGlance.major_creditor.address.postcode = 'sg13 8dq';
      atAGlance.major_creditor.pay_by_bacs = true;

      setupMajorCreditorAtAGlance(header, atAGlance);

      cy.get(MAJOR_CREDITOR_AT_A_GLANCE_COMPONENT).find(DOM.sectionHeading).should('have.length', 1);
      cy.contains(DOM.sectionHeading, 'Major creditor').should('be.visible');
      cy.get(MAJOR_CREDITOR_AT_A_GLANCE_COMPONENT).should('not.contain.text', 'Payout status');
      cy.get(MAJOR_CREDITOR_AT_A_GLANCE_COMPONENT).should('not.contain.text', DOM.labelBacsDetails);

      cy.contains(DOM.fieldHeading, DOM.labelName)
        .next(DOM.fieldValue)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('Central Fund');
        });

      cy.contains(DOM.fieldHeading, DOM.labelAddress)
        .next(DOM.fieldValue)
        .invoke('text')
        .then((text) => {
          expect(normalizeText(text)).to.eq('1 Test Road Suite 2 Hertford');
          expect(normalizeText(text)).not.to.contain('SG13 8DQ');
        });
    },
  );
});
