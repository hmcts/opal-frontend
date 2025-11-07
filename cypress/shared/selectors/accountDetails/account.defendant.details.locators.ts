// cypress/shared/selectors/account.details.locators.ts

/**
 * Defendant tab — headers, fields, links
 * Uses stable IDs from the summary card and summary list.
 */
export const AccountDefendantDetailsLocators = {
  // Page title and caption (e.g. caption = account ref; title = name)
  header: 'main h1.govuk-heading-l',
  headerCaption: 'main h1.govuk-heading-l .govuk-caption-l',

  fields: {
    // Summary list <dl id="defendantDetails"> with row-specific IDs
    name: '#defendantDetailsNameValue',
    aliases: '#defendantDetailsAliasesValue',
    dateOfBirth: '#defendantDetailsDobValue',
    nationalInsuranceNumber: '#defendantDetailsNational_insurance_numberValue',
    address: '#defendantDetailsAddressValue',
    vehicleMakeAndModel: '#defendantDetailsVehicle_make_and_modelValue',
    vehicleRegistration: '#defendantDetailsVehicle_registrationValue',
  },

  links: {
    // Actions area inside the card header (empty in sample HTML, but wired for future buttons/links)
    cardActions:
      '#defendant-summary-card-list .govuk-summary-card__actions a, #defendant-summary-card-list .govuk-summary-card__actions button',
    // The tab link itself (reuse if you already defined AccountDetailsTabsLocators)
    tab: 'li[subnavitemid="defendant-tab"] a.moj-sub-navigation__link',
  },

  view: {
    sectionHeader: 'h2.govuk-heading-s, .account-details__section-title',
  },

  edit: {
    form: 'form, .account-details__form',
  },
};
