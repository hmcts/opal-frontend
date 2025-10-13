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
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_YOUTH_MOCK,
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU77,
  USER_STATE_MOCK_PERMISSION_BU17,
  DEFENDANT_HEADER_ORG_MOCK,
} from './mocks/defendant_details_mock';
import {
  OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
  MOCK_FINES_ACCOUNT_STATE,
} from './mocks/defendant_details_at_glance_mock';
import { interceptAtAGlance } from './intercept/defendentAccountIntercept';

describe('Defendant Account Summary (Component)', () => {
  const setupComponent = (
    prefilledData = DEFENDANT_HEADER_MOCK,
    language = MOCK_FINES_ACCOUNT_STATE,
    //atAGlanceData = OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
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
  // beforeEach(() => {
  //   MOCK_ACCOUNT_STATE;
  // });

  it('AC2a: displays Language Preferences section below National Insurance Number', { tags: ['PO-984'] }, () => {
    interceptAtAGlance();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.headingWithCaption).should('exist');
    cy.get(DOM.headingName).should('exist').and('contain.text', 'Anna Graham');
    cy.get(DOM.accountInfo).should('exist');
    cy.get(DOM.summaryMetricBar).should('exist');
    cy.get(DOM.subnav).should('exist');
    cy.get(DOM.atAGlanceTabComponent).should('exist');
    cy.contains('h3', /national insurance number/i)
      .should('be.visible')
      .as('niH3');
    cy.get('@niH3')
      .siblings('h2')
      .contains(/language preference(s)?/i)
      .should('be.visible');
  });
  it('AC2ai: displays Language Preferences as read-only fields', { tags: ['PO-1593', 'PO-866'] }, () => {
    interceptAtAGlance();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

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
    { tags: ['PO-984'] },
    () => {
      interceptAtAGlance();
      setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

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
  it('AC2bi: Label Welsh and Language is displayed in blue', { tags: ['PO-1593', 'PO-866'] }, () => {
    interceptAtAGlance();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);
    cy.get(':nth-child(1) > opal-lib-govuk-tag > #enforcement_status')
      .should('be.visible')
      .and('contain.text', 'Welsh and English')
      .and('have.css', 'color', 'rgb(12, 45, 74)');
  });

  it('AC2bia: Label Welsh and Language is not displayed ', { tags: ['PO-1593', 'PO-866'] }, () => {
    interceptAtAGlance();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);
    cy.get(':nth-child(1) > opal-lib-govuk-tag > #enforcement_status').should('not.exist');
  });

  it('AC2c: Labels not displayed ', { tags: ['PO-1593', 'PO-866'] }, () => {
    interceptAtAGlance();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

    cy.contains('h2', /language preference(s)?/i).should('not.exist');
    cy.contains(/document language/i).should('not.exist');
    cy.contains('p', 'Welsh and English').should('not.exist');

    //Verify Court hearing language field and value are displayed
    cy.contains(/court hearing language/i).should('not.exist');
    cy.contains('p', 'Welsh and English').should('not.exist');
  });

  it('AC3: displays Aliases section when defendant has one or more aliases', { tags: ['PO-1593', 'PO-866'] }, () => {
    interceptAtAGlance();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

    cy.get('h3')
      .contains('Aliases')
      .next('p')
      .should('exist')
      .invoke('text')
      .then((text) => {
        const cleaned = text.replace(/\s+/g, ' ').trim();

        expect(cleaned).to.contain('B SMITH');
        expect(cleaned).to.contain('A GRAHAM');
        expect(cleaned.indexOf('B SMITH')).to.be.lessThan(cleaned.indexOf('A GRAHAM')); // order check
      });
  });
  it('AC3b: does not display Aliases section when defendant has no aliases', { tags: ['PO-984'] }, () => {
    const headerNoAliases = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    headerNoAliases.party_details.individual_details!.individual_aliases = [];
    interceptAtAGlance(headerNoAliases);
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);
    cy.get('h3').contains('Aliases').should('not.exist');
  });

  it('AC3b: does not display Aliases section when defendant has no aliases', { tags: ['PO-984'] }, () => {
    const headerNoAliases = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    headerNoAliases.party_details.individual_details!.individual_aliases = [];
    interceptAtAGlance(headerNoAliases);
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);
    cy.get('h3').contains('Aliases').should('not.exist');
  });

  it('AC4,AC4a: displays Comments section with no Account Comment or Free Text Notes', { tags: ['PO-984'] }, () => {
    const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    mockDataNoComments.comments_and_notes = {
      account_comment: null,
      free_text_note_1: null,
      free_text_note_2: null,
      free_text_note_3: null,
    };

    interceptAtAGlance(mockDataNoComments);
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

    cy.get('h3').contains('Comment').should('not.exist');
    cy.get('h3').contains('Free text notes').should('not.exist');
    cy.get('a[class="govuk-link govuk-link--no-visited-state"]').should('exist').should('have.text', 'Add comments');
  });

  it('AC4b: displays Comments section with Account Comment but no Free Text Notes', { tags: ['PO-984'] }, () => {
    const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    mockDataNoComments.comments_and_notes = {
      account_comment: 'Test account comment',
      free_text_note_1: null,
      free_text_note_2: null,
      free_text_note_3: null,
    };

    interceptAtAGlance(mockDataNoComments);
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

    cy.get('h3').contains('Comment').and('be.visible').next('p').should('have.text', 'Test account comment');
    cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', '—');
  });

  it('AC4c: displays Comments section with Free Text Notes but no Account Comment', { tags: ['PO-984'] }, () => {
    const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    mockDataNoComments.comments_and_notes = {
      account_comment: null,
      free_text_note_1: 'First note.',
      free_text_note_2: null,
      free_text_note_3: null,
    };

    interceptAtAGlance(mockDataNoComments);
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

    cy.get('h3').contains('Comment').and('be.visible').next('p').should('have.text', '-');
    cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', ' First note. ');
  });

  it('AC4d: displays Comments section with both Account Comment and Free Text Notes', { tags: ['PO-984'] }, () => {
    const mockDataNoComments = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    mockDataNoComments.comments_and_notes = {
      account_comment: 'Test account comment',
      free_text_note_1: 'First note.',
      free_text_note_2: null,
      free_text_note_3: null,
    };

    interceptAtAGlance(mockDataNoComments);
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

    cy.get('h3').contains('Comment').and('be.visible').next('p').should('have.text', 'Test account comment');
    cy.get('h3').contains('Free text notes').and('be.visible').next('p').should('have.text', ' First note. ');
  });

  it('AC6a: displays Payment Terms section for "Pay by date" scenario', { tags: ['PO-984'] }, () => {
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
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);
    cy.get('h2').contains('Payment terms').should('exist');
    cy.get('h3').contains('Payment terms').and('be.visible').next('p').should('have.text', 'Pay by date');
    cy.get('h3').contains('By date').and('be.visible').next('p').should('have.text', ' 31 December 2024 ');

    // Verify that instalment-specific fields are not displayed
    cy.get('h3').contains('Frequency').should('not.exist');
    cy.get('h3').contains('Instalments').should('not.exist');
    cy.get('h3').contains('Start Date').should('not.exist');
  });

  it('AC6b: displays Payment Terms section for "Lump sum plus instalments" scenario', { tags: ['PO-984'] }, () => {
    interceptAtAGlance();
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

    cy.get('h3').contains('Payment terms').and('be.visible').next('p').should('have.text', 'Lump sum plus instalments');
    cy.get('h3').contains('Frequency').and('be.visible').next('p').should('have.text', 'Monthly');
    cy.get('h3').contains('Instalments').and('be.visible').next('p').should('have.text', ' £100.00 ');
    cy.get('h3').contains('Start date').and('be.visible').next('p').should('have.text', ' 01 January 2024 ');

    // Verify that "By date" field is not displayed
    cy.get('h3').contains('By date').should('not.exist');
  });

  it('AC6c: displays Payment Terms section for "Instalments only" scenario', { tags: ['PO-984'] }, () => {
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
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);
    cy.get('h2').contains('Payment terms').should('exist');
    cy.get('h3').contains('Frequency').and('be.visible').next('p').should('have.text', 'Monthly');
    cy.get('h3').contains('Instalments').and('be.visible').next('p').should('have.text', ' £100.00 ');
    cy.get('h3').contains('Start date').and('be.visible').next('p').should('have.text', ' 31 December 2024 ');
  });

  it(
    'AC7a, AC7b, AC7c, AC7d: displays Last Enforcement Action field only when value is present',
    { tags: ['PO-984'] },
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
      setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);
      //to do existing tests
      cy.get('h3').contains('Last Enforcement Action').should('not.exist');
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
    { tags: ['PO-984'] },
    () => {
      const mockDataAdultWithCO = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataAdultWithCO.is_youth = false;
      mockDataAdultWithCO.enforcement_status.collection_order_made = true;
      mockDataAdultWithCO.enforcement_status.default_days_in_jail = 30;

      interceptAtAGlance(mockDataAdultWithCO);
      setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

      cy.get('span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--blue"]')
        .contains('Collection Order')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(29, 112, 184)');
    },
  );
  it(
    'AC8b: displays red "no collection order" label when defendant is adult and CO flag is false',
    { tags: ['PO-984'] },
    () => {
      const mockDataAdultNoCO = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataAdultNoCO.is_youth = false;
      mockDataAdultNoCO.enforcement_status.collection_order_made = false;
      mockDataAdultNoCO.enforcement_status.default_days_in_jail = 30;

      interceptAtAGlance(mockDataAdultNoCO);
      setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

      cy.get('span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--red"]')
        .contains('No collection Order')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(212, 53, 28)');
    },
  );
  //the red flag is not coming for youth with co true
  it(
    'AC8c: displays red "no collection order" label when defendant is youth and CO flag is true',
    { tags: ['PO-984'] },
    () => {
      const mockDataYouthWithCO = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataYouthWithCO.is_youth = true;
      mockDataYouthWithCO.enforcement_status.collection_order_made = true;

      interceptAtAGlance(mockDataYouthWithCO);
      setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

      cy.get('span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--red"]')
        .contains('No collection Order')
        .should('be.visible')
        .and('have.css', 'color', 'rgb(212, 53, 28)');
    },
  );
  it.only(
    'AC8d: displays no collection order label when defendant is youth and CO flag is false',
    { tags: ['PO-984'] },
    () => {
      const mockDataYouthNoCO = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      mockDataYouthNoCO.is_youth = true;
      mockDataYouthNoCO.enforcement_status.collection_order_made = false;

      interceptAtAGlance(mockDataYouthNoCO);
      setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);

      cy.get('opal-lib-govuk-tag')
        .contains(/collection order/i)
        .should('not.exist');
      cy.get('h2').contains('Enforcement Status').should('be.visible');
    },
  );
});
//  MOCK DATA
