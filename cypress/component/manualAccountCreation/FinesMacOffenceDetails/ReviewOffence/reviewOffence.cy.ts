import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsReviewOffenceComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-review-offence/fines-mac-offence-details-review-offence.component';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/review_offence_elements';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from './mocks/review_offence_mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-state.mock';

describe('ReviewOffenceComponent', () => {
  let finesMacOffenceDetailsDraftState = {
    ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
  };

  const setupComponent = (impositionCounter: number = 0) => {
    mount(FinesMacOffenceDetailsReviewOffenceComponent, {
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
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
      componentProperties: {
        offence: {
          ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK,
          formData: {
            ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData,
            fm_offence_details_impositions: [
              { ...FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK[impositionCounter] },
            ],
          },
        },
        impositionRefData: OPAL_FINES_RESULTS_REF_DATA_MOCK,
        majorCreditorRefData: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
        showActions: false,
      },
    });
  };
  it('should render component', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should load all elements on the screen correctly', () => {
    setupComponent();

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
  });

  it('should have correct values in the elements', () => {
    setupComponent();

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
  });

  it('should update value according to imposition type', () => {
    setupComponent(1);

    cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Imposition');
    cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Creditor');
    cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount imposed');
    cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount paid');
    cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Balance remaining');

    cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Fine');
    cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
    cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£0.0');
    cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£0.0');
    cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£0.0');

    cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
    cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '£0.0');
    cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£0.0');
    cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£0.0');
  });
});
