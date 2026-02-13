/**
 * @file account.details.locators.ts
 * @description
 * Selector map for the **Defendant tab** within the Account Details view.
 * Defines stable selectors for the page header, the defendant summary card,
 * contact and employer summary cards, tab navigation, and actionable links.
 *
 * @remarks
 * - All summary fields map to persistent `id` attributes inside GOV.UK summary lists.
 * - Scope selectors to the Account Details shell to avoid bleed into other pages.
 * - Intended for use by `AccountDetailsDefendantActions` and tests for read-only assertions
 *   and edit/change flows.
 *
 * @example
 * ```ts
 * // Assert page header and caption
 * cy.get(AccountDefendantDetailsLocators.header).should('contain.text', 'Mr John ACCDETAILSURNAME');
 * cy.get(AccountDefendantDetailsLocators.headerCaption).should('contain.text', '25000001E');
 *
 * // Assert defendant's name and DOB
 * cy.get(AccountDefendantDetailsLocators.defendant.fields.name).should('contain.text', 'Mr John ACCDETAILSURNAME');
 * cy.get(AccountDefendantDetailsLocators.defendant.fields.dateOfBirth).should('contain.text', '15 May 2002');
 *
 * // Assert contact email
 * cy.get(AccountDefendantDetailsLocators.contact.fields.primaryEmail).should('contain.text', 'John.AccDetailSurname@test.com');
 * ```
 *
 * @see {@link AccountDetailsDefendantActions}
 */
export const AccountDefendantDetailsLocators = {
  // ──────────────────────────────
  // Shell / scope
  // ──────────────────────────────
  /** Main content root to scope all selections on Account Details pages. */
  shell: 'main#main-content',

  // ──────────────────────────────
  // Page header (overall page header)
  // ──────────────────────────────

  /** Page heading showing account caption (ref) + defendant name, e.g. “25000001E Mr John ACCDETAILSURNAME”. */
  header: 'main#main-content h1.govuk-heading-l',

  /** Caption beneath/within the header showing the account reference number (e.g., “25000001E”). */
  headerCaption: 'main#main-content h1.govuk-heading-l .govuk-caption-l',

  /** Primary page-level actions next to the header. */
  headerActions: {
    /** Button: Add account note. */
    addAccountNote: 'button[id$="addAccountNote"]',
    /** “More options” menu toggle (button). */
    moreOptionsToggle: '.moj-button-menu__toggle-button',
  },

  // ──────────────────────────────
  // Sub-navigation (tabs)
  // ──────────────────────────────

  /** Sub-navigation container for Account Details tabs. */
  tabs: {
    root: '#account-details-tabs',
    /** The navigation tab link for “Defendant”. */
    defendantTab: 'li[subnavitemid="defendant-tab"] a.moj-sub-navigation__link',
  },

  // ──────────────────────────────
  // Defendant tab root + shared bits
  // ──────────────────────────────
  /** Root element for content rendered when the Defendant tab is active. */
  defendantTabRoot: 'app-fines-acc-defendant-details-defendant-tab',

  /** Heading and in-tab action area at the top of the Defendant tab. */
  defendantTabHeader: {
    /** “Defendant Details” section heading within the tab. */
    title: 'app-fines-acc-defendant-details-defendant-tab h2.govuk-heading-s',
    /** Right-aligned “Change” link for the Defendant details section. */
    changeLink: 'app-fines-acc-defendant-details-defendant-tab .govuk-grid-column-one-third .govuk-link',
  },

  // ──────────────────────────────
  // Defendant details (summary card)
  // ──────────────────────────────
  defendant: {
    /** Summary card wrapper and list for defendant details. */
    card: '#defendant-summary-card-list',
    list: '#defendantDetails',

    /** Fields section mapped by stable IDs from the summary list. */
    fields: {
      /** Full name value field. */
      name: '#defendantDetailsNameValue',
      /** Aliases value field (if any). */
      aliases: '#defendantDetailsAliasesValue',
      /** Date of birth value field. */
      dateOfBirth: '#defendantDetailsDobValue',
      /** National Insurance number value field. */
      nationalInsuranceNumber: '#defendantDetailsNational_insurance_numberValue',
      /** Address value field (may include multi-line content with <br>). */
      address: '#defendantDetailsAddressValue',
      /** Vehicle make and model value field (if applicable). */
      vehicleMakeAndModel: '#defendantDetailsVehicle_make_and_modelValue',
      /** Vehicle registration number value field (if applicable). */
      vehicleRegistration: '#defendantDetailsVehicle_registrationValue',
    },

    /** Actions inside the defendant summary card header (currently empty list, kept for future). */
    cardActions:
      '#defendant-summary-card-list .govuk-summary-card__actions a, #defendant-summary-card-list .govuk-summary-card__actions button',
  },

  // ──────────────────────────────
  // Contact details (summary card inside Defendant tab)
  // ──────────────────────────────
  contact: {
    /** Contact details summary card and list. */
    card: '#contact-summary-card-list',
    list: '#contactDetails',

    /** Contact fields (stable by ID). */
    fields: {
      /** Primary email address value field. */
      primaryEmail: '#contactDetailsPrimary_email_addressValue',
      /** Secondary email address value field (may be “—”). */
      secondaryEmail: '#contactDetailsSecondary_email_addressValue',
      /** Mobile telephone number value field. */
      mobileTelephone: '#contactDetailsMobile_telephone_numberValue',
      /** Home telephone number value field. */
      homeTelephone: '#contactDetailsHome_telephone_numberValue',
      /** Work telephone number value field. */
      workTelephone: '#contactDetailsWork_telephone_numberValue',
    },

    /** Actions area inside the contact card header (empty today, reserved). */
    cardActions:
      '#contact-summary-card-list .govuk-summary-card__actions a, #contact-summary-card-list .govuk-summary-card__actions button',
  },

  // ──────────────────────────────
  // Employer details (summary card inside Defendant tab)
  // ──────────────────────────────
  employer: {
    /** Employer details summary card and list. */
    card: '#employer-summary-card-list',
    list: '#employerDetails',

    /** Employer fields (stable by ID). */
    fields: {
      /** Employer name value field. */
      employerName: '#employerDetailsEmployer_nameValue',
      /** Employer reference value field. */
      employerReference: '#employerDetailsEmployer_referenceValue',
      /** Employer email value field. */
      employerEmail: '#employerDetailsEmployer_email_addressValue',
      /** Employer telephone value field. */
      employerTelephone: '#employerDetailsEmployer_telephone_numberValue',
      /** Employer address value field (may include <br>). */
      employerAddress: '#employerDetailsEmployer_addressValue',
    },

    /** Actions area inside the employer card header (empty today, reserved). */
    cardActions:
      '#employer-summary-card-list .govuk-summary-card__actions a, #employer-summary-card-list .govuk-summary-card__actions button',
  },

  // ──────────────────────────────
  // Right-hand actions column (inside Defendant tab)
  // ──────────────────────────────
  actions: {
    /** Container for the right column actions within Defendant tab. */
    sideColumn: 'app-fines-acc-defendant-details-defendant-tab .govuk-grid-column-one-third',

    /** “Convert to a company account” action link. */
    convertToCompany: 'app-fines-acc-defendant-details-defendant-tab .govuk-grid-column-one-third p > a',
  },
};
