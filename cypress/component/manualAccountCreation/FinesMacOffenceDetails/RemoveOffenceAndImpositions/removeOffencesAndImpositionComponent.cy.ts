import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-remove-offence-and-impositions/fines-mac-offence-details-remove-offence-and-impositions.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { provideHttpClient } from '@angular/common/http';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { DOM_ELEMENTS } from './constants/remove_offences_and_imposition_elements';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from './mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_STATE_MOCK } from 'src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';

describe('RemoveOffenceAndImpositionsComponent', () => {
  let finesMacState = FINES_MAC_STATE_MOCK;
  finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];

  let finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;

  beforeEach(() => {
    cy.intercept('GET', '**/opal-fines-service/results**', {
      statusCode: 200,
      body: OPAL_FINES_RESULTS_REF_DATA_MOCK,
    });
    cy.intercept('GET', '**/opal-fines-service/major-creditors**', {
      statusCode: 200,
      body: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
    });
    cy.intercept(
      {
        method: 'GET',
        pathname: '/opal-fines-service/offences',
      },
      (req) => {
        const requestedCjsCode = req.query['q'];
        const matchedOffences = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData.filter(
          (offence) => offence.get_cjs_code === requestedCjsCode,
        );
        req.reply({
          count: matchedOffences.length,
          refData: matchedOffences,
        });
      },
    );
  });

  const setupComponent = () => {
    mount(FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
        {
          provide: FinesMacOffenceDetailsStore,
          useFactory: () => {
            const store = new FinesMacOffenceDetailsStore();
            store.setOffenceDetailsDraft(finesMacOffenceDetailsDraftState.offenceDetailsDraft);
            return store;
          },
        },

        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {},
    });
  };
  it('(AC.1) should render component', { tags: ['@PO-416', '@PO-682', '@PO-680', '@PO-545'] }, () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.app).should('exist');
  });
  it('(AC.1) should load all elements on the page', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.caption).should('exist');
    cy.get(DOM_ELEMENTS.captionText).should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).should('exist');
    cy.get(DOM_ELEMENTS.impositionType).should('exist');
    cy.get(DOM_ELEMENTS.creditor).should('exist');
    cy.get(DOM_ELEMENTS.amountImposed).should('exist');
    cy.get(DOM_ELEMENTS.amountPaid).should('exist');
    cy.get(DOM_ELEMENTS.balanceRemaining).should('exist');
    cy.get(DOM_ELEMENTS.totalHeading).should('exist');
    cy.get(DOM_ELEMENTS.totalAmountImposed).should('exist');
    cy.get(DOM_ELEMENTS.totalAmountPaid).should('exist');
    cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('exist');
    cy.get(DOM_ELEMENTS.removeImpositionButton).should('exist');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it(
    '(AC.2, AC.3) should have appropriate text for each element',
    { tags: ['@PO-416', '@PO-682', '@PO-680', '@PO-545'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.heading).should(
        'contain',
        'Are you sure you want to remove this offence and all its impositions?',
      );
      cy.get(DOM_ELEMENTS.caption).should('contain', 'AK123456');
      cy.get(DOM_ELEMENTS.captionText).should('contain', 'ak test');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Imposition');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Creditor');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Balance remaining');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Criminal Courts Charge');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£150.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£150.00');

      cy.get(DOM_ELEMENTS.removeImpositionButton).should('contain', 'Yes - remove offence and all impositions');
      cy.get(DOM_ELEMENTS.cancelLink).should('contain', 'No - cancel');
    },
  );
});
