/**
 * @file account.search.nav.locators.ts
 * @description
 * Locators for the **Account Search navigation tabs**.
 *
 * Tabs included:
 * - Individuals
 * - Companies
 * - Major creditors
 * - Minor creditors
 *
 * Notes:
 * - These IDs follow the same pattern used in other search panels.
 * - Only tab controls are defined here; panel-specific fields live in their
 *   respective locator files (e.g. account.search.individuals.locators.ts).
 */

export const AccountSearchNavLocators = {
  /** Individuals tab toggle */
  individualsTab: '#tab-individuals',

  /** Companies tab toggle */
  companiesTab: '#tab-companies',

  /** Major creditors tab toggle */
  majorCreditorsTab: '#tab-major-creditors',

  /** Minor creditors tab toggle */
  minorCreditorsTab: '#tab-minor-creditors',
} as const;

export type AccountSearchNavLocatorKeys = keyof typeof AccountSearchNavLocators;
