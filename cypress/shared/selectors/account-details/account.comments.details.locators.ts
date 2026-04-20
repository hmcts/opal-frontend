/**
 * @file account.comments.details.locators.ts
 * @description
 * Stable, ID-first selectors for the **Comments** (Add comments) page.
 *
 * Notes:
 *  - Selectors prefer `<main role="main">` scoping when available and include fallbacks for component mounts.
 *  - Prefers explicit element IDs found in the provided DOM.
 */
export const AccountCommentsAddLocators = {
  /** Root page scope for all queries on this view. */
  pageRoot: 'main[role="main"]',

  // ──────────────────────────────
  // Header
  // ──────────────────────────────
  /** Page header element that contains "Comments". */
  header: 'main[role="main"] h1.govuk-heading-l, h1.govuk-heading-l',
  /** Caption beneath the header (e.g. "25000001E - Mr John ACCDETAILSURNAME"). */
  headerCaption: 'main[role="main"] h1.govuk-heading-l .govuk-caption-l, h1.govuk-heading-l .govuk-caption-l',

  // ──────────────────────────────
  // Form + Fields
  // ──────────────────────────────
  /** Root form element for the Comments page. */
  form: 'main[role="main"] form, form',

  /** Top-level GOV.UK error summary shown when validation fails. */
  errorSummary: '.govuk-error-summary',

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

  /** Inline validation errors for each text area. */
  errors: {
    comment: '#facc_add_comment-error-message',
    line1: '#facc_add_free_text_1-error-message',
    line2: '#facc_add_free_text_2-error-message',
    line3: '#facc_add_free_text_3-error-message',
  },

  /** Remaining-character status text shown beneath each text area. */
  characterCounts: {
    comment: '#facc_add_comment ~ .govuk-character-count__message.govuk-character-count__status',
    line1: '#facc_add_free_text_1 ~ .govuk-character-count__message.govuk-character-count__status',
    line2: '#facc_add_free_text_2 ~ .govuk-character-count__message.govuk-character-count__status',
    line3: '#facc_add_free_text_3 ~ .govuk-character-count__message.govuk-character-count__status',
  },

  // ──────────────────────────────
  // Actions
  // ──────────────────────────────
  actions: {
    /** Primary submit button to save comments. */
    saveButton: 'button#save-comments[type="submit"]',
    /** Cancel link beneath the form. */
    cancelLink: 'main[role="main"] a.govuk-link.button-link, a.govuk-link.button-link',
  },
} as const;
