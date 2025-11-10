import { mount } from 'cypress/angular';
import { FinesAccDefendantDetailsComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details.component';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../../../src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-impositions-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-tab-ref-data.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { DOM_ELEMENTS } from './constants/global_version_control_elements';
import { provideHttpClient } from '@angular/common/http';
import { FinesAccPayloadService } from '../../../../src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

describe('Global Version Control Mechanism - Component Tests', () => {
  let headerMock = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
  let atAGlanceMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);

  const setupComponent = (accountId: string = '77', baseVersion: string | null = 'version-1') => {
    return mount(FinesAccDefendantDetailsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        FinesAccPayloadService,
        PermissionsService,
        {
          provide: GlobalStore,
          useFactory: () => {
            const store = new GlobalStore();
            store.setUserState(OPAL_USER_STATE_MOCK);
            return store;
          },
        },
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            store.setAccountState({
              account_number: 'FN12345678',
              account_id: Number(accountId),
              party_id: 'P12345',
              party_type: 'Individual',
              party_name: 'John Doe',
              base_version: baseVersion,
              business_unit_id: '77',
              business_unit_user_id: 'BU001',
              welsh_speaking: 'N',
            });
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { accountId },
              data: {
                defendantAccountHeadingData: headerMock,
              },
              fragment: 'at-a-glance',
            },
            fragment: of('at-a-glance'),
          },
        },
      ],
    }).then(({ fixture }) => {
      fixture.detectChanges();
    });
  };

  beforeEach(() => {
    headerMock = structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    atAGlanceMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);

    cy.intercept('GET', '/opal-fines-service/defendant-accounts/*/header', {
      statusCode: 200,
      body: headerMock,
    }).as('getDefendantHeader');

    cy.intercept('GET', '/opal-fines-service/defendant-accounts/*/header-summary', {
      statusCode: 200,
      body: headerMock,
    }).as('getDefendantHeaderSummary');

    cy.intercept('GET', '/opal-fines-service/defendant-accounts/*/at-a-glance', {
      statusCode: 200,
      body: atAGlanceMock,
    }).as('getAtAGlance');
  });

  describe('Version Control Tests via Fine Account inquiry', () => {
    it(
      'AC1: Warning banner will not be displayed when version control mechanism confirms account-level-data has not changed',
      { tags: ['@PO-2140'] },
      () => {
        setupComponent('77', null);

        cy.get(DOM_ELEMENTS.warningBanner).should('not.exist');
        cy.get(DOM_ELEMENTS.atAGlanceTab).should('be.visible');

        // Navigate to other tabs - warning should persist
        cy.get(DOM_ELEMENTS.defendantTab).click();
        cy.get(DOM_ELEMENTS.warningBanner).should('not.exist');

        cy.get(DOM_ELEMENTS.parentGuardianTab).click();
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
        setupComponent('77', 'version-1');

        cy.get(DOM_ELEMENTS.warningBanner).should('exist');
        cy.get(DOM_ELEMENTS.warningBanner).should('have.attr', 'type', 'warning');
        cy.get(DOM_ELEMENTS.warningBannerIcon).should('have.attr', 'type', 'warning');
        cy.get(DOM_ELEMENTS.warningBannerText).should('contain', 'Some information on this page may be out of date');
        cy.get(DOM_ELEMENTS.refreshLink).should('contain', 'Refresh').and('be.visible');

        // Navigate to other tabs - warning should persist
        cy.get(DOM_ELEMENTS.defendantTab).click();
        cy.get(DOM_ELEMENTS.warningBanner).should('exist');

        cy.get(DOM_ELEMENTS.parentGuardianTab).click();
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
        setupComponent('77', 'version-1');

        // Wait for at-a-glance to load and verify warning banner appears
        cy.wait('@getAtAGlance');
        cy.get(DOM_ELEMENTS.warningBanner).should('exist');

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
});
