import { IOpalFinesAccountMinorCreditorCreditor } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';
import { createMinorCreditorHeaderMock } from './minor_creditor_at_a_glance.mock';

export const createMinorCreditorAmendCreditorMock = (
  includeBacsDetails = true,
): IOpalFinesAccountMinorCreditorCreditor => {
  const mock = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK);

  mock.party_details.organisation_flag = false;
  mock.party_details.organisation_details = null;
  mock.party_details.individual_details = {
    title: 'Mr',
    forenames: 'John',
    surname: 'smith',
    date_of_birth: null,
    age: null,
    national_insurance_number: null,
    individual_aliases: null,
  };
  mock.address = {
    address_line_1: '1 Test Street',
    address_line_2: 'Test Area',
    address_line_3: 'Test Town',
    address_line_4: null,
    address_line_5: null,
    postcode: 'ab1 2cd',
  };
  mock.payment = {
    pay_by_bacs: includeBacsDetails,
    hold_payment: false,
    account_name: includeBacsDetails ? 'John Smith' : '',
    sort_code: includeBacsDetails ? '112233' : '',
    account_number: includeBacsDetails ? '12345678' : '',
    account_reference: includeBacsDetails ? 'REF123' : '',
  };

  return mock;
};

export const createMinorCreditorAmendCreditorEmptyIndividualMock = (): IOpalFinesAccountMinorCreditorCreditor => {
  const mock = createMinorCreditorAmendCreditorMock(false);

  mock.party_details.individual_details = {
    title: null,
    forenames: null,
    surname: '',
    date_of_birth: null,
    age: null,
    national_insurance_number: null,
    individual_aliases: null,
  };

  return mock;
};

export const createMinorCreditorAmendCreditorEmptyCompanyMock = (): IOpalFinesAccountMinorCreditorCreditor => {
  const mock = createMinorCreditorAmendCreditorMock(false);

  mock.party_details.organisation_flag = true;
  mock.party_details.individual_details = null;
  mock.party_details.organisation_details = {
    organisation_name: '',
    organisation_aliases: null,
  };

  return mock;
};

export const createMinorCreditorAmendCompanyCreditorMock = (
  includeBacsDetails = true,
): IOpalFinesAccountMinorCreditorCreditor => {
  const mock = createMinorCreditorAmendCreditorMock(includeBacsDetails);

  mock.party_details.organisation_flag = true;
  mock.party_details.individual_details = null;
  mock.party_details.organisation_details = {
    organisation_name: 'Amend Minor Co Ltd',
    organisation_aliases: null,
  };
  mock.payment = {
    pay_by_bacs: includeBacsDetails,
    hold_payment: false,
    account_name: includeBacsDetails ? 'Amend Minor Co Ltd' : '',
    sort_code: includeBacsDetails ? '112233' : '',
    account_number: includeBacsDetails ? '12345678' : '',
    account_reference: includeBacsDetails ? 'MCREF123' : '',
  };

  return mock;
};

export const createMinorCreditorAmendHeaderMock = () => {
  const header = createMinorCreditorHeaderMock();

  header.party.organisation_flag = false;
  header.party.organisation_details = undefined;
  header.party.individual_details = {
    title: 'Mr',
    forenames: 'John',
    surname: 'smith',
  };

  return header;
};

export const buildMinorCreditorAmendPartyName = () => 'Mr John SMITH';
export const buildMinorCreditorAmendCompanyPartyName = () => 'AMEND MINOR CO LTD';
