import { mount } from 'cypress/angular';
import { ActivatedRoute } from '@angular/router';
import { FinesMacAccountDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-account-details/fines-mac-account-details.component';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_check_account_mock';
import { MacAccountDetailsLocators as L } from '../../../shared/selectors/manual-account-creation/mac.account-details.locators';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IFinesMacState } from '../../../../src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { FINES_AYG_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_ayg_check_account_mock';
import { FINES_AYPG_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_aypg_check_account_mock';
import { FINES_COMP_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_comp_check_account_mock';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_REJECTED_ACCOUNT_MOCK } from './mocks/fines_mac_rejected_account_mock';
import { FINES_ACCOUNT_TYPES } from 'src/app/flows/fines/constants/fines-account-types.constant';

describe('FinesMacAccountDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_CHECK_ACCOUNT_MOCK);
  let finesRejectedAccountMock = structuredClone(FINES_REJECTED_ACCOUNT_MOCK);

  const setupComponent = (
    formSubmit: any,
    defendantTypeMock: string = '',
    finesMacStateMock: IFinesMacState = finesMacState,
    setAmend: boolean = false,
  ) => {
    mount(FinesMacAccountDetailsComponent, {
      providers: [
        UtilsService,
        DateService,
        FinesMacPayloadService,

        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacStateMock);
            return store;
          },
        },
        {
          provide: FinesDraftStore,
          useFactory: () => {
            let store = new FinesDraftStore();
            store.setAmend(setAmend);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                accountDetailsFetchMap: {
                  FinesMacStore: finesMacState,
                  finesMacDraft: finesRejectedAccountMock,
                },
              },
              parent: {
                snapshot: {
                  url: [{ path: 'manual-account-creation' }],
                },
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
      finesMacState = structuredClone(FINES_CHECK_ACCOUNT_MOCK);
    });
  });

  it('should render the component', () => {
    setupComponent(null);
    // Verify the component is rendered
    cy.get(L.dataPage).should('exist');
  });

  it(
    '(AC.1,AC.2,AC.3,AC.4,AC.5)should load all elements on the screen correctly for Adult or Youth Only',
    { tags: ['@PO-366', '@PO-272', '@PO-468', 'PO-524'] },
    () => {
      setupComponent(null);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

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
    { tags: ['@PO-367', '@PO-344', '@PO-468', '@PO-524'] },
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
    { tags: ['@PO-362', '@PO-345', '@PO-468', '@PO-524', '@PO-640'] },
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
    { tags: ['@PO-549', '@PO-272'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly', FINES_AYG_CHECK_ACCOUNT_MOCK);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

      cy.get(L.checkAccountButton).should('exist');
      cy.get(L.CheckDetails).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should('not.exist');
    },
  );

  it(
    '(AC.2)should not show option to continue if required forms have not been provided for Adult Or Youth Only and should show message',
    { tags: ['@PO-549', '@PO-272'] },
    () => {
      setupComponent(null);

      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

      cy.get(L.checkAccountButton).should('not.exist');
      cy.get(L.CheckDetails).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should(
        'contain',
        'You cannot proceed until all required sections have been completed.',
      );
    },
  );

  it(
    'should show option to continue if all required forms have been provided for AYPG',
    { tags: ['@PO-653', '@PO-344'] },
    () => {
      setupComponent(null, 'pgToPay', FINES_AYPG_CHECK_ACCOUNT_MOCK);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      cy.get(L.checkAccountButton).should('exist');
      cy.get(L.CheckDetails).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should('not.exist');
    },
  );

  it(
    'should not show option to continue if required forms have not been provided for AYPG',
    { tags: ['@PO-653', '@PO-344'] },
    () => {
      setupComponent(null);

      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      cy.get(L.checkAccountButton).should('not.exist');
      cy.get(L.CheckDetails).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should('exist');
    },
  );

  it(
    'should show option to continue if all required forms have been provided for Company',
    { tags: ['@PO-654', '@PO-345'] },
    () => {
      setupComponent(null, 'company', FINES_COMP_CHECK_ACCOUNT_MOCK);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(L.checkAccountButton).should('exist');
      cy.get(L.CheckDetails).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should('not.exist');
    },
  );

  it(
    'should not show option to continue if required forms have not been provided for Company',
    { tags: ['@PO-654', '@PO-345'] },
    () => {
      setupComponent(null);

      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(L.checkAccountButton).should('not.exist');
      cy.get(L.CheckDetails).should('contain', 'Check and submit');
      cy.get(L.CheckDetailsText).should(
        'contain',
        'You cannot proceed until all required sections have been completed.',
      );
    },
  );
  it('(AC.1,AC.2) should show rejected account when account is rejected', { tags: ['@PO-605', '@PO-640'] }, () => {
    setupComponent(null, '', FINES_AYG_CHECK_ACCOUNT_MOCK, true);
    cy.get(L.reviewComponent).should('exist');
    cy.get(L.status).contains('Rejected').should('exist');
    cy.get(L.reviewHistory).contains('Review history').should('exist');
    cy.get(L.pageTitle).contains('Mr John DOE').should('exist');
    cy.get(L.timeLine).should('exist');
    cy.get(L.timeLineTitle).contains('Rejected').should('exist');
    cy.get(L.timelineAuthor).contains('by Timmy Test').should('exist');
    cy.get(L.timelineDate).contains('03 July 2023').should('exist');
    cy.get(L.timelineDescription).contains('Account rejected due to incorrect information').should('exist');
  });

  it('(AC.3)should show history of timeline data', { tags: ['@PO-605', '@PO-640'] }, () => {
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
  });

  it(
    'should not show rejected account when amend is set to false and should have account details title',
    { tags: ['@PO-605', '@PO-640'] },
    () => {
      setupComponent(null, '', FINES_AYG_CHECK_ACCOUNT_MOCK, false);
      cy.get(L.pageTitle).contains('Account details').should('exist');
      cy.get(L.reviewComponent).should('not.exist');
    },
  );

  it(
    '(AC.4,AC.5) Should display summary table below the review history for adultOrYouthOnly',
    { tags: ['@PO-605', '@PO-640', '@PO-272'] },
    () => {
      setupComponent(null, '', FINES_AYG_CHECK_ACCOUNT_MOCK, true);

      cy.get(L.reviewComponent).should('exist');
      cy.get(L.status).contains('Rejected').should('exist');
      cy.get(L.reviewHistory).contains('Review history').should('exist');
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
    { tags: ['@PO-605', '@PO-640', '@PO-344'] },
    () => {
      setupComponent(null, '', FINES_AYPG_CHECK_ACCOUNT_MOCK, true);

      cy.get(L.reviewComponent).should('exist');
      cy.get(L.status).contains('Rejected').should('exist');
      cy.get(L.reviewHistory).contains('Review history').should('exist');
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
    { tags: ['@PO-605', '@PO-640', '@PO-345'] },
    () => {
      setupComponent(null, '', FINES_COMP_CHECK_ACCOUNT_MOCK, true);

      cy.get(L.reviewComponent).should('exist');
      cy.get(L.status).contains('Rejected').should('exist');
      cy.get(L.reviewHistory).contains('Review history').should('exist');
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

  it('(AC.4d) should show Document and Language Preferences if BU is Welsh speaking', { tags: ['@PO-640'] }, () => {
    FINES_COMP_CHECK_ACCOUNT_MOCK.languagePreferences.formData.fm_language_preferences_document_language = 'CY';
    FINES_COMP_CHECK_ACCOUNT_MOCK.languagePreferences.formData.fm_language_preferences_hearing_language = 'CY';

    FINES_COMP_CHECK_ACCOUNT_MOCK.businessUnit.welsh_language = true;

    setupComponent(null, '', FINES_COMP_CHECK_ACCOUNT_MOCK, true);

    // Verify Welsh language preferences are displayed
    cy.get(L.languagePreferences).should('exist');
    cy.get(L.languagePreferences).should('contain', 'Welsh and English');
  });
});
