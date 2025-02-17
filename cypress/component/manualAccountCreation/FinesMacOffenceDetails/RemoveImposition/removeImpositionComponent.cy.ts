import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsRemoveImpositionComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-remove-imposition/fines-mac-offence-details-remove-imposition.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FinesMacOffenceDetailsService } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { DOM_ELEMENTS } from './constants/remove_imposition_elements';

describe('FinesMacLanguagePreferenceComponent', () => {
  let mockFinesService = new FinesService(new DateService());
  mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };

  const mockOffenceDetailsService = {
    finesMacOffenceDetailsDraftState: FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
  } as FinesMacOffenceDetailsService;

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
        { provide: FinesMacOffenceDetailsService, useValue: mockOffenceDetailsService },
        { provide: FinesService, useValue: mockFinesService },
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

  it('should render the component correctly', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should render all elements correctly', () => {
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

  it('should have correct field labels and names in the elements when loading data', () => {
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
  });

  it('should set values to defaults or null after pressing the remove imposition button', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.removeImpositionButton).click();

    cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Not provided');
    cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts and Tribunals Service (HMCTS)');
    cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£0.00');
    cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£0.00');
    cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£0.00');
  });
});
