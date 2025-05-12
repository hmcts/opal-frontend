import { mount } from 'cypress/angular';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DOM_ELEMENTS } from './constants/search_offence_elements_mock';
import { FinesMacOffenceDetailsSearchOffencesStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/stores/fines-mac-offence-details-search-offences.store';
import { SEARCH_OFFENCES_DEFAULT_FORM_MOCK } from './mocks/fines-mac-offence-details-search-offences-form.mock';
import { FinesMacOffenceDetailsSearchOffencesSearchComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences-search/fines-mac-offence-details-search-offences-search.component';
import { IFinesMacOffenceDetailsSearchOffencesForm } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/interfaces/fines-mac-offence-details-search-offences-form.interface';
import { SEARCH_OFFENCES_LENGTH_CHECK, SEARCH_OFFENCES_FORMAT_CHECK } from './constants/search_offence_errors';
import { mock } from 'node:test';
import { should } from 'chai';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  let formData: any;

  const setupComponent = (formSubmit: any, formMock: IFinesMacOffenceDetailsSearchOffencesForm) => {
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

  it('AC.2 Checking the validation failures', { tags: ['@PO-545', '@PO-667'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    //This creates the component with invalid offence code pre-loaded in the form
    setupComponent(mockFormSubmit, SEARCH_OFFENCES_INVALID_OFFENCE_CODE_MOCK);
    setupComponent(mockFormSubmit, SEARCH_OFFENCES_SPECIAL_CHAR_OFFENCE_CODE_MOCK);

    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.offenceCodeLabel).should('exist');
    cy.get(DOM_ELEMENTS.offenceCodeInput).should('exist');

    cy.get(DOM_ELEMENTS.shortTitleLabel).should('exist');
    cy.get(DOM_ELEMENTS.shortTitleInput).should('exist');

    cy.get(DOM_ELEMENTS.actAndSectionLabel).should('exist');
    cy.get(DOM_ELEMENTS.actAndSectionInput).should('exist');

    cy.get(DOM_ELEMENTS.inactiveLabel).should('exist');
    cy.get(DOM_ELEMENTS.inactiveInput).should('exist');

    formData.fm_offence_details_search_offences_code_length;
    formData[0].fm_offence_details_search_offences_short_title_length;
    formData[0].fm_offence_details_search_offences_act_and_section_length;
    cy.get(DOM_ELEMENTS.inactiveInput).check();

    cy.get(DOM_ELEMENTS.searchButton).should('exist');

    cy.contains('button', 'Search').should('exist');
    cy.contains('button', 'Search').click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.offenceCodeMaxLength)
      .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.shortTitleMaxLength)
      .should('contain', SEARCH_OFFENCES_LENGTH_CHECK.actAndSectionMaxLength);

    formData[1].fm_offence_details_search_offences_code_special_char;
    formData[1].fm_offence_details_search_offences_short_title_special_char;
    formData[1].fm_offence_details_search_offences_act_and_section_special_char;
    cy.get(DOM_ELEMENTS.inactiveInput).check();
    cy.contains('button', 'Search').click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('contain', SEARCH_OFFENCES_FORMAT_CHECK.offenceCodeSpecialCharPattern)
      .should('contain', SEARCH_OFFENCES_FORMAT_CHECK.shortTitleSpecialCharPattern)
      .should('contain', SEARCH_OFFENCES_FORMAT_CHECK.actAndSectionSpecialCharPattern);
  });
});
