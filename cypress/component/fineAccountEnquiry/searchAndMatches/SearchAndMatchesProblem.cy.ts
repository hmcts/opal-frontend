import { mount } from 'cypress/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesSaSearchProblemComponent } from 'src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-problem/fines-sa-search-problem.component';
import { FinesSaStore } from 'src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { AccountSearchProblemLocators } from 'cypress/shared/selectors/account-search/account.search.problem.locators';
import { FINES_SA_SEARCH_ROUTING_PATHS } from 'src/app/flows/fines/fines-sa/fines-sa-search/routing/constants/fines-sa-search-routing-paths.constant';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

describe('Search Account Problem Component', { tags: [ACCOUNT_ENQUIRY_JIRA_LABEL] }, () => {
  const setupComponent = () => {
    const activatedRouteParent = {};
    const activatedRoute = { parent: activatedRouteParent };
    const router = {
      navigate: cy.spy().as('routerNavigate'),
    };

    return mount(FinesSaSearchProblemComponent, {
      providers: [
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).then(({ fixture }) => {
      fixture.componentRef.injector.get(FinesSaStore).setActiveTab('individuals');
      fixture.detectChanges();

      return { activatedRouteParent };
    });
  };

  it(
    'AC9a. should render the account search problem page with the updated standalone options',
    { tags: ['@JIRA-STORY:PO-2953', '@JIRA-EPIC:PO-2630'] },
    () => {
      setupComponent();

      cy.get(AccountSearchProblemLocators.heading).should('contain', 'There is a problem');
      cy.get(AccountSearchProblemLocators.description)
        .invoke('text')
        .should((text) => {
          expect(text.replace(/\s+/g, ' ').trim()).to.equal(
            'Reference data and account information cannot be entered together when searching for an account. Search using either:',
          );
        });

      cy.get(AccountSearchProblemLocators.bulletList)
        .find('li')
        .then(($items) => {
          const items = [...$items].map((item) => item.textContent?.replace(/\s+/g, ' ').trim());

          expect(items).to.deep.equal([
            'account number, or',
            'reference or case number, or',
            'National Insurance number, or',
            'advanced search',
          ]);
        });

      cy.get(AccountSearchProblemLocators.actions.backLink).should('contain', 'Go back');
    },
  );

  it(
    'should navigate back to the search form with the current tab fragment',
    { tags: ['@JIRA-STORY:PO-2953', '@JIRA-EPIC:PO-2630'] },
    () => {
      setupComponent();

      cy.get(AccountSearchProblemLocators.actions.backLink).click();

      cy.get('@routerNavigate').should('have.been.calledOnce');
      cy.get('@routerNavigate').should('have.been.calledWithMatch', [FINES_SA_SEARCH_ROUTING_PATHS.root], {
        fragment: 'individuals',
      });
    },
  );
});
