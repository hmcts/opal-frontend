import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { FinesAccDefendantDetailsComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details.component';
import { FinesAccountStore } from '../../../../src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
// constants + mocks
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
import { get } from 'https';

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

  it.only('AC3b: does not display Aliases section when defendant has no aliases', { tags: ['PO-984'] }, () => {
    const headerNoAliases = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    headerNoAliases.party_details.individual_details!.individual_aliases = [];
    interceptAtAGlance(headerNoAliases);
    setupComponent(DEFENDANT_HEADER_MOCK, MOCK_FINES_ACCOUNT_STATE);
    cy.get('h3').contains('Aliases').should('not.exist');
  });
});
