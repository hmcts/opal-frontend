/**
 * @file account.parent.guardian.details.locators.ts
 * @description
 * Selector map for the **Parent or guardian** tab within the Account Details view.
 * Uses stable IDs on GOV.UK summary lists and minimal structure for “Change”/Actions.
 *
 * @remarks
 * - Scope all selectors to the Account Details shell to avoid cross-page bleed.
 * - Summary list value fields use the `...Value` IDs present in the DOM.
 * - Intended for use by page actions and E2E assertions.
 *
 * @example
 * // Assert page header caption + name
 * cy.get(AccountParentOrGuardianDetailsLocators.headerCaption).should('contain.text', '25000011D');
 * cy.get(AccountParentOrGuardianDetailsLocators.header).should('contain.text', 'Miss Catherine GREEN');
 *
 * // Open the tab (if needed) and assert a field
 * cy.get(AccountParentOrGuardianDetailsLocators.tabs.parentOrGuardianTab).click();
 * cy.get(AccountParentOrGuardianDetailsLocators.parentOrGuardian.fields.name)
 *   .should('contain.text', 'FNAME LNAME');
 */
export const AccountParentOrGuardianDetailsLocators = {
  // ──────────────────────────────
  // Shell / scope
  // ──────────────────────────────
  /** Main content root to scope all selections on Account Details pages. */
  shell: 'main#main-content',

  // ──────────────────────────────
  // Page header
  // ──────────────────────────────
  /** Page heading showing account caption + defendant name. */
  header: 'main#main-content h1.govuk-heading-l',
  /** Caption within the header showing the account reference number. */
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
  tabs: {
    /** Sub-navigation container for Account Details tabs. */
    root: '#account-details-tabs',
    /** The navigation tab link for “Parent or guardian”. */
    parentOrGuardianTab: 'li[subnavitemid="parent-or-guardian-tab"] a.moj-sub-navigation__link',
  },

  // ──────────────────────────────
  // Parent or guardian tab root + header area
  // ──────────────────────────────
  /** Root element for content rendered when the Parent or guardian tab is active. */
  parentOrGuardianTabRoot: 'app-fines-acc-defendant-details-parent-or-guardian-tab',

  /** Heading and in-tab action area at the top of the Parent or guardian tab. */
  parentOrGuardianTabHeader: {
    /** “Parent or guardian details” section heading within the tab. */
    title: 'app-fines-acc-defendant-details-parent-or-guardian-tab h2.govuk-heading-s',
    /** Right-aligned “Change” link for the section (scoped to tab). */
    changeLink: 'app-fines-acc-defendant-details-parent-or-guardian-tab .govuk-grid-column-one-third a.govuk-link',
  },

  // ──────────────────────────────
  // Parent or guardian details (summary card)
  // ──────────────────────────────
  parentOrGuardian: {
    /** Summary card wrapper and list for parent/guardian details. */
    card: '#parent-or-guardian-details-summary-card-list',
    list: '#parentOrGuardianDetails',

    /** Fields (stable by ID). */
    fields: {
      /** Name value field. */
      name: '#parentOrGuardianDetailsNameValue',
      /** Aliases value field. */
      aliases: '#parentOrGuardianDetailsAliasesValue',
      /** Date of birth value field (may render “—”). */
      dateOfBirth: '#parentOrGuardianDetailsDobValue',
      /** National Insurance number value field. */
      nationalInsuranceNumber: '#parentOrGuardianDetailsNational_insurance_numberValue',
      /** Address value field (may include <br>). */
      address: '#parentOrGuardianDetailsAddressValue',
      /** Vehicle make and model value field. */
      vehicleMakeAndModel: '#parentOrGuardianDetailsVehicle_make_and_modelValue',
      /** Vehicle registration value field. */
      vehicleRegistration: '#parentOrGuardianDetailsVehicle_registrationValue',
    },

    /** Actions area inside the parent/guardian card header (reserved). */
    cardActions:
      '#parent-or-guardian-details-summary-card-list .govuk-summary-card__actions a, #parent-or-guardian-details-summary-card-list .govuk-summary-card__actions button',
  },

  // ──────────────────────────────
  // Contact details (summary card inside Parent or guardian tab)
  // ──────────────────────────────
  contact: {
    /** Contact details summary card and list. */
    card: '#contact-summary-card-list',
    list: '#contactDetails',

    /** Contact fields (stable by ID). */
    fields: {
      primaryEmail: '#contactDetailsPrimary_email_addressValue',
      secondaryEmail: '#contactDetailsSecondary_email_addressValue',
      mobileTelephone: '#contactDetailsMobile_telephone_numberValue',
      homeTelephone: '#contactDetailsHome_telephone_numberValue',
      workTelephone: '#contactDetailsWork_telephone_numberValue',
    },

    /** Actions area inside the contact card header (reserved). */
    cardActions:
      '#contact-summary-card-list .govuk-summary-card__actions a, #contact-summary-card-list .govuk-summary-card__actions button',
  },

  // ──────────────────────────────
  // Employer details (summary card inside Parent or guardian tab)
  // ──────────────────────────────
  employer: {
    /** Employer details summary card and list. */
    card: '#employer-summary-card-list',
    list: '#employerDetails',

    /** Employer fields (stable by ID). */
    fields: {
      employerName: '#employerDetailsEmployer_nameValue',
      employerReference: '#employerDetailsEmployer_referenceValue',
      employerEmail: '#employerDetailsEmployer_email_addressValue',
      employerTelephone: '#employerDetailsEmployer_telephone_numberValue',
      employerAddress: '#employerDetailsEmployer_addressValue',
    },

    /** Actions area inside the employer card header (reserved). */
    cardActions:
      '#employer-summary-card-list .govuk-summary-card__actions a, #employer-summary-card-list .govuk-summary-card__actions button',
  },

  // ──────────────────────────────
  // Right-hand actions column (inside Parent or guardian tab)
  // ──────────────────────────────
  actions: {
    /** Container for the right column actions within this tab. */
    sideColumn: 'app-fines-acc-defendant-details-parent-or-guardian-tab .govuk-grid-column-one-third',
    /** “Remove Parent or guardian details” link. */
    removeParentOrGuardian: 'app-fines-acc-defendant-details-parent-or-guardian-tab .govuk-grid-column-one-third p > a',
  },
};
