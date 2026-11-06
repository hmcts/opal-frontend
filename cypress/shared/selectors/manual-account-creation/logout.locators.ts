/**
 * Logout locators shared across manual account creation and logout flows.
 */
export const logoutMenuSelectors = ['[data-cy="user-menu"]', '[data-cy="user-avatar"]', '[data-cy="user-toggle"]'];

export const logoutSignOutButtonSelector = '[data-cy="sign-out-button"]';

export const logoutSignOutTextRegex = /^sign[\s-]*out$/i;
