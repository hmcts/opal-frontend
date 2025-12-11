/**
 * @file account.notes.details.locators.ts
 * @description
 * Selector map for the **Add account note** page within the HMCTS Opal Fines flow.
 * Defines stable, ID-first selectors for the page heading, textarea, helper text,
 * character count status, and primary actions.
 *
 * @remarks
 * - All selectors are intentionally scoped from the `<main role="main">` container.
 * - Prefers persistent `id` attributes provided by GOV.UK components.
 * - Safe for use in both Cypress and Playwright tests.
 *
 * @example
 * ```ts
 * // Fill in a note and save
 * cy.get(FinesAccountNoteAddLocators.fields.noteTextArea).type('Payment plan discussed with defendant.');
 * cy.get(FinesAccountNoteAddLocators.actions.saveNoteButton).click();
 * ```
 */
export const AccountDetailsNotesLocators = {
  // ──────────────────────────────
  // Page chrome
  // ──────────────────────────────

  /** Root page scope for all queries on this view. */
  pageRoot: 'main[role="main"].govuk-main-wrapper',

  /** Page heading “Add account note”. */
  header: 'main[role="main"] h1.govuk-heading-l',

  /** Caption beneath the header showing account ref and name (e.g., “25000047W - Mr James …”). */
  headerCaption: 'main[role="main"] h1.govuk-heading-l .govuk-caption-l',

  /** Error summary block at the top of the form (renders when there are validation errors). */
  errorSummary: 'main[role="main"] .govuk-error-summary, main[role="main"] opal-lib-govuk-error-summary',

  // ──────────────────────────────
  // Form
  // ──────────────────────────────

  /** Root form element for adding an account note. */
  form: 'main[role="main"] form',

  fields: {
    /** Note textarea input. */
    noteTextArea: 'textarea#facc_add_notes',

    /** Hint text under the textarea. */
    noteHint: '#facc_add_notes-hint',

    /** Character count message visible to sighted users. */
    noteCharCountMessage: '#facc_add_notes-with-hint-info.govuk-character-count__message',

    /** Live region announcing remaining characters for screen readers. */
    noteCharCountSrStatus: '.govuk-character-count__sr-status',
  },

  // ──────────────────────────────
  // Actions
  // ──────────────────────────────

  actions: {
    /** Primary submit button to save the note. */
    saveNoteButton: 'button#save-note.govuk-button[type="submit"]',

    /** Cancel link beneath the form. */
    cancelLink: 'a.button-link.govuk-link',
  },

  // ──────────────────────────────
  // Header (global)
  // ──────────────────────────────

  headerNav: {
    /** “Sign out” link in the MOJ header. */
    signOut: 'header.moj-header a.moj-header__navigation-link:contains("Sign out")',

    /** Service name link (“Opal”). */
    serviceName: 'header.moj-header a.moj-header__link--service-name',

    /** Organisation name link (“HMCTS”). */
    organisationName: 'header.moj-header a.moj-header__link--organisation-name',
  },

  // ──────────────────────────────
  // Footer (global)
  // ──────────────────────────────

  footer: {
    /** GOV.UK footer root. */
    root: 'footer.govuk-footer',
    /** Crown copyright link. */
    crownCopyrightLink: 'footer.govuk-footer a.govuk-footer__copyright-logo',
    /** Open Government Licence link. */
    oglLink: 'footer.govuk-footer a[href*="open-government-licence"]',
  },
} as const;
