import { Routes } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { REDIRECT_TO_SSO } from '@hmcts/opal-frontend-common/guards/auth';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { routing } from 'src/app/flows/fines/fines-acc/routing/fines-acc.routes';
import {
  USER_STATE_MOCK_PERMISSION_BU77,
  USER_STATE_MOCK_NO_PERMISSION,
} from '../../CommonIntercepts/CommonUserState.mocks';
import { AccountConvertLocators } from 'cypress/shared/selectors/account-details/account.convert.locators';
import { AccountDefendantDetailsLocators } from 'cypress/shared/selectors/account-details/account.defendant.details.locators';
import { DOM_ELEMENTS } from 'cypress/shared/selectors/account-enquiry/account.enquiry.view-details.locators';
import {
  interceptAtAGlance,
  interceptDefendantDetails,
  interceptDefendantHeader,
  interceptPutDefendantAccountParty,
} from './intercept/defendantAccountIntercepts';
import { setupAccountEnquiryComponent } from './setup/SetupComponent';
import { buildSeededAccountStore, buildSeededGlobalStore } from './setup/SeededStores';
import {
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_ORG_MOCK,
  DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK,
} from './mocks/defendant_details_mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from './mocks/defendant_details_at_glance_mock';
import { VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK } from '../viewAndAmendDefendant/mocks/view-and-amend-defendant-company-full.mock';
import { VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK } from '../viewAndAmendDefendant/mocks/view-and-amend-defendant-individual-full.mock';

const finesAccountRoutes: Routes = [
  {
    path: 'fines/account',
    children: routing.filter((route) => route.path !== 'account'),
  },
];

const setupConvertRoute = ({
  targetPath,
  headerMock,
  partyMock,
  userState = USER_STATE_MOCK_PERMISSION_BU77,
}: {
  targetPath: string;
  headerMock:
    | typeof DEFENDANT_HEADER_MOCK
    | typeof DEFENDANT_HEADER_ORG_MOCK
    | typeof DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK;
  partyMock: typeof VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK | typeof VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK;
  userState?: typeof USER_STATE_MOCK_PERMISSION_BU77 | typeof USER_STATE_MOCK_NO_PERMISSION;
}) => {
  const accountId = Number(headerMock.defendant_account_id);

  interceptDefendantHeader(accountId, headerMock, String(1));
  interceptDefendantDetails(accountId, partyMock, String(1));
  interceptAtAGlance(accountId, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, String(1));

  setupAccountEnquiryComponent({
    accountId: String(accountId),
    fragments: undefined,
    interceptedRoutes: [],
    routerConfig: finesAccountRoutes,
    targetPath,
    globalStoreFactory: () => buildSeededGlobalStore(userState),
    finesAccountStoreFactory: () => buildSeededAccountStore(accountId),
    additionalProviders: [
      {
        provide: AuthService,
        useValue: {
          checkAuthenticated: () => of(true),
        },
      },
      {
        provide: REDIRECT_TO_SSO,
        useValue: cy.stub().as('redirectToSso'),
      },
      {
        provide: OpalUserService,
        useValue: {
          getLoggedInUserState: () => of(userState),
        },
      },
    ],
  });
};

