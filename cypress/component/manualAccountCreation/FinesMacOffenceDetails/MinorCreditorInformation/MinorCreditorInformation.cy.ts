import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsMinorCreditorInformationComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor-information/fines-mac-offence-details-minor-creditor-information.component';
import { OpalFines } from '../../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MINOR_CREDITOR_MOCK } from './mocks/minor_creditor_information_mocks';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FinesMacOffenceDetailsService } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { provideHttpClient } from '@angular/common/http';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-state.mock';
import { DOM_ELEMENTS } from './constants/minor-creditor-information-elements';

describe('FinesMacMinorCreditor', () => {
  let mockFinesService: FinesService;
  let mockOffenceDetailsService: FinesMacOffenceDetailsService;
  const mockUtilsService = {
    formatSortCode: (value: string) => {
      const sortCode = value.toString();
      return `${sortCode.slice(0, 2)}-${sortCode.slice(2, 4)}-${sortCode.slice(4, 6)}`;
    },
    upperCaseFirstLetter: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
  };
  const minorCreditorValue = { ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK };

  beforeEach(() => {
    mockFinesService = new FinesService(new DateService());
    mockFinesService.finesMacState = FINES_MINOR_CREDITOR_MOCK;
  });

  const setupComponent = (formSubmit: any) => {
    mount(FinesMacOffenceDetailsMinorCreditorInformationComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        { provide: UtilsService, useValue: mockUtilsService },

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
        minorCreditor: minorCreditorValue,
      },
    });
  };
  it('should load the component', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should load all fields with the correct values', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.name).should('have.value', 'John Doe');
    cy.get(DOM_ELEMENTS.address).should('have.value', 'Address 1 Testing Lane Test Town Testing TE12 3ST');
    cy.get(DOM_ELEMENTS.accountName).should('have.value', 'John Doe');
    cy.get(DOM_ELEMENTS.sortCode).should('have.value', '12-34-56');
    cy.get(DOM_ELEMENTS.accountNumber).should('have.value', '12345678');
    cy.get(DOM_ELEMENTS.paymentReference).should('have.value', 'Testing');
  });
});
