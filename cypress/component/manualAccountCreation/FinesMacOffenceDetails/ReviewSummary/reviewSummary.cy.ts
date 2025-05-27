import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsReviewComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-review/fines-mac-offence-details-review.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FINES_REVIEW_SUMMARY_OFFENCE_MOCK } from './mocks/review_summary_offence_mock';
import { DOM_ELEMENTS } from './constants/review_summary_elements';

describe('ReviewSummaryComponent', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/opal-fines-service/offences',
      },
      (req) => {
        const requestedCjsCode = req.query['q'];
        const matchedOffences = OPAL_FINES_OFFENCES_REF_DATA_MOCK.refData.filter(
          (offence) => offence.get_cjs_code === requestedCjsCode,
        );
        req.reply({
          count: matchedOffences.length,
          refData: matchedOffences,
        });
      },
    );
  });

  let finesMacState = { ...FINES_REVIEW_SUMMARY_OFFENCE_MOCK };

  afterEach(() => {
    finesMacState = { ...FINES_REVIEW_SUMMARY_OFFENCE_MOCK };
  });

  const setupComponent = () => {
    mount(FinesMacOffenceDetailsReviewComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        DateService,
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
        {
          provide: FinesMacOffenceDetailsStore,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
      componentProperties: {},
    });
  };
  it('(AC.1)should render component', { tags: ['@PO-417', '@PO-676', '@PO-679', '@PO-545'] }, () => {
    setupComponent();
  });

  it(
    '(AC.1,AC.3)should load all elements on the screen',
    { tags: ['@PO-417', '@PO-676', '@PO-679', '@PO-545', '@PO-662', '@PO-663', '@PO-560'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.headingLarge).should('exist');
      cy.get(DOM_ELEMENTS.headingMedium).should('exist');
      cy.get(DOM_ELEMENTS.dateOfSentence).should('exist');
      cy.get(DOM_ELEMENTS.offencecode).should('exist');
      cy.get(DOM_ELEMENTS.tableHeadings).should('exist');
      cy.get(DOM_ELEMENTS.impositionType).should('exist');
      cy.get(DOM_ELEMENTS.creditor).should('exist');
      cy.get(DOM_ELEMENTS.amountImposed).should('exist');
      cy.get(DOM_ELEMENTS.amountPaid).should('exist');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('exist');
      cy.get(DOM_ELEMENTS.GrandtotalAmountImposed).should('exist');
      cy.get(DOM_ELEMENTS.GrandtotalAmountPaid).should('exist');
      cy.get(DOM_ELEMENTS.GrandtotalRemainingBalance).should('exist');
      cy.get(DOM_ELEMENTS.totalHeading).should('exist');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('exist');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('exist');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('exist');
      cy.get(DOM_ELEMENTS.addOffenceButton).should('exist');
      cy.get(DOM_ELEMENTS.returnToCreateAccountButton).should('exist');
      cy.get(DOM_ELEMENTS.cancelLink).should('exist');
    },
  );

  it(
    '(AC.4,AC.5,AC.6) should display the correct data in the elements',
    { tags: ['@PO-417', '@PO-676', '@PO-679', '@PO-545', '@PO-662', '@PO-663', '@PO-560'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.headingLarge).should('contain', 'Offences and impositions');
      cy.get(DOM_ELEMENTS.dateOfSentence).should('contain', 'Date of sentence').should('contain', '01 October 2021');
      cy.get(DOM_ELEMENTS.offencecode).should('contain', 'AK123456').should('contain', 'ak test');

      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Imposition');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Creditor');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Balance remaining');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Criminal Courts Charge');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£150.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£150.00');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Fine');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£300.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£20.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£280.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '300.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£20.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£280.00');

      cy.get(DOM_ELEMENTS.headingMedium).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.GrandtotalAmountImposed).should('contain', '£500.00').should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.GrandtotalAmountPaid).should('contain', '£70.00').should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.GrandtotalRemainingBalance)
        .should('contain', '£430.00')
        .should('contain', 'Balance remaining');

      cy.get(DOM_ELEMENTS.returnToCreateAccountButton).should('contain', 'Return to account details');
    },
  );

  it(
    'should have updated values for different set of impositions and reflect correct totals and balances',
    { tags: ['@PO-417', '@PO-676', '@PO-679', '@PO-545', '@PO-662', '@PO-663', '@PO-560'] },
    () => {
      setupComponent();

      finesMacState.offenceDetails[0].formData.fm_offence_details_impositions = [
        {
          fm_offence_details_imposition_id: 0,
          fm_offence_details_result_id: 'FCOMP',
          fm_offence_details_amount_imposed: 400,
          fm_offence_details_amount_paid: 100,
          fm_offence_details_balance_remaining: 300,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 3856,
        },
      ];

      finesMacState.offenceDetails[1].formData.fm_offence_details_impositions = [
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FO',
          fm_offence_details_amount_imposed: 600,
          fm_offence_details_amount_paid: 200,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: false,
          fm_offence_details_creditor: null,
          fm_offence_details_major_creditor_id: null,
        },
      ];

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Compensation');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'Aldi Stores Ltd (ALDI)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£400.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£100.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£300.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '£400.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£100.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£300.00');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Fine');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£600.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£400.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '600.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£400.00');

      cy.get(DOM_ELEMENTS.headingMedium).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.GrandtotalAmountImposed).should('contain', '£1000.00').should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.GrandtotalAmountPaid).should('contain', '£300.00').should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.GrandtotalRemainingBalance)
        .should('contain', '£700.00')
        .should('contain', 'Balance remaining');
    },
  );

  it(
    '(AC.9)should allow for multiple impositions for the same offence and reflect correct totals and balances',
    { tags: ['@PO-417', '@PO-676', '@PO-679', '@PO-545', '@PO-662', '@PO-663', '@PO-560'] },
    () => {
      setupComponent();

      finesMacState.offenceDetails[0].formData.fm_offence_details_impositions = [
        {
          fm_offence_details_imposition_id: 0,
          fm_offence_details_result_id: 'FCOMP',
          fm_offence_details_amount_imposed: 400,
          fm_offence_details_amount_paid: 100,
          fm_offence_details_balance_remaining: 300,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 3856,
        },
        {
          fm_offence_details_imposition_id: 0,
          fm_offence_details_result_id: 'FFR',
          fm_offence_details_amount_imposed: 2000,
          fm_offence_details_amount_paid: 200,
          fm_offence_details_balance_remaining: 1800,
          fm_offence_details_needs_creditor: false,
          fm_offence_details_creditor: null,
          fm_offence_details_major_creditor_id: null,
        },
      ];

      finesMacState.offenceDetails[1].formData.fm_offence_details_impositions = [
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FO',
          fm_offence_details_amount_imposed: 600,
          fm_offence_details_amount_paid: 200,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: false,
          fm_offence_details_creditor: null,
          fm_offence_details_major_creditor_id: null,
        },
        {
          fm_offence_details_imposition_id: 0,
          fm_offence_details_result_id: 'FFR',
          fm_offence_details_amount_imposed: 1000,
          fm_offence_details_amount_paid: 100,
          fm_offence_details_balance_remaining: 900,
          fm_offence_details_needs_creditor: false,
          fm_offence_details_creditor: null,
          fm_offence_details_major_creditor_id: null,
        },
      ];

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Compensation');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'Aldi Stores Ltd (ALDI)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£400.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£100.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£300.00');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'FORFEITED RECOGNISANCE');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£2000.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£1800.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '£2400.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£300.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£2100.00');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Fine');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£600.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£400.00');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'FORFEITED RECOGNISANCE');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£1000.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£100.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£900.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '1600.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£300.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£1300.00');

      cy.get(DOM_ELEMENTS.headingMedium).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.GrandtotalAmountImposed).should('contain', '£4000.00').should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.GrandtotalAmountPaid).should('contain', '£600.00').should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.GrandtotalRemainingBalance)
        .should('contain', '£3400.00')
        .should('contain', 'Balance remaining');
    },
  );

  it(
    '(AC.7a,AC.4b,AC.4c)should be able to hide and show impositions',
    { tags: ['@PO-417', '@PO-676', '@PO-679', '@PO-545', '@PO-662', '@PO-663', '@PO-560'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.hideLink, { timeout: 10000 }).should('contain', 'Hide');
      cy.get(DOM_ELEMENTS.hideLink).first().click();

      cy.get(DOM_ELEMENTS.hideLink).click();

      cy.get(DOM_ELEMENTS.impositionType).should('not.exist');
      cy.get(DOM_ELEMENTS.creditor).should('not.exist');
      cy.get(DOM_ELEMENTS.amountImposed).should('not.exist');
      cy.get(DOM_ELEMENTS.amountPaid).should('not.exist');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('not.exist');

      cy.get(DOM_ELEMENTS.totalHeading).should('not.exist');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('not.exist');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('not.exist');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('not.exist');
    },
  );
});
