import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_CON_SEARCH_ACCOUNT_STATE } from '../../consolidate-acc/fines-con-search-account/constants/fines-con-search-account-state.constant';
import { IFinesConSearchAccountState } from '../../consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { buildDefendantAccountsSearchPayload } from './fines-con-payload-build-defendant-accounts-search.utils';
import { FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_ACCOUNT_NUMBER_MOCK } from './mocks/fines-con-payload-build-defendant-accounts-search-form-data-account-number.mock';
import { FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_NI_COMPANY_MOCK } from './mocks/fines-con-payload-build-defendant-accounts-search-form-data-ni-company.mock';
import { FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_INDIVIDUAL_CRITERIA_MOCK } from './mocks/fines-con-payload-build-defendant-accounts-search-form-data-individual-criteria.mock';
import { FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_COMPANY_CRITERIA_MOCK } from './mocks/fines-con-payload-build-defendant-accounts-search-form-data-company-criteria.mock';
import { FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_COMPANY_EMPTY_CRITERIA_MOCK } from './mocks/fines-con-payload-build-defendant-accounts-search-form-data-company-empty-criteria.mock';
import { FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_NULL_INDIVIDUAL_CRITERIA_MOCK } from './mocks/fines-con-payload-build-defendant-accounts-search-form-data-null-individual-criteria.mock';
import { FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_NULL_COMPANY_CRITERIA_MOCK } from './mocks/fines-con-payload-build-defendant-accounts-search-form-data-null-company-criteria.mock';

describe('buildDefendantAccountsSearchPayload', () => {
  let formData: IFinesConSearchAccountState;

  beforeEach(() => {
    formData = structuredClone(FINES_CON_SEARCH_ACCOUNT_STATE);
  });

  it('should build account-number payload for individual defendant', () => {
    formData = structuredClone(FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_ACCOUNT_NUMBER_MOCK);

    const payload = buildDefendantAccountsSearchPayload(formData, 101, 'individual');

    expect(payload.consolidation_search).toBe(true);
    expect(payload.business_unit_ids).toEqual([101]);
    expect(payload.reference_number).toEqual(
      expect.objectContaining({
        account_number: 'ACC123',
        organisation: false,
      }),
    );
    expect(payload.defendant).toBeNull();
  });

  it('should build national-insurance payload for company defendant', () => {
    formData = structuredClone(FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_NI_COMPANY_MOCK);

    const payload = buildDefendantAccountsSearchPayload(formData, 202, 'company');

    expect(payload.business_unit_ids).toEqual([202]);
    expect(payload.defendant).toEqual(
      expect.objectContaining({
        national_insurance_number: 'QQ123456C',
        organisation: true,
      }),
    );
    expect(payload.reference_number).toBeNull();
  });

  it('should build individual-criteria payload when individual criteria are present', () => {
    formData = structuredClone(FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_INDIVIDUAL_CRITERIA_MOCK);

    const payload = buildDefendantAccountsSearchPayload(formData, null, 'individual');

    expect(payload.business_unit_ids).toBeNull();
    expect(payload.defendant).toEqual(
      expect.objectContaining({
        surname: 'Smith',
        forenames: 'Jane',
        include_aliases: true,
        birth_date: '1990-01-01',
        address_line_1: '1 Main Street',
        postcode: 'AB1 2CD',
        organisation: false,
      }),
    );
  });

  it('should build company-criteria payload when company criteria are present', () => {
    formData = structuredClone(FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_COMPANY_CRITERIA_MOCK);

    const payload = buildDefendantAccountsSearchPayload(formData, 303, 'company');

    expect(payload.business_unit_ids).toEqual([303]);
    expect(payload.defendant).toEqual(
      expect.objectContaining({
        organisation_name: 'Acme Ltd',
        include_aliases: true,
        address_line_1: '20 Market Road',
        postcode: 'ZZ1 1ZZ',
        organisation: true,
      }),
    );
  });

  it('should return base payload when no usable criteria values are provided', () => {
    formData = structuredClone(FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_COMPANY_EMPTY_CRITERIA_MOCK);

    const payload = buildDefendantAccountsSearchPayload(formData, null, 'company');

    expect(payload).toEqual(
      expect.objectContaining({
        consolidation_search: true,
        active_accounts_only: false,
        business_unit_ids: null,
        reference_number: null,
        defendant: null,
      }),
    );
  });

  it('should return base payload when individual criteria is null', () => {
    formData = structuredClone(
      FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_NULL_INDIVIDUAL_CRITERIA_MOCK,
    );

    const payload = buildDefendantAccountsSearchPayload(formData, 404, 'individual');

    expect(payload).toEqual(
      expect.objectContaining({
        business_unit_ids: [404],
        reference_number: null,
        defendant: null,
      }),
    );
  });

  it('should return base payload when company criteria is null', () => {
    formData = structuredClone(FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_NULL_COMPANY_CRITERIA_MOCK);

    const payload = buildDefendantAccountsSearchPayload(formData, 505, 'company');

    expect(payload).toEqual(
      expect.objectContaining({
        business_unit_ids: [505],
        reference_number: null,
        defendant: null,
      }),
    );
  });
});
