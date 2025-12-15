// account.search.problem.locators.ts
// Purpose: Locators for the "There is a problem" error page shown from Account Search.
// Source DOM highlights:
// - Root component: <app-fines-sa-search-problem>
// - Heading: <h1 class="govuk-heading-l">There is a problem</h1>
// - Body copy: <p class="govuk-body"> ... </p>
// - Bulleted list: <ul class="govuk-list govuk-list--bullet"> ... </ul>
// - Back link: <a class="govuk-link">Go back</a>
//
// Notes:
// - Prefer stable element/tag anchors and classes present in the snippet; no made-up locators.
// - Keep selectors minimal; scope via the root component to avoid collisions.
// - Mirrors the style used for Account Search tabs (ID-first when available; otherwise scoped class selectors).
// - Sonar-friendly constants with a single exported map.
//
// Usage:
//   import { AccountSearchProblemLocators as L } from './account.search.problem.locators';
//   cy.get(L.root)                         // scope further queries
//   cy.get(L.heading)                      // assert heading
//   cy.get(L.description)                  // assert body message
//   cy.get(L.bulletList)                   // check bullet points
//   cy.get(L.actions.backLink).contains('Go back') // navigate back
//
export const AccountSearchProblemLocators = {
  // Root wrapper to scope queries on the problem screen
  root: 'app-fines-sa-search-problem',

  // Key content
  heading: 'app-fines-sa-search-problem h1.govuk-heading-l',
  description: 'app-fines-sa-search-problem p.govuk-body',
  bulletList: 'app-fines-sa-search-problem ul.govuk-list.govuk-list--bullet',

  // Actions
  actions: {
    backLink: 'app-fines-sa-search-problem a.govuk-link',
  },
} as const;

export type AccountSearchProblemLocatorKeys = keyof typeof AccountSearchProblemLocators;
