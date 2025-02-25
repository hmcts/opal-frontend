import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsRemoveImpositionComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-remove-imposition/fines-mac-offence-details-remove-imposition.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { provideHttpClient } from '@angular/common/http';
import { UtilsService } from '@services/utils/utils.service';
import { DOM_ELEMENTS } from './constants/remove_imposition_elements';

describe('FinesRemoveImpositionComponent', () => {
  let finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
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
  });

  const setupComponent = () => {
    mount(FinesMacOffenceDetailsRemoveImpositionComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        UtilsService,
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
            store.setRowIndex(0);
            store.setRemoveMinorCreditor(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.removeMinorCreditor);
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

  it('(AC.1)should render the component correctly', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('(AC.1)(AC.2)should render all elements correctly', { tags: ['@PO-418', '@PO-672', '@PO-673'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).should('exist');

    cy.get(DOM_ELEMENTS.impositionType).should('exist');
    cy.get(DOM_ELEMENTS.creditor).should('exist');
    cy.get(DOM_ELEMENTS.amountImposed).should('exist');
    cy.get(DOM_ELEMENTS.amountPaid).should('exist');
    cy.get(DOM_ELEMENTS.balanceRemaining).should('exist');

    cy.get(DOM_ELEMENTS.removeImpositionButton).should('exist');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it(
    '(AC.2)should have correct field labels and names in the elements when loading data',
    { tags: ['@PO-418', '@PO-672', '@PO-673'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.heading).should('contain', 'Are you sure you want to remove this imposition?');

      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Imposition');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Creditor');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Balance remaining');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Criminal Courts Charge (FCC)');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'Aldi Stores Ltd (ALDI)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£150.00');
    },
  );

  it(
    '(AC.4)should set values to defaults or null after pressing the remove imposition button',
    { tags: ['@PO-418', '@PO-672', '@PO-673'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.removeImpositionButton).click();

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Fine (FO)');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts and Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£0.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£0.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£0.00');
    },
  );
});
//E-2-E Tests Required : Check Flow to access imposition removal screen (AC.2), Check Cancel link works and flows (AC.3) , Check Remove imposition button and flow works (AC.4)