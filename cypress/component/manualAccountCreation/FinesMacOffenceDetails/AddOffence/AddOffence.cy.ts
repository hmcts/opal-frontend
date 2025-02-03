import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { FinesMacOffenceDetailsService } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { ADD_OFFENCE_OFFENCE_MOCK } from './mocks/add-offence-draft-state-mock';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@services/date-service/date.service';
import { DOM_ELEMENTS, impostitionSelectors } from './constants/fines_mac_offence_details_elements';
import { IMPOSITION_ERROR_MESSAGES, OFFENCE_ERROR_MESSAGES } from './constants/fines_mac_offence_details_errors';

describe('FinesMacLanguagePreferenceComponent', () => {
  let mockFinesService = new FinesService(new DateService());
  mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
  const date = new Date();

  const mockOffenceDetailsService = {
    offenceIndex: 0,
    addedOffenceCode: '',
    finesMacOffenceDetailsDraftState: ADD_OFFENCE_OFFENCE_MOCK,
    offenceCodeMessage: '',
  } as FinesMacOffenceDetailsService;

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
      mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData = {
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
        { provide: FinesMacOffenceDetailsService, useValue: mockOffenceDetailsService },
        { provide: FinesService, useValue: mockFinesService },
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

  it('should render the component', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should render all the elements on the page and not render imposition remove link', () => {
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
  });

  it('should render the component correctly for adultOrYouthOnly', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get('button[type="submit"]').should('contain', 'Add another offence');
  });
  it('should render the component correctly for parentOrGuardianToPay', () => {
    setupComponent(null, 'parentOrGuardianToPay');

    cy.get('button[type="submit"]').should('contain', 'Add another offence');
  });
  it('should render the component correctly for company', () => {
    setupComponent(null, 'company');

    cy.get('button[type="submit"]').should('contain', 'Add another offence');
  });

  it('should show error messages when the form is submitted with empty fields', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('contain', OFFENCE_ERROR_MESSAGES.requiredSentenceDate)
      .should('contain', OFFENCE_ERROR_MESSAGES.requiredOffenceCode)
      .should('contain', IMPOSITION_ERROR_MESSAGES.requiredImpositionCode)
      .should('contain', IMPOSITION_ERROR_MESSAGES.requiredAmountImposed);
  });

  it('should allow form to be submitted with required fields filled in', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    const imposition_1 = impostitionSelectors(0);

    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence =
      '01/01/2021';
    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code =
      'AK123456';
    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;

    cy.get(imposition_1.resultCodeInput).type('Victim Surcharge (FVS)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).first().click();
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should show minor creditor and major creditor fields for certain imposition codes', () => {
    setupComponent(null);

    const imposition_1 = impostitionSelectors(0);

    cy.get(imposition_1.resultCodeInput).type('Compensation (FCOMP)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });

    cy.get(imposition_1.majorCreditor).should('exist');
    cy.get(imposition_1.minorCreditor).should('exist');
    cy.get(imposition_1.majorCreditorLabel).should('contain', 'Major creditor');
    cy.get(imposition_1.minorCreditorLabel).should('contain', 'Minor creditor');
  });

  it('should not allow form to be submitted without selecting minor creditor or major creditor field', () => {
    setupComponent(null);

    const imposition_1 = impostitionSelectors(0);

    cy.get(imposition_1.resultCodeInput).type('Compensation (FCOMP)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });
    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredCreditor);
  });

  it('should load correct fields for major creditor selection and expect error if field is not filled in', () => {
    setupComponent(null);

    const imposition_1 = impostitionSelectors(0);

    cy.get(imposition_1.resultCodeInput).type('Compensation (FCOMP)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });

    cy.get(imposition_1.majorCreditor).click();
    cy.get(imposition_1.majorCreditorCode).should('exist');
    cy.get(imposition_1.majorCreditorCodeLabel).should('contain', 'Search using name or code');

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredMajorCreditor);
  });

  it('should load correct fields for minor creditor selection and expect error if field is not filled in', () => {
    setupComponent(null);

    const imposition_1 = impostitionSelectors(0);

    cy.get(imposition_1.resultCodeInput).type('Compensation (FCOMP)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });

    cy.get(imposition_1.minorCreditor).click();

    //E-2-E test for minor creditor flow to be tested
    cy.get(DOM_ELEMENTS.minorCreditorLink).should('exist');
  });

  it('should check impositions flow for multiple impositions', () => {
    setupComponent(null);

    const imposition_1 = impostitionSelectors(0);
    const imposition_2 = impostitionSelectors(1);

    cy.get(imposition_1.resultCodeInput).type('Compensation (FCOMP)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });

    cy.get(DOM_ELEMENTS.addImpositionButton).click();

    cy.get(imposition_2.resultCodeInput).should('exist');
    cy.get(imposition_2.amountImposedInput).should('exist');
    cy.get(imposition_2.amountPaidInput).should('exist');

    cy.get(imposition_2.resultCodeInput).type('Compensation (FCOMP)', { delay: 0 });
    cy.get(imposition_2.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_2.amountPaidInput).type('50', { delay: 0 });

    //E-2-E test for removing imposition for proper flows to be tested
    cy.get(DOM_ELEMENTS.removeImpositionLink).should('exist');
  });

  it('should show error message for invalid date format', () => {
    setupComponent(null);

    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence =
      '01.01.2021';

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidDateFormat);
  });
  it('should show error message for invalid date', () => {
    setupComponent(null);

    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence =
      '32/01/2021';

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidDate);
  });

  it('should show error message for future date', () => {
    setupComponent(null);

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toLocaleDateString('en-GB');

    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence =
      futureDateString;

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidFutureDate);
  });

  it('should show error message for invalid amount value', () => {
    setupComponent(null);

    const imposition_1 = impostitionSelectors(0);

    cy.get(imposition_1.resultCodeInput).type('Compensation (FCOMP)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('invalid', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.invalidAmountValue);
  });

  it('should show error message for invalid amount', () => {
    setupComponent(null);

    const imposition_1 = impostitionSelectors(0);

    cy.get(imposition_1.resultCodeInput).type('Compensation (FCOMP)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('123456789012345678901.12', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.invalidAmount);
  });

  it('should show error message for invalid offence code', () => {
    setupComponent(null);

    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code =
      'INVALID';

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidOffenceCode);
    cy.get(DOM_ELEMENTS.ticketPanel).first().should('exist');
    cy.get(DOM_ELEMENTS.invalidPanel).should('exist');
  });

  it('should show ticket panel for valid offence code', () => {
    setupComponent(null);

    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code =
      'AK123456';

    cy.get(DOM_ELEMENTS.ticketPanel).first().should('exist');
    cy.get(DOM_ELEMENTS.successPanel).should('exist');
  });

  it('should allow dateOfSentence to be entered via date picker and have all elements loaded', () => {
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
  });

  it('should allow form submission with multiple impositions', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    const imposition_1 = impostitionSelectors(0);
    const imposition_2 = impostitionSelectors(1);

    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence =
      '01/01/2021';
    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code =
      'AK123456';
    mockFinesService.finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;

    cy.get(imposition_1.resultCodeInput).type('Victim Surcharge (FVS)', { delay: 0 });
    cy.get(imposition_1.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_1.amountPaidInput).type('50', { delay: 0 });

    cy.get(DOM_ELEMENTS.addImpositionButton).click();

    cy.get(imposition_2.resultCodeInput).type('Victim Surcharge (FVS)', { delay: 0 });
    cy.get(imposition_2.amountImposedInput).type('100', { delay: 0 });
    cy.get(imposition_2.amountPaidInput).type('50', { delay: 0 });

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
