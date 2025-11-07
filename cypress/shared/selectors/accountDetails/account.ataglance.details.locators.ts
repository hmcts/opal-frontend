export const AccountAtAGlanceLocators = {
  // ---- Headers ----
  headers: {
    defendant: 'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Defendant")',
    paymentTerms: 'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Payment terms")',
    enforcementStatus:
      'app-fines-acc-defendant-details-at-a-glance-tab h2.govuk-heading-s:contains("Enforcement status")',
  },

  // ---- Fields ----
  fields: {
    // Defendant column
    name: 'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Name") + p',
    aliases:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Aliases") + p',
    dateOfBirth:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Date of birth") + p',
    address:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("Address") + p',
    nationalInsuranceNumber:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Defendant")) h3:contains("National Insurance Number") + p',

    // Payment terms column
    paymentTermsType:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Payment terms")) h3:contains("Payment terms") + p',
    paymentByDate:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Payment terms")) h3:contains("By date") + p',

    // Enforcement status column
    enforcementStatusTag: 'app-fines-acc-defendant-details-at-a-glance-tab strong#enforcement_status',
    enforcementStatusBadge: 'app-fines-acc-defendant-details-at-a-glance-tab span#badge1',
    dateOfLastMovement:
      'app-fines-acc-defendant-details-at-a-glance-tab .govuk-grid-column-one-third:has(h2:contains("Enforcement status")) h3:contains("Date of last movement") + p',
  },

  // ---- Links ----
  links: {
    addComments: 'app-fines-acc-defendant-details-at-a-glance-tab a.govuk-link:contains("Add comments")',
  },
};
