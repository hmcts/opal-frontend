import { FinesMacAccountDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-account-details/fines-mac-account-details.component';
import { FINES_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_check_account_mock';
import { MacAccountDetailsLocators as L } from '../../../shared/selectors/manual-account-creation/mac.account-details.locators';
import { IFinesMacState } from '../../../../src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { FINES_AYG_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_ayg_check_account_mock';
import { FINES_AYPG_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_aypg_check_account_mock';
import { FINES_COMP_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_comp_check_account_mock';
import { FINES_REJECTED_ACCOUNT_MOCK } from './mocks/fines_mac_rejected_account_mock';
import { FINES_ACCOUNT_TYPES } from 'src/app/flows/fines/constants/fines-account-types.constant';
import {
  mountFinesMacComponent,
  setupFinesMacRouteComponent,
} from 'cypress/component/CommonSetup/FinesMac/FinesMacSetup';
import {
  interceptAuthenticatedUser,
  interceptBusinessUnits,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/CommonIntercepts/CommonUserState.mocks';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';

const buildTags = (...tags: string[]) => [...tags, MANUAL_ACCOUNT_CREATION_JIRA_LABEL];

describe('FinesMacAccountDetailsComponent', () => {
  let finesMacStateTemplate = structuredClone(FINES_CHECK_ACCOUNT_MOCK);
  let finesMacState = finesMacStateTemplate;
  let finesRejectedAccountMockTemplate = structuredClone(FINES_REJECTED_ACCOUNT_MOCK);
  let finesRejectedAccountMock = finesRejectedAccountMockTemplate;

  beforeEach(() => {
    finesMacStateTemplate = structuredClone(FINES_CHECK_ACCOUNT_MOCK);
    finesMacState = finesMacStateTemplate;
    finesRejectedAccountMockTemplate = structuredClone(FINES_REJECTED_ACCOUNT_MOCK);
    finesRejectedAccountMock = finesRejectedAccountMockTemplate;
  });

  const setupComponent = (
    formSubmit: any,
    defendantTypeMock: string = '',
    finesMacStateMock: IFinesMacState = finesMacStateTemplate,
    setAmend: boolean = false,
  ) => {
    void formSubmit;
    finesMacState = structuredClone(finesMacStateMock);
    finesRejectedAccountMock = structuredClone(finesRejectedAccountMockTemplate);

    mountFinesMacComponent({
      component: FinesMacAccountDetailsComponent,
      initialState: finesMacState,
      draftState: finesRejectedAccountMock,
      setAmend,
      routeSnapshotData: {
        accountDetailsFetchMap: {
          finesMacState,
          finesMacDraft: finesRejectedAccountMock,
        },
      },
      componentProperties: {
        defendantType: defendantTypeMock,
      },
    });
  };

  it(
    'should render the component (FinesMacAccountDetailsComponent)',
    { tags: [...buildTags('@JIRA-STORY:PO-2790'), '@JIRA-EPIC:PO-2750', '@JIRA-TEST-KEY:PO-4868'] },
    () => {
      setupComponent(null);
      // Verify the component is rendered
      cy.get(L.dataPage).should('exist');
    },
  );

  const localMacComponentSetup = () =>
    setupFinesMacRouteComponent({
      targetPath: 'fines/manual-account-creation/account-details',
      personalDetails: {
        formData: {
          fm_personal_details_title: 'Mr',
          fm_personal_details_forenames: 'John',
          fm_personal_details_surname: 'Doe',
          fm_personal_details_add_alias: false,
          fm_personal_details_aliases: [],
          fm_personal_details_dob: '1990-01-01',
          fm_personal_details_national_insurance_number: 'AB123456C',
          fm_personal_details_address_line_1: '123 Main Street',
          fm_personal_details_address_line_2: null,
          fm_personal_details_address_line_3: null,
          fm_personal_details_post_code: null,
          fm_personal_details_vehicle_make: null,
          fm_personal_details_vehicle_registration_mark: null,
        },
        nestedFlow: false,
      },
      offenceDetails: [
        {
          formData: {
            fm_offence_details_id: 1,
            fm_offence_details_date_of_sentence: '2023-01-01',
            fm_offence_details_offence_cjs_code: '12345',
            fm_offence_details_offence_id: 1,
            fm_offence_details_impositions: [],
          },
          nestedFlow: false,
        },
      ],
    });

  it('Simple page changes should be less than 250ms - Personal Details Page', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    localMacComponentSetup();

    // Defining selectors rather than re-using due to directly accessing DOM for more accurate performance measurements.
    const personalDetailsTabSelector = L.personalDetails + ' .govuk-link';
    const cancelLinkSelector = '.govuk-link';

    cy.get(L.pageTitle).should('have.text', 'Account details');

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(personalDetailsTabSelector) as HTMLElement;

      expect(element, `${personalDetailsTabSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Personal details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Personal Details page should load within 250ms`).to.be.lessThan(250);
        });
    });

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(cancelLinkSelector) as HTMLElement;

      expect(element, `${cancelLinkSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Account details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Account Details page should load within 250ms`).to.be.lessThan(250);
        });
    });
  });

  it('Simple page changes should be less than 250ms - Contact Details Page', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    localMacComponentSetup();

    // Defining selectors rather than re-using due to directly accessing DOM for more accurate performance measurements.
    const contactDetailsTabSelector = L.contactDetails + ' .govuk-link';
    const cancelLinkSelector = '.govuk-link';

    cy.get(L.pageTitle).should('have.text', 'Account details');

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(contactDetailsTabSelector) as HTMLElement;

      expect(element, `${contactDetailsTabSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Defendant contact details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Contact Details page should load within 250ms`).to.be.lessThan(250);
        });
    });

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(cancelLinkSelector) as HTMLElement;

      expect(element, `${cancelLinkSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Account details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Account Details page should load within 250ms`).to.be.lessThan(250);
        });
    });
  });

  it('Simple page changes should be less than 250ms - Employer Details Page', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    localMacComponentSetup();

    // Defining selectors rather than re-using due to directly accessing DOM for more accurate performance measurements.
    const employerDetailsTabSelector = L.employerDetails + ' .govuk-link';
    const cancelLinkSelector = '.govuk-link';

    cy.get(L.pageTitle).should('have.text', 'Account details');

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(employerDetailsTabSelector) as HTMLElement;

      expect(element, `${employerDetailsTabSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Employer details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Employer Details page should load within 250ms`).to.be.lessThan(250);
        });
    });

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(cancelLinkSelector) as HTMLElement;

      expect(element, `${cancelLinkSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Account details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Account Details page should load within 250ms`).to.be.lessThan(250);
        });
    });
  });

  it('Simple page changes should be less than 250ms - Payment Terms Page', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    localMacComponentSetup();

    // Defining selectors rather than re-using due to directly accessing DOM for more accurate performance measurements.
    const paymentTermsTabSelector = L.paymentTerms + ' .govuk-link';
    const cancelLinkSelector = '.govuk-link';

    cy.get(L.pageTitle).should('have.text', 'Account details');

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(paymentTermsTabSelector) as HTMLElement;

      expect(element, `${paymentTermsTabSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Payment terms')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Payment Terms page should load within 250ms`).to.be.lessThan(250);
        });
    });

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(cancelLinkSelector) as HTMLElement;

      expect(element, `${cancelLinkSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Account details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Account Details page should load within 250ms`).to.be.lessThan(250);
        });
    });
  });

  it('Simple page changes should be less than 250ms - Comments and Notes Page', { tags: [] }, () => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnits();

    localMacComponentSetup();

    // Defining selectors rather than re-using due to directly accessing DOM for more accurate performance measurements.
    const commentsAndNotesTabSelector = L.accountCommentsAndNotes + ' .govuk-link';
    const cancelLinkSelector = '.govuk-link';

    cy.get(L.pageTitle).should('have.text', 'Account details');

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(commentsAndNotesTabSelector) as HTMLElement;

      expect(element, `${commentsAndNotesTabSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Account comments and notes')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Comments and Notes page should load within 250ms`).to.be.lessThan(250);
        });
    });

    cy.window().then((win) => {
      const start = win.performance.now();
      const element = win.document.querySelector(cancelLinkSelector) as HTMLElement;

      expect(element, `${cancelLinkSelector} should exist`).to.not.be.null;

      element.click();

      cy.get(L.pageTitle)
        .should('have.text', 'Account details')
        .then(() => {
          const elapsed = win.performance.now() - start;

          expect(elapsed, `Account Details page should load within 250ms`).to.be.lessThan(250);
        });
    });
  });

  it(
    '(AC.1a) should show Police and court details for Conditional Caution and pass accessibility checks',
    { tags: [...buildTags('@JIRA-STORY:PO-2790'), '@JIRA-EPIC:PO-2750', '@JIRA-TEST-KEY:PO-4869'] },
    () => {
      const conditionalCautionState = structuredClone(FINES_CHECK_ACCOUNT_MOCK);
      conditionalCautionState.accountDetails.formData.fm_create_account_account_type =
        FINES_ACCOUNT_TYPES['Conditional Caution'];
      conditionalCautionState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

      setupComponent(null, 'adultOrYouthOnly', conditionalCautionState);

      cy.contains('h2.govuk-heading-m', 'Police and court details').should('exist');
      cy.get(L.taskList.itemByName('Court details'))
        .find(L.taskList.link)
        .should('contain', 'Police and court details');
    },
  );

  it(
    '(AC.2) should keep Court details label for Fine accounts',
    { tags: [...buildTags('@JIRA-STORY:PO-2790'), '@JIRA-EPIC:PO-2750', '@JIRA-TEST-KEY:PO-4870'] },
    () => {
      const fineState = structuredClone(FINES_CHECK_ACCOUNT_MOCK);
      fineState.accountDetails.formData.fm_create_account_account_type = FINES_ACCOUNT_TYPES.Fine;
      fineState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

      setupComponent(null, 'adultOrYouthOnly', fineState);

      cy.contains('h2.govuk-heading-m', 'Court details').should('exist');
      cy.get(L.taskList.itemByName('Court details')).find(L.taskList.link).should('contain', 'Court details');
      cy.get(L.taskList.itemByName('Court details')).find(L.taskList.link).should('not.contain', 'Police and court');
    },
  );

  it(
    '(AC.2) should keep Court details label for Fixed Penalty accounts',
    { tags: [...buildTags('@JIRA-STORY:PO-2790'), '@JIRA-EPIC:PO-2750', '@JIRA-TEST-KEY:PO-4871'] },
    () => {
      const fineState = structuredClone(FINES_CHECK_ACCOUNT_MOCK);
      fineState.accountDetails.formData.fm_create_account_account_type = FINES_ACCOUNT_TYPES['Fixed Penalty'];
      fineState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

      setupComponent(null, 'adultOrYouthOnly', fineState);

      cy.contains('h2.govuk-heading-m', 'Court details').should('exist');
      cy.get(L.taskList.itemByName('Court details')).find(L.taskList.link).should('contain', 'Court details');
      cy.get(L.taskList.itemByName('Court details')).find(L.taskList.link).should('not.contain', 'Police and court');
    },
  );

  it(
    '(AC.1,AC.2,AC.2a,AC.3,AC.4,AC.5)should load all elements on the screen correctly for Adult or Youth Only',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-366', '@JIRA-STORY:PO-468', '@JIRA-STORY:PO-524', '@JIRA-STORY:PO-2767'),
        '@JIRA-EPIC:PO-272',
        '@JIRA-TEST-KEY:PO-4872',
      ],
    },
    () => {
      setupComponent(null);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

      // Verify all elements are rendered
      cy.get(L.dataPage).should('exist');
      cy.get(L.backLink).should('exist');
      cy.get(L.pageTitle).should('exist');
      cy.get(L.entryType).should('exist');
      cy.get(L.businessUnit).should('exist');
      cy.get(L.accountType).should('exist');
      cy.get(L.defendantType).should('exist');
      cy.get(L.courtDetails).should('exist');
      cy.get(L.offenceAndImpositionDetails).should('exist');
      cy.get(L.accountCommentsAndNotes).should('exist');
      cy.get(L.deleteAccountLink).should('exist');
      cy.get(L.offenceDetails).should('exist');
      cy.get(L.paymentTerms).should('exist');
      cy.get(L.accountCommentsAndNotesItem).should('exist');
      cy.get(L.defendantDetails).should('exist');
      cy.get(L.personalDetails).should('exist');
      cy.get(L.employerDetails).should('exist');
      cy.get(L.contactDetails).should('exist');

      //verify correct text is displayed
      cy.get(L.accountType).should('contain', FINES_ACCOUNT_TYPES.Fine);
      cy.get(L.defendantType).should('contain', 'Adult or youth only');
    },
  );

  it(
    '(AC.1,AC.2,AC.3,AC.4,AC.5,AC.6)should load all elements on the screen correctly for AYPG',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-367', '@JIRA-STORY:PO-468', '@JIRA-STORY:PO-524'),
        '@JIRA-EPIC:PO-344',
        '@JIRA-TEST-KEY:PO-4873',
      ],
    },
    () => {
      setupComponent(null);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      cy.get(L.dataPage).should('exist');
      cy.get(L.backLink).should('exist');
      cy.get(L.pageTitle).should('exist');
      cy.get(L.businessUnit).should('exist');
      cy.get(L.accountType).should('exist');
      cy.get(L.defendantType).should('exist');
      cy.get(L.courtDetails).should('exist');
      cy.get(L.offenceAndImpositionDetails).should('exist');
      cy.get(L.accountCommentsAndNotes).should('exist');
      cy.get(L.deleteAccountLink).should('exist');
      cy.get(L.offenceDetails).should('exist');
      cy.get(L.paymentTerms).should('exist');
      cy.get(L.accountCommentsAndNotesItem).should('exist');
      cy.get(L.defendantType).should('contain', 'Adult or youth with parent or guardian to pay');
      cy.get(L.parentOrGuardianDetails).should('exist');
      cy.get(L.personalDetails).should('exist');
      cy.get(L.paymentTerms).should('exist');
      cy.get(L.courtDetails).should('exist');
      cy.get(L.employerDetails).should('exist');
      cy.get(L.contactDetails).should('exist');

      cy.get(L.accountType).should('contain', FINES_ACCOUNT_TYPES.Fine);
      cy.get(L.defendantType).should('contain', 'Adult or youth with parent or guardian to pay');
    },
  );

  it(
    '(AC.1,AC.2,AC.3,AC.4,AC.5)should load all elements on the screen correctly',
    {
      tags: [
        ...buildTags('@JIRA-STORY:PO-362', '@JIRA-STORY:PO-468', '@JIRA-STORY:PO-524', '@JIRA-STORY:PO-640'),
        '@JIRA-EPIC:PO-345',
        '@JIRA-TEST-KEY:PO-4874',
      ],
    },
    () => {
      setupComponent(null);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';
      finesMacState.businessUnit.welsh_language = false;

      // Verify all elements are rendered
      cy.get(L.dataPage).should('exist');
      cy.get(L.backLink).should('exist');
      cy.get(L.pageTitle).should('exist');
      cy.get(L.businessUnit).should('exist');
      cy.get(L.accountType).should('exist');
      cy.get(L.defendantType).should('exist');
      cy.get(L.courtDetails).should('exist');
      cy.get(L.offenceAndImpositionDetails).should('exist');
      cy.get(L.accountCommentsAndNotes).should('exist');
      cy.get(L.deleteAccountLink).should('exist');
      cy.get(L.offenceDetails).should('exist');
      cy.get(L.paymentTerms).should('exist');
      cy.get(L.accountCommentsAndNotesItem).should('exist');

      cy.get(L.languagePreferences).should('not.exist');

      cy.get(L.accountType).should('contain', FINES_ACCOUNT_TYPES.Fine);
      cy.get(L.defendantType).should('contain', 'Company');
    },
  );

  it(
    '(AC.1)should show option to continue if all required forms have been provided for Adult Or Youth Only',
    { tags: [...buildTags('@JIRA-STORY:PO-549'), '@JIRA-EPIC:PO-272', '@JIRA-TEST-KEY:PO-4875'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_AYG_CHECK_ACCOUNT_MOCK);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

      cy.get(L.checkAccountButton).should('exist');
      cy.get(L.sectionHeading).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should('not.exist');
    },
  );

  it(
    '(AC.2)should not show option to continue if required forms have not been provided for Adult Or Youth Only and should show message',
    { tags: [...buildTags('@JIRA-STORY:PO-549'), '@JIRA-EPIC:PO-272', '@JIRA-TEST-KEY:PO-4876'] },
    () => {
      setupComponent(null);

      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

      cy.get(L.checkAccountButton).should('not.exist');
      cy.get(L.sectionHeading).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should(
        'contain',
        'You cannot proceed until all required sections have been completed.',
      );
    },
  );

  it(
    'should show option to continue if all required forms have been provided for AYPG',
    { tags: [...buildTags('@JIRA-STORY:PO-653'), '@JIRA-EPIC:PO-344', '@JIRA-TEST-KEY:PO-4877'] },
    () => {
      setupComponent(null, 'pgToPay', FINES_AYPG_CHECK_ACCOUNT_MOCK);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      cy.get(L.checkAccountButton).should('exist');
      cy.get(L.sectionHeading).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should('not.exist');
    },
  );

  it(
    'should not show option to continue if required forms have not been provided for AYPG',
    { tags: [...buildTags('@JIRA-STORY:PO-653'), '@JIRA-EPIC:PO-344', '@JIRA-TEST-KEY:PO-4878'] },
    () => {
      setupComponent(null);

      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      cy.get(L.checkAccountButton).should('not.exist');
      cy.get(L.sectionHeading).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should('exist');
    },
  );

  it(
    'should show option to continue if all required forms have been provided for Company',
    { tags: [...buildTags('@JIRA-STORY:PO-654'), '@JIRA-EPIC:PO-345', '@JIRA-TEST-KEY:PO-4879'] },
    () => {
      setupComponent(null, 'company', FINES_COMP_CHECK_ACCOUNT_MOCK);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(L.checkAccountButton).should('exist');
      cy.get(L.sectionHeading).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should('not.exist');
    },
  );

  it(
    'should not show option to continue if required forms have not been provided for Company',
    { tags: [...buildTags('@JIRA-STORY:PO-654'), '@JIRA-EPIC:PO-345', '@JIRA-TEST-KEY:PO-4880'] },
    () => {
      setupComponent(null);

      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(L.checkAccountButton).should('not.exist');
      cy.get(L.sectionHeading).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should(
        'contain',
        'You cannot proceed until all required sections have been completed.',
      );
    },
  );
  it(
    '(AC.1,AC.2) should show rejected account when account is rejected',
    {
      tags: [...buildTags('@JIRA-STORY:PO-605', '@JIRA-STORY:PO-640'), '@JIRA-EPIC:PO-2220', '@JIRA-TEST-KEY:PO-4881'],
    },
    () => {
      setupComponent(null, '', FINES_AYG_CHECK_ACCOUNT_MOCK, true);
      cy.get(L.reviewComponent).should('exist');
      cy.get(L.status).contains('Rejected').should('exist');
      cy.get(L.sectionHeading).contains('Review history').should('exist');
      cy.get(L.pageTitle).contains('Mr John DOE').should('exist');
      cy.get(L.timeLine).should('exist');
      cy.get(L.timeLineTitle).contains('Rejected').should('exist');
      cy.get(L.timelineAuthor).contains('by Timmy Test').should('exist');
      cy.get(L.timelineDate).contains('03 July 2023').should('exist');
      cy.get(L.timelineDescription).contains('Account rejected due to incorrect information').should('exist');
    },
  );

  it(
    '(AC.3)should show history of timeline data',
    {
      tags: [...buildTags('@JIRA-STORY:PO-605', '@JIRA-STORY:PO-640'), '@JIRA-EPIC:PO-2220', '@JIRA-TEST-KEY:PO-4882'],
    },
    () => {
      finesRejectedAccountMock.timeline_data.push({
        username: 'Timmy Test',
        status: 'Rejected',
        status_date: '2023-07-05',
        reason_text: null,
      });
      finesRejectedAccountMock.timeline_data.push({
        username: 'Timmy Test',
        status: 'Submitted',
        status_date: '2023-07-07',
        reason_text: null,
      });

      setupComponent(null, '', FINES_AYG_CHECK_ACCOUNT_MOCK, true);

      cy.get(L.timeLine).should('exist');
      const timelineEntries = [
        { title: 'Submitted', author: 'by Timmy Test', date: '03 July 2023' },
        { title: 'Rejected', author: 'by Timmy Test', date: '05 July 2023' },
        { title: 'Submitted', author: 'by Timmy Test', date: '07 July 2023' },
      ];

      timelineEntries.forEach((entry) => {
        cy.get(L.timeLineTitle).contains(entry.title).should('exist');
        cy.get(L.timelineAuthor).contains(entry.author).should('exist');
        cy.get(L.timelineDate).contains(entry.date).should('exist');
      });
    },
  );

  it(
    'should not show rejected account when amend is set to false and should have account details title',
    {
      tags: [...buildTags('@JIRA-STORY:PO-605', '@JIRA-STORY:PO-640'), '@JIRA-EPIC:PO-2220', '@JIRA-TEST-KEY:PO-4883'],
    },
    () => {
      setupComponent(null, '', FINES_AYG_CHECK_ACCOUNT_MOCK, false);
      cy.get(L.pageTitle).contains('Account details').should('exist');
      cy.get(L.reviewComponent).should('not.exist');
    },
  );

  it(
    '(AC.4,AC.5) Should display summary table below the review history for adultOrYouthOnly',
    { tags: [...buildTags('@JIRA-STORY:PO-605', '@JIRA-STORY:PO-640'), '@JIRA-EPIC:PO-272', '@JIRA-TEST-KEY:PO-4884'] },
    () => {
      setupComponent(null, '', FINES_AYG_CHECK_ACCOUNT_MOCK, true);

      cy.get(L.reviewComponent).should('exist');
      cy.get(L.status).contains('Rejected').should('exist');
      cy.get(L.sectionHeading).contains('Review history').should('exist');
      cy.get(L.pageTitle).contains('Mr John DOE').should('exist');
      cy.get(L.timeLine).should('exist');
      cy.get(L.timeLineTitle).contains('Rejected').should('exist');
      cy.get(L.timelineAuthor).contains('by Timmy Test').should('exist');
      cy.get(L.timelineDate).contains('03 July 2023').should('exist');
      cy.get(L.timelineDescription).contains('Account rejected due to incorrect information').should('exist');

      // Verify all elements are rendered
      cy.get(L.dataPage).should('exist');
      cy.get(L.backLink).should('exist');
      cy.get(L.pageTitle).should('exist');
      cy.get(L.businessUnit).should('exist');
      cy.get(L.accountType).should('exist');
      cy.get(L.defendantType).should('exist');
      cy.get(L.courtDetails).should('exist');
      cy.get(L.offenceAndImpositionDetails).should('exist');
      cy.get(L.accountCommentsAndNotes).should('exist');
      cy.get(L.offenceDetails).should('exist');
      cy.get(L.paymentTerms).should('exist');
      cy.get(L.accountCommentsAndNotesItem).should('exist');
      cy.get(L.defendantDetails).should('exist');
      cy.get(L.personalDetails).should('exist');
      cy.get(L.employerDetails).should('exist');
      cy.get(L.contactDetails).should('exist');

      cy.get(L.accountType).should('contain', FINES_ACCOUNT_TYPES.Fine);
      cy.get(L.defendantType).should('contain', 'Adult or youth only');
    },
  );

  it(
    '(AC.4,AC.6) Should display summary table below the review history for AYPG',
    { tags: [...buildTags('@JIRA-STORY:PO-605', '@JIRA-STORY:PO-640'), '@JIRA-EPIC:PO-344', '@JIRA-TEST-KEY:PO-4885'] },
    () => {
      setupComponent(null, '', FINES_AYPG_CHECK_ACCOUNT_MOCK, true);

      cy.get(L.reviewComponent).should('exist');
      cy.get(L.status).contains('Rejected').should('exist');
      cy.get(L.sectionHeading).contains('Review history').should('exist');
      cy.get(L.pageTitle).contains('Mr John DOE').should('exist');
      cy.get(L.timeLine).should('exist');
      cy.get(L.timeLineTitle).contains('Rejected').should('exist');
      cy.get(L.timelineAuthor).contains('by Timmy Test').should('exist');
      cy.get(L.timelineDate).contains('03 July 2023').should('exist');
      cy.get(L.timelineDescription).contains('Account rejected due to incorrect information').should('exist');

      // Verify all elements are rendered
      cy.get(L.dataPage).should('exist');
      cy.get(L.backLink).should('exist');
      cy.get(L.pageTitle).should('exist');
      cy.get(L.businessUnit).should('exist');
      cy.get(L.accountType).should('exist');
      cy.get(L.defendantType).should('exist');
      cy.get(L.courtDetails).should('exist');
      cy.get(L.offenceAndImpositionDetails).should('exist');
      cy.get(L.accountCommentsAndNotes).should('exist');
      cy.get(L.offenceDetails).should('exist');
      cy.get(L.paymentTerms).should('exist');
      cy.get(L.accountCommentsAndNotesItem).should('exist');
      cy.get(L.defendantType).should('contain', 'Adult or youth with parent or guardian to pay');
      cy.get(L.parentOrGuardianDetails).should('exist');
      cy.get(L.personalDetails).should('exist');
      cy.get(L.paymentTerms).should('exist');
      cy.get(L.courtDetails).should('exist');
      cy.get(L.employerDetails).should('exist');
      cy.get(L.contactDetails).should('exist');

      cy.get(L.accountType).should('contain', FINES_ACCOUNT_TYPES.Fine);
      cy.get(L.defendantType).should('contain', 'Adult or youth with parent or guardian to pay');
    },
  );

  it(
    '(AC.4,AC.7) Should display summary table below the review history for COMP',
    { tags: [...buildTags('@JIRA-STORY:PO-605', '@JIRA-STORY:PO-640'), '@JIRA-EPIC:PO-345', '@JIRA-TEST-KEY:PO-4886'] },
    () => {
      setupComponent(null, '', FINES_COMP_CHECK_ACCOUNT_MOCK, true);

      cy.get(L.reviewComponent).should('exist');
      cy.get(L.status).contains('Rejected').should('exist');
      cy.get(L.sectionHeading).contains('Review history').should('exist');
      cy.get(L.pageTitle).contains('Company Name').should('exist');
      cy.get(L.timeLine).should('exist');
      cy.get(L.timeLineTitle).contains('Rejected').should('exist');
      cy.get(L.timelineAuthor).contains('by Timmy Test').should('exist');
      cy.get(L.timelineDate).contains('03 July 2023').should('exist');
      cy.get(L.timelineDescription).contains('Account rejected due to incorrect information').should('exist');

      // Verify all elements are rendered
      cy.get(L.dataPage).should('exist');
      cy.get(L.backLink).should('exist');
      cy.get(L.pageTitle).should('exist');
      cy.get(L.businessUnit).should('exist');
      cy.get(L.accountType).should('exist');
      cy.get(L.defendantType).should('exist');
      cy.get(L.courtDetails).should('exist');
      cy.get(L.offenceAndImpositionDetails).should('exist');
      cy.get(L.accountCommentsAndNotes).should('exist');
      cy.get(L.offenceDetails).should('exist');
      cy.get(L.paymentTerms).should('exist');
      cy.get(L.accountCommentsAndNotesItem).should('exist');

      cy.get(L.accountType).should('contain', FINES_ACCOUNT_TYPES.Fine);
      cy.get(L.defendantType).should('contain', 'Company');
    },
  );

  it(
    '(AC.4d) should show Document and Language Preferences if BU is Welsh speaking',
    { tags: [...buildTags('@JIRA-STORY:PO-640'), '@JIRA-EPIC:PO-545', '@JIRA-TEST-KEY:PO-4887'] },
    () => {
      FINES_COMP_CHECK_ACCOUNT_MOCK.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
      FINES_COMP_CHECK_ACCOUNT_MOCK.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';

      FINES_COMP_CHECK_ACCOUNT_MOCK.businessUnit.welsh_language = true;

      setupComponent(null, '', FINES_COMP_CHECK_ACCOUNT_MOCK, true);

      // Verify Welsh language preferences are displayed
      cy.get(L.languagePreferences).should('exist');
      cy.get(L.languagePreferences).should('contain', 'Welsh and English');
    },
  );

  it(
    'should give each "Change" action a unique accessible name (via visually hidden context)',
    { tags: [...buildTags('@JIRA-STORY:PO-2787'), '@JIRA-EPIC:PO-545', '@JIRA-TEST-KEY:PO-4888'] },
    () => {
      setupComponent(null);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';
      finesMacState.businessUnit.welsh_language = true;

      // Document language row -> Change link -> visually hidden context
      cy.contains('.govuk-summary-list__row', 'Document language')
        .find('a.govuk-link')
        .should('contain.text', 'Change')
        .within(() => {
          cy.get('span.govuk-visually-hidden').should('exist').and('contain.text', 'document language');
        });

      // Hearing language row -> Change link -> visually hidden context
      cy.contains('.govuk-summary-list__row', 'Hearing language')
        .find('a.govuk-link')
        .should('contain.text', 'Change')
        .within(() => {
          cy.get('span.govuk-visually-hidden').should('exist').and('contain.text', 'hearing language');
        });
    },
  );
});
