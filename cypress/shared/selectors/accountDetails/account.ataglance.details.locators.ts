/**
 * @file accountAtAGlance.locators.ts
 * @description
 * Selector map for the **At a Glance** tab within the Account Details view.
 * Defines locators for section headers, summary fields, and key indicators
 * (e.g., enforcement status and payment terms).
 *
 * @remarks
 * - Scoped within the `<app-fines-acc-defendant-details-at-a-glance-tab>` Angular component.
 * - Selectors use GOV.UK grid and heading structures, targeting labelled content
 *   using `:has()` and `:contains()` for readability and resilience.
 * - Used by `AccountAtAGlanceActions` or flow classes that assert summary content
 *   without entering edit mode.
 *
 * @example
 * ```ts
 * // Assert the “Enforcement status” section is visible
 * cy.get(AccountAtAGlanceLocators.headers.enforcementStatus).should('be.visible');
 *
 * // Verify the defendant name field content
 * cy.get(AccountAtAGlanceLocators.fields.name).should('contain.text', 'John Smith');
 * ```
 *
 * @see {@link AccountAtAGlanceActions}
 */

export const AccountAtAGlanceLocators = {
  // ──────────────────────────────
  // Headers
  // ──────────────────────────────

  /** Section headings shown for each summary column in the “At a glance” tab. */
  headers: {
    /** Header for the Defendant information column. */
    defendant: 'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Defendant")',

    /** Header for the Payment Terms summary column. */
    paymentTerms: 'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Payment terms")',

    /** Header for the Enforcement Status summary column. */
    enforcementStatus:
      'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Enforcement status")',
  },

  // ──────────────────────────────
  // Fields
  // ──────────────────────────────

  /** Summary data fields displayed under each section column. */
  fields: {
    // Defendant column
    /** Defendant name value field. */
    name: 'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Name") + p',

    /** Defendant aliases value field. */
    aliases:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Aliases") + p',

    /** Date of birth value field. */
    dateOfBirth:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Date of birth") + p',

    /** Address value field. */
    address:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Address") + p',

    /** National Insurance number field. */
    nationalInsuranceNumber:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("National Insurance Number") + p',

    // Payment terms column
    /** Payment terms type value field. */
    paymentTermsType:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Payment terms")) h3:contains("Payment terms") + p',

    /** “By date” payment field. */
    paymentByDate:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Payment terms")) h3:contains("By date") + p',

    // Enforcement status column
    /** Enforcement status tag element. */
    enforcementStatusTag: 'app-fines-acc-defendant-details-at-a-glance-tab strong#enforcement_status',

    /** Enforcement status badge (visual indicator). */
    enforcementStatusBadge: 'app-fines-acc-defendant-details-at-a-glance-tab span#badge1',

    /** Date of last enforcement movement field. */
    dateOfLastMovement:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Enforcement status")) h3:contains("Date of last movement") + p',
  },

  // ──────────────────────────────
  // Links
  // ──────────────────────────────

  /** Action links available within the “At a glance” tab. */
  links: {
    /** “Add comments” link under the Defendant summary section. */
    addComments: 'app-fines-acc-defendant-details-at-a-glance-tab a.govuk-link:contains("Add comments")',
  },
};
