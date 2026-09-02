import {
  interceptAtAGlance,
  interceptDefendantHeader,
  interceptDefendantDetails,
  interceptEnforcementStatus,
  interceptHistoryAndNotes,
  interceptImpositions,
  interceptMinorCreditorHeader,
  interceptPaymentTerms,
} from './intercept/defendantAccountIntercepts';

// constants + mocks
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as DOM } from '../../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import {
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_YOUTH_MOCK,
  DEFENDANT_HEADER_ORG_MOCK,
  createDefendantHeaderMockWithName,
} from './mocks/defendant_details_mock';

import {
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../../CommonIntercepts/CommonUserState.mocks';
import { AccountAtAGlanceLocators as A } from '../../../../shared/selectors/account-details/account.at-a-glance.details.locators';
import { AccountNavDetailsLocators } from '../../../../shared/selectors/account-details/account.nav.details.locators';

import { FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-details/mocks/fines-acc-minor-creditor-details-header.mock';

import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';
import {
  interceptAuthenticatedUser,
  interceptResultByCode,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/defendant_details_at_glance_mock';
import { AccountDetailsResponsiveLayoutActions } from '../../../../e2e/functional/opal/actions/account-details/details.responsive-layout.actions';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-enforcement-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-impositions.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { mount } from 'cypress/angular';
import { FinesAccDefendantDetailsAtAGlanceTabComponent } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details-at-a-glance-tab/fines-acc-defendant-details-at-a-glance-tab.component';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

const responsiveLayoutActions = new AccountDetailsResponsiveLayoutActions();

const assertConsolidatedAccountStatusBanner = (): void => {
  cy.get(DOM.accountStatusBanner)
    .should('be.visible')
    .and('contain.text', 'Account closed')
    .and('contain.text', 'Account consolidated');
  cy.get(DOM.accountStatusBannerAlert).should('be.visible');
};

const assertHeaderActionsReflow = (): void => {
  cy.get(DOM.headingName).then(($heading) => {
    const headingBounds = $heading[0].getBoundingClientRect();

    cy.get(DOM.headingCaption).then(($caption) => {
      const captionBounds = $caption[0].getBoundingClientRect();
      expect(captionBounds.left, 'account number caption should align with the account name').to.be.closeTo(
        headingBounds.left,
        1,
      );

      cy.get(DOM.addNoteButton).then(($button) => {
        const buttonBounds = $button[0].getBoundingClientRect();

        cy.get(DOM.moreOptionsButton).then(($moreOptionsButton) => {
          const moreOptionsBounds = $moreOptionsButton[0].getBoundingClientRect();
          const actionsOverlap =
            buttonBounds.left < moreOptionsBounds.right &&
            buttonBounds.right > moreOptionsBounds.left &&
            buttonBounds.top < moreOptionsBounds.bottom &&
            buttonBounds.bottom > moreOptionsBounds.top;

          expect(buttonBounds.top, 'add account note button should be below the account name').to.be.at.least(
            headingBounds.bottom,
          );
          expect(moreOptionsBounds.top, 'more options button should be below the account name').to.be.at.least(
            headingBounds.bottom,
          );
          expect(buttonBounds.right, 'add account note button should be fully visible').to.be.at.most(320);
          expect(moreOptionsBounds.right, 'more options button should be fully visible').to.be.at.most(320);
          expect(actionsOverlap, 'header actions should not overlap').to.equal(false);

          cy.get(DOM.accountInfo).then(($accountInfo) => {
            const accountInfoBounds = $accountInfo[0].getBoundingClientRect();
            const headerContentBottom = Math.max(headingBounds.bottom, buttonBounds.bottom, moreOptionsBounds.bottom);

            expect(accountInfoBounds.top, 'account information should start below the complete header').to.be.at.least(
              headerContentBottom,
            );

            cy.get(DOM.summaryMetricBar).then(($summaryMetricBar) => {
              const summaryMetricBarBounds = $summaryMetricBar[0].getBoundingClientRect();
              expect(
                summaryMetricBarBounds.top,
                'summary metrics should start below account information',
              ).to.be.at.least(accountInfoBounds.bottom);

              cy.get(DOM.subnav).then(($subnav) => {
                expect(
                  $subnav[0].getBoundingClientRect().top,
                  'navigation should start below summary metrics',
                ).to.be.at.least(summaryMetricBarBounds.bottom);
              });
            });
          });
        });
      });
    });
  });
};

const assertDesktopHeaderLayout = (): void => {
  cy.get(DOM.headingName).then(($heading) => {
    const headingBounds = $heading[0].getBoundingClientRect();

    cy.get(DOM.headingCaption).then(($caption) => {
      expect(
        $caption[0].getBoundingClientRect().left,
        'account number caption should align with the account name',
      ).to.be.closeTo(headingBounds.left, 1);

      cy.get(DOM.addNoteButton).then(($button) => {
        const buttonBounds = $button[0].getBoundingClientRect();

        cy.get(DOM.moreOptionsButton).then(($moreOptionsButton) => {
          const moreOptionsBounds = $moreOptionsButton[0].getBoundingClientRect();
          const addNoteOverlapsName =
            buttonBounds.left < headingBounds.right &&
            buttonBounds.right > headingBounds.left &&
            buttonBounds.top < headingBounds.bottom &&
            buttonBounds.bottom > headingBounds.top;
          const moreOptionsOverlapsName =
            moreOptionsBounds.left < headingBounds.right &&
            moreOptionsBounds.right > headingBounds.left &&
            moreOptionsBounds.top < headingBounds.bottom &&
            moreOptionsBounds.bottom > headingBounds.top;
          const actionsOverlap =
            buttonBounds.left < moreOptionsBounds.right &&
            buttonBounds.right > moreOptionsBounds.left &&
            buttonBounds.top < moreOptionsBounds.bottom &&
            buttonBounds.bottom > moreOptionsBounds.top;

          expect(addNoteOverlapsName, 'add account note button should not overlap the account name').to.equal(false);
          expect(moreOptionsOverlapsName, 'more options button should not overlap the account name').to.equal(false);
          expect(actionsOverlap, 'header actions should not overlap').to.equal(false);
          expect(buttonBounds.right, 'add account note button should be fully visible').to.be.at.most(1280);
          expect(moreOptionsBounds.right, 'more options button should be fully visible').to.be.at.most(1280);
        });
      });
    });
  });
};

describe('Account Enquiry - Defendant Header', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: undefined,
    interceptedRoutes: [
      '/access-denied',
      '../note/add',
      '../debtor/individual/amend',
      '../debtor/parentGuardian/amend',
      // Add more routes here as needed
    ],
  };

  it(
    'AC1, AC5, AC7, AC9: keeps top account content aligned and unobscured at desktop width',
    { tags: [...buildTags('@JIRA-STORY:PO-2673'), '@JIRA-EPIC:PO-2673'] },
    () => {
      cy.viewport(1280, 900);

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.pageHeader).should('be.visible');
      cy.get(DOM.accountInfo).should('be.visible');
      cy.get(DOM.summaryMetricBar).should('be.visible');
      cy.get(DOM.subnav).should('be.visible');

      assertDesktopHeaderLayout();
      responsiveLayoutActions.assertSummaryContentReadable(1280);
    },
  );

  it(
    'AC1a: renders the Defendant Account Header Summary',
    {
      tags: [...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4204'],
    },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.headingWithCaption).should('exist');
      cy.get(DOM.headingName).should('exist').and('contain.text', 'Mr Anna GRAHAM');
      cy.get(DOM.accountInfo).should('exist');
      cy.get(A.accountSummary.root).should('be.visible');
      cy.get(DOM.summaryMetricBar).should('exist');
      cy.get(DOM.subnav).should('exist');
      cy.get(DOM.atAGlanceTabComponent).should('exist');
    },
  );

  it(
    'AC1a: renders the Company Account Header Summary',
    { tags: [...buildTags('@JIRA-STORY:PO-867'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4205'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.headingWithCaption).should('exist');
      cy.get(DOM.headingName).should('exist').and('contain.text', 'Sainsco');
      cy.get(DOM.accountInfo).should('exist');
      cy.get(A.accountSummary.root).should('be.visible');
      cy.get(DOM.summaryMetricBar).should('exist');
      cy.get(DOM.subnav).should('exist');
      cy.get(DOM.atAGlanceTabComponent).should('exist');
    },
  );

  it(
    'AC1b: applies field rules (PCR uppercase, BU formatting, summary labels)',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866', '@JIRA-STORY:PO-2949'),
        '@JIRA-EPIC:PO-812',
        '@JIRA-TEST-KEY:PO-4206',
      ],
    },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.prosecutor_case_reference = 'ref123'; // UI should uppercase
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.accountInfo).within(() => {
        cy.contains(DOM.labelAccountType).should('be.visible');
        cy.contains(String(header.account_type)).should('be.visible');

        cy.contains(DOM.labelCaseNumber).should('be.visible');
        cy.contains('REF123').should('be.visible');

        cy.contains(DOM.labelBusinessUnit).should('be.visible');
        cy.contains(header.business_unit_summary.business_unit_name).should('be.visible');
        cy.contains(`(${header.business_unit_summary.business_unit_code})`).should('be.visible');

        cy.contains(DOM.labelReceivedFrom).should('be.visible');
        cy.get(DOM.receivedFrom).should('be.visible').and('have.contain', header.originator_name);
      });

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.contains(DOM.labelImposed).should('be.visible');
        cy.contains(DOM.labelArrears).should('be.visible');
        cy.contains('£').should('exist'); // any currency value in the bar
      });
    },
  );

  it(
    'AC1b: applies field rules (PCR uppercase, BU formatting, summary labels) - Company',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866', '@JIRA-STORY:PO-2949'),
        '@JIRA-EPIC:PO-812',
        '@JIRA-TEST-KEY:PO-4207',
      ],
    },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      header.prosecutor_case_reference = 'ref123'; // UI should uppercase

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.accountInfo).within(() => {
        cy.contains(DOM.labelAccountType).should('be.visible');
        cy.contains(String(header.account_type)).should('be.visible');

        cy.contains(DOM.labelCaseNumber).should('be.visible');
        cy.contains('REF123').should('be.visible');

        cy.contains(DOM.labelBusinessUnit).should('be.visible');
        cy.contains(header.business_unit_summary.business_unit_name).should('be.visible');
        cy.contains(`(${header.business_unit_summary.business_unit_code})`).should('be.visible');

        cy.contains(DOM.labelReceivedFrom).should('be.visible');
        cy.get(DOM.receivedFrom).should('be.visible').and('have.contain', header.originator_name);
      });

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.contains(DOM.labelImposed).should('be.visible');
        cy.contains(DOM.labelArrears).should('be.visible');
        cy.contains('£').should('exist'); // any currency value in the bar
      });
    },
  );

  it(
    'AC1, AC8: renders a persistent account status banner on the header shell',
    {
      tags: [...buildTags('@JIRA-STORY:PO-5755', '@JIRA-NFR:PO-2322'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-5755'],
    },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.account_status_reference = {
        account_status_code: 'TA',
        account_status_display_name: 'TFO Out Acknowledged (E/W)',
      };

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get('#defendant-account-status').should('be.visible').and('contain.text', 'Transferred out');
      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.subnav).should('exist');
    },
  );

  it(
    'AC1, AC1a, AC1b, AC1c, AC1d: displays the consolidated child account banner across account tabs',
    {
      tags: [...buildTags('@JIRA-STORY:PO-2392'), '@JIRA-EPIC:PO-2332'],
    },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.has_consolidated_accounts = false;
      header.account_status_reference = {
        account_status_code: 'CS',
        account_status_display_name: 'Consolidated',
      };

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');
      interceptDefendantDetails(
        77,
        {
          version: DEFENDANT_HEADER_MOCK.version,
          defendant_account_party: OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party,
        },
        '1',
      );
      interceptPaymentTerms(77, OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK, '1');
      interceptResultByCode('REM');
      interceptEnforcementStatus(77, OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_ENFORCEMENT_TAB_REF_DATA_MOCK, '1');
      interceptImpositions(77, OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK, '1');
      interceptHistoryAndNotes(77, OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      assertConsolidatedAccountStatusBanner();

      [
        AccountNavDetailsLocators.subNav.defendantTab,
        AccountNavDetailsLocators.subNav.paymentTermsTab,
        AccountNavDetailsLocators.subNav.enforcementTab,
        AccountNavDetailsLocators.subNav.impositionsTab,
        AccountNavDetailsLocators.subNav.historyAndNotesTab,
      ].forEach((tabLink) => {
        cy.get(tabLink).click();
        assertConsolidatedAccountStatusBanner();
      });

      cy.get(AccountNavDetailsLocators.subNav.atAGlanceTab).click();
      assertConsolidatedAccountStatusBanner();
    },
  );

  // ONLY Youth tag when youth is the debtor and no P/G associated
  it(
    'AC2: shows ONLY "Youth Account" when youth=true, debtor=Defendant, and no Parent/Guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-1593'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4208'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
      header.is_youth = true;
      header.debtor_type = 'Defendant';
      header.parent_guardian_party_id = null;
      header.party_details.individual_details = {
        ...header.party_details.individual_details!,
        date_of_birth: '2010-06-15',
        age: '14',
      };

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.statusTag).should('exist').and('contain.text', 'Youth Account');
    },
  );

  it(
    'AC2: shows ONLY "Parent or Guardian" when youth=true, debtor=Parent/Guardian',
    { tags: [...buildTags('@JIRA-STORY:PO-866'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4209'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
      header.debtor_type = 'Parent/Guardian';
      header.parent_guardian_party_id = '99';

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.statusTag)
        .should('exist')
        .and('contain.text', 'Parent or Guardian to pay')
        .and('have.class', 'govuk-tag');
      cy.get(DOM.statusTag).should('not.contain.text', 'Youth Account');
    },
  );

  //  ONLY "Parent or Guardian to pay" (even if youth)
  it(
    'AC2i: Youth defendant who is not the debtor hides "Youth" label',
    {
      tags: [...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4210'],
    },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
      header.debtor_type = 'Parent/Guardian';
      header.parent_guardian_party_id = '99';

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.statusTag).should('not.contain.text', 'Youth Account');
      cy.get(DOM.statusTag).should('contain.text', 'Parent or Guardian to pay');
    },
  );

  //  Adult defendant → no tag at all
  it(
    'AC2a: renders no tag for adult defendants',
    { tags: [...buildTags('@JIRA-STORY:PO-1593'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4211'] },
    () => {
      const adult = structuredClone(DEFENDANT_HEADER_MOCK);
      adult.is_youth = false;
      adult.debtor_type = 'Defendant';
      adult.parent_guardian_party_id = null;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, adult, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.statusTag).should('not.exist');
    },
  );

  // Negative balance prefixed with minus (e.g. -£4.50)
  it(
    'AC3: negative balance is prefixed with a minus',
    {
      tags: [...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4212'],
    },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.payment_state_summary.account_balance = -4.5;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.summaryMetricBar)
        .contains(/-£\s*4\.50|−£\s*4\.50/)
        .should('exist');
    },
  );

  it(
    'AC3: negative balance is prefixed with a minus - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-867'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4213'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      header.payment_state_summary.account_balance = -4.5;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.summaryMetricBar)
        .contains(/-£\s*4\.50|−£\s*4\.50/)
        .should('exist');
    },
  );

  it(
    'AC4: shows "Add account note" when user has permission',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866', '@JIRA-STORY:PO-867'),
        '@JIRA-EPIC:PO-812',
        '@JIRA-TEST-KEY:PO-4214',
      ],
    },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.addNoteButton).should('exist').and('be.enabled');
    },
  );

  it(
    'AC4: Calls add note path when user has permission in this BU',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866', '@JIRA-STORY:PO-867'),
        '@JIRA-EPIC:PO-812',
        '@JIRA-TEST-KEY:PO-4215',
      ],
    },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.addNoteButton).click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/note\/add/);
        });
    },
  );

  it(
    'AC4a: Calls error path when user has no permission in this BU only in other BU',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866', '@JIRA-STORY:PO-867'),
        '@JIRA-EPIC:PO-812',
        '@JIRA-TEST-KEY:PO-4216',
      ],
    },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.addNoteButton).click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/access-denied/);
        });
    },
  );

  it(
    'AC4b: hides "Add account note" when user has no permission in any BU',
    {
      tags: [...buildTags('@JIRA-STORY:PO-1593', '@JIRA-STORY:PO-866'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4217'],
    },
    () => {
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.addNoteButton).should('not.exist');
    },
  );

  it(
    'AC3: shows "Add account note" when user has permission - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-867'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4218'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.addNoteButton).should('exist').and('be.enabled');
    },
  );
  it(
    'AC3: Calls add note path when user has permission in this BU - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-867'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4219'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);
      cy.get(DOM.addNoteButton).click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/note\/add/);
        });
    },
  );

  it(
    'AC3a: Calls error path when user has no permission in this BU only in other BU - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-867'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4220'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);
      cy.get(DOM.addNoteButton).click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/access-denied/);
        });
    },
  );

  it(
    'AC3b: hides "Add account note" when user has no permission in any BU - Company',
    { tags: [...buildTags('@JIRA-STORY:PO-867'), '@JIRA-EPIC:PO-812', '@JIRA-TEST-KEY:PO-4221'] },
    () => {
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(77, DEFENDANT_HEADER_ORG_MOCK, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);
      cy.get(DOM.addNoteButton).should('not.exist');
    },
  );

  it(
    'AC1, AC2, AC3, AC4, AC5, AC7, AC8, AC9, AC10: reflows the Account Details header at narrow widths with long names',
    { tags: [...buildTags('@JIRA-STORY:PO-2673'), '@JIRA-EPIC:PO-2673', '@JIRA-TEST-KEY:PO-2673'] },
    () => {
      cy.viewport(320, 900);
      // First name should be 20 characters, last name should be 30 characters, total 50 characters. This is the maximum length for a defendant name.
      const longHeader = createDefendantHeaderMockWithName('A very long forename', 'A very long surname that wraps');

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, longHeader, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.pageHeader).should('be.visible');
      cy.get(DOM.headingWithCaption).should('be.visible');
      cy.get(DOM.headingName).should('contain.text', 'A very long forename');
      cy.get(DOM.accountInfo).should('be.visible');
      cy.get(DOM.summaryMetricBar).should('be.visible');
      cy.get(DOM.subnav).should('be.visible');
      cy.get(DOM.addNoteButton).should('be.visible');

      cy.window().then((win) => {
        const { documentElement, body } = win.document;

        expect(documentElement.scrollWidth, 'document should not overflow viewport').to.be.at.most(
          documentElement.clientWidth + 1,
        );
        expect(body.scrollWidth, 'body should not overflow viewport').to.be.at.most(body.clientWidth + 1);
      });

      assertHeaderActionsReflow();
      responsiveLayoutActions.assertSummaryContentReadable();
    },
  );

  it(
    'AC1, AC2, AC3, AC4, AC5, AC7, AC8, AC9, AC10: keeps the header readable for a long company name at narrow widths',
    { tags: [...buildTags('@JIRA-STORY:PO-2673'), '@JIRA-EPIC:PO-2673', '@JIRA-TEST-KEY:PO-2674'] },
    () => {
      cy.viewport(320, 900);

      const longCompanyHeader = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
      //Company name should be max of 50 characters.
      longCompanyHeader.party_details.organisation_details = {
        ...longCompanyHeader.party_details.organisation_details!,
        organisation_name: 'A very long company name that is fifty characters.',
      };

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, longCompanyHeader, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.pageHeader).should('be.visible');
      cy.get(DOM.headingWithCaption).should('be.visible');
      cy.get(DOM.headingName)
        .should('be.visible')
        .and('contain.text', 'A very long company name that is fifty characters.');
      cy.get(DOM.accountInfo).should('be.visible');
      cy.get(DOM.summaryMetricBar).should('be.visible');
      cy.get(DOM.subnav).should('be.visible');
      cy.get(DOM.addNoteButton).should('be.visible');

      cy.window().then((win) => {
        const { documentElement, body } = win.document;

        expect(documentElement.scrollWidth, 'document should not overflow viewport').to.be.at.most(
          documentElement.clientWidth + 1,
        );
        expect(body.scrollWidth, 'body should not overflow viewport').to.be.at.most(body.clientWidth + 1);
      });

      assertHeaderActionsReflow();
      responsiveLayoutActions.assertSummaryContentReadable();
    },
  );

  it(
    'AC6: wraps the status chip content cleanly at narrow widths',
    { tags: [...buildTags('@JIRA-STORY:PO-2673'), '@JIRA-EPIC:PO-2673', '@JIRA-TEST-KEY:PO-2676'] },
    () => {
      cy.viewport(320, 900);

      const parentGuardianHeader = structuredClone(DEFENDANT_HEADER_MOCK);
      parentGuardianHeader.debtor_type = 'Parent/Guardian';
      parentGuardianHeader.parent_guardian_party_id = '99';

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, parentGuardianHeader, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.statusTag)
        .should('be.visible')
        .and('contain.text', 'Parent or Guardian to pay')
        .then(($tag) => {
          const el = $tag[0] as HTMLElement;
          const tagBounds = el.getBoundingClientRect();
          const containingRow = el.closest('.govuk-grid-column-full') as HTMLElement;

          expect(el.innerText.trim(), 'status tag should render its complete label').to.equal(
            'Parent or Guardian to pay',
          );
          expect(el.scrollWidth, 'status tag should not overflow its box').to.be.at.most(el.clientWidth + 1);
          expect(containingRow, 'status tag should have a containing row').to.exist;
          expect(tagBounds.right, 'status tag should not overflow its containing row').to.be.at.most(
            containingRow.getBoundingClientRect().right,
          );
        });
    },
  );

  it(
    'AC8: stacks the summary columns below the primary content at narrow widths',
    { tags: [...buildTags('@JIRA-STORY:PO-2673'), '@JIRA-EPIC:PO-2673', '@JIRA-TEST-KEY:PO-2677'] },
    () => {
      cy.viewport(320, 900);

      const atAGlanceData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      atAGlanceData.party_details.individual_details = {
        ...atAGlanceData.party_details.individual_details!,
        forenames: 'A very long first name that should wrap cleanly',
        surname: 'A very long surname that should also wrap cleanly',
      };

      mount(FinesAccDefendantDetailsAtAGlanceTabComponent, {
        componentProperties: { tabData: atAGlanceData },
      });

      cy.contains('Defendant')
        .closest('.govuk-grid-column-one-third')
        .then(($defendantColumn) => {
          const defendantBottom = $defendantColumn[0].getBoundingClientRect().bottom;

          cy.contains('Payment terms')
            .closest('.govuk-grid-column-one-third')
            .then(($paymentTermsColumn) => {
              const paymentTermsBounds = $paymentTermsColumn[0].getBoundingClientRect();
              expect(paymentTermsBounds.top, 'payment terms should start below defendant details').to.be.at.least(
                defendantBottom,
              );

              cy.contains('Enforcement status')
                .closest('.govuk-grid-column-one-third')
                .then(($enforcementStatusColumn) => {
                  expect(
                    $enforcementStatusColumn[0].getBoundingClientRect().top,
                    'enforcement status should start below payment terms',
                  ).to.be.at.least(paymentTermsBounds.bottom);
                });
            });
        });
    },
  );
});

