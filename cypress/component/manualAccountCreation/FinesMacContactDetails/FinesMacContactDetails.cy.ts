import { FinesMacContactDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-contact-details/fines-mac-contact-details.component';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { INVALID_DETAILS } from './constants/fines_mac_contact_details_errors';
import { MacContactDetailsLocators as L } from '../../../shared/selectors/manual-account-creation/mac.contact-details.locators';
import { mountMacStoreComponent } from '../support/mountMacStoreComponent';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';

const buildTags = (...tags: string[]) => [...tags, MANUAL_ACCOUNT_CREATION_JIRA_LABEL];

describe('FinesMacContactDetailsComponent', () => {
  type FinesMacContactDetailsState = typeof FINES_MAC_STATE_MOCK;

  const buildFinesMacContactDetailsState = (
    defendantType: string = '',
    configure?: (finesMacState: FinesMacContactDetailsState) => void,
  ): FinesMacContactDetailsState => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = defendantType;
    configure?.(finesMacState);
    return finesMacState;
  };

  const setupComponent = (
    formSubmit?: any,
    defendantType: string = '',
    configure?: (finesMacState: FinesMacContactDetailsState) => void,
  ) =>
    mountMacStoreComponent({
      component: FinesMacContactDetailsComponent,
      componentProperties: {
        defendantType,
      },
      formSubmit,
      initialState: buildFinesMacContactDetailsState(defendantType, configure),
      submitHandlerName: 'handleContactDetailsSubmit',
    });
  it(
    'should render the component (FinesMacContactDetailsComponent)',
    { tags: [...buildTags(), '@JIRA-EPIC:PO-272'] },
    () => {
      setupComponent(null);

      // Verify the component is rendered
      cy.get(L.primaryEmailInput).should('exist');
    },
  );

  it(
    '(AC.1) should load all elements on the screen correctly (FinesMacContactDetailsComponent)',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');

      cy.get(L.pageHeader).should('contain', 'Defendant contact details');

      cy.get(L.primaryEmailInput).should('exist');
      cy.get(L.secondaryEmailInput).should('exist');
      cy.get(L.mobileTelephoneInput).should('exist');
      cy.get(L.homeTelephoneInput).should('exist');
      cy.get(L.workTelephoneInput).should('exist');
      cy.get(L.returnToAccountDetailsButton).should('exist');

      cy.get(L.primaryEmailLabel).should('contain', 'Primary email address');
      cy.get(L.secondaryEmailLabel).should('contain', 'Secondary email address');
      cy.get(L.mobileTelephoneLabel).should('contain', 'Mobile telephone number');
      cy.get(L.homeTelephoneLabel).should('contain', 'Home telephone number');
      cy.get(L.workTelephoneLabel).should('contain', 'Work telephone number');

      cy.get(L.returnToAccountDetailsButton).should('contain', 'Return to account details');
      cy.get(L.cancelLink).should('contain', 'Cancel');
    },
  );

  it(
    '(AC.1) should load button for next page for adultOrYouthOnly Defendant',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');

      cy.get(L.addEmployerDetailsButton).should('contain', 'Add employer details');
    },
  );

  it(
    '(AC.2) should not have any mandatory inputs - Return to account details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy, 'adultOrYouthOnly');

      cy.get(L.returnToAccountDetailsButton).click();

      cy.wrap(formSubmitSpy).should('have.been.called');
    },
  );

  it(
    '(AC.2) should not have any mandatory inputs - Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy, 'adultOrYouthOnly');

      cy.get(L.addEmployerDetailsButton).click();

      cy.wrap(formSubmitSpy).should('have.been.called');
    },
  );

  it(
    '(AC.3) should load button for next page for AYPG Defendant',
    { tags: [...buildTags('@JIRA-STORY:PO-370'), '@JIRA-EPIC:PO-344'] },
    () => {
      setupComponent(null, 'pgToPay');

      cy.get(L.addEmployerDetailsButton).should('contain', 'Add employer details');
    },
  );

  it(
    '(AC.3) should load button for next page for Company Defendant',
    { tags: [...buildTags('@JIRA-STORY:PO-371'), '@JIRA-EPIC:PO-345'] },
    () => {
      setupComponent(null, 'company');

      cy.get(L.addOffenceDetailsButton).should('contain', 'Add offence details');
    },
  );

  it(
    '(AC.4) should accept valid email addresses - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy, 'adultOrYouthOnly', (finesMacState) => {
        finesMacState.contactDetails.formData = {
          fm_contact_details_email_address_1: 'name@example.com',
          fm_contact_details_email_address_2: 'secondary@example.com',
          fm_contact_details_telephone_number_mobile: '',
          fm_contact_details_telephone_number_home: '',
          fm_contact_details_telephone_number_business: '',
        };
      });

      cy.get(L.returnToAccountDetailsButton).click();

      cy.wrap(formSubmitSpy).should('have.been.called');

      cy.get(L.addEmployerDetailsButton).click();

      cy.wrap(formSubmitSpy).should('have.been.called');
    },
  );

  it(
    '(AC.5) should accept valid telephone numbers - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy, 'adultOrYouthOnly', (finesMacState) => {
        finesMacState.contactDetails.formData = {
          fm_contact_details_email_address_1: '',
          fm_contact_details_email_address_2: '',
          fm_contact_details_telephone_number_mobile: '07123456789',
          fm_contact_details_telephone_number_home: '01234 567890',
          fm_contact_details_telephone_number_business: '01234 567890',
        };
      });

      cy.get(L.returnToAccountDetailsButton).click();

      cy.wrap(formSubmitSpy).should('have.been.calledOnce');

      cy.get(L.addEmployerDetailsButton).click();

      cy.wrap(formSubmitSpy).should('have.been.called');
    },
  );

  it(
    '(AC.6) should accept valid contact details - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy, 'adultOrYouthOnly', (finesMacState) => {
        finesMacState.contactDetails.formData = {
          fm_contact_details_email_address_1: 'primary@email.com',
          fm_contact_details_email_address_2: 'secondary@email.com',
          fm_contact_details_telephone_number_mobile: '07123456789',
          fm_contact_details_telephone_number_home: '01234 567890',
          fm_contact_details_telephone_number_business: '01234 567890',
        };
      });

      cy.get(L.returnToAccountDetailsButton).click();

      cy.wrap(formSubmitSpy).should('have.been.calledOnce');

      cy.get(L.addEmployerDetailsButton).click();

      cy.wrap(formSubmitSpy).should('have.been.called');
    },
  );

  it(
    '(AC.7) should error when primary email address validation is not met - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const invalidEmails = ['test-test-com', 'test@test', 'test.com', 'test@.com', 'test@com'];
      cy.wrap(invalidEmails).each((email: string) => {
        cy.then(() => {
          setupComponent(null, 'adultOrYouthOnly', (finesMacState) => {
            finesMacState.contactDetails.formData.fm_contact_details_email_address_1 = email;
          });
          cy.get(L.returnToAccountDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidPrimaryEmail);
          cy.get(L.addEmployerDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidPrimaryEmail);
        });
      });
    },
  );

  it(
    '(AC.7) should error when secondary email address validation is not met - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const invalidEmails = ['test-test-com', 'test@test', 'test.com', 'test@.com', 'test@com'];
      cy.wrap(invalidEmails).each((email: string) => {
        cy.then(() => {
          setupComponent(null, 'adultOrYouthOnly', (finesMacState) => {
            finesMacState.contactDetails.formData.fm_contact_details_email_address_2 = email;
          });
          cy.get(L.returnToAccountDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidSecondaryEmail);
          cy.get(L.addEmployerDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidSecondaryEmail);
        });
      });
    },
  );

  it(
    '(AC.8) should error when home telephone number validation is not met - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const invalidPhoneNumbers = ['123456789', '123456789012', '1234567890a'];
      cy.wrap(invalidPhoneNumbers).each((number: string) => {
        cy.then(() => {
          setupComponent(null, 'adultOrYouthOnly', (finesMacState) => {
            finesMacState.contactDetails.formData.fm_contact_details_telephone_number_home = number;
          });
          cy.get(L.returnToAccountDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidHomeTelephone);
          cy.get(L.addEmployerDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidHomeTelephone);
        });
      });
    },
  );

  it(
    '(AC.8) should error when business telephone number validation is not met - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const invalidPhoneNumbers = ['123456789', '123456789012', '1234567890a'];
      cy.wrap(invalidPhoneNumbers).each((number: string) => {
        cy.then(() => {
          setupComponent(null, 'adultOrYouthOnly', (finesMacState) => {
            finesMacState.contactDetails.formData.fm_contact_details_telephone_number_business = number;
          });
          cy.get(L.returnToAccountDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidWorkTelephone);
          cy.get(L.addEmployerDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidWorkTelephone);
        });
      });
    },
  );

  it(
    '(AC.8) should error when mobile telephone number validation is not met - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const invalidPhoneNumbers = ['123456789', '123456789012', '1234567890a'];
      cy.wrap(invalidPhoneNumbers).each((number: string) => {
        cy.then(() => {
          setupComponent(null, 'adultOrYouthOnly', (finesMacState) => {
            finesMacState.contactDetails.formData.fm_contact_details_telephone_number_mobile = number;
          });
          cy.get(L.returnToAccountDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidMobileTelephone);
          cy.get(L.addEmployerDetailsButton).click();
          cy.get(L.errorSummary).should('contain', INVALID_DETAILS.invalidMobileTelephone);
        });
      });
    },
  );

  it(
    '(AC.9) should allow submission when validation errors are corrected - Return to account details + Add employer details',
    { tags: [...buildTags('@JIRA-STORY:PO-419'), '@JIRA-EPIC:PO-272'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy, 'adultOrYouthOnly', (finesMacState) => {
        finesMacState.contactDetails.formData = {
          fm_contact_details_email_address_1: 'bad-data',
          fm_contact_details_email_address_2: 'bad-data',
          fm_contact_details_telephone_number_mobile: 'bad-data',
          fm_contact_details_telephone_number_home: 'bad-data',
          fm_contact_details_telephone_number_business: 'bad-data',
        };
      });
      cy.get(L.returnToAccountDetailsButton).click();
      cy.get(L.errorSummary).should('exist');
      cy.get(L.addEmployerDetailsButton).click();
      cy.get(L.errorSummary).should('exist');

      cy.then(() => {
        setupComponent(formSubmitSpy, 'adultOrYouthOnly', (finesMacState) => {
          finesMacState.contactDetails.formData = {
            fm_contact_details_email_address_1: 'p@email.com',
            fm_contact_details_email_address_2: 's@email.com',
            fm_contact_details_telephone_number_mobile: '07123456789',
            fm_contact_details_telephone_number_home: '01234 567890',
            fm_contact_details_telephone_number_business: '01234 567890',
          };
        });
        cy.get(L.returnToAccountDetailsButton).click();
        cy.wrap(formSubmitSpy).should('have.been.called');
        cy.get(L.addEmployerDetailsButton).click();
        cy.wrap(formSubmitSpy).should('have.been.called');
      });
    },
  );
});
