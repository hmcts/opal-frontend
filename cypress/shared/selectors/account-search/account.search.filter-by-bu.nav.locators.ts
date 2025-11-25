/**
 * @file search.filter-by-bu.nav.locators.ts
 * @description
 * Shared sub-navigation locators for the Fines/Confiscation filter-by-business-unit pages.
 */

export const SearchFilterByBUNavLocators = {
  /** Wrapper navigation element for the Fines / Confiscation sub-nav. */
  subNavigation: 'nav.moj-sub-navigation#inputter-tabs',

  /** "Fines" sub-navigation list item. */
  finesTabItem: 'li[subnavitemid="inputter-in-review-tab"].moj-sub-navigation__item',

  /** Link element for the "Fines" tab. */
  finesTabLink: 'li[subnavitemid="inputter-in-review-tab"] .moj-sub-navigation__link',

  /** "Confiscation" sub-navigation list item. */
  confiscationTabItem: 'li[subnavitemid="inputter-approved-tab"].moj-sub-navigation__item',

  /** Link element for the "Confiscation" tab. */
  confiscationTabLink: 'li[subnavitemid="inputter-approved-tab"] .moj-sub-navigation__link',

  /** The aria-current value used for the active sub-navigation item. */
  activeSubNavAriaCurrent: 'page',
};
