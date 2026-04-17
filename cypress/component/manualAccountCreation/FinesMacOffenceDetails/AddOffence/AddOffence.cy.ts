import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/stores/fines-mac-offence-details.store';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_EXACT_MATCH_MULTI_RESULT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-multi-result.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-duplicate-code.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { ADD_OFFENCE_OFFENCE_MOCK } from './mocks/add-offence-draft-state-mock';
import { provideHttpClient } from '@angular/common/http';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import {
  MacOffenceDetailsAddOffenceLocators as DOM_ELEMENTS,
  impositionSelectors,
} from '../../../../shared/selectors/manual-account-creation/mac.offence-details.locators';
import { IMPOSITION_ERROR_MESSAGES, OFFENCE_ERROR_MESSAGES } from './constants/fines_mac_offence_details_errors';
import { impositionResultCodelist } from './constants/fines_mac_offence_details_results_codes';
import {
  IMPOSITION_MOCK_1,
  IMPOSITION_MOCK_2,
  IMPOSITION_MOCK_3,
  IMPOSITION_MOCK_4,
} from './mocks/add-offence-imposition-mock';

describe('FinesMacAddOffenceComponent', () => {
  let finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
  let offenceDetailsDraftState = structuredClone(ADD_OFFENCE_OFFENCE_MOCK);
  const date = new Date();

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
    ).as('getOffenceCode');
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

  const setupComponent = (formSubmit?: any, defendantType: string = '') => {
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = defendantType;
    return mount(FinesMacOffenceDetailsAddAnOffenceComponent, {
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
            snapshot: {
              data: {
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
      componentProperties: {
        defendantType: defendantType,
      },
    }).then(({ fixture }) => {
      if (!formSubmit) {
        return;
      }

      const comp: any = fixture.componentInstance as any;

      if (comp?.handleOffenceDetailsSubmit?.subscribe) {
        comp.handleOffenceDetailsSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
      } else if (typeof comp?.handleOffenceDetailsSubmit === 'function') {
        comp.handleOffenceDetailsSubmit = formSubmit;
      }

      fixture.detectChanges();
    });
  };

  it(
    'should block submitting the offence while offence-code validation is still in progress',
    {
      tags: ['@JIRA-STORY:PO-2948', '@JIRA-LABEL:manual-account-creation'],
    },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(IMPOSITION_MOCK_3);

      setupComponent(formSubmitSpy);

      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/offences',
          query: {
            q: 'AK123456',
          },
        },
        {
          delay: 750,
          body: OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK,
        },
      ).as('getDelayedOffenceCode');

      cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('AK123456{enter}', { delay: 0 });

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Offence code still being validated');
      cy.wrap(formSubmitSpy).should('not.have.been.called');

      cy.wait('@getDelayedOffenceCode');

      cy.get(DOM_ELEMENTS.successPanel).should('contain', 'Offence found');
      cy.get(DOM_ELEMENTS.successPanel).should(
        'contain',
        OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK.refData[0].offence_title,
      );

      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.wrap(formSubmitSpy).should('have.been.calledOnce');
    },
  );

  it(
    'should keep blocking submission when offence validation completes with an invalid offence code',
    {
      tags: ['@JIRA-STORY:PO-2948', '@JIRA-LABEL:manual-account-creation'],
    },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(IMPOSITION_MOCK_3);

      setupComponent(formSubmitSpy);

      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/offences',
          query: {
            q: 'ZZ12345',
          },
        },
        {
          delay: 750,
          body: {
            count: 0,
            refData: [],
          },
        },
      ).as('getInvalidOffenceCode');

      cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('ZZ12345{enter}', { delay: 0 });

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Offence code still being validated');
      cy.wrap(formSubmitSpy).should('not.have.been.called');

      cy.wait('@getInvalidOffenceCode');

      cy.get(DOM_ELEMENTS.invalidPanel).should('contain', 'Offence not found');
      cy.get(DOM_ELEMENTS.invalidPanel).should('contain', 'Enter a valid offence code');
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidOffenceCode);

      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.wrap(formSubmitSpy).should('not.have.been.called');
    },
  );

  it(
    'should submit the exact offence match when multiple offences are returned for the searched code',
    {
      tags: ['@JIRA-STORY:PO-3412', '@JIRA-LABEL:manual-account-creation'],
    },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(IMPOSITION_MOCK_3);

      setupComponent(formSubmitSpy);

      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/offences',
          query: {
            q: 'CD71039',
          },
        },
        {
          body: OPAL_FINES_OFFENCES_REF_DATA_EXACT_MATCH_MULTI_RESULT_MOCK,
        },
      ).as('getExactMatchMultiResultOffence');

      cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('CD71039', { delay: 0 });

      cy.wait('@getExactMatchMultiResultOffence').then(({ response }) => {
        expect(response?.body.count).to.be.greaterThan(1);
        expect(response?.body.refData).to.have.length.greaterThan(1);
        expect(
          response?.body.refData.some((offence: { get_cjs_code: string }) => offence.get_cjs_code === 'CD71039'),
        ).to.equal(true);
      });

      cy.get(DOM_ELEMENTS.successPanel).should('contain', 'Offence found');
      cy.get(DOM_ELEMENTS.successPanel).should(
        'contain',
        OPAL_FINES_OFFENCES_REF_DATA_EXACT_MATCH_MULTI_RESULT_MOCK.refData[0].offence_title,
      );
      cy.get(DOM_ELEMENTS.invalidPanel).should('not.exist');

      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.wrap(formSubmitSpy).should('have.been.calledOnce');

      cy.then(() => {
        const submittedForm = formSubmitSpy.getCall(0).args[0];
        expect(submittedForm.formData.fm_offence_details_offence_cjs_code).to.equal('CD71039');
        expect(submittedForm.formData.fm_offence_details_offence_id).to.equal(
          OPAL_FINES_OFFENCES_REF_DATA_EXACT_MATCH_MULTI_RESULT_MOCK.refData[0].offence_id,
        );
      });
    },
  );

  it(
    'should keep the offence invalid when multiple offences are returned but none exactly match the searched code',
    {
      tags: ['@JIRA-STORY:PO-3412', '@JIRA-LABEL:manual-account-creation'],
    },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(IMPOSITION_MOCK_3);

      setupComponent(formSubmitSpy);

      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/offences',
          query: {
            q: 'CD71039D',
          },
        },
        {
          body: {
            count: 2,
            refData: OPAL_FINES_OFFENCES_REF_DATA_DUPLICATE_CODE_MOCK.refData.map((offence, index) => ({
              ...offence,
              offence_id: offence.offence_id + index,
              get_cjs_code: `CD71039${String.fromCharCode(65 + index)}`,
            })),
          },
        },
      ).as('getInexactMultiResultOffence');

      cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('CD71039D', { delay: 0 });

      cy.wait('@getInexactMultiResultOffence').then(({ response }) => {
        expect(response?.body.count).to.be.greaterThan(1);
        expect(response?.body.refData).to.have.length.greaterThan(1);
        expect(
          response?.body.refData.some((offence: { get_cjs_code: string }) => offence.get_cjs_code === 'CD71039D'),
        ).to.equal(false);
      });

      cy.get(DOM_ELEMENTS.invalidPanel).should('contain', 'Offence not found');
      cy.get(DOM_ELEMENTS.invalidPanel).should('contain', 'Enter a valid offence code');
      cy.get(DOM_ELEMENTS.successPanel).should('not.exist');

      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.wrap(formSubmitSpy).should('not.have.been.called');
    },
  );

  it(
    '(AC.1)should render the component',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.app).should('exist');
    },
  );

  it(
    '(AC.1,AC.2,AC.3,AC.3a,AC.3ai,AC.3b,AC.4) should render all the elements on the page as per design artifact and not render imposition remove link',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      const imposition_1 = impositionSelectors(0);

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

      cy.get(DOM_ELEMENTS.removeImpositionLink).should('not.exist');
    },
  );

  it(
    'should render Add another offence button correctly for all defendant types',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-272',
        '@JIRA-STORY:PO-344',
        '@JIRA-STORY:PO-345',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null, 'adultOrYouthOnly');
      cy.get('button[type="submit"]').should('contain', 'Add another offence');

      setupComponent(null, 'pgToPay');
      cy.get('button[type="submit"]').should('contain', 'Add another offence');

      setupComponent(null, 'company');

      cy.get('button[type="submit"]').should('contain', 'Add another offence');
    },
  );

  it(
    '(AC.7b,AC.7d,AC.7h,AC.7i) should show error messages when the form is submitted with empty fields',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();
      setupComponent(formSubmitSpy);

      let Imposition = structuredClone(IMPOSITION_MOCK_3);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.wrap(formSubmitSpy).should('have.been.calledOnce');
    },
  );

  it(
    '(AC.4b,AC.4bi,AC,4c) should show minor,major creditor fields for (FCOMP,FCOST) Only',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      const imposition_1 = impositionSelectors(0);

      impositionResultCodelist.forEach((resultCode) => {
        if (resultCode === 'Compensation (FCOMP)' || resultCode === 'Costs (FCOST)') {
          cy.get(imposition_1.resultCodeInput).click();
          cy.get(imposition_1.resultCodeAutoComplete).find('li').should('have.length.greaterThan', 0);
          cy.get(imposition_1.resultCodeInput).clear().type(`${resultCode}`, { delay: 0, force: true });
          cy.get(imposition_1.resultCodeLabel).click();
          cy.get(imposition_1.majorCreditor).should('exist');
          cy.get(imposition_1.minorCreditor).should('exist');
          cy.get(imposition_1.majorCreditorLabel).should('contain', 'Major creditor');
          cy.get(imposition_1.minorCreditorLabel).should('contain', 'Minor creditor');
        } else {
          cy.get(imposition_1.resultCodeInput).click();
          cy.get(imposition_1.resultCodeAutoComplete).find('li').should('have.length.greaterThan', 0);
          cy.get(imposition_1.resultCodeInput).clear().type(`${resultCode}`, { delay: 0, force: true });
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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);
      const SELECTOR = impositionSelectors(0);

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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.removeImpositionLink).should('not.exist');
    },
  );

  it(
    '(AC.4bii) should load correct fields for major creditor selection and expect error if field is not filled in',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      const SELECTOR = impositionSelectors(0);

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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      const SELECTOR = impositionSelectors(0);

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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      const SELECTOR = impositionSelectors(0);

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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01.01.2021';

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidDateFormat);
    },
  );
  it(
    '(AC.7F) should show error message for invalid date',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '32/01/2021';

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', OFFENCE_ERROR_MESSAGES.invalidDate);
    },
  );

  it(
    '(AC.7g) should show error message for future date',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      const SELECTOR = impositionSelectors(0);

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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      setupComponent(null);

      const SELECTOR = impositionSelectors(0);

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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123457';
      setupComponent(null);

      cy.wait('@getOffenceCode');

      cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('AK123457', { delay: 0 });
      cy.get(DOM_ELEMENTS.ticketPanel).first().should('exist');
      cy.get(DOM_ELEMENTS.invalidPanel).should('exist');
    },
  );

  it(
    '(AC.3bi) should show ticket panel for valid offence code',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

      setupComponent(null);

      cy.get(DOM_ELEMENTS.offenceCodeInput).clear().type('CA03010D', { delay: 0 });
      cy.wait('@getOffenceCode');

      cy.get(DOM_ELEMENTS.ticketPanel).first().should('exist').click();
      cy.get(DOM_ELEMENTS.successPanel, { timeout: 30000 }).should('be.visible');
    },
  );

  it(
    '(AC.2) should allow dateOfSentence to be entered via date picker and have all elements loaded',
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
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
    {
      tags: [
        '@JIRA-STORY:PO-411',
        '@JIRA-STORY:PO-681',
        '@JIRA-STORY:PO-684',
        '@JIRA-STORY:PO-545',
        '@JIRA-LABEL:manual-account-creation',
      ],
    },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      setupComponent(formSubmitSpy);

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

      cy.wrap(formSubmitSpy).should('have.been.calledOnce');
    },
  );

  it(
    '(AC.1, AC.2) should not allow form to be submitted without selecting minor creditor, A/Y only',
    { tags: ['@JIRA-STORY:PO-1060', '@JIRA-LABEL:manual-account-creation'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');
      const SELECTOR = impositionSelectors(0);

      let Imposition_1 = structuredClone(IMPOSITION_MOCK_4);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition_1);

      cy.get(SELECTOR.resultCodeInput).click();
      cy.get(SELECTOR.resultCodeAutoComplete).find('li').first().click();
      cy.get(SELECTOR.minorCreditor).click();
      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredMinorCreditor);
      cy.get(DOM_ELEMENTS.addAnotherOffenceButton).first().click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredMinorCreditor);
    },
  );

  it(
    '(AC.1, AC.2) should not allow form to be submitted without selecting minor creditor, A/Y with parent/guardian to pay',
    { tags: ['@JIRA-STORY:PO-1060', '@JIRA-LABEL:manual-account-creation'] },
    () => {
      setupComponent(null, 'pgToPay');
      const SELECTOR = impositionSelectors(0);

      let Imposition_1 = structuredClone(IMPOSITION_MOCK_4);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition_1);

      cy.get(SELECTOR.resultCodeInput).click();
      cy.get(SELECTOR.resultCodeAutoComplete).find('li').first().click();
      cy.get(SELECTOR.minorCreditor).click();
      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredMinorCreditor);
      cy.get(DOM_ELEMENTS.addAnotherOffenceButton).first().click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredMinorCreditor);
    },
  );

  it(
    '(AC.1, AC.2) should not allow form to be submitted without selecting minor creditor, company',
    { tags: ['@JIRA-STORY:PO-1060', '@JIRA-LABEL:manual-account-creation'] },
    () => {
      setupComponent(null, 'company');
      const SELECTOR = impositionSelectors(0);

      let Imposition_1 = structuredClone(IMPOSITION_MOCK_4);

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition_1);

      cy.get(SELECTOR.resultCodeInput).click();
      cy.get(SELECTOR.resultCodeAutoComplete).find('li').first().click();
      cy.get(SELECTOR.minorCreditor).click();
      cy.get(DOM_ELEMENTS.submitButton).first().click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredMinorCreditor);
      cy.get(DOM_ELEMENTS.addAnotherOffenceButton).first().click();
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.requiredMinorCreditor);
    },
  );

  it(
    'Each imposition is wrapped in its own fieldset',
    { tags: ['@JIRA-STORY:PO-2716', '@JIRA-LABEL:manual-account-creation'] },
    () => {
      setupComponent(null);

      // Prepare three impositions in the store
      let Imposition = structuredClone(IMPOSITION_MOCK_2);
      if (!Array.isArray(Imposition)) Imposition = [Imposition];
      // Ensure at least 3 impositions
      while (Imposition.length < 3) {
        Imposition.push(structuredClone(IMPOSITION_MOCK_1)[0] ?? structuredClone(IMPOSITION_MOCK_2)[0]);
      }

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.log('assert', 'Asserting each imposition is wrapped in its own fieldset');

      cy.contains(DOM_ELEMENTS.legend, /^Impositions$/)
        .closest('h2')
        .nextUntil(DOM_ELEMENTS.addImpositionButton, DOM_ELEMENTS.fieldset) // only fieldsets
        .then(($fieldsets) => {
          const fieldsetCount = $fieldsets.length;
          const impositionCount = Cypress.$($fieldsets).find(DOM_ELEMENTS.removeImpositionLink).length;

          cy.log(`Fieldsets: ${fieldsetCount}`);
          cy.log(`Remove links (impositions): ${impositionCount}`);

          expect(impositionCount, 'impositions on screen').to.be.greaterThan(0);
          expect(fieldsetCount, 'fieldset per imposition').to.eq(impositionCount);
        });
    },
  );

  it(
    'Should show error message for invalid amount imposed being a zero value',
    {
      tags: buildTags('@JIRA-STORY:PO-3550', '@JIRA-KEY:POT-????'),
    },
    () => {
      setupComponent(null);

      const SELECTOR = impositionSelectors(0);

      let Imposition = structuredClone(IMPOSITION_MOCK_1);
      Imposition[0].fm_offence_details_amount_imposed = 0;

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.invalidZeroValue);
    },
  );

  it(
    'Should show error message for invalid amount imposed being a minus value',
    {
      tags: buildTags('@JIRA-STORY:PO-3550', '@JIRA-KEY:POT-????'),
    },
    () => {
      setupComponent(null);

      const SELECTOR = impositionSelectors(0);

      let Imposition = structuredClone(IMPOSITION_MOCK_1);
      Imposition[0].fm_offence_details_amount_imposed = -200;

      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_date_of_sentence = '01/01/2021';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_cjs_code = 'AK123456';
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_offence_id = 52;
      finesMacState.offenceDetails[currentoffenceDetails].formData.fm_offence_details_impositions =
        structuredClone(Imposition);

      cy.get(DOM_ELEMENTS.submitButton).first().click();

      cy.get(DOM_ELEMENTS.errorSummary).should('contain', IMPOSITION_ERROR_MESSAGES.invalidNegativeValue);
    },
  );
});
