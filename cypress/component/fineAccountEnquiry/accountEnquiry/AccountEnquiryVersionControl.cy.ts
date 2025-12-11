import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { DOM_ELEMENTS } from './constants/global_version_control_elements';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';
import {
  interceptAtAGlance,
  interceptDefendantDetails,
  interceptDefendantHeader,
  interceptPaymentTerms,
} from './intercept/defendantAccountIntercepts';
import {
  interceptAuthenticatedUser,
  interceptResultByCode,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { DEFENDANT_HEADER_MOCK, USER_STATE_MOCK_PERMISSION_BU77 } from './mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { head } from 'lodash';

describe('Global Version Control Mechanism - Component Tests', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
  });

  const componentProperties: IComponentProperties = {
    accountId: '77',
    fragments: 'at-a-glance',
    interceptedRoutes: [
      '/access-denied',
      '../note/add',
      '../debtor/individual/amend',
      '../debtor/parentGuardian/amend',
    ],
  };

  it(
    'AC1: Warning banner will not be displayed when version control mechanism confirms account-level-data has not changed',
    { tags: ['@PO-2140'] },
    () => {
      // Use same ETag for both header and at-a-glance to simulate no version change
      const etag = 'W/"version-1"';

      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, etag);
      interceptDefendantDetails(
        77,
        {
          version: DEFENDANT_HEADER_MOCK.version,
          defendant_account_party: OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party,
        },
        etag,
      );
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, etag);
      interceptPaymentTerms(77, OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK, etag);
      interceptResultByCode('REM');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM_ELEMENTS.warningBanner).should('not.exist');
      cy.get(DOM_ELEMENTS.atAGlanceTab).should('be.visible');

      // Navigate to other tabs - warning should not exist
      cy.get(DOM_ELEMENTS.defendantTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('not.exist');

      cy.get(DOM_ELEMENTS.paymentTermsTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('not.exist');

      cy.get(DOM_ELEMENTS.enforcementTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('not.exist');

      cy.get(DOM_ELEMENTS.impositionsTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('not.exist');

      cy.get(DOM_ELEMENTS.historyNotesTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('not.exist');
    },
  );

  it(
    '(AC2a, AC2b, AC2bi) When navigating to a new tab with version changes, tab displays with orange warning banner matching design',
    { tags: ['@PO-2140'] },
    () => {
      // Use different ETags to simulate version changes
      const headerEtag = 'W/"version-1"';
      const atAGlanceEtag = 'W/"version-2"';
      const paymentTermsEtag = 'W/"version-3"';

      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, headerEtag);
      interceptDefendantDetails(
        77,
        {
          version: DEFENDANT_HEADER_MOCK.version, // Use same version as header to show they match
          defendant_account_party: OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party,
        },
        headerEtag, // Use headerEtag to match the header version
      );
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, atAGlanceEtag);
      interceptPaymentTerms(77, OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK, paymentTermsEtag);
      interceptResultByCode('REM');

      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM_ELEMENTS.warningBanner).should('exist');
      cy.get(DOM_ELEMENTS.warningBanner).should('have.attr', 'type', 'warning');
      cy.get(DOM_ELEMENTS.warningBannerIcon).should('have.attr', 'type', 'warning');
      cy.get(DOM_ELEMENTS.warningBannerText).should('contain', 'Some information on this page may be out of date');
      cy.get(DOM_ELEMENTS.refreshLink).should('contain', 'Refresh').and('be.visible');

      // Navigate to other tabs - warning should persist
      cy.get(DOM_ELEMENTS.defendantTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('exist');

      cy.get(DOM_ELEMENTS.paymentTermsTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('exist');

      cy.get(DOM_ELEMENTS.enforcementTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('exist');

      cy.get(DOM_ELEMENTS.impositionsTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('exist');

      cy.get(DOM_ELEMENTS.historyNotesTab).click();
      cy.get(DOM_ELEMENTS.warningBanner).should('exist');
    },
  );

  it(
    '(AC2c, AC2ci, AC2cii, AC2ciii, AC2ciiia) When refresh button is clicked, page refreshes and shows green success banner',
    { tags: ['@PO-2140'] },
    () => {
      // Start with different ETags to show version mismatch
      const headerEtag = 'W/"version-1"';
      const atAGlanceEtag = 'W/"version-2"';

      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, headerEtag);
      interceptDefendantDetails(
        77,
        {
          version: DEFENDANT_HEADER_MOCK.version,
          defendant_account_party: OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party,
        },
        atAGlanceEtag,
      );
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, atAGlanceEtag);
      setupAccountEnquiryComponent(componentProperties);

      cy.get(DOM_ELEMENTS.warningBanner).should('exist');

      // Wait for at-a-glance to load and verify warning banner appears
      cy.wait('@getAtAGlance');
      cy.get(DOM_ELEMENTS.warningBanner).should('exist');

      const newEtag = 'W/"version-2"';
      interceptDefendantHeader(77, DEFENDANT_HEADER_MOCK, newEtag);
      interceptDefendantDetails(
        77,
        {
          version: DEFENDANT_HEADER_MOCK.version,
          defendant_account_party: OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK.defendant_account_party,
        },
        newEtag,
      );
      interceptAtAGlance(77, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, newEtag);
      // Click refresh link
      cy.get(DOM_ELEMENTS.refreshLink).click();

      // Verify green success banner is displayed with correct content
      cy.get(DOM_ELEMENTS.successBanner).should('exist');
      cy.get(DOM_ELEMENTS.successBanner).should('have.attr', 'type', 'success');
      cy.get(DOM_ELEMENTS.successBannerIcon).should('exist');
      cy.get(DOM_ELEMENTS.successBannerIcon).should('have.attr', 'type', 'success');
      cy.get(DOM_ELEMENTS.successBannerText).should('contain', 'Information is up to date');

      // Verify success banner can be dismissed
      cy.get(DOM_ELEMENTS.successBannerDismiss).should('exist').click();
      cy.get(DOM_ELEMENTS.successBanner).should('not.exist');
    },
  );
});
