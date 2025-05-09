import { mount } from 'cypress/angular';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DOM_ELEMENTS } from './constants/search_offence_elements_mock';
import { FinesMacOffenceDetailsSearchOffencesStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/stores/fines-mac-offence-details-search-offences.store';
import {
  SEARCH_OFFENCES_DEFAULT_FORM_MOCK,
  SEARCH_OFFENCES_INVALID_OFFENCE_CODE_MOCK,
} from './mocks/fines-mac-offence-details-search-offences-form.mock';
import { FinesMacOffenceDetailsSearchOffencesSearchComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences-search/fines-mac-offence-details-search-offences-search.component';
import { IFinesMacOffenceDetailsSearchOffencesForm } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/interfaces/fines-mac-offence-details-search-offences-form.interface';
import { mock } from 'node:test';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  const setupComponent = (formSubmit: any, formMock: IFinesMacOffenceDetailsSearchOffencesForm) => {
    mount(FinesMacOffenceDetailsSearchOffencesSearchComponent, {
      providers: [
        {
          provide: FinesMacOffenceDetailsSearchOffencesStore,
          useFactory: () => {
            const store = new FinesMacOffenceDetailsSearchOffencesStore();
            store.setSearchOffences(formMock);
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
  it('Seach offences component is created correctly', { tags: ['@PO-545', '@PO-667'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    //This creates the component with no values pre-loaded in the form
    setupComponent(mockFormSubmit, SEARCH_OFFENCES_DEFAULT_FORM_MOCK);

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

    cy.get(DOM_ELEMENTS.searchButton).should('exist');
  });

  it('example test case 2', { tags: ['@PO-545', '@PO-667'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');

    //This creates the component with invalid offence code pre-loaded in the form
    setupComponent(mockFormSubmit, SEARCH_OFFENCES_INVALID_OFFENCE_CODE_MOCK);

    cy.contains('button', 'Search').should('exist');
    cy.contains('button', 'Search').click();
  });

  it('example test case 3', { tags: ['@PO-545', '@PO-667'] }, () => {
    const mockFormSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(mockFormSubmit, SEARCH_OFFENCES_DEFAULT_FORM_MOCK);

    cy.get(DOM_ELEMENTS.heading).should('have.text', 'Search offences');
    cy.get(DOM_ELEMENTS.searchButton).should('contain', 'Search');
  });
});
