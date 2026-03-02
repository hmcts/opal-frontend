import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_COURTS_DETAILS_MOCK } from './mocks/fines-mac-court-details-mock';
import { FinesMacCourtDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-court-details/fines-mac-court-details.component';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { MacCourtDetailsLocators as L } from '../../../shared/selectors/manual-account-creation/mac.court-details.locators';
import { INVALID_ERRORS, MISSING_ERRORS } from './constants/fines_mac_court_details_errors';
import { provideHttpClient } from '@angular/common/http';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { of } from 'rxjs';
import { IOpalFinesLocalJusticeAreaRefData } from '../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';

describe('FinesMacCourtDetailsComponent', () => {
  let finesMacState = structuredClone(FINES_COURTS_DETAILS_MOCK);

  const setupComponent = (
    formSubmit?: any,
    defType?: string,
    localJusticeAreas: IOpalFinesLocalJusticeAreaRefData = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
  ) => {
    finesMacState.businessUnit.business_unit_id = 73;
    if (defType) {
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = defType;
    }

    return mount(FinesMacCourtDetailsComponent, {
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
            parent: of('manual-account-creation'),
            snapshot: {
              data: {
                localJusticeAreas,
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
      componentProperties: {
        // Only Inputs here
        defendantType: defType,
      },
    }).then(({ fixture }) => {
      if (!formSubmit) return;
      const comp: any = fixture.componentInstance as any;
      if (comp?.handleCourtDetailsSubmit?.subscribe) {
        comp.handleCourtDetailsSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
      } else if (typeof comp?.handleCourtDetailsSubmit === 'function') {
        comp.handleCourtDetailsSubmit = formSubmit;
      }
      fixture.detectChanges();
    });
  };
  //Clean up after each test
  afterEach(() => {
    finesMacState.courtDetails.formData = {
      fm_court_details_originator_id: '',
      fm_court_details_originator_name: '',
      fm_court_details_prosecutor_case_reference: '',
      fm_court_details_imposing_court_id: '',
    };
  });

  it('should render the component correctly for AY', { tags: ['@PO-272', '@PO-389'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');
    cy.get(L.componentRoot).should('exist');
    cy.get(L.nestedFlowButton).should('contain', 'Add personal details');
  });
  it('should render the component correctly for AYPG', { tags: ['@PO-344', '@PO-527', '@PO-1449'] }, () => {
    setupComponent(null, 'pgToPay');
    cy.get(L.componentRoot).should('exist');
    cy.get(L.nestedFlowButton).should('contain', 'Add parent or guardian details');
  });
  it('should render the component correctly for COMP', { tags: ['@PO-345', '@PO-529'] }, () => {
    setupComponent(null, 'company');
    cy.get(L.componentRoot).should('exist');
    cy.get(L.nestedFlowButton).should('contain', 'Add company details');
  });

  it('(AC.1, AC.4) should be created as per the design artifacts', { tags: ['@PO-272', '@PO-389'] }, () => {
    const formSubmitSpy = Cypress.sinon.spy();
    setupComponent(formSubmitSpy, 'adultOrYouthOnly');

    // Verify the page text
    //title
    cy.get(L.pageHeader).should('contain', 'Court details');
    //Lja
    cy.get(L.ljaLabel).should('contain', 'Sending area or Local Justice Area (LJA)');
    cy.get(L.ljaHint).should('contain', 'Search using the code or name of the area that sent the transfer');
    cy.get(L.ljaInput).should('exist');
    //Pcr
    cy.get(L.pcrLabel).should('contain', 'Prosecutor Case Reference (PCR)');
    cy.get(L.pcrHint).should('contain', "Enter the prosecutor's reference number or original account number");
    cy.get(L.pcrInput).should('exist');
    //Enforcement Court
    cy.get(L.enforcementCourtLabel).should('contain', 'Enforcement court');
    cy.get(L.enforcementCourtHint).should('contain', 'Search using enforcement court or code');
    cy.get(L.enforcementCourtInput).should('exist');
  });
  it('(AC.2) should dynamically filter LJA field', { tags: ['@PO-272', '@PO-389'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    //Verify working input fields
    cy.get(L.ljaInput).focus().type('Asylum', { delay: 0 });
    cy.get(L.ljaListbox).find('li').first().click();
    cy.get(L.ljaInput).should('have.value', 'Asylum & Immigration Tribunal (9985)');

    cy.get(L.ljaInput).focus().clear().type('court', { delay: 0 });
    cy.get(L.ljaListbox).find('li').should('not.contain', 'Asylum & Immigration Tribunal (9985)');
    cy.get(L.ljaListbox).find('li').should('contain', "Avon & Somerset Magistrates' Court (5735)");
    cy.get(L.ljaListbox).find('li').should('contain', "Bedfordshire Magistrates' Court (4165)");
    cy.get(L.ljaListbox).find('li').should('contain', "Berkshire Magistrates' Court (4125)");
    cy.get(L.ljaListbox).find('li').should('contain', "Birmingham and Solihull Magistrates' Court (5004)");
  });
  it('(AC.3) should dynamically filter Enforcement court field', { tags: ['@PO-272', '@PO-389'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');
    //Verify working input fields
    cy.get(L.enforcementCourtInput).focus().type('Port', { delay: 0 });
    cy.get(L.enforcementCourtListbox).find('li').first().click();
    cy.get(L.enforcementCourtInput).should('have.value', 'Port Talbot Justice Centre (999)');

    cy.get(L.enforcementCourtInput).focus().clear().type('historic', { delay: 0 });
    cy.get(L.enforcementCourtListbox).find('li').should('not.contain', 'Port Talbot Justice Centre (999)');
    cy.get(L.enforcementCourtListbox).find('li').should('contain', 'Historic Debt Database (101)');
    cy.get(L.enforcementCourtListbox).find('li').should('contain', 'Historic Debt Database (998)');
    cy.get(L.enforcementCourtListbox).find('li').should('contain', 'HISTORIC DEBT LODGE COURT (102)');
  });

  it('(AC.5) should validate mandatory fields', { tags: ['@PO-272', '@PO-389'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    //Submit without input
    cy.get(L.returnToAccountDetailsButton).click();

    //Verify page did not change
    cy.get(L.pageHeader).should('have.text', 'Court details');

    //Verify error summary
    cy.get(L.errorSummary).should('exist');

    Object.values(MISSING_ERRORS).forEach((key) => {
      cy.get(L.errorSummary).should('contain', key);
    });

    //Verify input field error messages
    cy.get(L.ljaErrorMessage).should('contain', MISSING_ERRORS.missingLJA);
    cy.get(L.pcrErrorMessage).should('contain', MISSING_ERRORS.missingPCR);
    cy.get(L.enforcementCourtErrorMessage).should('contain', MISSING_ERRORS.missingEnforcementCourt);

    //Submit without input
    cy.get(L.nestedFlowButton).click();

    //Verify page did not change
    cy.get(L.pageHeader).should('have.text', 'Court details');

    //Verify error summary
    cy.get(L.errorSummary).should('exist');

    Object.values(MISSING_ERRORS).forEach((key) => {
      cy.get(L.errorSummary).should('contain', key);
    });

    //Verify input field error messages
    cy.get(L.ljaErrorMessage).should('contain', MISSING_ERRORS.missingLJA);
    cy.get(L.pcrErrorMessage).should('contain', MISSING_ERRORS.missingPCR);
    cy.get(L.enforcementCourtErrorMessage).should('contain', MISSING_ERRORS.missingEnforcementCourt);
  });

  it(
    '(AC.6) should validate mandatory fields even when data exists in another',
    { tags: ['@PO-272', '@PO-389'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');
      finesMacState.courtDetails.formData.fm_court_details_prosecutor_case_reference = '1234';

      //Submit without input
      cy.get(L.returnToAccountDetailsButton).click();

      //Verify page did not change
      cy.get(L.pageHeader).should('have.text', 'Court details');

      //Verify error summary
      cy.get(L.errorSummary).should('exist');

      cy.get(L.errorSummary).should('contain', MISSING_ERRORS.missingLJA);
      cy.get(L.errorSummary).should('contain', MISSING_ERRORS.missingEnforcementCourt);
      cy.get(L.errorSummary).should('not.contain', MISSING_ERRORS.missingPCR);

      //Verify input field error messages
      cy.get(L.ljaErrorMessage).should('contain', MISSING_ERRORS.missingLJA);
      cy.get(L.enforcementCourtErrorMessage).should('contain', MISSING_ERRORS.missingEnforcementCourt);
      cy.get(L.pcrErrorMessage).should('not.exist');

      //Submit without input
      cy.get(L.nestedFlowButton).click();

      //Verify page did not change
      cy.get(L.pageHeader).should('have.text', 'Court details');

      //Verify error summary
      cy.get(L.errorSummary).should('exist');

      cy.get(L.errorSummary).should('contain', MISSING_ERRORS.missingLJA);
      cy.get(L.errorSummary).should('contain', MISSING_ERRORS.missingEnforcementCourt);
      cy.get(L.errorSummary).should('not.contain', MISSING_ERRORS.missingPCR);

      //Verify input field error messages
      cy.get(L.ljaErrorMessage).should('contain', MISSING_ERRORS.missingLJA);
      cy.get(L.enforcementCourtErrorMessage).should('contain', MISSING_ERRORS.missingEnforcementCourt);
      cy.get(L.pcrErrorMessage).should('not.exist');
    },
  );

  it('(AC.7) should validate PRC field length', { tags: ['@PO-272', '@PO-389'] }, () => {
    finesMacState.courtDetails.formData.fm_court_details_prosecutor_case_reference = 'a'.repeat(31);

    setupComponent(null);

    //Submit with invalid input
    cy.get(L.returnToAccountDetailsButton).click();

    //Verify error message
    cy.get(L.pcrErrorMessage).should('contain', INVALID_ERRORS.tooLongPCR);
  });

  it('(AC.7) should validate PCR field allowed characters', { tags: ['@PO-272', '@PO-389'] }, () => {
    const invalidInputs = ['1234!', '1@', 'test@', 'test1234@', 'abc#', '123$', 'abc%', '123^', 'abc&', '123*'];
    cy.wrap(invalidInputs).each((input: string) => {
      cy.then(() => {
        setupComponent(null);
        finesMacState.courtDetails.formData.fm_court_details_prosecutor_case_reference = input;
        cy.get(L.returnToAccountDetailsButton).click();
        cy.get(L.pcrErrorMessage).should('contain', INVALID_ERRORS.invalidPCR);
      });
    });
  });

  it('(AC.8) should clear errors when validation is passed', { tags: ['@PO-272', '@PO-389'] }, () => {
    const formSubmitSpy = Cypress.sinon.spy();
    setupComponent(formSubmitSpy, 'adultOrYouthOnly');

    //Submit without input
    cy.get(L.returnToAccountDetailsButton).click();

    //Verify error summary
    cy.get(L.errorSummary).should('exist');

    //Verify input field error messages
    cy.get(L.ljaErrorMessage).should('contain', MISSING_ERRORS.missingLJA);
    cy.get(L.pcrErrorMessage).should('contain', MISSING_ERRORS.missingPCR);
    cy.get(L.enforcementCourtErrorMessage).should('contain', MISSING_ERRORS.missingEnforcementCourt);

    //Verify error summary is cleared
    cy.get(L.ljaInput).focus().type('Asylum', { delay: 0 });
    cy.get(L.ljaListbox).find('li').first().click();

    cy.get(L.pcrInput).focus().type('1234', { delay: 0 });

    cy.get(L.enforcementCourtInput).focus().type('Port', { delay: 0 });
    cy.get(L.enforcementCourtListbox).find('li').first().click();

    cy.get(L.returnToAccountDetailsButton).click();
    cy.get(L.errorSummary).should('not.exist');
    cy.get(L.ljaErrorMessage).should('not.exist');
    cy.get(L.pcrErrorMessage).should('not.exist');
    cy.get(L.enforcementCourtErrorMessage).should('not.exist');
  });

  it('(AC.9) should clear errors when validation is passed', { tags: ['@PO-272', '@PO-389'] }, () => {
    const formSubmitSpy = Cypress.sinon.spy();
    setupComponent(formSubmitSpy, 'adultOrYouthOnly');

    //Submit without input
    cy.get(L.nestedFlowButton).click();

    //Verify error summary
    cy.get(L.errorSummary).should('exist');
    cy.get(L.ljaErrorMessage).should('contain', MISSING_ERRORS.missingLJA);
    cy.get(L.pcrErrorMessage).should('contain', MISSING_ERRORS.missingPCR);
    cy.get(L.enforcementCourtErrorMessage).should('contain', MISSING_ERRORS.missingEnforcementCourt);

    //Input data
    cy.get(L.ljaInput).focus().type('Asylum', { delay: 0 });
    cy.get(L.ljaListbox).find('li').first().click();

    cy.get(L.pcrInput).focus().type('1234', { delay: 0 });

    cy.get(L.enforcementCourtInput).focus().type('Port', { delay: 0 });
    cy.get(L.enforcementCourtListbox).find('li').first().click();

    //Verify error summary is cleared
    cy.get(L.nestedFlowButton).click();

    cy.get(L.nestedFlowButton).click();
    cy.get(L.errorSummary).should('not.exist');
    cy.get(L.ljaErrorMessage).should('not.exist');
    cy.get(L.enforcementCourtErrorMessage).should('not.exist');
    cy.get(L.pcrErrorMessage).should('not.exist');
  });

  it('(AC.1) should convert PCR input to uppercase', { tags: ['@PO-345', '@PO-1450'] }, () => {
    setupComponent(null, 'company');

    cy.get(L.pcrInput).focus().type('abcd1234a', { delay: 0 });

    cy.get(L.pcrInput).should('have.value', 'ABCD1234A');
  });

  it('Prosecutor Case Reference should capitalise - AYPG', { tags: ['@PO-344', '@PO-1449'] }, () => {
    const formSubmitSpy = Cypress.sinon.spy();
    setupComponent(formSubmitSpy, 'pgToPay');

    cy.get(L.ljaInput).focus().type('Asylum', { delay: 0 });
    cy.get(L.ljaListbox).find('li').first().click();
    cy.get(L.pcrInput).type('testpcr', { delay: 0 });
    cy.get(L.pcrInput).blur();
    cy.get(L.enforcementCourtInput).focus().type('Port', { delay: 0 });
    cy.get(L.enforcementCourtListbox).find('li').first().click();

    cy.get(L.pcrInput).should('have.value', 'TESTPCR');

    cy.get(L.returnToAccountDetailsButton).click();
  });

  it('(AC.1) should convert PCR input to uppercase', { tags: ['@PO-272', '@PO-1448'] }, () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(L.pcrInput).focus().type('abcd1234', { delay: 0 });

    cy.get(L.pcrInput).should('have.value', 'ABCD1234');
  });

  it(
    'Should show all values in LJA and Enforcement Court auto-complete dropdown when selected',
    { tags: ['@PO-1990'] },
    () => {
      setupComponent(null, 'adultOrYouthOnly');

      //Verify autocomplete fields display all values when selected
      cy.get(L.ljaInput).focus().click();
      cy.get(L.ljaListbox).find('li').should('contain', 'Asylum & Immigration Tribunal (9985)');
      cy.get(L.ljaListbox).find('li').should('contain', "Avon & Somerset Magistrates' Court (5735)");
      cy.get(L.ljaListbox).find('li').should('contain', "Bedfordshire Magistrates' Court (4165)");
      cy.get(L.ljaListbox).find('li').should('contain', "Berkshire Magistrates' Court (4125)");
      cy.get(L.ljaListbox).find('li').should('contain', "Birmingham and Solihull Magistrates' Court (5004)");
      cy.get(L.ljaListbox).find('li').contains("Birmingham and Solihull Magistrates' Court (5004)").click();

      cy.get(L.enforcementCourtInput).focus().click();
      cy.get(L.enforcementCourtListbox).find('li').should('contain', 'Port Talbot Justice Centre (999)');
      cy.get(L.enforcementCourtListbox).find('li').should('contain', 'Historic Debt Database (101)');
      cy.get(L.enforcementCourtListbox).find('li').should('contain', 'Historic Debt Database (998)');
      cy.get(L.enforcementCourtListbox).find('li').should('contain', 'HISTORIC DEBT LODGE COURT (102)');
      cy.get(L.enforcementCourtListbox).find('li').contains('HISTORIC DEBT LODGE COURT (102)').click();
    },
  );

  it(
    '(AC3, AC4) should only show PSA/CRWCRT local justice areas for filtered journeys (Fine/Confiscation)',
    { tags: ['@PO-2761'] },
    () => {
      const filteredLocalJusticeAreas: IOpalFinesLocalJusticeAreaRefData = {
        count: 2,
        refData: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.refData.slice(1, 3),
      };

      setupComponent(null, 'adultOrYouthOnly', filteredLocalJusticeAreas);

      cy.get(L.ljaInput).focus().click();
      cy.get(L.ljaListbox).find('li').should('have.length', 2);
      cy.get(L.ljaListbox).find('li').should('contain', "Avon & Somerset Magistrates' Court (5735)");
      cy.get(L.ljaListbox).find('li').should('contain', "Bedfordshire Magistrates' Court (4165)");
      cy.get(L.ljaListbox).find('li').should('not.contain', 'Asylum & Immigration Tribunal (9985)');
    },
  );
});
