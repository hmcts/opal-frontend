import { mount } from 'cypress/angular';
import { ActivatedRoute } from '@angular/router';
import { FinesMacAccountDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-account-details/fines-mac-account-details.component';
import { FinesMacStoreType } from 'src/app/flows/fines/fines-mac/stores/types/fines-mac-store.type';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_check_account_mock';
import { FINES_MAC_STATUS } from '../../../../src/app/flows/fines/fines-mac/constants/fines-mac-status';
import { DOM_ELEMENTS } from './constants/fines_mac_check_account_details_elements';
import { UtilsService } from '@services/utils/utils.service';
import { DateService } from '@services/date-service/date.service';

describe('FinesMacAccountDetailsComponent', () => {
  // let finesMacStore: FinesMacStoreType;
  //  finesMacStore = new FinesMacStore();
  //  let finesMacState = structuredClone(FINES_CHECK_ACCOUNT_MOCK);

  // finesMacStore.setFinesMacStore(finesMacState);

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacAccountDetailsComponent, {
      providers: [
        UtilsService,
        DateService,
        FinesMacStore,
        { provide: FinesMacStore, useValue: FINES_CHECK_ACCOUNT_MOCK },
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
        defendantType: defendantTypeMock,
        
      },
    });
  };

  afterEach(() => {
    cy.then(() => {
      // finesMacState = structuredClone(FINES_CHECK_ACCOUNT_MOCK);
    });
  });

  it('should render the component', () => {
    setupComponent(null);
    // Verify the component is rendered
    cy.get(DOM_ELEMENTS.dataPage).should('exist');
  });

  it('should load all elements on the screen correctly', () => {
    setupComponent(null);

    // Verify all elements are rendered
    cy.get(DOM_ELEMENTS.dataPage).should('exist');
    cy.get(DOM_ELEMENTS.backLink).should('exist');
    cy.get(DOM_ELEMENTS.pageTitle).should('exist');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist');
    cy.get(DOM_ELEMENTS.accountType).should('exist');
    cy.get(DOM_ELEMENTS.defendantType).should('exist');
    cy.get(DOM_ELEMENTS.courtDetails).should('exist');
    cy.get(DOM_ELEMENTS.offenceAndImpositionDetails).should('exist');
    cy.get(DOM_ELEMENTS.accountCommentsAndNotes).should('exist');
    cy.get(DOM_ELEMENTS.deleteAccountLink).should('exist');
    cy.get(DOM_ELEMENTS.offenceDetails).should('exist');
    cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
    cy.get(DOM_ELEMENTS.accountCommentsAndNotesItem).should('exist');
  });

  it('should show elements on the screen correctly for Adult or Youth Only', () => {
    setupComponent(null);
    // finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

    cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Adult or youth only');
    cy.get(DOM_ELEMENTS.defendantDetails).should('exist');
    cy.get(DOM_ELEMENTS.personalDetails).should('exist');
    cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
    cy.get(DOM_ELEMENTS.courtDetails).should('exist');
    cy.get(DOM_ELEMENTS.employerDetails).should('exist');
    cy.get(DOM_ELEMENTS.contactDetails).should('exist');
  });

  it('should show elements on the screen correctly for AYPG', () => {
    setupComponent(null);
    // finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

    cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Adult or youth with parent or guardian to pay');
    cy.get(DOM_ELEMENTS.parentOrGuardianDetails).should('exist');
    cy.get(DOM_ELEMENTS.personalDetails).should('exist');
    cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
    cy.get(DOM_ELEMENTS.courtDetails).should('exist');
    cy.get(DOM_ELEMENTS.employerDetails).should('exist');
    cy.get(DOM_ELEMENTS.contactDetails).should('exist');
  });

  // it('should show elements on the screen correctly for Company', () => {
  //   setupComponent(null);
  //     finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

  //     cy.get(DOM_ELEMENTS.defendantType).should('contain', 'Company');
  //     cy.get(DOM_ELEMENTS.companyDetails).should('exist');
  //     cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
  //     cy.get(DOM_ELEMENTS.courtDetails).should('exist');
  //   });

  //   it('should show option to continue if all required forms have been provided for Adult Or Youth Only', () => {
  //     setupComponent(null);
  //     finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

  //     cy.get(DOM_ELEMENTS.checkAccountButton).should('exist');
  //   });

  //   it('should not show option to continue if required forms have not been provided for Adult Or Youth Only', () => {
  //     setupComponent(null);

  //     finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

  //     cy.get(DOM_ELEMENTS.checkAccountButton).should('not.exist');
  //   });

  //   it('should show option to continue if all required forms have been provided for AYPG', () => {
  //     setupComponent(null);
  //     finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

  //     cy.get(DOM_ELEMENTS.checkAccountButton).should('exist');
  //   });

  //   it('should not show option to continue if required forms have not been provided for AYPG', () => {
  //     setupComponent(null);

  //     finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

  //     cy.get(DOM_ELEMENTS.checkAccountButton).should('not.exist');
  //   });

  //   it('should show option to continue if all required forms have been provided for Company', () => {
  //     setupComponent(null);
  //     finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

  //     cy.get(DOM_ELEMENTS.checkAccountButton).should('exist');
  //   });

  //   it('should not show option to continue if required forms have not been provided for Company', () => {
  //     setupComponent(null);

  //     finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

  //     cy.get(DOM_ELEMENTS.checkAccountButton).should('not.exist');
  //   });
});
