/**
 * @file account.comments.details.locators.ts
 * @description
 * Stable, ID-first selectors for the **Comments** (Add comments) page.
 *

 * Notes:
 *  - All selectors are scoped from <main role="main"> to avoid header/footer collisions.
 *  - Prefers explicit element IDs found in the provided DOM.
 */
export const AccountCommentsAddLocators = {
  /** Root page scope for all queries on this view. */
  pageRoot: 'main[role="main"]',

  // ──────────────────────────────
  // Header
  // ──────────────────────────────
  /** Page header element that contains "Comments". */
  header: 'main[role="main"] h1.govuk-heading-l',
  /** Caption beneath the header (e.g. "25000001E - Mr John ACCDETAILSURNAME"). */
  headerCaption: 'main[role="main"] h1.govuk-heading-l .govuk-caption-l',

  // ──────────────────────────────
  // Form + Fields
  // ──────────────────────────────
  /** Root form element for the Comments page. */
  form: 'main[role="main"] form',

  fields: {
    /** Top comment field (30 char limit). */
    comment: 'textarea#facc_add_comment',
    /** Free text Line 1 (76 char limit). */
    line1: 'textarea#facc_add_free_text_1',
    /** Free text Line 2 (76 char limit). */
    line2: 'textarea#facc_add_free_text_2',
    /** Free text Line 3 (76 char limit). */
    line3: 'textarea#facc_add_free_text_3',
  },

  // ──────────────────────────────
  // Actions
  // ──────────────────────────────
  actions: {
    /** Primary submit button to save comments. */
    saveButton: 'button#save-comments[type="submit"]',
    /** Cancel link beneath the form. */
    cancelLink: 'main[role="main"] a.govuk-link.button-link',
  },
} as const;
