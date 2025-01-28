import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_COURTS_DETAILS_MOCK } from './mocks/fines-mac-court-details-mock';
import { FinesMacCourtDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-court-details/fines-mac-court-details.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { ERROR_MESSAGES, REQUIRED_FIELDS } from './constants/fines_mac_court_details_errors';
import { DOM_ELEMENTS } from './constants/fines_mac_court_details_elements';
import { of } from 'rxjs';

describe('FinesMacParentGuardianDetailsComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_COURTS_DETAILS_MOCK },
  };
  mockFinesService.finesMacState.businessUnit.business_unit_id = 73;

  afterEach(() => {
    mockFinesService.finesMacState.courtDetails.formData = {
      fm_court_details_originator_id: '',
      fm_court_details_originator_name: '',
      fm_court_details_prosecutor_case_reference: '',
      fm_court_details_imposing_court_id: '',
    };
  });
  const setupComponent = (formSubmit: any) => {
    const mockOpalFinesService = {
      getLocalJusticeAreas: () => of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK),
      getLocalJusticeAreaPrettyName: (item: any) => `${item.name} (${item.lja_code})`,
      getCourts: () => of(OPAL_FINES_COURT_REF_DATA_MOCK),
      getCourtPrettyName: (item: any) => `${item.name} (${item.court_code})`,
    };

    mount(FinesMacCourtDetailsComponent, {
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: OpalFines, useValue: mockOpalFinesService },
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
      },
    });
  };

  it('should render the child component', () => {
    setupComponent(null);
    mockFinesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

    // Verify the child component is rendered
    cy.get(DOM_ELEMENTS['app']).should('exist');
  });

  it('should not allow form to be submitted with no input and should throw required fields errors', () => {
    setupComponent(null);

    cy.get('button[type = "submit"]').first().click();

    for (const [, value] of Object.entries(REQUIRED_FIELDS)) {
      cy.get(DOM_ELEMENTS['errorSummary']).should('contain', value);
    }
  });

  it('should not allow length of prosecutor reference to be more than 30 characters', () => {
    setupComponent(null);

    mockFinesService.finesMacState.courtDetails.formData.fm_court_details_prosecutor_case_reference = 'a'.repeat(31);

    cy.get('button[type = "submit"]').first().click();

    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ERROR_MESSAGES['maxLengthProsecutorCaseReference']);
  });

  it('should not allow special characters in prosecutor reference', () => {
    setupComponent(null);

    mockFinesService.finesMacState.courtDetails.formData.fm_court_details_prosecutor_case_reference = '£';

    cy.get('button[type = "submit"]').first().click();

    cy.get(DOM_ELEMENTS['errorSummary']).should('contain', ERROR_MESSAGES['patternProsecutorCaseReference']);
  });

  it('should allow valid details and form submission', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS['originatorAutoComplete']).type("Avon & Somerset Magistrates' Court (1450)", {
      delay: 0,
    });

    cy.get(DOM_ELEMENTS['courtIdAutoComplete']).type('Historic Debt Database (101)', { delay: 0 });

    mockFinesService.finesMacState.courtDetails.formData.fm_court_details_prosecutor_case_reference = '123';

    cy.get('button[type = "submit"]').first().click();
    cy.get('button[type = "submit"]').first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should not allow invalid data to be submitted', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['originatorAutoComplete']).type('random', {
      delay: 0,
    });

    cy.get(DOM_ELEMENTS['courtIdAutoComplete']).type('random', { delay: 0 });

    mockFinesService.finesMacState.courtDetails.formData.fm_court_details_prosecutor_case_reference = 'r@';

    cy.get('button[type = "submit"]').first().click();
    cy.get('button[type = "submit"]').first().click();

    cy.get(DOM_ELEMENTS['errorSummary'])
      .should('contain', ERROR_MESSAGES['patternProsecutorCaseReference'])
      .should('contain', REQUIRED_FIELDS['emptySendingArea'])
      .should('contain', REQUIRED_FIELDS['emptyEnforcementCourt']);
  });
});
