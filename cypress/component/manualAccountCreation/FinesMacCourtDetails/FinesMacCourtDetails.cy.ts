import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_COURTS_DETAILS_MOCK } from './mocks/fines-mac-court-details-mock';
import { FinesMacCourtDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-court-details/fines-mac-court-details.component';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { DOM_ELEMENTS } from './constants/fines_mac_court_details_elements';
import { INVALID_ERRORS, MISSING_ERRORS } from './constants/fines_mac_court_details_errors';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';

describe('FinesMacCourtDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_COURTS_DETAILS_MOCK);

  const setupComponent = (formSubmit: any, defType?: string) => {
    finesMacState.businessUnit.business_unit_id = 73;

    mount(FinesMacCourtDetailsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        DateService,
        UtilsService,
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
        handleCourtDetailsSubmit: formSubmit,
        defendantType: defType,
      },
    });
  };
  //Mock OpalFines service http calls
  beforeEach(() => {
    cy.intercept('GET', '**/opal-fines-service/local-justice-areas', {
      statusCode: 200,
      body: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    });
    cy.intercept('GET', '**/opal-fines-service/courts**', {
      statusCode: 200,
      body: OPAL_FINES_COURT_REF_DATA_MOCK,
    });
  });
  //Clean up after each test
  afterEach(() => {
    finesMacState.courtDetails.formData = {
      fm_court_details_originator_id: '',
      fm_court_details_originator_name: '',
      fm_court_details_prosecutor_case_reference: '',
      fm_court_details_imposing_court_id: '',
    };
  });

  it('should render the component correctly for adultOrYouthOnly', () => {
    setupComponent(null, 'adultOrYouthOnly');
    cy.get('app-fines-mac-court-details-form').should('exist');

    cy.get('button[type="submit"]').should('contain', 'Add personal details');
  });
  it('should render the component correctly for parentOrGuardianToPay', () => {
    setupComponent(null, 'parentOrGuardianToPay');
    cy.get('app-fines-mac-court-details-form').should('exist');

    cy.get('button[type="submit"]').should('contain', 'Add parent or guardian details');
  });
  it('should render the component correctly for company', () => {
    setupComponent(null, 'company');
    cy.get('app-fines-mac-court-details-form').should('exist');

    cy.get('button[type="submit"]').should('contain', 'Add company details');
  });

  it('should have correct titles and allow inputs', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    // Verify the page text
    //title
    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Court details');
    //Lja
    cy.get(DOM_ELEMENTS.ljaInputTitle).should('contain', 'Sending area or Local Justice Area (LJA)');
    cy.get(DOM_ELEMENTS.ljaInputHint).should(
      'contain',
      'Search using the code or name of the area that sent the transfer',
    );
    //Pcr
    cy.get(DOM_ELEMENTS.pcrInputTitle).should('contain', 'Prosecutor Case Reference (PCR)');
    cy.get(DOM_ELEMENTS.pcrInputHint).should(
      'contain',
      "Enter the prosecutor's reference number or original account number",
    );
    //Enforcement Court
    cy.get(DOM_ELEMENTS.enforcementCourtTitle).should('contain', 'Enforcement court');
    cy.get(DOM_ELEMENTS.enforcementCourtHint).should('contain', 'Search using enforcement court or code');

    //Verify working input fields
    cy.get(DOM_ELEMENTS.ljaInput).focus().type('Asylum', { delay: 0 });
    cy.get(DOM_ELEMENTS.ljaAutocomplete).find('li').first().click();
    cy.get(DOM_ELEMENTS.ljaInput).should('have.value', 'Asylum & Immigration Tribunal (9985)');

    cy.get(DOM_ELEMENTS.pcrInput).focus().type('1234', { delay: 0 });
    cy.get(DOM_ELEMENTS.pcrInput).should('have.value', '1234');

    cy.get(DOM_ELEMENTS.enforcementCourt).focus().type('Port', { delay: 0 });
    cy.get(DOM_ELEMENTS.enforcementCourtAutocomplete).find('li').first().click();
    cy.get(DOM_ELEMENTS.enforcementCourt).should('have.value', 'Port Talbot Justice Centre (999)');

    //Verify form submit
    cy.get(DOM_ELEMENTS.returnToACDetails).click();
    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should validate mandatory fields', () => {
    setupComponent(null);

    //Submit without input
    cy.get(DOM_ELEMENTS.returnToACDetails).click();

    //Verify error summary
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');

    Object.values(MISSING_ERRORS).forEach((key) => {
      cy.get(DOM_ELEMENTS.errorSummary).should('contain', key);
    });

    //Verify input field error messages
    cy.get(DOM_ELEMENTS.ljaErrorMessage).should('contain', MISSING_ERRORS.missingLJA);
    cy.get(DOM_ELEMENTS.pcrErrorMessage).should('contain', MISSING_ERRORS.missingPCR);
    cy.get(DOM_ELEMENTS.enforcementCourtErrorMessage).should('contain', MISSING_ERRORS.missingEnforcementCourt);
  });

  it('should validate PRC field length', () => {
    finesMacState.courtDetails.formData.fm_court_details_prosecutor_case_reference = 'a'.repeat(31);

    setupComponent(null);

    //Submit with invalid input
    cy.get(DOM_ELEMENTS.returnToACDetails).click();

    //Verify error message
    cy.get(DOM_ELEMENTS.pcrErrorMessage).should('contain', INVALID_ERRORS.tooLongPCR);
  });

  it('should validate PCR field allowed characters', () => {
    setupComponent(null);

    const invalidInputs = ['1234!', '1@', 'test@', 'test1234@', 'abc#', '123$', 'abc%', '123^', 'abc&', '123*'];

    invalidInputs.forEach((input) => {
      cy.get(DOM_ELEMENTS.pcrInput).clear().type(input, { delay: 0 });

      //Submit with invalid input
      cy.get(DOM_ELEMENTS.returnToACDetails).click();

      //Verify error message
      cy.get(DOM_ELEMENTS.pcrErrorMessage).should('contain', INVALID_ERRORS.invalidPCR);
    });
  });
  it('should clear errors when validation is met', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    //Submit without input
    cy.get(DOM_ELEMENTS.returnToACDetails).click();

    //Verify error summary
    cy.get(DOM_ELEMENTS.errorSummary).should('exist');

    //Verify input field error messages
    cy.get(DOM_ELEMENTS.ljaErrorMessage).should('contain', MISSING_ERRORS.missingLJA);
    cy.get(DOM_ELEMENTS.pcrErrorMessage).should('contain', MISSING_ERRORS.missingPCR);
    cy.get(DOM_ELEMENTS.enforcementCourtErrorMessage).should('contain', MISSING_ERRORS.missingEnforcementCourt);

    //Verify error summary is cleared
    cy.get(DOM_ELEMENTS.ljaInput).focus().type('Asylum', { delay: 0 });
    cy.get(DOM_ELEMENTS.ljaAutocomplete).find('li').first().click();

    cy.get(DOM_ELEMENTS.pcrInput).focus().type('1234', { delay: 0 });

    cy.get(DOM_ELEMENTS.enforcementCourt).focus().type('Port', { delay: 0 });
    cy.get(DOM_ELEMENTS.enforcementCourtAutocomplete).find('li').first().click();

    cy.get(DOM_ELEMENTS.returnToACDetails).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
    cy.get(DOM_ELEMENTS.ljaErrorMessage).should('not.exist');
    cy.get(DOM_ELEMENTS.pcrErrorMessage).should('not.exist');
    cy.get(DOM_ELEMENTS.enforcementCourtErrorMessage).should('not.exist');
  });
});