describe('Account Enquiry - Convert Account', { tags: ['@JIRA-EPIC:PO-1970', '@JIRA-LABEL:account-enquiry'] }, () => {
  describe('Convert To Company', { tags: [''] }, () => {
    it.only(
      'Convert link should not be visible for parent or guardian accounts',
      { tags: ['@JIRA-STORY:PO-1942'] },
      () => {
        let partyMock = structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK);
        partyMock.defendant_account_party.is_debtor = false; // Set to non-debtor to simulate parent/guardian scenario
        setupConvertRoute({
          targetPath: '/fines/account/defendant/77/details#defendant',
          headerMock: structuredClone(DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK),
          partyMock: partyMock,
        });

        cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/details#defendant');
        cy.get(AccountDefendantDetailsLocators.actions.convertActionLink).should('not.exist');
      },
    );
    it.only('Convert link should be visible for adult or youth accounts', { tags: ['@JIRA-STORY:PO-1942'] }, () => {
      setupConvertRoute({
        targetPath: '/fines/account/defendant/77/details#defendant',
        headerMock: structuredClone(DEFENDANT_HEADER_MOCK),
        partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK),
      });

      cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/details#defendant');
      cy.get(AccountDefendantDetailsLocators.actions.convertActionLink)
        .should('exist')
        .and('contain.text', 'Convert to a company account');
    });
    it(
      'renders the confirmation screen for an individual defendant and continues to the convert form',
      { tags: ['@JIRA-STORY:PO-1943'] },
      () => {
        setupConvertRoute({
          targetPath: '/fines/account/defendant/77/convert/company',
          headerMock: structuredClone(DEFENDANT_HEADER_MOCK),
          partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK),
        });

        cy.get(AccountConvertLocators.page.heading).should(
          'contain.text',
          'Are you sure you want to convert this account to a company account?',
        );
        cy.get(AccountConvertLocators.page.caption).should('contain.text', '177A - Mr Anna GRAHAM');
        cy.get(AccountConvertLocators.page.warningText).should(
          'contain.text',
          'Certain data related to individual accounts, such as employment details, will be removed.',
        );

        cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/convert/company');

        cy.get(AccountConvertLocators.page.confirmButton).click();

        cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/party/company/convert');
        cy.get(DOM_ELEMENTS.pageTitle).should('contain.text', 'Company details');
        cy.get(DOM_ELEMENTS.organisationNameInput).should('exist');
      },
    );

    it(
      'submits the company convert form with the expected API payload structure',
      { tags: ['@JIRA-STORY:PO-1953'] },
      () => {
        interceptPutDefendantAccountParty(77, VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK);

        setupConvertRoute({
          targetPath: '/fines/account/defendant/77/convert/company',
          headerMock: structuredClone(DEFENDANT_HEADER_MOCK),
          partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK),
        });

        cy.get(AccountConvertLocators.page.confirmButton).click();
        cy.get(DOM_ELEMENTS.organisationNameInput).type('Converted Co Ltd');
        cy.get(DOM_ELEMENTS.submitButton).click();

        cy.wait('@putDefendantAccountParty').then(({ request }) => {
          expect(request.headers['if-match']).to.equal('1');
          expect(request.headers['business-unit-id']).to.equal('77');
          expect(request.body).to.deep.include({
            defendant_account_party_type: 'Defendant',
            is_debtor: true,
          });
          expect(request.body.party_details).to.deep.equal({
            party_id: 'PTY-1001',
            organisation_flag: true,
            organisation_details: {
              organisation_name: 'Converted Co Ltd',
              organisation_aliases: null,
            },
            individual_details: null,
          });
          expect(request.body.address).to.deep.include({
            address_line_1: '123 Test Street',
            address_line_2: 'Second Floor',
            address_line_3: 'City Center',
            postcode: 'TE5T 1NG',
          });
          expect(request.body.contact_details).to.deep.include({
            primary_email_address: 'john@example.com',
            secondary_email_address: 'john.doe@secondary.com',
            mobile_telephone_number: '07123456789',
            home_telephone_number: '01234567890',
            work_telephone_number: '02087654321',
          });
          expect(request.body.vehicle_details).to.deep.equal({
            vehicle_registration: 'ABC123',
            vehicle_make_and_model: 'Toyota Corolla',
          });
          expect(request.body.employer_details).to.deep.equal(null);
        });

        cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/details#defendant');
      },
    );
  });

  describe('Convert To Individual', { tags: [''] }, () => {
    it.only('convert link should be visible for company accounts', { tags: ['@JIRA-STORY:PO-1955'] }, () => {
      setupConvertRoute({
        targetPath: '/fines/account/defendant/77/details#defendant',
        headerMock: structuredClone(DEFENDANT_HEADER_ORG_MOCK),
        partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK),
      });
      cy.get(AccountDefendantDetailsLocators.actions.convertActionLink)
        .should('exist')
        .and('contain.text', 'Convert to an individual account');
    });

    it(
      'renders the confirmation screen for a company account and supports cancel',
      { tags: ['@JIRA-STORY:PO-1956'] },
      () => {
        setupConvertRoute({
          targetPath: '/fines/account/defendant/77/convert/individual',
          headerMock: structuredClone(DEFENDANT_HEADER_ORG_MOCK),
          partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK),
        });

        cy.get(AccountConvertLocators.page.heading).should(
          'contain.text',
          'Are you sure you want to convert this account to an individual account?',
        );
        cy.get(AccountConvertLocators.page.caption).should('contain.text', '177A - Sainsco');
        cy.get(AccountConvertLocators.page.warningText).should(
          'contain.text',
          'Some information specific to company accounts, such as company name, will be removed.',
        );

        cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/convert/individual');

        cy.get(AccountConvertLocators.page.cancelLink).click();

        cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/details#defendant');
      },
    );

    it(
      'renders the convert form with company data mapped into shared fields',
      { tags: ['@JIRA-STORY:PO-1956'] },
      () => {
        setupConvertRoute({
          targetPath: '/fines/account/defendant/77/convert/individual',
          headerMock: structuredClone(DEFENDANT_HEADER_ORG_MOCK),
          partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK),
        });

        cy.get(AccountConvertLocators.page.confirmButton).click();

        cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/party/individual/convert');
        cy.get(DOM_ELEMENTS.pageTitle).should('contain.text', 'Defendant details');
        cy.get(DOM_ELEMENTS.titleSelect).should('exist');
        cy.get(DOM_ELEMENTS.forenamesInput).should('have.value', '');
        cy.get(DOM_ELEMENTS.surnameInput).should('have.value', '');
        cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'EC2Y 8DS');
        cy.get(DOM_ELEMENTS.email1Input).should('have.value', 'contact@abccorporation.co.uk');
        cy.get(DOM_ELEMENTS.businessPhoneInput).should('have.value', '02071234567');
        cy.get(DOM_ELEMENTS.organisationNameInput).should('not.exist');
      },
    );

    it(
      'submits the individual convert form with the expected API payload structure',
      { tags: ['@JIRA-STORY:PO-1957'] },
      () => {
        interceptPutDefendantAccountParty(77, VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK);

        setupConvertRoute({
          targetPath: '/fines/account/defendant/77/convert/individual',
          headerMock: structuredClone(DEFENDANT_HEADER_ORG_MOCK),
          partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK),
        });

        cy.get(AccountConvertLocators.page.confirmButton).click();
        cy.get(DOM_ELEMENTS.titleSelect).select('Miss');
        cy.get(DOM_ELEMENTS.forenamesInput).type('Jamie', { delay: 0 });
        cy.get(DOM_ELEMENTS.surnameInput).type('Converted', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerCompanyInput).type('ABC Corporation', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerReferenceInput).type('EMP123', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerEmailInput).type('hr@company.com', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerPhoneInput).type('01234567890', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerAddressLine1Input).type('456 Business Park', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerAddressLine2Input).type('Suite 200', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerAddressLine3Input).type('Industrial Estate', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerAddressLine4Input).type('Business District', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerAddressLine5Input).type('Metropolitan Area', { delay: 0 });
        cy.get(DOM_ELEMENTS.employerPostcodeInput).type('BU5 1NE', { delay: 0 });
        cy.get(DOM_ELEMENTS.submitButton).click();

        cy.wait('@putDefendantAccountParty').then(({ request }) => {
          expect(request.headers['if-match']).to.equal('1');
          expect(request.headers['business-unit-id']).to.equal('77');
          expect(request.body).to.deep.include({
            defendant_account_party_type: 'Defendant',
            is_debtor: true,
          });
          expect(request.body.party_details.organisation_flag).to.equal(false);
          expect(request.body.party_details.organisation_details).to.equal(null);
          expect(request.body.party_details.party_id).to.equal('PTY-2001');
          expect(request.body.party_details.individual_details).to.deep.include({
            title: 'Miss',
            forenames: 'Jamie',
            surname: 'CONVERTED',
            date_of_birth: null,
            national_insurance_number: null,
          });
          expect(request.body.address).to.deep.include({
            address_line_1: '100 Corporate Plaza',
            address_line_2: '25th Floor',
            address_line_3: 'Financial',
            postcode: 'EC2Y 8DS',
          });
          expect(request.body.contact_details).to.deep.include({
            primary_email_address: 'contact@abccorporation.co.uk',
            secondary_email_address: 'legal@abccorporation.co.uk',
            mobile_telephone_number: '07900123456',
            home_telephone_number: '02071234567',
            work_telephone_number: '02071234567',
          });
          expect(request.body.vehicle_details).to.deep.equal({
            vehicle_registration: 'ABC123D',
            vehicle_make_and_model: 'Mercedes Sprinter',
          });
          expect(request.body.employer_details).to.deep.include({
            employer_name: 'ABC Corporation',
            employer_reference: 'EMP123',
            employer_email_address: 'hr@company.com',
            employer_telephone_number: '01234567890',
            employer_address: {
              address_line_1: '456 Business Park',
              address_line_2: 'Suite 200',
              address_line_3: 'Industrial Estate',
              address_line_4: 'Business District',
              address_line_5: 'Metropolitan Area',
              postcode: 'BU5 1NE',
            },
          });
        });

        cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/details#defendant');
      },
    );
  });

  it('redirects back to defendant details when the target conversion is unsupported', { tags: [''] }, () => {
    setupConvertRoute({
      targetPath: '/fines/account/defendant/77/convert/unsupported-target',
      headerMock: structuredClone(DEFENDANT_HEADER_MOCK),
      partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK),
    });

    cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/details#defendant');
  });

  it(
    'redirects back to defendant details when a parent or guardian account tries to convert to company',
    { tags: ['@JIRA-STORY:PO-1942'] },
    () => {
      setupConvertRoute({
        targetPath: '/fines/account/defendant/77/convert/company',
        headerMock: structuredClone(DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK),
        partyMock: structuredClone(VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK),
      });

      cy.get('@router').its('url').should('equal', '/fines/account/defendant/77/details#defendant');
    },
  );
});
