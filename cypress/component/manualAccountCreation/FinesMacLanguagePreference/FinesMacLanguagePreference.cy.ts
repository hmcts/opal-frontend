import { mount } from 'cypress/angular';
import { FinesMacLanguagePreferencesComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-language-preferences/fines-mac-language-preferences.component';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { DOM_ELEMENTS } from '../../../../cypress/component/manualAccountCreation/FinesMacLanguagePreference/constants/fines_mac_language_preference_elements';

describe('FinesMacLanguagePreferenceComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
  };

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

  afterEach(() => {
    cy.then(() => {
      mockFinesService.finesMacState.languagePreferences.formData = {
        fm_language_preferences_document_language: '',
        fm_language_preferences_hearing_language: '',
      };
    });
  });

  it('should render the component', () => {
    setupComponent(null);

    // Verify the component is rendered
    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('(AC.1,AC.2)should load all elements on the screen correctly', { tags: ['@PO-464'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Language preferences');
    cy.get(DOM_ELEMENTS.descriptionText).should(
      'contain',
      'These language preferences are for the defendant, or a parent or guardian if they are paying on behalf of the defendant.',
    );
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Documents');
    cy.get(DOM_ELEMENTS.legend).should('contain', 'Court hearings');
    cy.get(DOM_ELEMENTS.cyDocumentRadioLabel).should('contain', 'Welsh and English');
    cy.get(DOM_ELEMENTS.enDocumentRadioLabel).should('contain', 'English only');
    cy.get(DOM_ELEMENTS.cyCourtHearingRadioLabel).should('contain', 'Welsh and English');
    cy.get(DOM_ELEMENTS.enCourtHearingRadioLabel).should('contain', 'English only');

    cy.get(DOM_ELEMENTS.cyDocumentRadioOption).should('exist');
    cy.get(DOM_ELEMENTS.enDocumentRadioOption).should('exist');
    cy.get(DOM_ELEMENTS.cyCourtHearingRadioOption).should('exist');
    cy.get(DOM_ELEMENTS.enCourtHearingRadioOption).should('exist');

    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Save changes');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it('(AC.3)should allow form to be submitted with no input', { tags: ['@PO-464'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('(AC.3)should allow selections on language preferences', { tags: ['@PO-464'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS.cyDocumentRadioOption).click();
    cy.get(DOM_ELEMENTS.enCourtHearingRadioOption).click();

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });

  it('(AC.3)should allow selections on language preferences Opposite options', { tags: ['@PO-464'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    setupComponent(mockFormSubmit);

    cy.get(DOM_ELEMENTS.enDocumentRadioOption).click();
    cy.get(DOM_ELEMENTS.cyCourtHearingRadioOption).click();

    cy.get(DOM_ELEMENTS.submitButton).first().click();

    cy.get('@formSubmitSpy').should('have.been.calledOnce');
  });
});
