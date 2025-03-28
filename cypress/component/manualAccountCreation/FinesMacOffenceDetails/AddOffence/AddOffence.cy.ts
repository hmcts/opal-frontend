import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { ADD_OFFENCE_OFFENCE_MOCK } from './mocks/add-offence-draft-state-mock';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@services/date-service/date.service';
import { DOM_ELEMENTS, impostitionSelectors } from './constants/fines_mac_offence_details_elements';
import { IMPOSITION_ERROR_MESSAGES, OFFENCE_ERROR_MESSAGES } from './constants/fines_mac_offence_details_errors';
import { UtilsService } from '@services/utils/utils.service';
import { impositionResultCodelist } from './constants/fines_mac_offence_details_results_codes';
import { IMPOSITION_MOCK_1, IMPOSITION_MOCK_2, IMPOSITION_MOCK_3 } from './mocks/add-offence-imposition-mock';

describe('FinesMacAddOffenceComponent', () => {
  let finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
  let offenceDetailsDraftState = structuredClone(ADD_OFFENCE_OFFENCE_MOCK);
  const date = new Date();

  beforeEach(() => {
    cy.intercept('GET', '**/opal-fines-service/results**', {
      statusCode: 200,
      body: OPAL_FINES_RESULTS_REF_DATA_MOCK,
    });
    cy.intercept('GET', '**/opal-fines-service/major-creditors**', {
      statusCode: 200,
      body: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
    });
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

  let currentoffenceDetails = 0;

  afterEach(() => {
    cy.then(() => {
      finesMacState.offenceDetails[currentoffenceDetails].formData = {
        fm_offence_details_id: 0,
        fm_offence_details_date_of_sentence: '',
        fm_offence_details_offence_cjs_code: null,
        fm_offence_details_offence_id: 0,
        fm_offence_details_impositions: [],
      };
    });
  });

  const setupComponent = (formSubmit: any, defendantType: string = '') => {
    mount(FinesMacOffenceDetailsAddAnOffenceComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        DateService,
        UtilsService,
        {
          provide: FinesMacOffenceDetailsStore,
          useFactory: () => {
            const store = new FinesMacOffenceDetailsStore();
            store.setOffenceDetailsDraft(offenceDetailsDraftState.offenceDetailsDraft);
            store.setRemoveMinorCreditor(0);

            return store;
          },
        },
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
        handleOffenceDetailsSubmit: formSubmit,
        defendantType: defendantType,
      },
    });
  };

  it('(AC.1)should render the component', { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it(
    '(AC.1,AC.2,AC.3,AC.3a,AC.3ai,AC.3b,AC.4) should render all the elements on the page as per design artifact and not render imposition remove link',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      const imposition_1 = impostitionSelectors(0);

      cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Add an offence');
      cy.get(DOM_ELEMENTS.legend).should('contain', 'Offence details');

      cy.get(DOM_ELEMENTS.dateOfSentenceInput).should('exist');
      cy.get(DOM_ELEMENTS.offenceCodeInput).should('exist');
      cy.get(imposition_1.resultCodeInput).should('exist');
      cy.get(imposition_1.amountImposedInput).should('exist');
      cy.get(imposition_1.amountPaidInput).should('exist');

      cy.get(DOM_ELEMENTS.addImpositionButton).should('exist');
      cy.get(DOM_ELEMENTS.submitButton).should('exist');

      cy.get(DOM_ELEMENTS.dateOfSentenceLabel).should('contain', 'Date of sentence');
      cy.get(DOM_ELEMENTS.dateHint).should('contain', 'For example, 31/01/2023');
      cy.get(DOM_ELEMENTS.offenceCodeLabel).should('contain', 'Offence code');
      cy.get(DOM_ELEMENTS.offenceCodeHint).should(
        'contain',
        "For example, HY35014. If you don't know the offence code, you can",
      );
      cy.get(DOM_ELEMENTS.offenceLink).should('contain', ' search the offence list');
      cy.get(imposition_1.resultCodeLabel).should('contain', 'Result code');
      cy.get(imposition_1.amountImposedLabel).should('contain', 'Amount imposed');
      cy.get(imposition_1.amountPaidLabel).should('contain', 'Amount paid');

      cy.get(DOM_ELEMENTS.removeImpositionLink).eq(2).should('not.exist');
    },
  );

  it(
    'should render Add another offence button correctly for all defendant types',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-272', '@PO-344', '@PO-345'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');
      cy.get('button[type="submit"]').should('contain', 'Add another offence');

      setupComponent(null, 'parentOrGuardianToPay');
      cy.get('button[type="submit"]').should('contain', 'Add another offence');

      setupComponent(null, 'company');

      cy.get('button[type="submit"]').should('contain', 'Add another offence');
    },
  );

  it(
    '(AC.7b,AC.7d,AC.7h,AC.7i) should show error messages when the form is submitted with empty fields',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary)
        .should('contain', OFFENCE_ERROR_MESSAGES.requiredSentenceDate)
        .should('contain', OFFENCE_ERROR_MESSAGES.requiredOffenceCode)
        .should('contain', IMPOSITION_ERROR_MESSAGES.requiredImpositionCode)
        .should('contain', IMPOSITION_ERROR_MESSAGES.requiredAmountImposed);
    },
  );

  it(
    '(AC.8)should allow form to be submitted with required fields filled in',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      setupComponent(mockFormSubmit);

      let Imposition = structuredClone(IMPOSITION_MOCK_3);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );

  it(
    '(AC.4b,AC.4bi,AC,4c) should show minor,major creditor fields for (FCOMP,FCOST) Only',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      const imposition_1 = impostitionSelectors(0);

      impositionResultCodelist.forEach((resultCode) => {
        if (resultCode === 'Compensation (FCOMP)' || resultCode === 'Costs (FCOST)') {
          cy.get(imposition_1.resultCodeInput).type(`${resultCode}`, { delay: 0 });
          cy.get(imposition_1.resultCodeLabel).click();
          cy.get(imposition_1.majorCreditor).should('exist');
          cy.get(imposition_1.minorCreditor).should('exist');
          cy.get(imposition_1.majorCreditorLabel).should('contain', 'Major creditor');
          cy.get(imposition_1.minorCreditorLabel).should('contain', 'Minor creditor');
        } else {
          cy.get(imposition_1.resultCodeInput).type(`${resultCode}`, { delay: 0 });
          cy.get(imposition_1.resultCodeLabel).click();

          cy.get(imposition_1.majorCreditor).should('not.exist');
          cy.get(imposition_1.minorCreditor).should('not.exist');
          cy.get(imposition_1.majorCreditorLabel).should('not.exist');
          cy.get(imposition_1.minorCreditorLabel).should('not.exist');
        }
      });
    },
  );

  it(
    'should not allow form to be submitted without selecting minor creditor or major creditor field',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);
      const SELECTOR = impostitionSelectors(0);

      let Imposition_1 = structuredClone(IMPOSITION_MOCK_1);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition_1);

      cy.get(SELECTOR.resultCodeInput).click();
      cy.get(SELECTOR.resultCodeAutoComplete).find('li').first().click();
      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredCreditor);
    },
  );

  it(
    ' (AC.5a) should not show remove imposition link for only 1 imposition',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.removeImpositionLink).should('not.exist');
    },
  );

  it(
    '(AC.4bii) should load correct fields for major creditor selection and expect error if field is not filled in',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      const SELECTOR = impostitionSelectors(0);

      let Imposition_1 = structuredClone(IMPOSITION_MOCK_1);
      Imposition_1[0].fm_offence_details_major_creditor_id = null;
      Imposition_1[0].fm_offence_details_creditor = 'major';

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition_1);

      cy.get(SELECTOR.majorCreditorCode).should('exist');
      cy.get(SELECTOR.majorCreditorCodeLabel).should('contain', 'Search using name or code');

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredMajorCreditor);
    },
  );

  it(
    '(AC.4bii) should load correct fields for minor creditor selection and expect error if field is not filled in',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      const SELECTOR = impostitionSelectors(0);

      let Imposition_1 = structuredClone(IMPOSITION_MOCK_1);
      Imposition_1[0].fm_offence_details_major_creditor_id = null;
      Imposition_1[0].fm_offence_details_creditor = 'minor';

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition_1);

      cy.get(SELECTOR.majorCreditor).should('not.be.selected');

      cy.get(DOM_ELEMENTS.minorCreditorLink).should('exist');
    },
  );

  it(
    '(AC.5) should check impositions flow for multiple impositions and remove imposition link',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      const SELECTOR = impostitionSelectors(0);

      let Imposition = structuredClone(IMPOSITION_MOCK_2);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.get(SELECTOR.resultCodeInput).should('exist');
      cy.get(SELECTOR.amountImposedInput).should('exist');
      cy.get(SELECTOR.amountPaidInput).should('exist');

      cy.get(DOM_ELEMENTS.removeImpositionLink).should('exist');
    },
  );

  it(
    '(AC.7E) should show error message for invalid date format',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01.01.2021';

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidDateFormat);
    },
  );
  it(
    '(AC.7F) should show error message for invalid date',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '32/01/2021';

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidDate);
    },
  );

  it(
    '(AC.7g) should show error message for future date',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toLocaleDateString('en-GB');

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence =
        futureDateString;

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidFutureDate);
    },
  );

  it(
    '(AC.7j) should show error message for invalid amount imposed',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      const SELECTOR = impostitionSelectors(0);

      let Imposition = structuredClone(IMPOSITION_MOCK_1);
      Imposition[0].fm_offence_details_amount_imposed = null;

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.get(SELECTOR.amountImposedInput).type('invalid', { delay: 0 });

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.invalidAmountValue);
    },
  );

  it(
    '(AC.7k) should show error message for invalid  amount paid',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      const SELECTOR = impostitionSelectors(0);

      let Imposition = structuredClone(IMPOSITION_MOCK_1);
      Imposition[0].fm_offence_details_amount_paid = null;

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.get(SELECTOR.amountImposedInput).type('123456789012345678901.12', { delay: 0 });

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.invalidAmount);
    },
  );

  it(
    '(AC.3bii) should show invalid ticket panel for invalid offence code',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.offenceCodeInput).type('INVALID', { delay: 0 });
      cy.get(DOM_ELEMENTS.ticketPanel).first().should('exist');
      cy.get(DOM_ELEMENTS.invalidPanel).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidOffenceCode);
    },
  );

  it(
    '(AC.3bi) should show ticket panel for valid offence code',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';

      cy.get(DOM_ELEMENTS.ticketPanel).first().should('exist');
      cy.get(DOM_ELEMENTS.successPanel).should('exist');
    },
  );

  it(
    '(AC.2) should allow dateOfSentence to be entered via date picker and have all elements loaded',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.datePickerButton).should('exist');
      cy.get(DOM_ELEMENTS.datePickerButton).click();
      cy.get(DOM_ELEMENTS.datePickerDialogHead).should('exist');
      cy.get(DOM_ELEMENTS.datePickerDateOfSentenceElement).should('exist');
      cy.get(DOM_ELEMENTS.testDate).click();
      cy.get(DOM_ELEMENTS.dateOfSentenceInput).should(
        'have.value',
        `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
      );
    },
  );

  it(
    '(AC.6, AC.8) should allow form submission with multiple impositions',
    { tags: ['@PO-411', '@PO-681', '@PO-684', '@PO-545'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      setupComponent(mockFormSubmit);

      let Imposition = structuredClone(IMPOSITION_MOCK_2);
      Imposition[0] = {
        fm_offence_details_imposition_id: 0,
        fm_offence_details_result_id: 'FVS',
        fm_offence_details_amount_imposed: 100,
        fm_offence_details_amount_paid: 50,
        fm_offence_details_balance_remaining: 50,
        fm_offence_details_needs_creditor: false,
        fm_offence_details_creditor: '',
        fm_offence_details_major_creditor_id: 3856,
      };
      Imposition[1] = {
        fm_offence_details_imposition_id: 0,
        fm_offence_details_result_id: 'FVS',
        fm_offence_details_amount_imposed: 100,
        fm_offence_details_amount_paid: 50,
        fm_offence_details_balance_remaining: 50,
        fm_offence_details_needs_creditor: false,
        fm_offence_details_creditor: '',
        fm_offence_details_major_creditor_id: 3856,
      };

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get('@formSubmitSpy').should('have.been.calledOnce');
    },
  );
});
