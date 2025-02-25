import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsMinorCreditorInformationComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor-information/fines-mac-offence-details-minor-creditor-information.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MINOR_CREDITOR_MOCK } from './mocks/minor_creditor_information_mocks';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { provideHttpClient } from '@angular/common/http';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-state.mock';
import { DOM_ELEMENTS } from './constants/minor-creditor-information-elements';

describe('FinesMacMinorCreditorInformation', () => {
  let finesMacState = structuredClone(FINES_MINOR_CREDITOR_MOCK);

  const minorCreditorValue = { ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK };

  const setupComponent = (formSubmit: any) => {
    mount(FinesMacOffenceDetailsMinorCreditorInformationComponent, {
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
        minorCreditor: minorCreditorValue,
      },
    });
  };
  it('(AC.1) should load the component', { tags: ['@PO-670', '@PO-671', '@PO-414'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('(AC.1) should render all elements on the page', { tags: ['@PO-670', '@PO-671', '@PO-414'] }, () => {
    setupComponent(null);
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
  });

  it('(AC.2) should load all keys and elements with correct text', { tags: ['@PO-670', '@PO-671', '@PO-414'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addressKey).should('contain', 'Address');
    cy.get(DOM_ELEMENTS.paymentMethodKey).should('contain', 'Payment method');
    cy.get(DOM_ELEMENTS.accountNameKey).should('contain', 'Account name');
    cy.get(DOM_ELEMENTS.sortCodeKey).should('contain', 'Sort code');
    cy.get(DOM_ELEMENTS.accountNumberKey).should('contain', 'Account number');
    cy.get(DOM_ELEMENTS.paymentReferenceKey).should('contain', 'Payment reference');
  });
  it('(AC.2)should load all fields with the correct values', { tags: ['@PO-670', '@PO-671', '@PO-414'] }, () => {
    setupComponent(null);
    cy.get(DOM_ELEMENTS.name).should('contain', 'John Doe');
    cy.get(DOM_ELEMENTS.address).should('contain', '1 Testing Lane' + 'Test Town' + 'Testing' + 'TE12 3ST');
    cy.get(DOM_ELEMENTS.accountName).should('contain', 'John Doe');
    cy.get(DOM_ELEMENTS.sortCode).should('contain', '12-34-56');
    cy.get(DOM_ELEMENTS.accountNumber).should('contain', '12345678');
    cy.get(DOM_ELEMENTS.paymentReference).should('contain', 'Testing');
  });
});
//E-2-E Tests Not required for this component as it is being tested in the Remove Minor Creditor screen.