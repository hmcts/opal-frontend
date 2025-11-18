/**
 * @file accessDenied.locators.ts
 * @description
 * Selector map for the **Access Denied** page in the HMCTS Opal application.
 *
 * Provides stable locators for verifying that the page is displayed correctly
 * when a user lacks access permissions or encounters authorization errors.
 *
 * @remarks
 * - Used by `accessDenied.actions.ts` for assertions within error-handling tests.
 * - Keep selectors minimal and scoped to visible elements for fast, reliable checks.
 * - Page markup follows the standard GOV.UK layout conventions.
 *
 * @example
 * ```ts
 * cy.get(accessDeniedHeading).should('contain.text', 'Access Denied');
 * cy.get(accessDeniedMessage).should('contain.text', 'You do not have permission');
 * cy.get(backToDashboardBtn).click();
 * ```
 *
 * @see {@link accessDenied.actions.ts}
 */

/** Page heading element (e.g., “Access Denied”). */
export const accessDeniedHeading = 'h1';

/** Error message paragraph inside the main GOV.UK grid column. */
export const accessDeniedMessage = '.govuk-grid-column-two-thirds p';

/** “Back to dashboard” button or link element. */
export const backToDashboardBtn = '#go-back';
