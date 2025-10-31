import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as DOM } from './constants/account_enquiry_header_elements';
import {
  createDefendantHeaderMockWithName,
  createParentGuardianHeaderMockWithName,
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK,
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from './mocks/defendant_details_mock';

import {
  OPAL_FINES_ACCOUNT_ORG_AT_A_GLANCE_MOCK,
  OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK,
} from './mocks/defendant_details_at_glance_mock';
import { interceptAtAGlance, interceptDefendantHeader } from './intercept/defendantAccountIntercepts';
import { interceptAuthenticatedUser, interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { IComponentProperties } from './setup/setupComponent.interface';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { DEFENDANT_DETAILS } from './constants/defendant_details_elements';
import { setLanguagePref } from './Utils/SharedFunctions';

describe('Defendant Account Summary - At a Glance Tab', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });
  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'at-a-glance',
    interceptedRoutes: [
      '/access-denied',
      '../note/add',
      '../individual/amend',
      '../parentGuardian/amend',
      // Add more routes here as needed
    ],
  };
  it(
    'AC1,Ac1a, Ac1b: The At a Glance tab is built as per the design artefact for parent/guardian',
    { tags: ['PO-779'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK);
      header.party_details.organisation_flag = false;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, header, '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.headingWithCaption).should('exist');
      cy.get(DOM.headingName).should('exist').and('contain.text', 'Mr Anna GRAHAM');
      cy.get(DEFENDANT_DETAILS.parentGuardianTag).should('exist').and('contain.text', 'Parent or Guardian to pay');
      cy.get(DOM.accountInfo).should('exist');
      cy.get(DOM.summaryMetricBar).should('exist');
      cy.get(DOM.subnav).should('exist');
      cy.get(DOM.atAGlanceTabComponent).should('exist');
      cy.contains(DOM.labelDefendant).should('be.visible');
      cy.contains(DOM.labelPaymentTerms).should('be.visible');
      cy.get('input, textarea, select, [contenteditable="true"]').should('not.exist');
      cy.get(DEFENDANT_DETAILS.parentGuardianTableSections).should('contain.text', 'Parent or Guardian');
      cy.get(DEFENDANT_DETAILS.parentGuardianTableSections).should('contain.text', 'Language preferences');
      cy.get(DEFENDANT_DETAILS.parentGuardianTableSections).should('contain.text', 'Payment terms');
      cy.get(DEFENDANT_DETAILS.parentGuardianTableSections).should('contain.text', 'Enforcement status');
      cy.get(DEFENDANT_DETAILS.parentGuardianTableSections).should('contain.text', 'Comment');
      cy.get('h3')
        .contains('Name')
        .next('p')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          const normalized = text
            .replace(/\u00A0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          expect(normalized).to.eq('Mr Opal parent LNAME');
        });
      cy.get('h3').contains('Date of birth').next('p').should('be.visible').should('contain.text', ' 15 June 1975 ');
      cy.get('h3')
        .contains('Address')
        .next('p')
        .should('be.visible')
        .should('contain.text', ' PG2 addr1  PG2 addr2  PG2 addr3  PG12 3ST ');
      cy.get('h3')
        .contains('National Insurance Number')
        .next('p')
        .should('be.visible')
        .should('contain.text', ' OT000001D ');
    },
  );

  it(
    'AC2a: Displays read-only Language Preferences section below National Insurance Number',
    { tags: ['PO-779'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get('h3').contains('National Insurance Number').next('p').should('be.visible').as('niH3');
      cy.get('@niH3')
        .siblings('h2')
        .contains(/language preference(s)?/i)
        .should('be.visible')
        .within(() => {
          cy.get('input').should('not.exist');
          cy.get('select').should('not.exist');
          cy.get('textarea').should('not.exist');
        });
    },
  );

  it(
    'AC2b: displays Document language and Court hearing language values in Language Preferences section',
    { tags: ['PO-779'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_ORG_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.contains('h2', /language preference(s)?/i)
        .should('be.visible')
        .parent()
        .within(() => {
          // Verify Document language field and value are displayed
          cy.contains(/document language/i)
            .should('be.visible')
            .next('p')
            .contains('Welsh and English')
            .should('be.visible');

          //Verify Court hearing language field and value are displayed
          cy.contains(/court hearing language/i)
            .should('be.visible')
            .next('p')
            .contains('Welsh and English')
            .should('be.visible'); //This selects the same "Welsh and English" as above
        });
    },
  );
  it('AC2bi: Label Welsh and Language is displayed in blue', { tags: ['PO-779'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_ORG_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get(DOM.enforcementStatusTag)
      .should('be.visible')
      .and('contain.text', 'Welsh and English')
      .and('have.css', 'color', 'rgb(12, 45, 74)');
  });

  it('AC2bia: Label Welsh and Language is not displayed ', { tags: ['PO-779'] }, () => {
    let PGAtAGlance = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
    const { language_preferences } = PGAtAGlance;
    setLanguagePref(language_preferences!.document_language_preference);
    setLanguagePref(language_preferences!.hearing_language_preference);
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, PGAtAGlance, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.contains('h2', /language preference(s)?/i).should('not.exist');
    cy.contains(/document language/i).should('not.exist');
    cy.contains(/court hearing language/i).should('not.exist');
  });

  it('AC2c: Labels not displayed ', { tags: ['PO-779'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_ORG_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.contains('h2', /language preference(s)?/i).should('not.exist');
    cy.contains(/document language/i).should('not.exist');
    cy.contains('p', 'Welsh and English').should('not.exist');

    cy.contains(/court hearing language/i).should('not.exist');
    cy.contains('p', 'Welsh and English').should('not.exist');

    cy.get(DOM.enforcementStatusTag).should('not.exist');
  });

  it('AC3: displays Aliases section when defendant has one or more aliases', { tags: ['PO-779'] }, () => {
    const mockDataWithAlias = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
    const aliasOne = {
      alias_id: '12345',
      sequence_number: 1,
      surname: 'SMITH',
      forenames: 'Ewan',
    };
    const aliasTwo = {
      alias_id: '12346',
      sequence_number: 2,
      surname: 'WILLIAMS',
      forenames: 'Megan',
    };
    mockDataWithAlias.party_details.individual_details!.individual_aliases = [aliasOne, aliasTwo];
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, mockDataWithAlias, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get('h3')
      .contains('Aliases')
      .next('p')
      .should('exist')
      .invoke('text')
      .then((text) => {
        const aliases = text.replace(/\s+/g, ' ').trim();

        expect(aliases).to.contain('Ewan SMITH');
        expect(aliases).to.contain('Megan WILLIAMS');
        expect(aliases.indexOf('Ewan SMITH')).to.be.lessThan(aliases.indexOf('Megan WILLIAMS')); // order check
      });
  });

  it('AC3b: does not display Aliases section when defendant has no aliases', { tags: ['PO-779'] }, () => {
    const headerNoAliases = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
    headerNoAliases.party_details.individual_details!.individual_aliases = null;

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, headerNoAliases, '1');

    setupAccountEnquiryComponent(componentProperties);
    cy.get('h3').should('not.contain', 'Aliases');
  });

  it('AC4,AC4a: displays Comments section with no Account Comment or Free Text Notes', { tags: ['PO-779'] }, () => {
    const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
    mockDataNoComments.comments_and_notes = {
      account_comment: null,
      free_text_note_1: null,
      free_text_note_2: null,
      free_text_note_3: null,
    };

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, mockDataNoComments, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get('h3').contains('Comment').should('not.exist');
    cy.get('h3').contains('Free text notes').should('not.exist');
    cy.get(DOM.linkText).should('exist').should('have.text', 'Add comments');
  });

  it('AC4b, Ac9: displays Comments section with Account Comment but no Free Text Notes', { tags: ['PO-779'] }, () => {
    const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
    mockDataNoComments.comments_and_notes = {
      account_comment: 'Test account comment',
      free_text_note_1: null,
      free_text_note_2: null,
      free_text_note_3: null,
    };

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, mockDataNoComments, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get('h3').contains('Comment').and('be.visible').next('p').should('have.text', 'Test account comment');
    cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', '—');
  });

  it(
    'AC4c, AC9: displays Comments section with Free Text Notes but no Account Comment, showing em-dash for empty fields',
    { tags: ['PO-779'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: null,
        free_text_note_1: 'First note.',
        free_text_note_2: null,
        free_text_note_3: null,
      };

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, mockDataNoComments, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get('h3').contains('Comment').and('be.visible').next('p').should('contain.text', '-');

      cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', ' First note. ');
    },
  );

  it('AC4d: displays Comments section with both Account Comment and Free Text Notes', { tags: ['PO-779'] }, () => {
    const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
    mockDataNoComments.comments_and_notes = {
      account_comment: 'Test account comment',
      free_text_note_1: 'First note.',
      free_text_note_2: null,
      free_text_note_3: null,
    };

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, mockDataNoComments, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get('h3').contains('Comment').and('be.visible').next('p').should('have.text', 'Test account comment');
    cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', ' First note. ');
  });

  it(
    'AC5: Shows Add comments link and navigates to Comments screen when user has Account Maintenance permission in associated  BU',
    { tags: ['PO-779'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: null,
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      };
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, mockDataNoComments, '1');

      setupAccountEnquiryComponent(componentProperties);
      // First verify the button exists and is visible
      cy.get(DOM.linkText).should('be.visible').and('contain.text', 'Add comments');

      // Click the link
      cy.get(DOM.linkText).click();

      // Verify navigation to note/add page - check if router was called with the expected route
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../comments/add']);
    },
  );

  it(
    'AC5: Shows Change link and navigates to Comments screen when user has Account Maintenance permission in associated BU',
    { tags: ['PO-779'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: 'Test account comment',
        free_text_note_1: 'first note',
        free_text_note_2: null,
        free_text_note_3: null,
      };
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, mockDataNoComments, '1');

      setupAccountEnquiryComponent(componentProperties);
      cy.get(DOM.linkText).should('be.visible').and('contain.text', 'Change');

      cy.get(DOM.linkText).click();

      // Verify navigation to note/add page - check if router was called with the expected route
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['../comments/add']);
    },
  );

  it(
    'AC5a: Add Comment link exists when user has permission in at least one BU but not the BU associated to the account',
    { tags: ['PO-779'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: null,
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      };
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, mockDataNoComments, '1');

      setupAccountEnquiryComponent(componentProperties);
      // First verify the button exists and is visible
      cy.get(DOM.linkText).should('be.visible').and('contain.text', 'Add comments');

      // Click the link
      cy.get(DOM.linkText).click();

      // Verify navigation to access-denied page
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['/access-denied']);
    },
  );

  it(
    'AC5a: Change link exists when user has permission in at least one BU but not the BU associated to the account',
    { tags: ['PO-779'] },
    () => {
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU17);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);
      cy.get(DOM.linkText).should('be.visible').and('contain.text', 'Change');
      cy.get(DOM.linkText).click();

      // Verify navigation to access-denied page
      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['/access-denied']);
    },
  );

  it(
    'AC5b: Change link and add comment do not exist when user has no permission in any BU',
    { tags: ['PO-779'] },
    () => {
      interceptUserState(USER_STATE_MOCK_NO_PERMISSION);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK, '1');

      setupAccountEnquiryComponent(componentProperties);

      // Verify that neither Add comments nor Change links exist
      cy.get(DOM.linkText).should('not.exist');
      cy.get(DOM.addNoteButton).should('not.exist');
    },
  );

  it('AC6a: displays Payment Terms section for "Pay by date" scenario', { tags: ['PO-779'] }, () => {
    const mockDataPayByDate = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
    mockDataPayByDate.payment_terms = {
      payment_terms_type: {
        payment_terms_type_code: 'B',
        payment_terms_type_display_name: 'By date',
      },
      effective_date: '31/12/2024',
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
    };

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, mockDataPayByDate, '1');

    setupAccountEnquiryComponent(componentProperties);
    cy.get('h2').contains('Payment terms').should('exist');
    cy.get('h3').contains('Payment terms').and('be.visible').next('p').should('have.text', 'Pay by date');
    cy.get('h3').contains('By date').and('be.visible').next('p').should('have.text', ' 31 December 2024 ');

    // Verify that instalment-specific fields are not displayed
    cy.get('h3').contains('Frequency').should('not.exist');
    cy.get('h3').contains('Instalments').should('not.exist');
    cy.get('h3').contains('Start Date').should('not.exist');
  });

  it('AC6b: displays Payment Terms section for "Lump sum plus instalments" scenario', { tags: ['PO-779'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK, '1');

    setupAccountEnquiryComponent(componentProperties);

    cy.get('h3').contains('Payment terms').and('be.visible').next('p').should('have.text', 'Lump sum plus instalments');
    cy.get('h3').contains('Frequency').and('be.visible').next('p').should('have.text', 'Monthly');
    cy.get('h3').contains('Instalments').and('be.visible').next('p').should('have.text', ' £100.00 ');
    cy.get('h3').contains('Start date').and('be.visible').next('p').should('have.text', ' 01 January 2024 ');

    // Verify that "By date" field is not displayed
    cy.get('h3').contains('By date').should('not.exist');
  });

  it('AC6c: displays Payment Terms section for "Instalments only" scenario', { tags: ['PO-779'] }, () => {
    const mockDataPayByDate = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
    mockDataPayByDate.payment_terms = {
      payment_terms_type: {
        payment_terms_type_code: 'I',
        payment_terms_type_display_name: 'Instalments',
      },
      effective_date: '31/12/2024',
      instalment_period: {
        instalment_period_code: 'M',
        instalment_period_display_name: 'Monthly',
      },
      lump_sum_amount: null,
      instalment_amount: 100,
    };

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
    interceptAtAGlance(77, mockDataPayByDate, '1');

    setupAccountEnquiryComponent(componentProperties);
    cy.get('h2').contains('Payment terms').should('exist');
    cy.get('h3').contains('Frequency').and('be.visible').next('p').should('have.text', 'Monthly');
    cy.get('h3').contains('Instalments').and('be.visible').next('p').should('have.text', ' £100.00 ');
    cy.get('h3').contains('Start date').and('be.visible').next('p').should('have.text', ' 31 December 2024 ');
  });

  it(
    'AC7a, AC7b, AC7c, AC7d: displays Last Enforcement Action field only when value is present',
    { tags: ['PO-779'] },
    () => {
      const mockDataNoEnforcementAction = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
      mockDataNoEnforcementAction.enforcement_status = {
        last_enforcement_action: {
          last_enforcement_action_id: 'EA-001',
          last_enforcement_action_title: 'Warrant Issued',
        },
        collection_order_made: true,
        default_days_in_jail: 45,
        enforcement_override: {
          enforcement_override_result: {
            enforcement_override_result_id: 'EOR-001',
            enforcement_override_result_title: 'Override Approved',
          },
          enforcer: {
            enforcer_id: 10,
            enforcer_name: 'Court Officer',
          },
          lja: {
            lja_id: 20,
            lja_name: 'Central LJA',
          },
        },
        last_movement_date: '01/05/2024',
      };
      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, mockDataNoEnforcementAction, '1');

      setupAccountEnquiryComponent(componentProperties);
      cy.get('h3').contains('Days in default').and('be.visible').next('p').should('have.text', ' 45 days ');
      cy.get('h3')
        .contains('Enforcement override')
        .and('be.visible')
        .next('p')
        .should('have.text', ' Override Approved EOR-001 ');
      cy.get('h3').contains('Date of last movement').and('be.visible').next('p').should('have.text', ' 01 May 2024 ');
    },
  );

  it(
    'AC8a: displays blue "collection order" label when defendant is adult and CO flag is true',
    { tags: ['PO-779'] },
    () => {
      const mockDataAdultWithCO = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
      mockDataAdultWithCO.is_youth = false;
      mockDataAdultWithCO.enforcement_status.collection_order_made = true;
      mockDataAdultWithCO.enforcement_status.default_days_in_jail = 30;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, mockDataAdultWithCO, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.badgeBlue).contains('Collection Order').should('be.visible');
    },
  );

  it(
    'AC8b: displays red "no collection order" label when defendant is adult and CO flag is false',
    { tags: ['PO-779'] },
    () => {
      const mockDataAdultNoCO = structuredClone(OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_AT_A_GLANCE_MOCK);
      mockDataAdultNoCO.is_youth = false;
      mockDataAdultNoCO.enforcement_status.collection_order_made = false;
      mockDataAdultNoCO.enforcement_status.default_days_in_jail = 30;

      interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
      interceptDefendantHeader(77, createParentGuardianHeaderMockWithName('Albert', 'Lake'), '1');
      interceptAtAGlance(77, mockDataAdultNoCO, '1');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM.badgeRed).contains('No collection Order').should('be.visible');
    },
  );
});
