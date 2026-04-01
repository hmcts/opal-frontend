/**
 * @file account.fixed-penalty.details.locators.ts
 * @description
 * Selector map for the **Fixed penalty** tab within the Account Details view.
 * Provides stable selectors for the tab root, tab link, and summary-card header
 * used by account-enquiry assertions.
 *
 * @remarks
 * - Scoped to the Account Details shell to avoid cross-page bleed.
 * - The fixed-penalty tab currently renders a single GOV.UK summary card, so the
 *   header selector intentionally targets the tab-local summary-card title.
 */
export const AccountFixedPenaltyDetailsLocators = {
  /** Main content root to scope all selections on Account Details pages. */
  shell: 'main#main-content',

  tabs: {
    /** Sub-navigation container for Account Details tabs. */
    root: '#account-details-tabs',
    /** The navigation tab link for “Fixed penalty”. */
    fixedPenaltyTab: 'li[subnavitemid="fixed-penalty-tab"] a.moj-sub-navigation__link',
  },

  /** Root element for content rendered when the Fixed penalty tab is active. */
  fixedPenaltyTabRoot: 'app-fines-acc-defendant-details-fixed-penalty-tab',

  /** Heading area for the summary card rendered inside the Fixed penalty tab. */
  fixedPenaltyTabHeader: {
    /** Summary-card title shown at the top of the Fixed penalty tab. */
    title: 'app-fines-acc-defendant-details-fixed-penalty-tab .govuk-summary-card__title',
  },

  /** Summary list value fields for fixed-penalty data. */
  fields: {
    issuingAuthority: '#fixedPenaltyDetailsIssuing_authorityValue',
    ticketNumber: '#fixedPenaltyDetailsTicket_numberValue',
    registrationNumber: '#fixedPenaltyDetailsRegistration_numberValue',
    drivingLicence: '#fixedPenaltyDetailsLicence_numberValue',
    noticeNumber: '#fixedPenaltyDetailsNotice_numberValue',
    issuedDate: '#fixedPenaltyDetailsIssued_dateValue',
    timeOfOffence: '#fixedPenaltyDetailsTime_of_offenceValue',
    placeOfOffence: '#fixedPenaltyDetailsPlace_of_offenceValue',
  },
} as const;
