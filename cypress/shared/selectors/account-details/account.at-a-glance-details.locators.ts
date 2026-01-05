/**
 * @file account.AtAGlance.details.locators.ts
 * @description
 * Selector map for the **At a glance** tab within the Account Details view,
 * plus the page header (caption + title and header actions).
 *
 * @remarks
 * - Scoped to `<app-fines-acc-defendant-details-at-a-glance-tab>` for tab content.
 * - Uses visible headings/labels and stable IDs where available (`#addAccountNote`,
 *   `#enforcement_status`, `#badge1`) to keep selectors resilient.
 * - Intended for use by `AccountAtAGlanceActions` and read-only summary flows.
 *
 * @example
 * ```ts
 * // Assert the “Enforcement status” section is visible
 * cy.get(AccountAtAGlanceLocators.headers.enforcementStatus).should('be.visible');
 *
 * // Verify the defendant name field content
 * cy.get(AccountAtAGlanceLocators.fields.name).should('contain.text', 'Mr John ACCDETAILSURNAME');
 * ```
 *
 * @see {@link AccountAtAGlanceActions}
 */
export const AccountAtAGlanceLocators = {
  // ──────────────────────────────
  // Page header (caption/title + actions)
  // ──────────────────────────────

  header: {
    /** Entire H1 header element (includes caption + name). */
    title: 'opal-lib-govuk-heading-with-caption h1.govuk-heading-l',

    /** Account reference shown as caption above the name (e.g., 25000001E). */
    accountIdCaption: 'opal-lib-govuk-heading-with-caption .govuk-caption-l',

    /** Primary header action: Add account note button. */
    addAccountNoteButton: 'button#addAccountNote',

    /** “More options” menu toggle button in the header. */
    moreOptionsToggle: '.moj-button-menu__toggle-button',
  },

  // ──────────────────────────────
  // At a glance — Section headings
  // ──────────────────────────────

  headers: {
    /** Column header: Defendant */
    defendant: 'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Defendant")',

    /** Column header: Payment terms */
    paymentTerms: 'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Payment terms")',

    /** Column header: Enforcement status */
    enforcementStatus:
      'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Enforcement status")',

    /** Section header: Comments (appears in the third column, beneath enforcement block) */
    comments: 'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Comments")',
  },

  // ──────────────────────────────
  // At a glance — Fields
  // ──────────────────────────────

  fields: {
    // Defendant column
    /** Defendant name value. */
    name: 'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Name") + p',

    /** Defendant aliases value. */
    aliases:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Aliases") + p',

    /** Date of birth value. */
    dateOfBirth:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Date of birth") + p',

    /** Address value (may contain line breaks). */
    address:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Address") + p',

    /** National Insurance Number value. */
    nationalInsuranceNumber:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("National Insurance Number") + p',

    // Payment terms column
    /** Payment terms type (e.g., Pay by date). */
    paymentTermsType:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Payment terms")) h3:contains("Payment terms") + p',

    /** By date value. */
    paymentByDate:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Payment terms")) h3:contains("By date") + p',

    // Enforcement status column
    /** Enforcement status tag text. */
    enforcementStatusTag: 'app-fines-acc-defendant-details-at-a-glance-tab strong#enforcement_status',

    /** Enforcement status badge text. */
    enforcementStatusBadge: 'app-fines-acc-defendant-details-at-a-glance-tab span#badge1',

    /** Date of last movement value. */
    dateOfLastMovement:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Enforcement status")) h3:contains("Date of last movement") + p',
  },

  sections: {
    /** Root element for the At a glance tab content. */
    atAGlanceTabRoot: 'app-fines-acc-defendant-details-at-a-glance-tab',

    /** Column that contains the Comments block on At a glance. */
    commentsColumn:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2.govuk-heading-s:contains("Comments"))',
  },

  links: {
    /**
     * Text matcher for the action link inside the Comments block.
     * Shows as "Add comments" when empty, "Change" when comments exist.
     */
    commentsActionText: /^(add comments|change)$/i,
  },

  comments: {
    /** “Comment” value paragraph under the Comments section. */
    commentValue:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Comments")) h3:contains("Comment") + p',

    /** “Free text notes” value paragraph (contains <br> for multiple lines). */
    freeTextNotesValue:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Comments")) h3:contains("Free text notes") + p',
  },
};
