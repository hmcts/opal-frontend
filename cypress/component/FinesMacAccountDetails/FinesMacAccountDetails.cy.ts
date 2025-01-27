import { mount } from 'cypress/angular';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacAccountDetailsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-account-details/fines-mac-account-details.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { DateService } from '@services/date-service/date.service';
import { FINES_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_check_account_mock';

describe('FinesMacAccountDetailsComponent', () => {
  let mockFinesService = new FinesService(new DateService());

  mockFinesService.finesMacState = { ...FINES_CHECK_ACCOUNT_MOCK };

  const setupComponent = (formSubmit: any, defendantTypeMock: string = '') => {
    mount(FinesMacAccountDetailsComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
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
      componentProperties: {},
    });
  };

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get('app-fines-mac-account-details').should('exist');
  });
});
