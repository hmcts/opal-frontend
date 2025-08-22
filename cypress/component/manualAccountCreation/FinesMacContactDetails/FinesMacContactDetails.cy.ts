import { mount } from 'cypress/angular';
import { FinesMacContactDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-contact-details/fines-mac-contact-details.component';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { INVALID_DETAILS } from './constants/fines_mac_contact_details_errors';
import { DOM_ELEMENTS } from './constants/fines_mac_contact_details_elements';

describe('FinesMacContactDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

  const setupComponent = (formSubmit: any, defendantType: string = '') => {
    mount(FinesMacContactDetailsComponent, {
      providers: [
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
        handleContactDetailsSubmit: formSubmit,
        defendantType: defendantType,
      },
    });
  };
  afterEach(() => {
    cy.then(() => {
      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_mobile: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_business: '',
      };
    });
  });

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get(DOM_ELEMENTS.primaryEmailInput).should('exist');
  });

  it('(AC.1) should load all elements on the screen correctly', { tags: ['@PO-272', '@PO-419'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Defendant contact details');

    cy.get(DOM_ELEMENTS.primaryEmailInput).should('exist');
    cy.get(DOM_ELEMENTS.secondaryEmailInput).should('exist');
    cy.get(DOM_ELEMENTS.mobileTelephoneInput).should('exist');
    cy.get(DOM_ELEMENTS.homeTelephoneInput).should('exist');
    cy.get(DOM_ELEMENTS.workTelephoneInput).should('exist');
    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).should('exist');

    cy.get(DOM_ELEMENTS.primaryEmailSubheading).should('contain', 'Primary email address');
    cy.get(DOM_ELEMENTS.secondaryEmailSubheading).should('contain', 'Secondary email address');
    cy.get(DOM_ELEMENTS.mobileTelephoneSubheading).should('contain', 'Mobile telephone number');
    cy.get(DOM_ELEMENTS.homeTelephoneSubheading).should('contain', 'Home telephone number');
    cy.get(DOM_ELEMENTS.workTelephoneSubheading).should('contain', 'Work telephone number');

    cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).should('contain', 'Return to account details');
    cy.get(DOM_ELEMENTS.cancelLink).should('contain', 'Cancel');
  });

  it('(AC.1) should load button for next page for adultOrYouthOnly Defendant', { tags: ['@PO-272', '@PO-419'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.addEmployerDetailsButton).should('contain', 'Add employer details');
  });

  it(
    '(AC.2) should not have any mandatory inputs - Return to account details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit, 'adultOrYouthOnly');

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();

      cy.get('@formSubmitSpy').should('have.been.called');
    },
  );

  it('(AC.2) should not have any mandatory inputs - Add employer details', { tags: ['@PO-272', '@PO-419'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();

    cy.get('@formSubmitSpy').should('have.been.called');
  });

  it('(AC.3) should load button for next page for AYPG Defendant', { tags: ['@PO-344', '@PO-370'] }, () => {
    setupComponent(null, 'pgToPay');

    cy.get(DOM_ELEMENTS.addEmployerDetailsButton).should('contain', 'Add employer details');
  });

  it('(AC.3) should load button for next page for Company Defendant', { tags: ['@PO-345', '@PO-371'] }, () => {
    setupComponent(null, 'company');

    cy.get(DOM_ELEMENTS.addOffenceDetailsButton).should('contain', 'Add offence details');
  });

  it(
    '(AC.4) should accept valid email addresses - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit, 'adultOrYouthOnly');

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: 'name@example.com',
        fm_contact_details_email_address_2: 'secondary@example.com',
        fm_contact_details_telephone_number_mobile: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_business: '',
      };

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();

      cy.get('@formSubmitSpy').should('have.been.called');

      cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();

      cy.get('@formSubmitSpy').should('have.been.called');
    },
  );

  it(
    '(AC.5) should accept valid telephone numbers - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit, 'adultOrYouthOnly');

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_mobile: '07123456789',
        fm_contact_details_telephone_number_home: '01234 567890',
        fm_contact_details_telephone_number_business: '01234 567890',
      };

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();

      cy.get('@formSubmitSpy').should('have.been.calledOnce');

      cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();

      cy.get('@formSubmitSpy').should('have.been.called');
    },
  );

  it(
    '(AC.6) should accept valid contact details - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit, 'adultOrYouthOnly');

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: 'primary@email.com',
        fm_contact_details_email_address_2: 'secondary@email.com',
        fm_contact_details_telephone_number_mobile: '07123456789',
        fm_contact_details_telephone_number_home: '01234 567890',
        fm_contact_details_telephone_number_business: '01234 567890',
      };

      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();

      cy.get('@formSubmitSpy').should('have.been.calledOnce');

      cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();

      cy.get('@formSubmitSpy').should('have.been.called');
    },
  );

  it(
    '(AC.7) should error when primary email address validation is not met - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const invalidEmails = ['test-test-com', 'test@test', 'test.com', 'test@.com', 'test@com'];
      cy.wrap(invalidEmails).each((email: string) => {
        cy.then(() => {
          finesMacState.contactDetails.formData.fm_contact_details_email_address_1 = email;
          setupComponent(null, 'adultOrYouthOnly');
          cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidPrimaryEmail);
          cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidPrimaryEmail);
        });
      });
    },
  );

  it(
    '(AC.7) should error when secondary email address validation is not met - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const invalidEmails = ['test-test-com', 'test@test', 'test.com', 'test@.com', 'test@com'];
      cy.wrap(invalidEmails).each((email: string) => {
        cy.then(() => {
          finesMacState.contactDetails.formData.fm_contact_details_email_address_2 = email;
          setupComponent(null, 'adultOrYouthOnly');
          cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidSecondaryEmail);
          cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidSecondaryEmail);
        });
      });
    },
  );

  it(
    '(AC.8) should error when home telephone number validation is not met - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const invalidPhoneNumbers = ['123456789', '123456789012', '1234567890a'];
      cy.wrap(invalidPhoneNumbers).each((number: string) => {
        cy.then(() => {
          finesMacState.contactDetails.formData.fm_contact_details_telephone_number_home = number;
          setupComponent(null, 'adultOrYouthOnly');
          cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidHomeTelephone);
          cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidHomeTelephone);
        });
      });
    },
  );

  it(
    '(AC.8) should error when business telephone number validation is not met - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const invalidPhoneNumbers = ['123456789', '123456789012', '1234567890a'];
      cy.wrap(invalidPhoneNumbers).each((number: string) => {
        cy.then(() => {
          finesMacState.contactDetails.formData.fm_contact_details_telephone_number_business = number;
          setupComponent(null, 'adultOrYouthOnly');
          cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidWorkTelephone);
          cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidWorkTelephone);
        });
      });
    },
  );

  it(
    '(AC.8) should error when mobile telephone number validation is not met - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const invalidPhoneNumbers = ['123456789', '123456789012', '1234567890a'];
      cy.wrap(invalidPhoneNumbers).each((number: string) => {
        cy.then(() => {
          finesMacState.contactDetails.formData.fm_contact_details_telephone_number_mobile = number;
          setupComponent(null, 'adultOrYouthOnly');
          cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidMobileTelephone);
          cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();
          cy.get(DOM_ELEMENTS.errorSummary).should('contain', INVALID_DETAILS.invalidMobileTelephone);
        });
      });
    },
  );

  it(
    '(AC.9) should allow submission when validation errors are corrected - Return to account details + Add employer details',
    { tags: ['@PO-272', '@PO-419'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit, 'adultOrYouthOnly');
      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: 'bad-data',
        fm_contact_details_email_address_2: 'bad-data',
        fm_contact_details_telephone_number_mobile: 'bad-data',
        fm_contact_details_telephone_number_home: 'bad-data',
        fm_contact_details_telephone_number_business: 'bad-data',
      };
      cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');
      cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should('exist');

      cy.then(() => {
        setupComponent(mockFormSubmit, 'adultOrYouthOnly');
        finesMacState.contactDetails.formData = {
          fm_contact_details_email_address_1: 'p@email.com',
          fm_contact_details_email_address_2: 's@email.com',
          fm_contact_details_telephone_number_mobile: '07123456789',
          fm_contact_details_telephone_number_home: '01234 567890',
          fm_contact_details_telephone_number_business: '01234 567890',
        };
        cy.get(DOM_ELEMENTS.returnToAccountDetailsButton).click();
        cy.get('@formSubmitSpy').should('have.been.called');
        cy.get(DOM_ELEMENTS.addEmployerDetailsButton).click();
        cy.get('@formSubmitSpy').should('have.been.called');
      });
    },
  );
});
