import { IFinesConSearchAccountState } from '../../consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { FinesConDefendant } from '../../types/fines-con-defendant.type';
import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-reference-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defendant-defaults.constant';

const hasValue = (value: string | boolean | null | undefined): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return value === true;
};

const hasIndividualCriteria = (formData: IFinesConSearchAccountState): boolean => {
  const individualCriteria = formData.fcon_search_account_individuals_search_criteria;

  if (!individualCriteria) {
    return false;
  }

  return Object.values(individualCriteria).some((value) => hasValue(value));
};

const hasCompanyCriteria = (formData: IFinesConSearchAccountState): boolean => {
  const companyCriteria = formData.fcon_search_account_companies_search_criteria;

  if (!companyCriteria) {
    return false;
  }

  return Object.values(companyCriteria).some((value) => hasValue(value));
};

export const buildDefendantAccountsSearchPayload = (
  formData: IFinesConSearchAccountState,
  businessUnitId: number | null,
  defendantType: FinesConDefendant,
): IOpalFinesDefendantAccountSearchParams => {
  const isCompany = defendantType === 'company';
  const businessUnitIds = businessUnitId === null ? null : [businessUnitId];

  const basePayload: IOpalFinesDefendantAccountSearchParams = {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
    consolidation_search: true,
    business_unit_ids: businessUnitIds,
    active_accounts_only: false,
  };

  if (formData.fcon_search_account_number) {
    return {
      ...basePayload,
      reference_number: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
        account_number: formData.fcon_search_account_number,
        organisation: isCompany,
      },
    };
  }

  if (formData.fcon_search_account_national_insurance_number) {
    return {
      ...basePayload,
      defendant: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
        national_insurance_number: formData.fcon_search_account_national_insurance_number,
        organisation: isCompany,
      },
    };
  }

  if (!isCompany && hasIndividualCriteria(formData) && formData.fcon_search_account_individuals_search_criteria) {
    const criteria = formData.fcon_search_account_individuals_search_criteria;

    return {
      ...basePayload,
      defendant: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
        surname: criteria.fcon_search_account_individuals_last_name,
        exact_match_surname: criteria.fcon_search_account_individuals_last_name_exact_match ?? false,
        forenames: criteria.fcon_search_account_individuals_first_names,
        exact_match_forenames: criteria.fcon_search_account_individuals_first_names_exact_match ?? false,
        include_aliases: criteria.fcon_search_account_individuals_include_aliases ?? false,
        birth_date: criteria.fcon_search_account_individuals_date_of_birth,
        address_line_1: criteria.fcon_search_account_individuals_address_line_1,
        postcode: criteria.fcon_search_account_individuals_post_code,
        organisation: false,
      },
    };
  }

  if (isCompany && hasCompanyCriteria(formData) && formData.fcon_search_account_companies_search_criteria) {
    const criteria = formData.fcon_search_account_companies_search_criteria;

    return {
      ...basePayload,
      defendant: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
        organisation_name: criteria.fcon_search_account_companies_company_name,
        exact_match_organisation_name: criteria.fcon_search_account_companies_company_name_exact_match ?? false,
        include_aliases: criteria.fcon_search_account_companies_include_aliases ?? false,
        address_line_1: criteria.fcon_search_account_companies_address_line_1,
        postcode: criteria.fcon_search_account_companies_post_code,
        organisation: true,
      },
    };
  }

  return basePayload;
};
