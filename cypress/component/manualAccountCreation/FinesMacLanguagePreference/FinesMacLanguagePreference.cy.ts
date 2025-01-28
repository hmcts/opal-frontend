import { mount } from 'cypress/angular';
import { FinesMacLanguagePreferencesComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-language-preferences/fines-mac-language-preferences.component';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';

describe('FinesMacLanguagePreferenceComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
  };

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.languagePreferences.formData = {
        fm_language_preferences_document_language: '',
        fm_language_preferences_hearing_language: '',
      };
    });
  });

  const setupComponent = (formSubmit: any) => {
    mount(FinesMacLanguagePreferencesComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
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
        handleLanguagePreferencesSubmit: formSubmit,
      },
    });
  };

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get('app-fines-mac-language-preferences-form').should('exist');
  });

  it('should allow form to be submitted with no input', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get('button[type = "submit"]').first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should allow selections on language preferences', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get('input[id="CYDocumentRadioOption"]').click();
    cy.get('input[id="ENCourtHearingRadioOption"]').click();

    cy.get('button[type = "submit"]').first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('should allow selections on language preferences Opposite options', () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get('input[id="ENDocumentRadioOption"]').click();
    cy.get('input[id="CYCourtHearingRadioOption"]').click();

    cy.get('button[type = "submit"]').first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