describe('Account Enquiry - Minor Creditor Header', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  const minorCreditorAccountId = FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK.creditor.account_id;
  const minorCreditorComponentProperties: IComponentProperties = {
    accountId: minorCreditorAccountId.toString(),
    routeRoot: 'minor-creditor',
    fragments: undefined,
    interceptedRoutes: [
      '/access-denied',
      '../note/add',
      '../debtor/individual/amend',
      '../debtor/parentGuardian/amend',
      // Add more routes here as needed
    ],
  };

  it(
    'AC4: retains all existing financial tiles for a regular Minor Creditor account with an associated Defendant Account',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-1924', '@JIRA-STORY:PO-2963'),
        '@JIRA-EPIC:PO-2234',
        '@JIRA-EPIC:PO-2630',
        '@JIRA-TEST-KEY:PO-4222',
      ],
    },
    () => {
      const header = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
      header.creditor.has_associated_defendant = true;
      header.financials.awaiting_payout = 100;
      header.financials.awarded = 200;
      header.financials.paid_out = 50;
      header.financials.outstanding = 150;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMinorCreditorHeader(minorCreditorAccountId, header, '1');
      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.minorCreditorAccountType).should('contain.text', 'Minor Creditor');
      cy.get(DOM.minorCreditorBusinessUnit).should(
        'contain.text',
        `${header.business_unit.business_unit_name} (${header.business_unit.business_unit_code})`,
      );

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.contains(DOM.labelAwaitingPayout)
          .should('be.visible')
          .closest(DOM.summaryMetricBarItem)
          .should('contain.text', '£100.00');
        cy.contains(DOM.labelAwarded)
          .should('be.visible')
          .closest(DOM.summaryMetricBarItem)
          .should('contain.text', '£200.00');
        cy.contains(DOM.labelPaidOut)
          .should('be.visible')
          .closest(DOM.summaryMetricBarItem)
          .should('contain.text', '£50.00');
        cy.contains(DOM.labelOutstanding)
          .should('be.visible')
          .closest(DOM.summaryMetricBarItem)
          .should('contain.text', '£150.00');
      });
    },
  );

  it(
    'AC1, AC2, AC3, AC5, AC6: displays only the API-provided Paid out repayment amount in the Minor Creditor header',
    { tags: [...buildTags('@JIRA-STORY:PO-2963'), '@JIRA-EPIC:PO-2630'] },
    () => {
      const baseHeader = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
      const repaymentHeader = {
        ...baseHeader,
        repayment: true,
        creditor: { ...baseHeader.creditor, has_associated_defendant: false },
        financials: {
          ...baseHeader.financials,
          awarded: 200,
          paid_out: 50,
          awaiting_payout: 100,
          outstanding: 150,
        },
      };

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMinorCreditorHeader(minorCreditorAccountId, repaymentHeader, '1');

      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.get(DOM.summaryMetricBarItem).should('have.length', 1);
        cy.contains(DOM.labelPaidOut)
          .should('be.visible')
          .closest(DOM.summaryMetricBarItem)
          .should('contain.text', '£50.00');
      });
      cy.get(DOM.summaryMetricBar).should('not.contain.text', DOM.labelAwarded);
      cy.get(DOM.summaryMetricBar).should('not.contain.text', DOM.labelAwaitingPayout);
      cy.get(DOM.summaryMetricBar).should('not.contain.text', DOM.labelOutstanding);

      cy.document().then((document) => {
        document.documentElement.lang = 'en';
      });
      cy.get('app-fines-acc-minor-creditor-details').then(($accountEnquiry) => {
        $accountEnquiry.wrap('<main id="component-test-main"></main>');
      });
      cy.injectAxe({ axeCorePath: 'node_modules/axe-core/axe.min.js' });
      cy.checkA11y('#component-test-main', {
        includedImpacts: ['critical', 'serious', 'moderate'],
      });
    },
  );

  it(
    'retains all financial tiles when a Minor Creditor has no associated Defendant Account but is not a repayment',
    { tags: [...buildTags('@JIRA-STORY:PO-2963'), '@JIRA-EPIC:PO-2630'] },
    () => {
      const header = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
      header.repayment = false;
      header.creditor.has_associated_defendant = false;
      header.financials.awaiting_payout = 100;
      header.financials.awarded = 200;
      header.financials.paid_out = 50;
      header.financials.outstanding = 150;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMinorCreditorHeader(minorCreditorAccountId, header, '1');
      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.get(DOM.summaryMetricBarItem).should('have.length', 4);
        cy.contains(DOM.labelAwarded).should('be.visible');
        cy.contains(DOM.labelPaidOut).should('be.visible');
        cy.contains(DOM.labelAwaitingPayout).should('be.visible');
        cy.contains(DOM.labelOutstanding).should('be.visible');
      });
    },
  );

  it(
    'displays a zero Paid out repayment amount without restoring the other financial tiles',
    { tags: [...buildTags('@JIRA-STORY:PO-2963'), '@JIRA-EPIC:PO-2630'] },
    () => {
      const header = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
      header.repayment = true;
      header.creditor.has_associated_defendant = false;
      header.financials.awarded = 200;
      header.financials.paid_out = 0;
      header.financials.awaiting_payout = 100;
      header.financials.outstanding = 150;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMinorCreditorHeader(minorCreditorAccountId, header, '1');
      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.get(DOM.summaryMetricBarItem).should('have.length', 1);
        cy.contains(DOM.labelPaidOut)
          .should('be.visible')
          .closest(DOM.summaryMetricBarItem)
          .should('contain.text', '£0.00');
      });
      cy.get(DOM.summaryMetricBar).should('not.contain.text', DOM.labelAwarded);
      cy.get(DOM.summaryMetricBar).should('not.contain.text', DOM.labelAwaitingPayout);
      cy.get(DOM.summaryMetricBar).should('not.contain.text', DOM.labelOutstanding);
    },
  );

  it(
    'formats a decimal Paid out repayment amount while displaying only one financial tile',
    { tags: [...buildTags('@JIRA-STORY:PO-2963'), '@JIRA-EPIC:PO-2630'] },
    () => {
      const header = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
      header.repayment = true;
      header.creditor.has_associated_defendant = false;
      header.financials.paid_out = 1234.5;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMinorCreditorHeader(minorCreditorAccountId, header, '1');
      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.get(DOM.summaryMetricBarItem).should('have.length', 1);
        cy.contains(DOM.labelPaidOut)
          .should('be.visible')
          .closest(DOM.summaryMetricBarItem)
          .should('contain.text', '£1,234.50');
      });
    },
  );

  it(
    'AC3a: shows add account note button and navigates to add note page',
    { tags: [...buildTags('@JIRA-STORY:PO-1924'), '@JIRA-EPIC:PO-2234', '@JIRA-TEST-KEY:PO-4224'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptMinorCreditorHeader(minorCreditorAccountId, FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK, '1');
      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.minorCreditorAddNoteButton).should('exist').click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/note\/add/);
        });
    },
  );

  it(
    'AC3b: access denied when user has no permission and minor creditor does have permission',
    { tags: [...buildTags('@JIRA-STORY:PO-1924'), '@JIRA-EPIC:PO-2234', '@JIRA-TEST-KEY:PO-4225'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptMinorCreditorHeader(minorCreditorAccountId, FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK, '1');
      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.minorCreditorAddNoteButton).should('exist').click();
      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/access-denied/);
        });
    },
  );

  it(
    'AC3c: hides Add account note when user has no permission in any BU',
    { tags: [...buildTags('@JIRA-STORY:PO-1924'), '@JIRA-EPIC:PO-2234', '@JIRA-TEST-KEY:PO-4226'] },
    () => {
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptMinorCreditorHeader(minorCreditorAccountId, FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK, '1');

      setupAccountEnquiryComponent(minorCreditorComponentProperties);

      cy.get(DOM.minorCreditorAddNoteButton).should('not.exist');
    },
  );
});
