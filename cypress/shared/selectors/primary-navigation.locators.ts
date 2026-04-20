/**
 * Shared selectors for the top-level Fines primary navigation and account header controls.
 */
const PRIMARY_NAVIGATION_CONTAINER = '#primaryNavigation nav[aria-label="Primary navigation"]';
const PRIMARY_NAVIGATION_ITEMS = '#primaryNavigation .moj-primary-navigation__link';

export const PrimaryNavigationLocators = {
  container: PRIMARY_NAVIGATION_CONTAINER,
  items: PRIMARY_NAVIGATION_ITEMS,
  itemByText: (label: string) => `${PRIMARY_NAVIGATION_ITEMS}:contains("${label}")`,
  labels: {
    search: 'Search',
    accounts: 'Accounts',
    finance: 'Finance',
    reports: 'Reports',
    administration: 'Administration',
  },
  expectedItemsWithoutReports: ['Search', 'Accounts', 'Finance', 'Administration'],
  expectedItemsWithReports: ['Search', 'Accounts', 'Finance', 'Reports', 'Administration'],
} as const;
