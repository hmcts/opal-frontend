import {
  createDefendantHeaderMockWithName,
  createParentGuardianHeaderMockWithName,
  DEFENDANT_HEADER_ORG_MOCK,
  DEFENDANT_HEADER_YOUTH_MOCK,
} from '../mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS as PAYMENT_TERMS_TAB } from '../../../../shared/selectors/account-enquiry/account.enquiry.payment-terms.locators';
import { interceptDefendantHeader, interceptPaymentTerms } from '../intercept/defendantAccountIntercepts';
import {
  interceptAuthenticatedUser,
  interceptResultByCode,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';
import { setupAccountEnquiryComponent } from '../setup/SetupComponent';
import { PAYMENT_TERMS_AMEND_ELEMENTS as AMEND_PAYMENT_TERMS } from 'cypress/shared/selectors/account-enquiry/account.enquiry.payment-terms-amend.locators';
import { IComponentProperties } from '../setup/setupComponent.interface';
import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { MOCK_FINES_ACCOUNT_STATE } from 'src/app/flows/fines/fines-acc/mocks/fines-acc-state.mock';
import { FinesAccPaymentTermsAmendFormComponent } from 'src/app/flows/fines/fines-acc/fines-acc-payment-terms-amend/fines-acc-payment-terms-amend-form/fines-acc-payment-terms-amend-form.component';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM } from 'src/app/flows/fines/fines-acc/fines-acc-payment-terms-amend/constants/fines-acc-payment-terms-amend-form.constant';
import { IFinesAccPaymentTermsAmendState } from 'src/app/flows/fines/fines-acc/fines-acc-payment-terms-amend/interfaces/fines-acc-payment-terms-amend-state.interface';
import { IFinesAccountState } from 'src/app/flows/fines/fines-acc/interfaces/fines-acc-state-interface';
import { IOpalFinesAccountDefendantDetailsHeader } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Account Enquiry Amend Payment Terms', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
  });

  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'payment-terms',
    interceptedRoutes: ['/access-denied'],
  };

  type DefendantType = 'adultOrYouth' | 'parentGuardian' | 'company';

  const getHeaderMock = (defendantType: DefendantType) => {
    switch (defendantType) {
      case 'parentGuardian': {
        const mock = structuredClone(createParentGuardianHeaderMockWithName('Paula', 'Guardian'));
        mock.debtor_type = 'Parent/Guardian';
        return mock;
      }
      case 'company': {
        const mock = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
        mock.party_details.organisation_details = {
          organisation_name: 'Test Org Ltd',
          organisation_aliases: [],
        };
        return mock;
      }
      case 'adultOrYouth':
      default: {
        const mock = structuredClone(createDefendantHeaderMockWithName('Robert', 'Thomson'));
        mock.debtor_type = 'individual';
        return mock;
      }
    }
  };

  const getAccountStateOverrides = (defendantType: DefendantType): Partial<IFinesAccountState> => {
    switch (defendantType) {
      case 'parentGuardian':
        return {
          party_name: 'Paula Guardian',
          party_type: 'parent-guardian',
        };
      case 'company':
        return {
          party_name: 'Test Org Ltd',
          party_type: 'company',
        };
      case 'adultOrYouth':
      default:
        return {
          party_name: 'Robert Thomson',
          party_type: 'individual',
        };
    }
  };

  const setupAmendPaymentTermsViaNavigation = (
    defendantType: DefendantType,
    headerOverride?: IOpalFinesAccountDefendantDetailsHeader,
  ) => {
    const headerMock = headerOverride ? structuredClone(headerOverride) : getHeaderMock(defendantType);
    const paymentTermsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
    const accountId = headerMock.defendant_account_party_id;

    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptDefendantHeader(accountId, headerMock, '123');
    interceptPaymentTerms(accountId, paymentTermsMock, '123');
    interceptResultByCode('REM');

    setupAccountEnquiryComponent({ ...componentProperties, accountId });

    cy.get(PAYMENT_TERMS_TAB.tabName).should('exist').and('contain.text', 'Payment terms');
    cy.contains(PAYMENT_TERMS_TAB.paymentTermsLink, 'Change').click();
    cy.get(AMEND_PAYMENT_TERMS.form).should('exist');
  };

  type AccountStateOverrides = Partial<IFinesAccountState> & { is_youth?: boolean };

  const mountAmendPaymentTermsForm = (
    defendantType: DefendantType = 'adultOrYouth',
    formOverrides: Partial<IFinesAccPaymentTermsAmendState> = {},
    accountStateOverrides: AccountStateOverrides = {},
  ) => {
    const formData = structuredClone(FINES_ACC_PAYMENT_TERMS_AMEND_FORM);
    formData.formData = {
      ...formData.formData,
      ...formOverrides,
    };

    mount(FinesAccPaymentTermsAmendFormComponent, {
      providers: [
        provideHttpClient(),
        provideRouter([]),
        DateService,
        UtilsService,
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            store.setAccountState({
              ...structuredClone(MOCK_FINES_ACCOUNT_STATE),
              ...getAccountStateOverrides(defendantType),
              ...accountStateOverrides,
            } as IFinesAccountState);
            return store;
          },
        },
      ],
      componentProperties: {
        initialFormData: formData,
      },
    });
  };

  describe('Adult or youth defendant', () => {
    it('AC1: Navigation opens the amend payment terms screen', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4250'] }, () => {
        setupAmendPaymentTermsViaNavigation('adultOrYouth');

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.form).should('exist');
      });

    it('AC2a: Display payment terms radio buttons', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4251'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth');

        cy.contains('legend', 'Select payment terms').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.payInFullLabel).should('contain.text', 'Pay in full');
        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyLabel).should('contain.text', 'Instalments only');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsLabel).should('contain.text', 'Lump sum plus instalments');
      });

    it('AC3a: Pay in full shows pay by date and is required', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4252'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth');

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).check({ force: true });
        cy.get(AMEND_PAYMENT_TERMS.payByDateLabel).should('contain.text', 'Enter pay by date');
        cy.get(AMEND_PAYMENT_TERMS.payByDateInput).should('exist');

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter pay by date');
      });

    it('AC3b: Pay in full past date warning message displays', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4253'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2020',
        });

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('be.checked');
        cy.contains('strong', 'Pay by date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC3c: Pay in full future date warning message displays', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4254'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
        });

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('be.checked');
        cy.contains('strong', 'Pay by date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC3dii.b: Invalid pay by date shows valid date error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4255'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '32/13/2024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC3dii.c: Invalid pay by date format shows format error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4256'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC4a: Instalments only shows mandatory fields', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4257'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
        });

        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).should('be.checked');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountLabel).should('contain.text', 'Instalment');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.frequencyWeeklyLabel).should('contain.text', 'Weekly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyFortnightlyLabel).should('contain.text', 'Fortnightly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyMonthlyLabel).should('contain.text', 'Monthly');
        cy.get(AMEND_PAYMENT_TERMS.startDateLabel).should('contain.text', 'Start date');
        cy.get(AMEND_PAYMENT_TERMS.startDateInput).should('exist');
      });

    it('AC4b: Start date in past warning displays', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4258'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_start_date: '01/01/2020',
        });

        cy.contains('strong', 'Start date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC4c: Start date in future warning displays', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4259'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.contains('strong', 'Start date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC4d: Instalments only missing values shows required errors', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4260'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth');

        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).click();
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter instalment amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Select frequency of instalments');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter start date');
      });

    it('AC4e: Instalment amount with too many decimals shows error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4261'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 12.345,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after',
        );
      });

    it('AC4f: Start date with invalid value shows valid date error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4262'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 10,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '35/14/2023',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC4g: Start date with invalid format shows format error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4263'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 10,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC5a: Lump sum plus instalments shows mandatory fields', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4264'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth');

        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).click();
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).should('be.checked');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumAmountLabel).should('contain.text', 'Lump sum');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountLabel).should('contain.text', 'Instalment');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.frequencyWeeklyLabel).should('contain.text', 'Weekly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyFortnightlyLabel).should('contain.text', 'Fortnightly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyMonthlyLabel).should('contain.text', 'Monthly');
        cy.get(AMEND_PAYMENT_TERMS.startDateLabel).should('contain.text', 'Start date');
        cy.get(AMEND_PAYMENT_TERMS.startDateInput).should('exist');

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter lump sum amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter instalment amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Select frequency of instalments');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter start date');
      });

    it('AC5b: Lump sum plus instalments start date in past warning displays', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4265'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'lumpSumPlusInstalments',
          facc_payment_terms_start_date: '01/01/2020',
        });

        cy.contains('strong', 'Start date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC5b: Lump sum plus instalments start date in future warning displays', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4266'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'lumpSumPlusInstalments',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.contains('strong', 'Start date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC5c: Pay in full invalid date shows calendar date error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4267'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '32/13/2024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC5c: Pay in full invalid format shows format error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4268'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC6a: Days in default checkbox displays for adult defendant', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4269'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth');

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultLabel).should('contain.text', 'There are days in default');
      });

    it('AC6b: Youth defendant does not show days in default checkbox', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4270'] }, () => {
        const youthHeader = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
        youthHeader.is_youth = true;
        youthHeader.debtor_type = 'Defendant';
        youthHeader.parent_guardian_party_id = null;
        youthHeader.party_details.individual_details = {
          ...youthHeader.party_details.individual_details!,
          date_of_birth: '2010-06-15',
          age: '14',
        };

        setupAmendPaymentTermsViaNavigation('adultOrYouth', youthHeader);

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCheckbox).should('not.exist');
      });

    it('AC6c/AC6d: Days in default fields and help link display when selected', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4271'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_has_days_in_default: true,
        });

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultDateLabel).should('contain.text', 'Date days in default were imposed');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultDateInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountLabel).should('contain.text', 'Enter days in default');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountInput).should('exist');
        cy.get('[summarytext="Help calculate days in default"]').should('exist');
      });

    it('AC6ei: Missing days in default date shows required error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4272'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter date days in default were imposed');
      });

    it('AC6eii: Future days in default date shows future date error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4273'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2050',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must not be in the future');
      });

    it('AC6eiii: Invalid days in default date shows valid calendar date error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4274'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '32/13/2024',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid calendar date');
      });

    it('AC6eiv: Days in default date invalid format shows format error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4275'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01012024',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC6ev: Missing days in default count shows required error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4276'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2024',
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter days in default');
      });

    it('AC6evi: Non-numeric days in default count shows numeric error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4277'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2024',
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountInput).type('abc');
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Default days in jail must only contain numbers',
        );
      });

    it('AC7a: Change without reason shows reason required error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4278'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_reason_for_change: null,
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter reason for change');
      });

    it('AC7b: Reason for change character count updates', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4279'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_reason_for_change: '1234567890',
        });

        cy.get(AMEND_PAYMENT_TERMS.reasonForChangeTextarea).should('have.attr', 'maxlength', '250');
        cy.get(AMEND_PAYMENT_TERMS.reasonForChangeCharacterCount).should(
          'contain.text',
          'You have 240 characters remaining',
        );
      });

    it('AC8a: Request payment card checkbox displays', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4280'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth');

        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardLabel).should('contain.text', 'Request payment card');
      });

    it('AC8bi: Pay in full with payment card request shows restriction error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4281'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          "Cannot request a payment card when payment terms are 'Pay in full'",
        );
      });

    it('AC8ci: Payment card already processing shows blocked banner', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4282'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_payment_card_request: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'a card has already been requested and is being processed').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('not.exist');
      });

    it('AC8cii: Enforcement action blocks request shows blocked banner', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4283'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_prevent_payment_card: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'the current enforcement action does not allow it').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('not.exist');
      });

    it('AC8ciii: Business unit blocks request text appears on blocked banner', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4284'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_prevent_payment_card: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'your business unit does not allow payment card requests').should('exist');
      });

    it('AC9a: Generate payment terms change letter checkbox displays', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4285'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth');

        cy.get(AMEND_PAYMENT_TERMS.changeLetterCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.changeLetterLabel).should('contain.text', 'Generate payment terms change letter');
      });

    it('AC9b: No changes with change letter checked shows error', { tags: [...buildTags('@JIRA-STORY:PO-1149'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4286'] }, () => {
        mountAmendPaymentTermsForm('adultOrYouth', {
          facc_payment_terms_change_letter: true,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Cannot generate payment terms change letter as no changes made',
        );
      });
  });

  describe('Parent or Guardian defendant', () => {
    it('AC1: Navigation opens the amend payment terms screen (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4287'] }, () => {
        setupAmendPaymentTermsViaNavigation('parentGuardian');

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.form).should('exist');
      });

    it('AC2a: Display payment terms radio buttons (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4288'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian');

        cy.contains('legend', 'Select payment terms').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.payInFullLabel).should('contain.text', 'Pay in full');
        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyLabel).should('contain.text', 'Instalments only');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsLabel).should('contain.text', 'Lump sum plus instalments');
      });

    it('AC3a: Pay in full shows pay by date and is required (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4289'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian');

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).check({ force: true });
        cy.get(AMEND_PAYMENT_TERMS.payByDateLabel).should('contain.text', 'Enter pay by date');
        cy.get(AMEND_PAYMENT_TERMS.payByDateInput).should('exist');

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter pay by date');
      });

    it('AC3b: Pay in full past date warning message displays (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4290'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2020',
        });

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('be.checked');
        cy.contains('strong', 'Pay by date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC3c: Pay in full future date warning message displays (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4291'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
        });

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('be.checked');
        cy.contains('strong', 'Pay by date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC3dii.b: Invalid pay by date shows valid date error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4292'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '32/13/2024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC3dii.c: Invalid pay by date format shows format error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4293'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC4a: Instalments only shows mandatory fields (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4294'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
        });

        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).should('be.checked');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountLabel).should('contain.text', 'Instalment');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.frequencyWeeklyLabel).should('contain.text', 'Weekly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyFortnightlyLabel).should('contain.text', 'Fortnightly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyMonthlyLabel).should('contain.text', 'Monthly');
        cy.get(AMEND_PAYMENT_TERMS.startDateLabel).should('contain.text', 'Start date');
        cy.get(AMEND_PAYMENT_TERMS.startDateInput).should('exist');
      });

    it('AC4b: Start date in past warning displays (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4295'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_start_date: '01/01/2020',
        });

        cy.contains('strong', 'Start date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC4c: Start date in future warning displays (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4296'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.contains('strong', 'Start date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC4d: Instalments only missing values shows required errors (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4297'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian');

        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).click();
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter instalment amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Select frequency of instalments');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter start date');
      });

    it('AC4e: Instalment amount with too many decimals shows error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4298'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 12.345,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after',
        );
      });

    it('AC4f: Start date with invalid value shows valid date error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4299'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 10,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '35/14/2023',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC4g: Start date with invalid format shows format error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4300'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 10,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC5a: Lump sum plus instalments shows mandatory fields (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4301'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian');

        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).click();
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).should('be.checked');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumAmountLabel).should('contain.text', 'Lump sum');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountLabel).should('contain.text', 'Instalment');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.frequencyWeeklyLabel).should('contain.text', 'Weekly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyFortnightlyLabel).should('contain.text', 'Fortnightly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyMonthlyLabel).should('contain.text', 'Monthly');
        cy.get(AMEND_PAYMENT_TERMS.startDateLabel).should('contain.text', 'Start date');
        cy.get(AMEND_PAYMENT_TERMS.startDateInput).should('exist');

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter lump sum amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter instalment amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Select frequency of instalments');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter start date');
      });

    it('AC5b: Lump sum plus instalments start date in past warning displays (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4302'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'lumpSumPlusInstalments',
          facc_payment_terms_start_date: '01/01/2020',
        });

        cy.contains('strong', 'Start date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC5b: Lump sum plus instalments start date in future warning displays (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4303'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'lumpSumPlusInstalments',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.contains('strong', 'Start date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC5c: Pay in full invalid date shows calendar date error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4304'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '32/13/2024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC5c: Pay in full invalid format shows format error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4305'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC6a: Days in default checkbox displays for adult defendant (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4306'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian');

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultLabel).should('contain.text', 'There are days in default');
      });

    it('AC6b: Youth defendant does not show days in default checkbox (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4307'] }, () => {
        const youthHeader = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
        youthHeader.is_youth = true;
        youthHeader.debtor_type = 'Defendant';
        youthHeader.parent_guardian_party_id = null;
        youthHeader.party_details.individual_details = {
          ...youthHeader.party_details.individual_details!,
          date_of_birth: '2010-06-15',
          age: '14',
        };

        setupAmendPaymentTermsViaNavigation('parentGuardian', youthHeader);

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCheckbox).should('not.exist');
      });

    it('AC6c/AC6d: Days in default fields and help link display when selected (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4308'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_has_days_in_default: true,
        });

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultDateLabel).should('contain.text', 'Date days in default were imposed');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultDateInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountLabel).should('contain.text', 'Enter days in default');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountInput).should('exist');
        cy.get('[summarytext="Help calculate days in default"]').should('exist');
      });

    it('AC6ei: Missing days in default date shows required error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4309'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter date days in default were imposed');
      });

    it('AC6eii: Future days in default date shows future date error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4310'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2050',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must not be in the future');
      });

    it('AC6eiii: Invalid days in default date shows valid calendar date error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4311'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '32/13/2024',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid calendar date');
      });

    it('AC6eiv: Days in default date invalid format shows format error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4312'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01012024',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC6ev: Missing days in default count shows required error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4313'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2024',
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter days in default');
      });

    it('AC6evi: Non-numeric days in default count shows numeric error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4314'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2024',
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountInput).type('abc');
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Default days in jail must only contain numbers',
        );
      });

    it('AC7a: Change without reason shows reason required error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4315'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_reason_for_change: null,
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter reason for change');
      });

    it('AC7b: Reason for change character count updates (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4316'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_reason_for_change: '1234567890',
        });

        cy.get(AMEND_PAYMENT_TERMS.reasonForChangeTextarea).should('have.attr', 'maxlength', '250');
        cy.get(AMEND_PAYMENT_TERMS.reasonForChangeCharacterCount).should(
          'contain.text',
          'You have 240 characters remaining',
        );
      });

    it('AC8a: Request payment card checkbox displays (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4317'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian');

        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardLabel).should('contain.text', 'Request payment card');
      });

    it('AC8bi: Pay in full with payment card request shows restriction error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4318'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          "Cannot request a payment card when payment terms are 'Pay in full'",
        );
      });

    it('AC8ci: Payment card already processing shows blocked banner (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4319'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_payment_card_request: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'a card has already been requested and is being processed').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('not.exist');
      });

    it('AC8cii: Enforcement action blocks request shows blocked banner (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4320'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_prevent_payment_card: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'the current enforcement action does not allow it').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('not.exist');
      });

    it('AC8ciii: Business unit blocks request text appears on blocked banner (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4321'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_prevent_payment_card: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'your business unit does not allow payment card requests').should('exist');
      });

    it('AC9a: Generate payment terms change letter checkbox displays (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4322'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian');

        cy.get(AMEND_PAYMENT_TERMS.changeLetterCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.changeLetterLabel).should('contain.text', 'Generate payment terms change letter');
      });

    it('AC9b: No changes with change letter checked shows error (Parent or Guardian defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1639'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4323'] }, () => {
        mountAmendPaymentTermsForm('parentGuardian', {
          facc_payment_terms_change_letter: true,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Cannot generate payment terms change letter as no changes made',
        );
      });
  });

  describe('Company defendant', () => {
    it('AC1: Navigation opens the amend payment terms screen (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4324'] }, () => {
        setupAmendPaymentTermsViaNavigation('company');

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.form).should('exist');
      });

    it('AC2a: Display payment terms radio buttons (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4325'] }, () => {
        mountAmendPaymentTermsForm('company');

        cy.contains('legend', 'Select payment terms').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.payInFullLabel).should('contain.text', 'Pay in full');
        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyLabel).should('contain.text', 'Instalments only');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsLabel).should('contain.text', 'Lump sum plus instalments');
      });

    it('AC3a: Pay in full shows pay by date and is required (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4326'] }, () => {
        mountAmendPaymentTermsForm('company');

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).check({ force: true });
        cy.get(AMEND_PAYMENT_TERMS.payByDateLabel).should('contain.text', 'Enter pay by date');
        cy.get(AMEND_PAYMENT_TERMS.payByDateInput).should('exist');

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter pay by date');
      });

    it('AC3b: Pay in full past date warning message displays (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4327'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2020',
        });

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('be.checked');
        cy.contains('strong', 'Pay by date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC3c: Pay in full future date warning message displays (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4328'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
        });

        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('be.checked');
        cy.contains('strong', 'Pay by date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC3dii.b: Invalid pay by date shows valid date error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4329'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '32/13/2024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC3dii.c: Invalid pay by date format shows format error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4330'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC4a: Instalments only shows mandatory fields (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4331'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
        });

        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).should('be.checked');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountLabel).should('contain.text', 'Instalment');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.frequencyWeeklyLabel).should('contain.text', 'Weekly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyFortnightlyLabel).should('contain.text', 'Fortnightly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyMonthlyLabel).should('contain.text', 'Monthly');
        cy.get(AMEND_PAYMENT_TERMS.startDateLabel).should('contain.text', 'Start date');
        cy.get(AMEND_PAYMENT_TERMS.startDateInput).should('exist');
      });

    it('AC4b: Start date in past warning displays (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4332'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_start_date: '01/01/2020',
        });

        cy.contains('strong', 'Start date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC4c: Start date in future warning displays (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4333'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.contains('strong', 'Start date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC4d: Instalments only missing values shows required errors (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4334'] }, () => {
        mountAmendPaymentTermsForm('company');

        cy.get(AMEND_PAYMENT_TERMS.instalmentsOnlyRadio).click();
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter instalment amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Select frequency of instalments');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter start date');
      });

    it('AC4e: Instalment amount with too many decimals shows error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4335'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 12.345,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after',
        );
      });

    it('AC4f: Start date with invalid value shows valid date error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4336'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 10,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '35/14/2023',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC4g: Start date with invalid format shows format error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4337'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'instalmentsOnly',
          facc_payment_terms_instalment_amount: 10,
          facc_payment_terms_instalment_period: 'M',
          facc_payment_terms_start_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC5a: Lump sum plus instalments shows mandatory fields (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4338'] }, () => {
        mountAmendPaymentTermsForm('company');

        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).click();
        cy.get(AMEND_PAYMENT_TERMS.lumpSumPlusInstalmentsRadio).should('be.checked');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumAmountLabel).should('contain.text', 'Lump sum');
        cy.get(AMEND_PAYMENT_TERMS.lumpSumAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountLabel).should('contain.text', 'Instalment');
        cy.get(AMEND_PAYMENT_TERMS.instalmentAmountInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.frequencyWeeklyLabel).should('contain.text', 'Weekly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyFortnightlyLabel).should('contain.text', 'Fortnightly');
        cy.get(AMEND_PAYMENT_TERMS.frequencyMonthlyLabel).should('contain.text', 'Monthly');
        cy.get(AMEND_PAYMENT_TERMS.startDateLabel).should('contain.text', 'Start date');
        cy.get(AMEND_PAYMENT_TERMS.startDateInput).should('exist');

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter lump sum amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter instalment amount');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Select frequency of instalments');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter start date');
      });

    it('AC5b: Lump sum plus instalments start date in past warning displays (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4339'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'lumpSumPlusInstalments',
          facc_payment_terms_start_date: '01/01/2020',
        });

        cy.contains('strong', 'Start date is in the past').should('exist');
        cy.contains('p', 'You can continue with date in the past or change').should('exist');
      });

    it('AC5b: Lump sum plus instalments start date in future warning displays (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4340'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'lumpSumPlusInstalments',
          facc_payment_terms_start_date: '01/01/2030',
        });

        cy.contains('strong', 'Start date is more than 6 months in the future').should('exist');
        cy.contains('p', 'You can continue with date in the future or change').should('exist');
      });

    it('AC5c: Pay in full invalid date shows calendar date error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4341'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '32/13/2024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid date');
      });

    it('AC5c: Pay in full invalid format shows format error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4342'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01012024',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC6a: Days in default checkbox displays for adult defendant (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4343'] }, () => {
        mountAmendPaymentTermsForm('company');

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultLabel).should('contain.text', 'There are days in default');
      });

    it('AC6b: Youth defendant does not show days in default checkbox (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4344'] }, () => {
        const youthHeader = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
        youthHeader.is_youth = true;
        youthHeader.debtor_type = 'Defendant';
        youthHeader.parent_guardian_party_id = null;
        youthHeader.party_details.individual_details = {
          ...youthHeader.party_details.individual_details!,
          date_of_birth: '2010-06-15',
          age: '14',
        };

        setupAmendPaymentTermsViaNavigation('company', youthHeader);

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.payInFullRadio).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCheckbox).should('not.exist');
      });

    it('AC6c/AC6d: Days in default fields and help link display when selected (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4345'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_has_days_in_default: true,
        });

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultDateLabel).should('contain.text', 'Date days in default were imposed');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultDateInput).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountLabel).should('contain.text', 'Enter days in default');
        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountInput).should('exist');
        cy.get('[summarytext="Help calculate days in default"]').should('exist');
      });

    it('AC6ei: Missing days in default date shows required error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4346'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter date days in default were imposed');
      });

    it('AC6eii: Future days in default date shows future date error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4347'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2050',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must not be in the future');
      });

    it('AC6eiii: Invalid days in default date shows valid calendar date error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4348'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '32/13/2024',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter a valid calendar date');
      });

    it('AC6eiv: Days in default date invalid format shows format error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4349'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01012024',
          facc_payment_terms_default_days_in_jail: 10,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');
      });

    it('AC6ev: Missing days in default count shows required error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4350'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2024',
          facc_payment_terms_default_days_in_jail: null,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter days in default');
      });

    it('AC6evi: Non-numeric days in default count shows numeric error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4351'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_has_days_in_default: true,
          facc_payment_terms_suspended_committal_date: '01/01/2024',
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.daysInDefaultCountInput).type('abc');
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Default days in jail must only contain numbers',
        );
      });

    it('AC7a: Change without reason shows reason required error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4352'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_reason_for_change: null,
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should('contain.text', 'Enter reason for change');
      });

    it('AC7b: Reason for change character count updates (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4353'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_reason_for_change: '1234567890',
        });

        cy.get(AMEND_PAYMENT_TERMS.reasonForChangeTextarea).should('have.attr', 'maxlength', '250');
        cy.get(AMEND_PAYMENT_TERMS.reasonForChangeCharacterCount).should(
          'contain.text',
          'You have 240 characters remaining',
        );
      });

    it('AC8a: Request payment card checkbox displays (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4354'] }, () => {
        mountAmendPaymentTermsForm('company');

        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardLabel).should('contain.text', 'Request payment card');
      });

    it('AC8bi: Pay in full with payment card request shows restriction error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4355'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_terms: 'payInFull',
          facc_payment_terms_pay_by_date: '01/01/2030',
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).click();
        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          "Cannot request a payment card when payment terms are 'Pay in full'",
        );
      });

    it('AC8ci: Payment card already processing shows blocked banner (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4356'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_payment_card_request: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'a card has already been requested and is being processed').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('not.exist');
      });

    it('AC8cii: Enforcement action blocks request shows blocked banner (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4357'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_prevent_payment_card: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'the current enforcement action does not allow it').should('exist');
        cy.get(AMEND_PAYMENT_TERMS.paymentCardCheckbox).should('not.exist');
      });

    it('AC8ciii: Business unit blocks request text appears on blocked banner (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4358'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_prevent_payment_card: true,
        });

        cy.contains('strong', 'Payment card request blocked').should('exist');
        cy.contains('li', 'your business unit does not allow payment card requests').should('exist');
      });

    it('AC9a: Generate payment terms change letter checkbox displays (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4359'] }, () => {
        mountAmendPaymentTermsForm('company');

        cy.get(AMEND_PAYMENT_TERMS.changeLetterCheckbox).should('exist');
        cy.get(AMEND_PAYMENT_TERMS.changeLetterLabel).should('contain.text', 'Generate payment terms change letter');
      });

    it('AC9b: No changes with change letter checked shows error (Company defendant)', { tags: [...buildTags('@JIRA-STORY:PO-1640'), '@JIRA-EPIC:PO-977', '@JIRA-TEST-KEY:PO-4360'] }, () => {
        mountAmendPaymentTermsForm('company', {
          facc_payment_terms_change_letter: true,
          facc_payment_terms_reason_for_change: 'Test reason',
        });

        cy.get(AMEND_PAYMENT_TERMS.pageHeading).should('contain.text', 'Payment terms');
        cy.get(AMEND_PAYMENT_TERMS.submitButton).click();
        cy.get(AMEND_PAYMENT_TERMS.errorSummary).should(
          'contain.text',
          'Cannot generate payment terms change letter as no changes made',
        );
      });
  });
});
