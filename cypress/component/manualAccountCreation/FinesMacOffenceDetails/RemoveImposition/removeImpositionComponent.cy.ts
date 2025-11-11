import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsRemoveImpositionComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-remove-imposition/fines-mac-offence-details-remove-imposition.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { provideHttpClient } from '@angular/common/http';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DOM_ELEMENTS } from './constants/remove_imposition_elements';
import { RouterTestingModule } from '@angular/router/testing';

describe('FinesRemoveImpositionComponent', () => {
  let finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
  let finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
  let setDraftSpy: sinon.SinonSpy;

  // Updated setupComponent for AC.4 test: allows spying on setOffenceDetailsDraft
  const setupComponent = () => {
    let offenceDetailsStoreSpy;
    return mount(FinesMacOffenceDetailsRemoveImpositionComponent, {
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'add-offence', component: FinesMacOffenceDetailsRemoveImpositionComponent }]),
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
            offenceDetailsStoreSpy = new FinesMacOffenceDetailsStore();
            setDraftSpy = Cypress.sinon.spy(offenceDetailsStoreSpy, 'setOffenceDetailsDraft');
            offenceDetailsStoreSpy.setOffenceDetailsDraft(finesMacOffenceDetailsDraftState.offenceDetailsDraft);
            offenceDetailsStoreSpy.setRowIndex(0);
            offenceDetailsStoreSpy.setRemoveMinorCreditor(
              FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.removeMinorCreditor,
            );
            return offenceDetailsStoreSpy;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
    });
  };

  it('(AC.1)should render the component correctly', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('(AC.1)(AC.2)should render all elements correctly', { tags: ['@PO-418', '@PO-672', '@PO-673', '@PO-545'] }, () => {
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
    { tags: ['@PO-418', '@PO-672', '@PO-673', '@PO-545'] },
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
    { tags: ['@PO-418', '@PO-672', '@PO-673', '@PO-545'] },
    () => {
      setupComponent();

      cy.wrap(setDraftSpy).should('have.been.calledOnce');

      cy.wrap(setDraftSpy).then((setDraft: any) => {
        const beforeDraft = structuredClone(setDraft.firstCall.args[0]);

        // Assert the impositions before removal
        const impositionsBefore = beforeDraft[0].formData.fm_offence_details_impositions;

        expect(impositionsBefore).to.deep.equal([
          {
            fm_offence_details_imposition_id: 0,
            fm_offence_details_result_id: 'FCC',
            fm_offence_details_amount_imposed: 200,
            fm_offence_details_amount_paid: 50,
            fm_offence_details_balance_remaining: 150,
            fm_offence_details_needs_creditor: true,
            fm_offence_details_creditor: 'major',
            fm_offence_details_major_creditor_id: 3856,
          },
          {
            fm_offence_details_imposition_id: 1,
            fm_offence_details_result_id: 'FO',
            fm_offence_details_amount_imposed: 0,
            fm_offence_details_amount_paid: 0,
            fm_offence_details_balance_remaining: 0,
            fm_offence_details_needs_creditor: false,
            fm_offence_details_creditor: null,
            fm_offence_details_major_creditor_id: null,
          },
        ]);

        // Perform removal action
        cy.get(DOM_ELEMENTS.removeImpositionButton).click();

        // Wait for the second store update
        cy.wrap(setDraftSpy).should('have.been.calledTwice');

        cy.wrap(setDraftSpy).then((updated: any) => {
          const afterDraft = updated.secondCall.args[0];
          const impositionsAfter = afterDraft[0].formData.fm_offence_details_impositions;

          // Assert only the second imposition remains
          expect(impositionsAfter).to.deep.equal([
            {
              fm_offence_details_imposition_id: 1,
              fm_offence_details_result_id: 'FO',
              fm_offence_details_amount_imposed: 0,
              fm_offence_details_amount_paid: 0,
              fm_offence_details_balance_remaining: 0,
              fm_offence_details_needs_creditor: false,
              fm_offence_details_creditor: null,
              fm_offence_details_major_creditor_id: null,
            },
          ]);
        });
      });
    },
  );
});
