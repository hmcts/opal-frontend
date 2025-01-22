import { mount } from 'cypress/angular';
import { FinesMacPaymentTermsComponent } from '../../../src/app/flows/fines/fines-mac/fines-mac-payment-terms/fines-mac-payment-terms.component';
import { ActivatedRoute } from '@angular/router';
import { FINES_PAYMENT_TERMS_MOCK } from './mocks/fines-payment-terms-mock';
import {
  ERROR_MESSAGES,
  LUMPSUM_ERRORS,
  INSTALLMENT_ERRORS,
  ENFORCEMENT_ERRORS,
} from './constants/FinesMacPaymentTermsErrors';
import { DOM_ELEMENTS } from './constants/FinesMacPaymentTermsElements';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OpalFines } from '../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { DateService } from '@services/date-service/date.service';

describe('FinesMacPaymentTermsComponent', () => {
  /**
   * Function to set up the component with mocked services and data.
   */
  const setupComponent = (formSubmit: any, defendantTypeMock: string | undefined = '') => {
    // Mock the state with data from multiple forms
    const MockFinesService = new FinesService(new DateService());
    const mockPermissionService = new PermissionsService();

    mockPermissionService.getUniquePermissions(SESSION_USER_STATE_MOCK);

    MockFinesService.finesMacState = {
      ...FINES_PAYMENT_TERMS_MOCK,
    };

    // Mount the component with mocked services and data
    mount(FinesMacPaymentTermsComponent, {
      providers: [
        { provide: OpalFines, useValue: MockFinesService },
        { provide: FinesService, useValue: MockFinesService },
        { provide: PermissionsService, useValue: mockPermissionService },
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
        handlePaymentTermsSubmit: formSubmit,
        defendantType: defendantTypeMock,
      },
    });
  };

  it('should prefill the collection order date with the earliestDateOfSentence', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS['collectionOrderMadeTrue']).click();
    cy.get(DOM_ELEMENTS['collectionOrderDate']).should('have.value', '01/10/2022');
  });

  it('should render the component', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['finesMacPaymentTermsForm']).should('exist');
  });

  it.only('should handle "Pay in full" with past dates and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS['payInFull']).first().click();
    cy.get(DOM_ELEMENTS['payByDate']).clear().type('01/01/2022', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['dateInPast']);

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should handle "Pay in full" with future dates and submit form', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS['payInFull']).first().click();
    cy.get(DOM_ELEMENTS['payByDate']).type('09/09/2030', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).first().click();
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['dateInFuture']);

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should handle "Instalments only" with past dates', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['instalmentsOnly']).click();
    cy.get(DOM_ELEMENTS['instalmentAmount']).type('1000', { delay: 0 });
    cy.get(DOM_ELEMENTS['startDate']).type('01/01/2022', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['startDateInPast']);
  });

  it('should handle "Instalments only" with future dates', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['instalmentsOnly']).click();
    cy.get(DOM_ELEMENTS['instalmentAmount']).type('1000', { delay: 0 });
    cy.get(DOM_ELEMENTS['startDate']).type('01/01/2030', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['startDateInFuture']);
  });

  it('should handle "Lump sum plus instalments" with past dates', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['lumpSumPlusInstalments']).click();
    cy.get(DOM_ELEMENTS['lumpSumAmount']).type('500', { delay: 0 });
    cy.get(DOM_ELEMENTS['instalmentAmount']).type('1000', { delay: 0 });
    cy.get(DOM_ELEMENTS['startDate']).type('01/01/2022', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['startDateInPast']);
  });

  it('should handle "Lump sum plus instalments" with future dates', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['lumpSumPlusInstalments']).click();
    cy.get(DOM_ELEMENTS['lumpSumAmount']).type('500', { delay: 0 });
    cy.get(DOM_ELEMENTS['instalmentAmount']).type('1000', { delay: 0 });
    cy.get(DOM_ELEMENTS['startDate']).type('01/01/2030', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['mojTicketPanel']).should('contain', ERROR_MESSAGES['startDateInFuture']);
  });

  it('should handle error messages for Pay by date', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['paymentTerms']);

    cy.get(DOM_ELEMENTS['payInFull']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['payByDate']);

    cy.get(DOM_ELEMENTS['payByDate']).type('32/09/2025', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validDate']);

    cy.get(DOM_ELEMENTS['payByDate']).clear().type('13.09.2023', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validDateFormat']);
  });

  it('should handle errors for Installment', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['instalmentsOnly']).click({ multiple: true });

    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });

    for (const [, value] of Object.entries(INSTALLMENT_ERRORS)) {
      cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', value);
    }

    cy.get(DOM_ELEMENTS['instalmentAmount']).type('-1', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validInstalmentAmount']);

    cy.get(DOM_ELEMENTS['startDate']).clear().type('22.33.2222', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validInstalmentDateFormat']);

    cy.get(DOM_ELEMENTS['startDate']).clear().type('32/09/2025', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validDate']);
  });

  it('should handle errors for Lump sum plus Installment', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['lumpSumPlusInstalments']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });

    for (const [, value] of Object.entries(LUMPSUM_ERRORS)) {
      cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', value);
    }

    cy.get(DOM_ELEMENTS['lumpSumAmount']).clear().type('-1', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validLumpSumAmount']);

    cy.get(DOM_ELEMENTS['instalmentAmount']).type('-1', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validInstalmentAmount']);

    cy.get(DOM_ELEMENTS['startDate']).clear().type('22.33.2222', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validInstalmentDateFormat']);

    cy.get(DOM_ELEMENTS['startDate']).clear().type('32/09/2025', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['validDate']);
  });

  it('should have validations in place for days in default ', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS['hasDaysInDefault']).click();
    cy.get(DOM_ELEMENTS['suspendedCommittalDate']).type('32/09/2025', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage'])
      .should('contain', ERROR_MESSAGES['validDate'])
      .should('contain', ERROR_MESSAGES['defaultDays']);

    cy.get(DOM_ELEMENTS['suspendedCommittalDate']).clear().type('20/09/2100', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['futureDate']);

    cy.get(DOM_ELEMENTS['defaultDaysInJail']).clear().type('-1', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['defaultDaysTypeCheck']);
  });

  it('should have validations in place for enforcement action (pris)', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['addEnforcementAction']).click();
    cy.get(DOM_ELEMENTS['pris']).click();
    cy.get(DOM_ELEMENTS['earliestReleaseDate']).type('32/09/2025', { delay: 0 });
    cy.get(DOM_ELEMENTS['prisonAndPrisonNumber']).type('@', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });

    for (const [, value] of Object.entries(ENFORCEMENT_ERRORS)) {
      cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', value);
    }

    cy.get(DOM_ELEMENTS['earliestReleaseDate']).clear().type('29/09/2021', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['futureDateMust']);

    cy.get(DOM_ELEMENTS['earliestReleaseDate']).clear().type('29,09.2021', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['prisonDateFormat']);
  });

  it('should have validations in place for enforcement action (NOENF)', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS['addEnforcementAction']).click();
    cy.get(DOM_ELEMENTS['noenf']).click();
    cy.get(DOM_ELEMENTS['reasonAccountIsOnNoenf']).type('@', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['noenfTypeCheck']);
  });

  it('should have validations in place for enforcement action (NOENF)', () => {
    setupComponent(null, 'adultOrYouthOnly');

    cy.get(DOM_ELEMENTS['addEnforcementAction']).click();
    cy.get(DOM_ELEMENTS['noenf']).click();
    cy.get(DOM_ELEMENTS['reasonAccountIsOnNoenf']).type('@', { delay: 0 });
    cy.get(DOM_ELEMENTS['submitButton']).click({ multiple: true });
    cy.get(DOM_ELEMENTS['govukErrorMessage']).should('contain', ERROR_MESSAGES['noenfTypeCheck']);
  });
});
