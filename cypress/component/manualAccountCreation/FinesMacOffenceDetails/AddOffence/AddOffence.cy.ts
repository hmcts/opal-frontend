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

describe('FinesMacLanguagePreferenceComponent', () => {
  let mockFinesService = new FinesService(new DateService());
  mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };

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
        const requestedCjsCode = req.query.q;
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
  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.languagePreferences.formData = {
        fm_language_preferences_document_language: '',
        fm_language_preferences_hearing_language: '',
      };
    });
  });

  const setupComponent = (formSubmit: any) => {
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
      },
    });
  };

  it('should render the component', () => {
    setupComponent(null);

    cy.get('app-fines-mac-offence-details-add-an-offence-form').should('exist');
    cy.get('#fm_offence_details_offence_cjs_code').type('AK123456', { delay: 0 });
  });
});
