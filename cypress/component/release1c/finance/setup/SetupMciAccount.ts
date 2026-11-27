import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FinesMciStore } from 'src/app/flows/fines/fines-mci/stores/fines-mci.store';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { IOpalFinesAccountDefendantAtAGlance } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ManualCashInputLocators as Mci } from '../../../../shared/selectors/finance.locators';
import { MCI_CONFIRM_INDIVIDUAL_MOCK } from '../mocks/manual-cash-input-confirm-account.mock';
import { setupFinancePageComponent } from './SetupComponent';

export const MCI_CRIMINAL_URL = '/fines/manual-cash-input/create/till/payment/category/criminal';

export const mciSearchAccount = (details: IOpalFinesAccountDefendantAtAGlance) => ({
  ...structuredClone(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]),
  defendant_account_id: Number(details.defendant_account_id),
  account_number: details.account_number,
  organisation_flag: details.party_details.organisation_flag,
  organisation_name: details.party_details.organisation_details?.organisation_name ?? null,
  defendant_title: details.party_details.individual_details?.title ?? null,
  defendant_firstnames: details.party_details.individual_details?.forenames ?? null,
  defendant_surname: details.party_details.individual_details?.surname ?? null,
  birth_date: details.party_details.individual_details?.date_of_birth ?? null,
  national_insurance_number: null,
  aliases: [],
  account_balance: details.account_balance ?? null,
});

export const mciAccountHeader = (details: IOpalFinesAccountDefendantAtAGlance) => ({
  ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
  defendant_account_id: details.defendant_account_id,
  account_number: details.account_number,
  party_details: structuredClone(details.party_details),
  account_status_reference: {
    account_status_code: details.account_status_code ?? 'L',
    account_status_display_name: 'Test account status',
  },
  payment_state_summary: {
    ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.payment_state_summary,
    account_balance: details.account_balance ?? 1234.56,
  },
});

type MciAccountOptions = {
  businessUnit?: (typeof OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData)[number];
  master?: IOpalFinesAccountDefendantAtAGlance;
  otherAccounts?: IOpalFinesAccountDefendantAtAGlance[];
  configureService?: (service: OpalFines) => void;
};

/** Uses the existing finance shell and service-stub/store-alias pattern. */
export const openMciAccount = (
  details: IOpalFinesAccountDefendantAtAGlance = structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK),
  {
    businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
    master,
    otherAccounts = [],
    configureService,
  }: MciAccountOptions = {},
): void => {
  const accounts = [details, ...otherAccounts];
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });
  cy.get('@opalFines').then((service) => {
    const opalFines = service as OpalFines;
    cy.wrap(
      cy
        .stub(opalFines, 'getDefendantAccounts')
        .returns(of({ count: accounts.length, defendant_accounts: accounts.map(mciSearchAccount) })),
    ).as('getDefendantAccounts');
    const detailsForId = (id: string | number | null) => {
      const account = [...accounts, ...(master ? [master] : [])].find(
        (item) => item.defendant_account_id === String(id),
      );
      if (!account) throw new Error(`Missing synthetic account details for ID ${id}`);
      return account;
    };
    cy.wrap(cy.stub(opalFines, 'getDefendantAccountAtAGlance').callsFake((id) => of(detailsForId(id)))).as(
      'getAtAGlance',
    );
    cy.wrap(
      cy.stub(opalFines, 'getDefendantAccountHeadingData').callsFake((id) => of(mciAccountHeader(detailsForId(id)))),
    ).as('getHeader');
    cy.wrap(
      cy
        .stub(opalFines, 'getDefendantAccountMaster')
        .returns(of({ defendant_account_id: master?.defendant_account_id ?? '2' })),
    ).as('getMaster');
    cy.stub(opalFines, 'getTills').returns(of({ tills: [] }));
    configureService?.(opalFines);
  });
  cy.get('@finesMciStore').then((store) => {
    const mciStore = store as InstanceType<typeof FinesMciStore>;
    mciStore.setBusinessUnit(businessUnit);
    mciStore.ensureTill();
    mciStore.setDraftJourney('criminal');
  });
  cy.get('@financeRouter')
    .then((router) => (router as Router).navigateByUrl(`${MCI_CRIMINAL_URL}/search`))
    .should('be.true');
  if (details.party_details.organisation_flag) {
    cy.get(Mci.searchAccount.companiesTab).click();
    cy.get(Mci.searchAccount.companyName).type('Example');
  } else {
    cy.get(Mci.searchAccount.lastName).type('Example');
  }
  cy.get(Mci.searchAccount.searchButton).click();
  cy.get(Mci.searchResults.accountCheckbox(details.defendant_account_id)).check();
  cy.get(Mci.searchResults.continue).click();
  cy.get(Mci.account.page).should('be.visible');
};
