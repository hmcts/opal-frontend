import { mount } from 'cypress/angular';
import { FinesMacLanguagePreferencesComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-language-preferences/fines-mac-language-preferences.component';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { MacLanguagePreferencesLocators as L } from '../../../shared/selectors/manual-account-creation/mac.language-preferences.locators';
import { of } from 'rxjs';

describe('FinesMacLanguagePreferenceComponent', () => {
  let mockFinesService = {
    finesMacState: { ...FINES_MAC_STATE_MOCK },
  };

  const setupComponent = (formSubmit?: any) => {
    return mount(FinesMacLanguagePreferencesComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
      componentProperties: {},
    }).then(({ fixture }) => {
      if (!formSubmit) {
        return;
      }

      const comp: any = fixture.componentInstance as any;

      if (comp?.handleLanguagePreferencesSubmit?.subscribe) {
        comp.handleLanguagePreferencesSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
      } else if (typeof comp?.handleLanguagePreferencesSubmit === 'function') {
        comp.handleLanguagePreferencesSubmit = formSubmit;
      }

      fixture.detectChanges();
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
    cy.get(L.app).should('exist');
  });

  it('(AC.1,AC.2)should load all elements on the screen correctly', { tags: ['@PO-464'] }, () => {
    setupComponent(null);

    cy.get(L.pageTitle).should('contain', 'Language preferences');
    cy.get(L.descriptionText).should(
      'contain',
      'These language preferences are for the defendant, or a parent or guardian if they are paying on behalf of the defendant.',
    );
    cy.get(L.legend).should('contain', 'Documents');
    cy.get(L.legend).should('contain', 'Court hearings');
    cy.get(L.cyDocumentRadioLabel).should('contain', 'Welsh and English');
    cy.get(L.enDocumentRadioLabel).should('contain', 'English only');
    cy.get(L.cyCourtHearingRadioLabel).should('contain', 'Welsh and English');
    cy.get(L.enCourtHearingRadioLabel).should('contain', 'English only');

    cy.get(L.cyDocumentRadioOption).should('exist');
    cy.get(L.enDocumentRadioOption).should('exist');
    cy.get(L.cyCourtHearingRadioOption).should('exist');
    cy.get(L.enCourtHearingRadioOption).should('exist');

    cy.get(L.submitButton).should('contain', 'Save changes');
    cy.get(L.cancelLink).should('exist');
  });

  it('(AC.3)should allow form to be submitted with no input', { tags: ['@PO-464'] }, () => {
    const formSubmitSpy = Cypress.sinon.spy();

    setupComponent(formSubmitSpy);

    cy.get(L.submitButton).first().click();

    cy.wrap(formSubmitSpy).should('have.been.calledOnce');
  });

  it('(AC.3)should allow selections on language preferences', { tags: ['@PO-464'] }, () => {
    const formSubmitSpy = Cypress.sinon.spy();

    setupComponent(formSubmitSpy);

    cy.get(L.cyDocumentRadioOption).click();
    cy.get(L.enCourtHearingRadioOption).click();

    cy.get(L.submitButton).first().click();

    cy.wrap(formSubmitSpy).should('have.been.calledOnce');
  });

  it('(AC.3)should allow selections on language preferences Opposite options', { tags: ['@PO-464'] }, () => {
    const formSubmitSpy = Cypress.sinon.spy();

    setupComponent(formSubmitSpy);

    cy.get(L.enDocumentRadioOption).click();
    cy.get(L.cyCourtHearingRadioOption).click();

    cy.get(L.submitButton).first().click();

    cy.wrap(formSubmitSpy).should('have.been.calledOnce');
  });
});
