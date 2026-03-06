/**
 * @file account.notes.details.locators.ts
 * @description
 * Selector map for the **Add account note** page within the HMCTS Opal Fines flow.
 * Defines stable, ID-first selectors for the page heading, textarea, helper text,
 * character count status, and primary actions.
 *
 * @remarks
 * - Selectors are scoped from the component root so they work in both component and e2e tests.
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

  /** Component root for the Add account note view. */
  componentRoot: 'app-fines-acc-note-add-form',

  /** Page heading “Add account note”. */
  header: 'app-fines-acc-note-add-form h1.govuk-heading-l',

  /** Caption beneath the header showing account ref and name (e.g., “25000047W - Mr James …”). */
  headerCaption: 'app-fines-acc-note-add-form h1.govuk-heading-l .govuk-caption-l',

  /** Error summary block at the top of the form (renders when there are validation errors). */
  errorSummary:
    'app-fines-acc-note-add-form .govuk-error-summary, app-fines-acc-note-add-form opal-lib-govuk-error-summary',

  /** Error summary body containing the list of anchor links. */
  errorSummaryBody: 'app-fines-acc-note-add-form .govuk-error-summary__body',

  // ──────────────────────────────
  // Form
  // ──────────────────────────────

  /** Root form element for adding an account note. */
  form: 'app-fines-acc-note-add-form form',

  fields: {
    /** Note textarea input. */
    noteTextArea: 'textarea#facc_add_notes',

    /** Hint text under the textarea. */
    noteHint: '#facc_add_notes-hint',

    /** Inline error message for the note textarea. */
    noteErrorMessage: 'app-fines-acc-note-add-form #facc_add_notes-error-message',

    /** Character count message visible to sighted users. */
    noteCharCountMessage:
      'app-fines-acc-note-add-form #facc_add_notes ~ .govuk-character-count__message.govuk-character-count__status',

    /** Live region announcing remaining characters for screen readers. */
    noteCharCountSrStatus: 'app-fines-acc-note-add-form .govuk-character-count__sr-status',
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
