import { mount } from 'cypress/angular';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DOM_ELEMENTS } from './constants/search_offence_elements_mock';
import { FinesMacOffenceDetailsSearchOffencesStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/stores/fines-mac-offence-details-search-offences.store';
import { SEARCH_OFFENCES_DEFAULT_FORM_MOCK } from './mocks/fines-mac-offence-details-search-offences-form.mock';
import { FinesMacOffenceDetailsSearchOffencesSearchComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences-search/fines-mac-offence-details-search-offences-search.component';
import { SEARCH_OFFENCES_LENGTH_CHECK, SEARCH_OFFENCES_FORMAT_CHECK } from './constants/search_offence_errors';
import { of } from 'rxjs';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  let offenceSearchFormData = structuredClone(SEARCH_OFFENCES_DEFAULT_FORM_MOCK);

  const setupComponent = (formSubmit?: any) => {
    return mount(FinesMacOffenceDetailsSearchOffencesSearchComponent, {
      providers: [
        {
          provide: FinesMacOffenceDetailsSearchOffencesStore,
          useFactory: () => {
            const store = new FinesMacOffenceDetailsSearchOffencesStore();
            store.setSearchOffences(offenceSearchFormData);
            return store;
          },
        },
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

      if (comp?.handleSearchOffencesSubmit?.subscribe) {
        comp.handleSearchOffencesSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
      } else if (typeof comp?.handleSearchOffencesSubmit === 'function') {
        comp.handleSearchOffencesSubmit = formSubmit;
      }

      fixture.detectChanges();
    });
  };

  afterEach(() => {
    offenceSearchFormData = structuredClone(SEARCH_OFFENCES_DEFAULT_FORM_MOCK);
  });

  it('AC.1a, AC.1b should render all elements on the page', { tags: ['@PO-545', '@PO-667'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.offenceCodeLabel).should('exist');
    cy.get(DOM_ELEMENTS.offenceCodeInput).should('exist');

    cy.get(DOM_ELEMENTS.shortTitleLabel).should('exist');
    cy.get(DOM_ELEMENTS.shortTitleInput).should('exist');

    cy.get(DOM_ELEMENTS.actAndSectionLabel).should('exist');
    cy.get(DOM_ELEMENTS.actAndSectionInput).should('exist');

    cy.get(DOM_ELEMENTS.inactiveLabel).should('exist');
    cy.get(DOM_ELEMENTS.inactiveInput).should('exist');
    cy.contains('button', 'Search').should('exist');
  });

  // This test verifying the maximum length of the fields
  it(
    'AC.2a, AC.2b, AC.2c Checking the validation failures when exceeding the maximum characters',
    { tags: ['@PO-545', '@PO-667'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      //This creates the component with invalid offence code pre-loaded in the form
      offenceSearchFormData.formData.fm_offence_details_search_offences_code = 'a'.repeat(10);
      offenceSearchFormData.formData.fm_offence_details_search_offences_short_title = 'a'.repeat(121);
      offenceSearchFormData.formData.fm_offence_details_search_offences_act_section = 'a'.repeat(4001);
      setupComponent(formSubmitSpy);

      cy.contains('button', 'Search').click();

      cy.get(DOM_ELEMENTS.errorSummary)
        .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.offenceCodeMaxLength)
        .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.shortTitleMaxLength)
        .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.actAndSectionMaxLength);
    },
  );
  //The below code will check each string in the invalidInputs array and check if the error message is displayed
  it(
    'AC.2d, AC.2e, AC.2f Checking the validation failures when a special character into the fields',
    { tags: ['@PO-545', '@PO-667'] },
    () => {
      const formSubmitSpy = Cypress.sinon.spy();

      const invalidInputs = ['*', '$', '@'];
      cy.wrap(invalidInputs).each((input: string) => {
        cy.then(() => {
          offenceSearchFormData.formData.fm_offence_details_search_offences_code = input;
          offenceSearchFormData.formData.fm_offence_details_search_offences_short_title = input;
          offenceSearchFormData.formData.fm_offence_details_search_offences_act_section = input;
          setupComponent(formSubmitSpy);
          cy.contains('button', 'Search').click();

          cy.get(DOM_ELEMENTS.errorSummary)
            .should('contain', SEARCH_OFFENCES_FORMAT_CHECK.offenceCodeSpecialCharPattern)
            .should('contain', SEARCH_OFFENCES_FORMAT_CHECK.shortTitleSpecialCharPattern)
            .should('contain', SEARCH_OFFENCES_FORMAT_CHECK.actAndSectionSpecialCharPattern);
        });
      });
    },
  );
});
