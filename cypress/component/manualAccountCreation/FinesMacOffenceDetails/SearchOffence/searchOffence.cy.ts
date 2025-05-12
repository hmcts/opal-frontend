import { mount } from 'cypress/angular';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DOM_ELEMENTS } from './constants/search_offence_elements_mock';
import { FinesMacOffenceDetailsSearchOffencesStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/stores/fines-mac-offence-details-search-offences.store';
import { SEARCH_OFFENCES_DEFAULT_FORM_MOCK } from './mocks/fines-mac-offence-details-search-offences-form.mock';
import { FinesMacOffenceDetailsSearchOffencesSearchComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences-search/fines-mac-offence-details-search-offences-search.component';
import { SEARCH_OFFENCES_LENGTH_CHECK, SEARCH_OFFENCES_FORMAT_CHECK } from './constants/search_offence_errors';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  let offenceSearchFormData = structuredClone(SEARCH_OFFENCES_DEFAULT_FORM_MOCK);

  const setupComponent = (formSubmit: any) => {
    mount(FinesMacOffenceDetailsSearchOffencesSearchComponent, {
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
            parent: {
              snapshot: {
                url: [{ path: 'manual-account-creation' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        handleSearchOffencesSubmit: formSubmit,
      },
    });
  };

  afterEach(() => {
    offenceSearchFormData = structuredClone(SEARCH_OFFENCES_DEFAULT_FORM_MOCK);
  });

  //it looks like this test is checking both the structure of the form and the validation errors
  //this needs to be split to make it clearer what is being tested
  it(
    'AC.2 Checking the validation failures when exceeding the maximum characters',
    { tags: ['@PO-545', '@PO-667'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');

      //This creates the component with invalid offence code pre-loaded in the form
      offenceSearchFormData.formData.fm_offence_details_search_offences_code = 'a'.repeat(10);
      offenceSearchFormData.formData.fm_offence_details_search_offences_short_title = 'a'.repeat(121);
      offenceSearchFormData.formData.fm_offence_details_search_offences_act_and_section = 'a'.repeat(4001);
      setupComponent(mockFormSubmit);

      cy.get(DOM_ELEMENTS.app).should('exist');
      cy.get(DOM_ELEMENTS.heading).should('contain', 'Search offences');

      cy.get(DOM_ELEMENTS.offenceCodeLabel).should('contain', 'Offence code');
      cy.get(DOM_ELEMENTS.offenceCodeInput).should('exist');

      cy.get(DOM_ELEMENTS.shortTitleLabel).should('contain', 'Short title');
      cy.get(DOM_ELEMENTS.shortTitleInput).should('exist');

      cy.get(DOM_ELEMENTS.actAndSectionLabel).should('contain', 'Act and section');
      cy.get(DOM_ELEMENTS.actAndSectionInput).should('exist');

      cy.get(DOM_ELEMENTS.inactiveLabel).should('contain', 'Include inactive offence codes');
      cy.get(DOM_ELEMENTS.inactiveInput).should('exist');

      cy.get(DOM_ELEMENTS.inactiveInput).check();

      cy.get(DOM_ELEMENTS.searchButton).should('exist');

      cy.contains('button', 'Search').should('exist');
      cy.contains('button', 'Search').click();

      cy.get(DOM_ELEMENTS.errorSummary)
        .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.offenceCodeMaxLength)
        .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.shortTitleMaxLength)
        .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.actAndSectionMaxLength);
    },
  );
  //Missing test cases for positive scenarios where validation passes, no errors are shown etc.
  it(
    'AC.2 Checking the validation failures when a special character into the fields',
    { tags: ['@PO-545', '@PO-667'] },
    () => {
      const mockFormSubmit = cy.spy().as('formSubmitSpy');
      //This is an example error message for the special character in the Offence Code field
      //'Offence Code must only include letters a to z, numbers, hyphens, spaces and apostrophes'
      //The below code will check each string in the invalidInputs array and check if the error message is displayed
      //Adjust as needed for edge cases and other special characters
      const invalidInputs = ['*'];
      cy.wrap(invalidInputs).each((input: string) => {
        cy.then(() => {
          offenceSearchFormData.formData.fm_offence_details_search_offences_code = input;
          offenceSearchFormData.formData.fm_offence_details_search_offences_short_title = input;
          offenceSearchFormData.formData.fm_offence_details_search_offences_act_and_section = input;
          setupComponent(mockFormSubmit);
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
