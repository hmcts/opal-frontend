/**
 * @file shared.locators.ts
 * @description Shared selectors reused across Manual Account Creation task pages.
 *
 * @remarks
 * - Primarily houses the common "Return to account details" CTA selector.
 * - Referenced by Cypress actions/flows to keep selectors centralized.
 */
export const ManualAccountSharedLocators = {
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
} as const;
