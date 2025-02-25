import { mount } from 'cypress/angular';
import { FinesMacOffenceDetailsSearchOffencesComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences.component';
import { ActivatedRoute } from '@angular/router';
import { DOM_ELEMENTS } from './constants/search_offence_elements_mock';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  const setupComponent = (impositionCounter: number = 0) => {
    mount(FinesMacOffenceDetailsSearchOffencesComponent, {
      providers: [
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
  it('should render component', { tags: ['@PO-411', '@PO-681', '@PO-684'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should load all elements on the screen correctly', { tags: ['@PO-411', '@PO-681', '@PO-684'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.backLink).should('exist');
    cy.get(DOM_ELEMENTS.searchButton).should('exist');
  });

  it('should have correct values for each elements', { tags: ['@PO-411', '@PO-681', '@PO-684'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('have.text', 'Search offences');
    cy.get(DOM_ELEMENTS.backLink).should('have.text', 'Back');
    cy.get(DOM_ELEMENTS.searchButton).should('contain', 'Search');
  });
});
