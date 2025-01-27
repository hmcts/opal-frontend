import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FinesMacAccountDetailsComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-account-details/fines-mac-account-details.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { DateService } from '@services/date-service/date.service';
import { FINES_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_check_account_mock';
import { FINES_MAC_STATUS } from '../../../../src/app/flows/fines/fines-mac/constants/fines-mac-status';
import { DOM_ELEMENTS } from './constants/fines_mac_check_account_details_elements';
import { mock } from 'node:test';

describe('FinesMacAccountDetailsComponent', () => {
  let mockFinesService = new FinesService(new DateService());

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type = '';

      mockFinesService.finesMacState.personalDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
      mockFinesService.finesMacState.parentGuardianDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
      mockFinesService.finesMacState.companyDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
      mockFinesService.finesMacState.paymentTerms.status = FINES_MAC_STATUS.NOT_PROVIDED;
      mockFinesService.finesMacState.courtDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
      mockFinesService.finesMacState.employerDetails.status = FINES_MAC_STATUS.NOT_PROVIDED;
    });
  });

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
      componentProperties: {
        defendantType: defendantTypeMock,
      },
    });
  };

  it('should render the component', () => {
    setupComponent(null);
    // Verify the component is rendered
    cy.get(DOM_ELEMENTS['dataPage']).should('exist');
  });

  it('should show option to continue if all required forms have been provided for Adult Or Youth Only', () => {
    setupComponent(null);
    mockFinesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

    mockFinesService.finesMacState.personalDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.companyDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.paymentTerms.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.courtDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.employerDetails.status = FINES_MAC_STATUS.PROVIDED;

    cy.get(DOM_ELEMENTS['checkAccountButton']).should('exist');
  });

  it('should not show option to continue if required forms have not been provided for Adult Or Youth Only', () => {
    setupComponent(null);

    mockFinesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'adultOrYouthOnly';

    cy.get(DOM_ELEMENTS['checkAccountButton']).should('not.exist');
  });

  it('should show option to continue if all required forms have been provided for AYPG', () => {
    setupComponent(null);
    mockFinesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

    mockFinesService.finesMacState.personalDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.parentGuardianDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.companyDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.paymentTerms.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.courtDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.employerDetails.status = FINES_MAC_STATUS.PROVIDED;

    cy.get(DOM_ELEMENTS['checkAccountButton']).should('exist');
  });

  it('should not show option to continue if required forms have not been provided for AYPG', () => {
    setupComponent(null);

    mockFinesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'parentOrGuardianToPay';

    cy.get(DOM_ELEMENTS['checkAccountButton']).should('not.exist');
  });

  it('should show option to continue if all required forms have been provided for Company', () => {
    setupComponent(null);
    mockFinesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

    mockFinesService.finesMacState.companyDetails.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.paymentTerms.status = FINES_MAC_STATUS.PROVIDED;
    mockFinesService.finesMacState.courtDetails.status = FINES_MAC_STATUS.PROVIDED;

    cy.get(DOM_ELEMENTS['checkAccountButton']).should('exist');
  });

  it('should not show option to continue if required forms have not been provided for Company', () => {
    setupComponent(null);

    mockFinesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

    cy.get(DOM_ELEMENTS['checkAccountButton']).should('not.exist');
  });
});
