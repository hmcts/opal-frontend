import { USER_STATE_MOCK_PERMISSION_BU77 } from '../../CommonIntercepts/CommonUserState.mocks';
import { interceptAuthenticatedUser, interceptUserState } from '../../CommonIntercepts/CommonIntercepts';
import {
  interceptMinorCreditorCreditor,
  interceptMinorCreditorHeader,
  interceptPatchMinorCreditorAccount,
} from './intercept/defendantAccountIntercepts';
import {
  buildMinorCreditorAmendCompanyPartyName,
  buildMinorCreditorAmendPartyName,
  createMinorCreditorAmendCompanyCreditorMock,
  createMinorCreditorAmendCreditorMock,
  createMinorCreditorAmendCreditorEmptyCompanyMock,
  createMinorCreditorAmendCreditorEmptyIndividualMock,
  createMinorCreditorAmendHeaderMock,
} from './mocks/minor_creditor_amend_creditor.mock';
import { MINOR_CREDITOR_ACCOUNT_ID } from './mocks/minor_creditor_at_a_glance.mock';
import { buildSeededAccountStore } from './setup/SeededStores';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';
import { MINOR_CREDITOR_AMEND_ELEMENTS as AMEND } from '../../../shared/selectors/account-enquiry/account.enquiry.minor-creditor-amend.locators';
import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { FinesAccMinorCreditorAddAmendConvertFormComponent } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-add-amend-convert/fines-acc-minor-creditor-add-amend-convert-form/fines-acc-minor-creditor-add-amend-convert-form.component';
import { FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-add-amend-convert/constants/fines-acc-minor-creditor-add-amend-convert-form.constant';
import { IFinesAccMinorCreditorAddAmendConvertState } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-add-amend-convert/interfaces/fines-acc-minor-creditor-add-amend-convert-state.interface';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const AMEND_MINOR_CREDITOR_STORY_TAG = '@JIRA-STORY:PO-1984';
const AMEND_MINOR_CREDITOR_EPIC_TAG = '@JIRA-EPIC:PO-1285';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

const componentProperties: IComponentProperties = {
  accountId: MINOR_CREDITOR_ACCOUNT_ID.toString(),
  routeRoot: 'minor-creditor',
  fragments: undefined,
  targetPath: `/minor-creditor/${MINOR_CREDITOR_ACCOUNT_ID}/amend`,
};

const setupMinorCreditorAmendScreen = (creditorData = createMinorCreditorAmendCreditorMock(true)) => {
  const header = createMinorCreditorAmendHeaderMock();

  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptMinorCreditorCreditor(MINOR_CREDITOR_ACCOUNT_ID, creditorData, '1');

  setupAccountEnquiryComponent({
    ...componentProperties,
    finesAccountStoreFactory: () =>
      buildSeededAccountStore(MINOR_CREDITOR_ACCOUNT_ID, {
        account_number: header.creditor.account_number,
        party_name: buildMinorCreditorAmendPartyName(),
        party_type: 'Minor Creditor',
        party_id: header.party.party_id,
        base_version: header.version ?? '1',
        business_unit_id: header.business_unit.business_unit_id,
      }),
  });

  cy.wait('@getMinorCreditorCreditor');
  cy.get(AMEND.form).should('exist');
};

const setupMinorCreditorAmendCompanyScreen = () => {
  const header = createMinorCreditorAmendHeaderMock();
  const creditorData = createMinorCreditorAmendCompanyCreditorMock(true);

  header.party.organisation_flag = true;
  header.party.organisation_details = { organisation_name: 'Amend Minor Co Ltd', organisation_aliases: null };
  header.party.individual_details = undefined;

  interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  interceptMinorCreditorCreditor(MINOR_CREDITOR_ACCOUNT_ID, creditorData, '1');
  interceptMinorCreditorHeader(MINOR_CREDITOR_ACCOUNT_ID, header, '1');
  interceptPatchMinorCreditorAccount(MINOR_CREDITOR_ACCOUNT_ID);

  setupAccountEnquiryComponent({
    ...componentProperties,
    finesAccountStoreFactory: () =>
      buildSeededAccountStore(MINOR_CREDITOR_ACCOUNT_ID, {
        account_number: header.creditor.account_number,
        party_name: buildMinorCreditorAmendCompanyPartyName(),
        party_type: 'Minor Creditor',
        party_id: header.party.party_id,
        base_version: header.version ?? '1',
        business_unit_id: header.business_unit.business_unit_id,
      }),
  });

  cy.wait('@getMinorCreditorCreditor');
  cy.get(AMEND.form).should('exist');
};

const mountMinorCreditorAmendForm = (formOverrides: Partial<IFinesAccMinorCreditorAddAmendConvertState> = {}) => {
  const formData = structuredClone(FINES_ACC_MINOR_CREDITOR_ADD_AMEND_CONVERT_FORM);
  formData.formData = {
    ...formData.formData,
    ...formOverrides,
  };

  mount(FinesAccMinorCreditorAddAmendConvertFormComponent, {
    providers: [
      provideHttpClient(),
      provideRouter([]),
      {
        provide: FinesAccountStore,
        useFactory: () =>
          buildSeededAccountStore(MINOR_CREDITOR_ACCOUNT_ID, {
            account_number: '87654321',
            party_name: buildMinorCreditorAmendPartyName(),
            party_type: 'Minor Creditor',
          }),
      },
    ],
    componentProperties: {
      initialFormData: formData,
    },
  });
};

const assertMinorCreditorAmendErrorSummary = (expectedMessage: string) => {
  cy.get(AMEND.submitButton).click();
  cy.get(AMEND.errorSummary).should('contain.text', expectedMessage);
};

const getValidIndividualMinorCreditorFormOverrides = (): Partial<IFinesAccMinorCreditorAddAmendConvertState> => ({
  facc_minor_creditor_creditor_type: 'individual',
  facc_minor_creditor_title: 'Mr',
  facc_minor_creditor_forenames: 'John',
  facc_minor_creditor_surname: 'SMITH',
  facc_minor_creditor_pay_by_bacs: true,
  facc_minor_creditor_bank_account_name: 'John Smith',
  facc_minor_creditor_bank_sort_code: '112233',
  facc_minor_creditor_bank_account_number: '12345678',
  facc_minor_creditor_bank_account_reference: 'REF123',
});

describe('Minor Creditor Account Enquiry - Amend Minor Creditor Details', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  it(
    'AC1a-AC1d: renders the amend screen with minor creditor and BACS details pre-populated from the API',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      setupMinorCreditorAmendScreen(createMinorCreditorAmendCreditorMock(true));

      cy.get(AMEND.pageHeading).should('contain.text', 'Minor creditor details');
      cy.get(AMEND.headingCaption).should('contain.text', '87654321 - Mr John SMITH');
      cy.contains('legend', 'Select creditor type').should('exist');
      cy.contains('h2', 'Minor creditor address').should('exist');
      cy.contains('h2', 'Payment details').should('exist');

      cy.get(AMEND.individualRadio).should('be.checked');
      cy.get(AMEND.companyRadio).should('not.be.checked');

      cy.get(AMEND.titleLabel).should('contain.text', 'Title');
      cy.get(AMEND.titleSelect).should('have.value', 'Mr');
      cy.get(AMEND.forenamesLabel).should('contain.text', 'First names');
      cy.get(AMEND.forenamesInput).should('have.value', 'John');
      cy.get(AMEND.surnameLabel).should('contain.text', 'Last name');
      cy.get(AMEND.surnameInput).should('have.value', 'SMITH');
      cy.get(AMEND.addressLine1Label).should('contain.text', 'Address line 1');
      cy.get(AMEND.addressLine1Input).should('have.value', '1 Test Street');
      cy.get(AMEND.addressLine2Label).should('contain.text', 'Address line 2');
      cy.get(AMEND.addressLine2Input).should('have.value', 'Test Area');
      cy.get(AMEND.addressLine3Label).should('contain.text', 'Address line 3');
      cy.get(AMEND.addressLine3Input).should('have.value', 'Test Town');
      cy.get(AMEND.postcodeLabel).should('contain.text', 'Postcode');
      cy.get(AMEND.postcodeInput).should('have.value', 'AB1 2CD');

      cy.get(AMEND.payByBacsCheckbox).should('be.checked');
      cy.get(AMEND.payByBacsLabel).should('contain.text', 'I have BACS payment details');
      cy.get(AMEND.bankAccountNameLabel).should('contain.text', 'Name on account');
      cy.get(AMEND.bankAccountNameInput).should('have.value', 'John Smith');
      cy.get(AMEND.bankSortCodeLabel).should('contain.text', 'Sort code');
      cy.get(AMEND.bankSortCodeInput).should('have.value', '112233');
      cy.get(AMEND.bankAccountNumberLabel).should('contain.text', 'Account number');
      cy.get(AMEND.bankAccountNumberInput).should('have.value', '12345678');
      cy.get(AMEND.bankAccountReferenceLabel).should('contain.text', 'Payment reference');
      cy.get(AMEND.bankAccountReferenceInput).should('have.value', 'REF123');
    },
  );

  it(
    'AC1d-AC1e: leaves BACS unchecked and hides payment fields when no BACS details exist',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      setupMinorCreditorAmendScreen(createMinorCreditorAmendCreditorMock(false));

      cy.get(AMEND.pageHeading).should('contain.text', 'Minor creditor details');
      cy.get(AMEND.individualRadio).should('be.checked');
      cy.get(AMEND.payByBacsCheckbox).should('not.be.checked');

      cy.get(AMEND.bankAccountNameInput).should('not.exist');
      cy.get(AMEND.bankSortCodeInput).should('not.exist');
      cy.get(AMEND.bankAccountNumberInput).should('not.exist');
      cy.get(AMEND.bankAccountReferenceInput).should('not.exist');
    },
  );

  it(
    'AC3a.ii: shows the creditor type required error when no creditor type is selected',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      mountMinorCreditorAmendForm();

      assertMinorCreditorAmendErrorSummary('Select whether minor creditor is an individual or company');
    },
  );

  it(
    'AC3a.i, AC3a.iii, AC3a.iv, AC3a.v: shows individual minor creditor validation errors when details are blank',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      setupMinorCreditorAmendScreen(createMinorCreditorAmendCreditorEmptyIndividualMock());

      cy.get(AMEND.submitButton).click();
      cy.get(AMEND.errorSummary).should('contain.text', 'Add minor creditor details');
      cy.get(AMEND.errorSummary).should('contain.text', 'Select minor creditor’s title');
      cy.get(AMEND.errorSummary).should('contain.text', 'Enter minor creditor’s first name');
      cy.get(AMEND.errorSummary).should('contain.text', 'Enter minor creditor’s last name');
    },
  );

  it(
    'AC3a.vi: shows company name required for a company minor creditor when details are blank',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      setupMinorCreditorAmendScreen(createMinorCreditorAmendCreditorEmptyCompanyMock());

      assertMinorCreditorAmendErrorSummary('Enter minor creditor company name');
    },
  );

  it(
    'AC3b.i, AC3b.ii, AC3b.iii, AC3b.vii: shows required BACS field errors when payment details are blank',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      mountMinorCreditorAmendForm({
        ...getValidIndividualMinorCreditorFormOverrides(),
        facc_minor_creditor_bank_account_name: null,
        facc_minor_creditor_bank_sort_code: null,
        facc_minor_creditor_bank_account_number: null,
        facc_minor_creditor_bank_account_reference: null,
      });

      cy.get(AMEND.submitButton).click();
      cy.get(AMEND.errorSummary).should('contain.text', 'Enter name on account');
      cy.get(AMEND.errorSummary).should('contain.text', 'Enter sort code');
      cy.get(AMEND.errorSummary).should('contain.text', 'Enter account number');
      cy.get(AMEND.errorSummary).should('contain.text', 'Enter payment reference');
    },
  );

  it(
    'AC3b.iv: shows an error when the BACS account number has fewer than 6 digits',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      mountMinorCreditorAmendForm({
        ...getValidIndividualMinorCreditorFormOverrides(),
        facc_minor_creditor_bank_account_number: '12345',
      });

      assertMinorCreditorAmendErrorSummary('Account number must be between 6 and 8 digits long');
    },
  );

  it(
    'AC3b.v: shows an error when the BACS account number contains non-numerical characters',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      mountMinorCreditorAmendForm({
        ...getValidIndividualMinorCreditorFormOverrides(),
        facc_minor_creditor_bank_account_number: '12AB56',
      });

      assertMinorCreditorAmendErrorSummary('Enter a valid account number like 00733445');
    },
  );

  it(
    'AC3b.vi: shows sort code validation errors for invalid BACS sort codes',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      mountMinorCreditorAmendForm({
        ...getValidIndividualMinorCreditorFormOverrides(),
        facc_minor_creditor_bank_sort_code: '12AB56',
      });

      assertMinorCreditorAmendErrorSummary('Enter a valid sort code like 309430');
    },
  );

  it(
    'AC2b: saves amended company minor creditor details with BACS and returns to the creditor tab',
    { tags: buildTags(AMEND_MINOR_CREDITOR_STORY_TAG, AMEND_MINOR_CREDITOR_EPIC_TAG) },
    () => {
      setupMinorCreditorAmendCompanyScreen();

      cy.get(AMEND.companyRadio).should('be.checked');
      cy.get(AMEND.companyNameInput).should('have.value', 'Amend Minor Co Ltd');
      cy.get(AMEND.payByBacsCheckbox).should('be.checked');
      cy.get(AMEND.bankAccountNameInput).should('have.value', 'Amend Minor Co Ltd');
      cy.get(AMEND.bankSortCodeInput).should('have.value', '112233');
      cy.get(AMEND.bankAccountNumberInput).should('have.value', '12345678');
      cy.get(AMEND.bankAccountReferenceInput).should('have.value', 'MCREF123');

      cy.get(AMEND.companyNameInput).clear().type('Updated Minor Co Ltd');
      cy.get(AMEND.submitButton).click();

      cy.wait('@patchMinorCreditorAccount')
        .its('request.body')
        .should((body) => {
          expect(body.party_details.organisation_flag).to.eq(true);
          expect(body.party_details.organisation_details.organisation_name).to.eq('Updated Minor Co Ltd');
          expect(body.payment.pay_by_bacs).to.eq(true);
          expect(body.payment.account_name).to.eq('Amend Minor Co Ltd');
          expect(body.payment.sort_code).to.eq('112233');
          expect(body.payment.account_number).to.eq('12345678');
          expect(body.payment.account_reference).to.eq('MCREF123');
        });

      cy.get('@routerNavigate').should('have.been.calledWithMatch', ['details'], {
        fragment: 'creditor',
      });
    },
  );
});
