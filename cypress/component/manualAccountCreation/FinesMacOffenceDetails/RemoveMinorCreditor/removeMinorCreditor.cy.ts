import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsRemoveMinorCreditorComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-remove-minor-creditor/fines-mac-offence-details-remove-minor-creditor.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { provideHttpClient } from '@angular/common/http';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-draft-state.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DOM_ELEMENTS } from './constants/remove_minor_creditor_elements';

describe('FinesMacRemoveMinorCreditor', () => {
  let finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
  let currentoffenceDetails = 0;
  let formData: any;

  beforeEach(() => {
    const childForms = [
      {
        ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK,
      },
    ];

    finesMacOffenceDetailsDraftState.offenceDetailsDraft[currentoffenceDetails].childFormData = childForms;

    finesMacOffenceDetailsDraftState.removeMinorCreditor = 0;
    formData = childForms;
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
  it('(AC.1) should render the component', { tags: ['@PO-670', '@PO-671', '@PO-414', '@PO-545'] }, () => {
    setupComponent();
  });
  it('AC.1) should render all elements on the page', { tags: ['@PO-670', '@PO-671', '@PO-414', '@PO-545'] }, () => {
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

  it(
    ' AC.2) should load all keys and elements with correct text',
    { tags: ['@PO-670', '@PO-671', '@PO-414', '@PO-545'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.heading).should('contain', 'Are you sure you want to remove this minor creditor?');

      cy.get(DOM_ELEMENTS.addressKey).should('contain', 'Address');
      cy.get(DOM_ELEMENTS.paymentMethodKey).should('contain', 'Payment method');
      cy.get(DOM_ELEMENTS.accountNameKey).should('contain', 'Account name');
      cy.get(DOM_ELEMENTS.sortCodeKey).should('contain', 'Sort code');
      cy.get(DOM_ELEMENTS.accountNumberKey).should('contain', 'Account number');
      cy.get(DOM_ELEMENTS.paymentReferenceKey).should('contain', 'Payment reference');

      cy.get(DOM_ELEMENTS.removeCreditorButton).should('contain', 'Yes - remove minor creditor');
    },
  );

  it(
    'AC.2) should load all fields with the correct values',
    { tags: ['@PO-670', '@PO-671', '@PO-414', '@PO-545'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.name).should('contain', 'John Doe');
      cy.get(DOM_ELEMENTS.address).should('contain', '1 Testing Lane' + 'Test Town' + 'Testing' + 'TE12 3ST');
      cy.get(DOM_ELEMENTS.accountName).should('contain', 'John Doe');
      cy.get(DOM_ELEMENTS.sortCode).should('contain', '12-34-56');
      cy.get(DOM_ELEMENTS.accountNumber).should('contain', '12345678');
      cy.get(DOM_ELEMENTS.paymentReference).should('contain', 'Testing');
    },
  );

  it(
    'AC.2(bii,biv,bv)) should set non required fields as "not / none provided" if values are empty',
    { tags: ['@PO-670', '@PO-671', '@PO-414', '@PO-545'] },
    () => {
      setupComponent();

      formData[0].formData = {
        fm_offence_details_imposition_position: 0,
        fm_offence_details_minor_creditor_creditor_type: 'individual',
        fm_offence_details_minor_creditor_title: 'Mr',
        fm_offence_details_minor_creditor_forenames: 'John',
        fm_offence_details_minor_creditor_surname: 'Doe',
        fm_offence_details_minor_creditor_company_name: null,
        fm_offence_details_minor_creditor_address_line_1: null,
        fm_offence_details_minor_creditor_address_line_2: null,
        fm_offence_details_minor_creditor_address_line_3: null,
        fm_offence_details_minor_creditor_post_code: null,
        fm_offence_details_minor_creditor_pay_by_bacs: false,
        fm_offence_details_minor_creditor_bank_account_name: null,
        fm_offence_details_minor_creditor_bank_sort_code: null,
        fm_offence_details_minor_creditor_bank_account_number: null,
        fm_offence_details_minor_creditor_bank_account_ref: null,
      };

      cy.get(DOM_ELEMENTS.name).should('contain', 'John Doe');
      cy.get(DOM_ELEMENTS.address).should('contain', 'Not provided');
      cy.get(DOM_ELEMENTS.paymentMethod).should('contain', 'Not provided');
    },
  );
});
