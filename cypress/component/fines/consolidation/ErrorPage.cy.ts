import { mount } from 'cypress/angular';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesConSearchErrorComponent } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-error/fines-con-search-error.component';
import { FinesConStore } from 'src/app/flows/fines/fines-con/stores/fines-con.store';
import { ErrorPageLocators } from 'cypress/shared/selectors/consolidation/ErrorPage.locators';

const CONSOLIDATION_JIRA_LABEL = '@JIRA-LABEL:consolidation';
const CONSOLIDATION_STORY_LABEL = '@JIRA-STORY:PO-2417';

const buildTags = (...tags: string[]): string[] => [...tags, CONSOLIDATION_JIRA_LABEL, CONSOLIDATION_STORY_LABEL];

describe('FinesConSearchErrorComponent', () => {
  const setupComponent = (defendantType: 'individual' | 'company') => {
    return mount(FinesConSearchErrorComponent, {
      providers: [
        provideRouter([]),
        FinesConStore,
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {},
          },
        },
      ],
    }).then(({ fixture }) => {
      const store = fixture.componentRef.injector.get(FinesConStore);
      cy.stub(store, 'getDefendantType').returns(defendantType);
      expect(store.getDefendantType()).to.equal(defendantType);
      fixture.detectChanges();
    });
  };

  const assertHeadingAndIntro = () => {
    cy.get(ErrorPageLocators.heading).should('contain', 'There is a problem');
    cy.get(ErrorPageLocators.message)
      .invoke('text')
      .then((text) => {
        const normalisedText = text.replace(/\s+/g, ' ').trim();
        expect(normalisedText).to.equal(
          'Reference data and account information cannot be entered together when searching for an account. Search using either:',
        );
      });
  };

  it('AC2a. displays the individual search error heading and message text', { tags: buildTags() }, () => {
    setupComponent('individual');

    assertHeadingAndIntro();
    cy.get(ErrorPageLocators.bulletItems).then(($items) => {
      const items = [...$items].map((item) => item.textContent?.replace(/\s+/g, ' ').trim());
      expect(items).to.deep.equal(['account number, or', 'National Insurance number, or', 'advanced search']);
    });
  });

  it('AC2b. displays the company search error heading and message text', { tags: buildTags() }, () => {
    setupComponent('company');

    assertHeadingAndIntro();
    cy.get(ErrorPageLocators.bulletItems).then(($items) => {
      const items = [...$items].map((item) => item.textContent?.replace(/\s+/g, ' ').trim());
      expect(items).to.deep.equal(['account number, or', 'advanced search']);
    });
  });
});
