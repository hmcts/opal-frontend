import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsRemoveMinorCreditorComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-remove-minor-creditor/fines-mac-offence-details-remove-minor-creditor.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { provideHttpClient } from '@angular/common/http';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { UtilsService } from '@services/utils/utils.service';
import { DOM_ELEMENTS } from './constants/remove_minor_creditor_elements';

describe('FinesMacRemoveMinorCreditor', () => {
  let finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
  let currentoffenceDetails = 0;

  beforeEach(() => {
    const childForms = [
      {
        ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK,
      },
    ];

    finesMacOffenceDetailsDraftState.offenceDetailsDraft[currentoffenceDetails].childFormData = childForms;

    finesMacOffenceDetailsDraftState.removeMinorCreditor = 0;
  });

  const setupComponent = () => {
    mount(FinesMacOffenceDetailsRemoveMinorCreditorComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        UtilsService,
        {
          provide: FinesMacStore,
        },
        {
          provide: FinesMacOffenceDetailsStore,
          useFactory: () => {
            const store = new FinesMacOffenceDetailsStore();
            store.setOffenceDetailsDraft(finesMacOffenceDetailsDraftState.offenceDetailsDraft);
            store.setRemoveMinorCreditor(0);
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
  it('should render the component', () => {
    setupComponent();
  });
  it('should render all elements on the page', () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.name).should('exist');
    cy.get(DOM_ELEMENTS.address).should('exist');
    cy.get(DOM_ELEMENTS.paymentMethod).should('exist');
    cy.get(DOM_ELEMENTS.accountName).should('exist');
    cy.get(DOM_ELEMENTS.sortCode).should('exist');
    cy.get(DOM_ELEMENTS.accountNumber).should('exist');
    cy.get(DOM_ELEMENTS.paymentReference).should('exist');

    cy.get(DOM_ELEMENTS.addressKey).should('exist');
    cy.get(DOM_ELEMENTS.paymentMethodKey).should('exist');
    cy.get(DOM_ELEMENTS.accountNameKey).should('exist');
    cy.get(DOM_ELEMENTS.sortCodeKey).should('exist');
    cy.get(DOM_ELEMENTS.accountNumberKey).should('exist');
    cy.get(DOM_ELEMENTS.paymentReferenceKey).should('exist');

    cy.get(DOM_ELEMENTS.removeCreditorButton).should('exist');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it('should load all keys and elements with correct text', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Are you sure you want to remove this minor creditor?');

    cy.get(DOM_ELEMENTS.addressKey).should('contain', 'Address');
    cy.get(DOM_ELEMENTS.paymentMethodKey).should('contain', 'Payment method');
    cy.get(DOM_ELEMENTS.accountNameKey).should('contain', 'Account name');
    cy.get(DOM_ELEMENTS.sortCodeKey).should('contain', 'Sort code');
    cy.get(DOM_ELEMENTS.accountNumberKey).should('contain', 'Account number');
    cy.get(DOM_ELEMENTS.paymentReferenceKey).should('contain', 'Payment reference');

    cy.get(DOM_ELEMENTS.removeCreditorButton).should('contain', 'Yes - remove minor creditor');
  });

  it('should load all fields with the correct values', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.name).should('contain', 'John Doe');
    cy.get(DOM_ELEMENTS.address).should('contain', '1 Testing Lane' + 'Test Town' + 'Testing' + 'TE12 3ST');
    cy.get(DOM_ELEMENTS.accountName).should('contain', 'John Doe');
    cy.get(DOM_ELEMENTS.sortCode).should('contain', '12-34-56');
    cy.get(DOM_ELEMENTS.accountNumber).should('contain', '12345678');
    cy.get(DOM_ELEMENTS.paymentReference).should('contain', 'Testing');
  });
});
