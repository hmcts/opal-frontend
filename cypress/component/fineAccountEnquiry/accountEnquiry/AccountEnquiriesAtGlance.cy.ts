import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { FinesAccDefendantDetailsComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details.component';
import { FinesAccountStore } from '../../../../src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { DOM_ELEMENTS as DOM } from './constants/defendant_details_elements';
import {
  createDefendantHeaderMockWithName,
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_ORG_MOCK,
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from './mocks/defendant_details_mock';

import {
  OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
  MOCK_FINES_ACCOUNT_STATE,
  OPAL_FINES_ACCOUNT_ORG_AT_A_GLANCE_MOCK,
} from './mocks/defendant_details_at_glance_mock';
import { interceptAtAGlance } from './intercept/defendantAccountIntercept';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

describe('Defendant Account Summary - At a Glance Tab', () => {
  const mockDataChangeName = structuredClone(DEFENDANT_HEADER_MOCK);
  if (mockDataChangeName.party_details.individual_details) {
    mockDataChangeName.party_details.individual_details.forenames = 'James';
    mockDataChangeName.party_details.individual_details.surname = 'Robert';
    mockDataChangeName.party_details.individual_details.title = 'Mr';
  }

  const setupComponent = (
    prefilledData = mockDataChangeName,
    language = MOCK_FINES_ACCOUNT_STATE,
    userState: IOpalUserState,
  ) => {
    cy.then(() => {
      mount(FinesAccDefendantDetailsComponent, {
        providers: [
          provideHttpClient(),
          OpalFines,
          {
            provide: FinesAccountStore,
            useFactory: () => {
              const store = new FinesAccountStore();
              const mockState = structuredClone(MOCK_FINES_ACCOUNT_STATE);

              if (prefilledData.party_details.organisation_flag) {
                mockState.party_name = prefilledData.party_details.organisation_details?.organisation_name ?? '';
                mockState.party_type = 'Organisation';
              } else {
                mockState.party_name =
                  `${prefilledData.party_details.individual_details?.forenames ?? ''} ${prefilledData.party_details.individual_details?.surname ?? ''}`.trim();
                mockState.party_type = 'Individual';
              }

              store.setAccountState(mockState);
              return store;
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              fragment: of('at-a-glance'),
              snapshot: {
                data: {
                  defendantAccountHeadingData: prefilledData,
                },
              },
            },
          },
          UtilsService,
          {
            provide: GlobalStore,
            useFactory: () => {
              const store = new GlobalStore();
              store.setUserState(userState);
              return store;
            },
          },
          {
            provide: Router,
            useValue: {
              navigate: cy.stub().as('routerNavigate'),
            },
          },
        ],
      });
    });
  };

  it(
    'AC1,Ac1a, Ac1b: The At a Glance tab is built as per the design artefact for company',
    { tags: ['PO-814'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.party_details.organisation_flag = true;
      header.party_details.organisation_details = {
        organisation_name: 'Test Org Ltd',
        organisation_aliases: [],
      };
      interceptAtAGlance(OPAL_FINES_ACCOUNT_ORG_AT_A_GLANCE_MOCK);
      setupComponent(header, MOCK_FINES_ACCOUNT_STATE, USER_STATE_MOCK_PERMISSION_BU77);
      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.headingWithCaption).should('exist');
      cy.get(DOM.headingName).should('exist').and('contain.text', 'Test Org Ltd');
      cy.get(DOM.accountInfo).should('exist');
      cy.get(DOM.summaryMetricBar).should('exist');
      cy.get(DOM.subnav).should('exist');
      cy.get(DOM.atAGlanceTabComponent).should('exist');
      cy.contains(DOM.labelDefendant).should('be.visible');
      cy.contains(DOM.labelPaymentTerms).should('be.visible');
      cy.contains(DOM.labelEnforcementStatus).should('be.visible');
      cy.get('h3').contains('Company Name').next('p').should('be.visible').and('contain.text', ' Tech Solutions Ltd ');
      cy.get('h3')
        .contains('Address')
        .next('p')
        .should('be.visible')
        .should('contain.text', ' 123 Main Street  Apt 4  AB12 3CD ');
    },
  );

  it(
    'AC1,Ac1a, Ac1b: The At a Glance tab is built as per the design artefact for defendant',
    { tags: ['PO-984'] },
    () => {
      interceptAtAGlance();
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get(DOM.pageHeader).should('exist');
      cy.get(DOM.headingWithCaption).should('exist');
      cy.get(DOM.headingName).should('exist').and('contain.text', 'Robert Thomson');
      cy.get(DOM.accountInfo).should('exist');
      cy.get(DOM.summaryMetricBar).should('exist');
      cy.get(DOM.subnav).should('exist');
      cy.get(DOM.atAGlanceTabComponent).should('exist');
      cy.contains(DOM.labelDefendant).should('be.visible');
      cy.contains(DOM.labelPaymentTerms).should('be.visible');
      cy.contains(DOM.labelEnforcementStatus).should('be.visible');
      cy.get('h3')
        .contains('Date of birth')
        .next('p')
        .should('be.visible')
        .should('contain.text', ' 03 February 1980 ');
      cy.get('h3')
        .contains('Address')
        .next('p')
        .should('be.visible')
        .should('contain.text', ' 123 Main Street  Apt 4  AB12 3CD ');
    },
  );

  it('AC2a: Displays Language Preferences section below National Insurance Number', { tags: ['PO-984'] }, () => {
    interceptAtAGlance();
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );
    cy.get('h3').contains('National Insurance Number').next('p').should('be.visible').as('niH3');
    cy.get('@niH3')
      .siblings('h2')
      .contains(/language preference(s)?/i)
      .should('be.visible');
  });

  it('AC2ai: Displays Language Preferences as read-only fields', { tags: ['PO-984', 'PO-814'] }, () => {
    interceptAtAGlance();
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );

    cy.contains('h2', /language preference(s)?/i)
      .should('be.visible')
      .parent()
      .within(() => {
        // Verify all language preference fields are read-only (no input elements)
        cy.get('input').should('not.exist');
        cy.get('select').should('not.exist');
        cy.get('textarea').should('not.exist');
      });
  });

  it(
    'AC2b: displays Document language and Court hearing language values in Language Preferences section',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      interceptAtAGlance();
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.contains('h2', /language preference(s)?/i)
        .should('be.visible')
        .parent()
        .within(() => {
          // Verify Document language field and value are displayed
          cy.contains(/document language/i).should('be.visible');
          cy.contains('p', 'Welsh and English').should('be.visible');

          //Verify Court hearing language field and value are displayed
          cy.contains(/court hearing language/i).should('be.visible');
          cy.contains('p', 'Welsh and English').should('be.visible');
        });
    },
  );
  it('AC2bi: Label Welsh and Language is displayed in blue', { tags: ['PO-984', 'PO-814'] }, () => {
    interceptAtAGlance();
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );
    cy.get(DOM.enforcementStatusTag)
      .should('be.visible')
      .and('contain.text', 'Welsh and English')
      .and('have.css', 'color', 'rgb(12, 45, 74)');
  });

  it('AC2bia: Label Welsh and Language is not displayed ', { tags: ['PO-984', 'PO-814'] }, () => {
    interceptAtAGlance();
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );
    cy.get(DOM.enforcementStatusTag).should('not.exist');
  });

  it('AC2c: Labels not displayed ', { tags: ['PO-984', 'PO-814'] }, () => {
    interceptAtAGlance();
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );

    cy.contains('h2', /language preference(s)?/i).should('not.exist');
    cy.contains(/document language/i).should('not.exist');
    cy.contains('p', 'Welsh and English').should('not.exist');

    cy.contains(/court hearing language/i).should('not.exist');
    cy.contains('p', 'Welsh and English').should('not.exist');
  });

  it('AC3: displays Aliases section when defendant has one or more aliases', { tags: ['PO-984'] }, () => {
    interceptAtAGlance();
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );

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
  it('AC3b: does not display Aliases section when defendant has no aliases', { tags: ['PO-984'] }, () => {
    const headerNoAliases = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    headerNoAliases.party_details.individual_details!.individual_aliases = [];
    interceptAtAGlance(headerNoAliases);
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );
    cy.get('h3').contains('Aliases').next('p').should('not.have.text');
  });

  it('AC3: displays Aliases section when company has one or more aliases', { tags: ['PO-814'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_MOCK);
    header.party_details.organisation_flag = true;
    header.party_details.organisation_details = {
      organisation_name: 'Test Org Ltd',
      organisation_aliases: [],
    };
    interceptAtAGlance(OPAL_FINES_ACCOUNT_ORG_AT_A_GLANCE_MOCK);
    setupComponent(header, MOCK_FINES_ACCOUNT_STATE, USER_STATE_MOCK_PERMISSION_BU77);
    cy.get(DOM.pageHeader).should('exist');

    cy.get('h3')
      .contains('Aliases')
      .next('p')
      .should('exist')
      .invoke('text')
      .then((text) => {
        const aliases = text.replace(/\s+/g, ' ').trim();

        expect(aliases).to.contain('Meridian Construction Ltd');
        expect(aliases).to.contain('Meridian Solutions Ltd');
        expect(aliases.indexOf('Meridian Construction Ltd')).to.be.lessThan(aliases.indexOf('Meridian Solutions Ltd')); // order check
      });
  });

  it('AC3b: does not display Aliases section when company has no aliases', { tags: ['PO-814'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_MOCK);
    header.party_details.organisation_flag = true;
    header.party_details.organisation_details = {
      organisation_name: 'Test Org Ltd',
      organisation_aliases: [],
    };
    const headerNoAliases = structuredClone(OPAL_FINES_ACCOUNT_ORG_AT_A_GLANCE_MOCK);
    headerNoAliases.party_details.organisation_details!.organisation_aliases = [];
    interceptAtAGlance(headerNoAliases);
    setupComponent(header, MOCK_FINES_ACCOUNT_STATE, USER_STATE_MOCK_PERMISSION_BU77);
    cy.get('h3').contains('Aliases').next('p').should('not.have.text');
  });

  it(
    'AC4,AC4a: displays Comments section with no Account Comment or Free Text Notes',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: null,
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      };

      interceptAtAGlance(mockDataNoComments);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get('h3').contains('Comment').should('not.exist');
      cy.get('h3').contains('Free text notes').should('not.exist');
      cy.get(DOM.linkText).should('exist').should('have.text', 'Add comments');
    },
  );

  it(
    'AC4b, Ac9: displays Comments section with Account Comment but no Free Text Notes',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: 'Test account comment',
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      };

      interceptAtAGlance(mockDataNoComments);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get('h3').contains('Comment').and('be.visible').next('p').should('have.text', 'Test account comment');
      cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', '—');
    },
  );

  it(
    'AC4c, Ac9: displays Comments section with Free Text Notes but no Account Comment',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: null,
        free_text_note_1: 'First note.',
        free_text_note_2: null,
        free_text_note_3: null,
      };

      interceptAtAGlance(mockDataNoComments);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get('h3').contains('Comment').and('be.visible').next('p').should('have.text', '-');
      cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', ' First note. ');
    },
  );

  it(
    'AC4d: displays Comments section with both Account Comment and Free Text Notes',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: 'Test account comment',
        free_text_note_1: 'First note.',
        free_text_note_2: null,
        free_text_note_3: null,
      };

      interceptAtAGlance(mockDataNoComments);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get('h3').contains('Comment').and('be.visible').next('p').should('have.text', 'Test account comment');
      cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', ' First note. ');
    },
  );

  it(
    'AC5: Shows Add comments link and navigates to Comments screen when user has Account Maintenance permission in associated  BU',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: null,
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      };
      interceptAtAGlance(mockDataNoComments);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );
      // First verify the button exists and is visible
      cy.get(DOM.linkText).should('be.visible').and('contain.text', 'Add comments');

      // Click the link
      cy.get(DOM.linkText).click();

      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/comments\/add/);
        });
    },
  );

  it(
    'AC5: Shows Change link and navigates to Comments screen when user has Account Maintenance permission in associated BU',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: 'Test account comment',
        free_text_note_1: 'first note',
        free_text_note_2: null,
        free_text_note_3: null,
      };
      interceptAtAGlance(mockDataNoComments);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );
      cy.get(DOM.linkText).should('be.visible').and('contain.text', 'Change');

      cy.get(DOM.linkText).click();

      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/comments\/add/);
        });
    },
  );

  it(
    'AC5a: Add Comment link exists when user has permission in at least one BU but not the BU associated to the account',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataNoComments.comments_and_notes = {
        account_comment: null,
        free_text_note_1: null,
        free_text_note_2: null,
        free_text_note_3: null,
      };
      interceptAtAGlance(mockDataNoComments);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU17,
      );
      // First verify the button exists and is visible
      cy.get(DOM.linkText).should('be.visible').and('contain.text', 'Add comments');

      // Click the link
      cy.get(DOM.linkText).click();

      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/access-denied/);
        });
    },
  );

  it(
    'AC5a: Change link exists when user has permission in at least one BU but not the BU associated to the account',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      interceptAtAGlance();
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU17,
      );
      cy.get(DOM.linkText).should('be.visible').and('contain.text', 'Change');
      cy.get(DOM.linkText).click();

      cy.get('@routerNavigate')
        .its('lastCall.args.0')
        .should((arg0) => {
          const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0);
          expect(path).to.match(/access-denied/);
        });
    },
  );

  it(
    'AC5b: Change link and add comment do not exist when user has no permission in any BU',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      interceptAtAGlance();
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_NO_PERMISSION,
      );
      cy.get(DOM.linkText).should('not.exist');
    },
  );

  it('AC6a: displays Payment Terms section for "Pay by date" scenario', { tags: ['PO-984', 'PO-814'] }, () => {
    const mockDataPayByDate = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
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

    interceptAtAGlance(mockDataPayByDate);
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );
    cy.get('h2').contains('Payment terms').should('exist');
    cy.get('h3').contains('Payment terms').and('be.visible').next('p').should('have.text', 'Pay by date');
    cy.get('h3').contains('By date').and('be.visible').next('p').should('have.text', ' 31 December 2024 ');

    // Verify that instalment-specific fields are not displayed
    cy.get('h3').contains('Frequency').should('not.exist');
    cy.get('h3').contains('Instalments').should('not.exist');
    cy.get('h3').contains('Start Date').should('not.exist');
  });

  it(
    'AC6b: displays Payment Terms section for "Lump sum plus instalments" scenario',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      interceptAtAGlance();
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get('h3')
        .contains('Payment terms')
        .and('be.visible')
        .next('p')
        .should('have.text', 'Lump sum plus instalments');
      cy.get('h3').contains('Frequency').and('be.visible').next('p').should('have.text', 'Monthly');
      cy.get('h3').contains('Instalments').and('be.visible').next('p').should('have.text', ' £100.00 ');
      cy.get('h3').contains('Start date').and('be.visible').next('p').should('have.text', ' 01 January 2024 ');

      // Verify that "By date" field is not displayed
      cy.get('h3').contains('By date').should('not.exist');
    },
  );

  it('AC6c: displays Payment Terms section for "Instalments only" scenario', { tags: ['PO-984', 'PO-814'] }, () => {
    const mockDataPayByDate = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    mockDataPayByDate.payment_terms = {
      payment_terms_type: {
        payment_terms_type_code: 'I',
        payment_terms_type_display_name: 'By date',
      },
      effective_date: '31/12/2024',
      instalment_period: {
        instalment_period_code: 'M',
        instalment_period_display_name: 'Monthly',
      },
      lump_sum_amount: 1000,
      instalment_amount: 100,
    };

    interceptAtAGlance(mockDataPayByDate);
    setupComponent(
      createDefendantHeaderMockWithName('Robert', 'Thomson'),
      MOCK_FINES_ACCOUNT_STATE,
      USER_STATE_MOCK_PERMISSION_BU77,
    );
    cy.get('h2').contains('Payment terms').should('exist');
    cy.get('h3').contains('Frequency').and('be.visible').next('p').should('have.text', 'Monthly');
    cy.get('h3').contains('Instalments').and('be.visible').next('p').should('have.text', ' £100.00 ');
    cy.get('h3').contains('Start date').and('be.visible').next('p').should('have.text', ' 31 December 2024 ');
  });

  it(
    'AC7a, AC7b, AC7c, AC7d: displays Last Enforcement Action field only when value is present',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataNoEnforcementAction = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      ((mockDataNoEnforcementAction.enforcement_status = {
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
      }),
        interceptAtAGlance(mockDataNoEnforcementAction));
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );
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
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataAdultWithCO = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataAdultWithCO.is_youth = false;
      mockDataAdultWithCO.enforcement_status.collection_order_made = true;
      mockDataAdultWithCO.enforcement_status.default_days_in_jail = 30;

      interceptAtAGlance(mockDataAdultWithCO);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get(DOM.badgeBlue)
        .contains('Collection Order')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(29, 112, 184)');
    },
  );
  it(
    'AC8b: displays red "no collection order" label when defendant is adult and CO flag is false',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataAdultNoCO = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataAdultNoCO.is_youth = false;
      mockDataAdultNoCO.enforcement_status.collection_order_made = false;
      mockDataAdultNoCO.enforcement_status.default_days_in_jail = 30;

      interceptAtAGlance(mockDataAdultNoCO);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get(DOM.badgeRed)
        .contains('No collection Order')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(212, 53, 28)');
    },
  );

  it(
    'AC8c: displays red "no collection order" label when defendant is youth and CO flag is true',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataYouthWithCO = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataYouthWithCO.is_youth = true;
      mockDataYouthWithCO.enforcement_status.collection_order_made = true;

      interceptAtAGlance(mockDataYouthWithCO);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get(DOM.badgeRed)
        .contains('No collection Order')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(212, 53, 28)');
    },
  );

  it(
    'AC8d: displays no collection order label when defendant is youth and CO flag is false',
    { tags: ['PO-984', 'PO-814'] },
    () => {
      const mockDataYouthNoCO = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataYouthNoCO.is_youth = true;
      mockDataYouthNoCO.enforcement_status.collection_order_made = false;

      interceptAtAGlance(mockDataYouthNoCO);
      setupComponent(
        createDefendantHeaderMockWithName('Robert', 'Thomson'),
        MOCK_FINES_ACCOUNT_STATE,
        USER_STATE_MOCK_PERMISSION_BU77,
      );

      cy.get('opal-lib-govuk-tag')
        .contains(/collection order/i)
        .should('not.exist');
      cy.get('h2').contains('Enforcement status').should('be.visible');
    },
  );
});
