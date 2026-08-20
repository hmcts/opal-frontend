import { describe, expect, it } from 'vitest';
import { FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS } from '../fines-mac/fines-mac-company-details/constants/fines-mac-company-details-field-errors.constant';
import { FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS } from '../fines-mac/fines-mac-employer-details/constants/fines-mac-employer-details-field-errors.constant';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_ERRORS } from '../fines-mac/fines-mac-offence-details/fines-mac-offence-details-minor-creditor/constants/fines-mac-offence-details-minor-creditor-field-errors.constant';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FIELD_ERRORS } from '../fines-mac/fines-mac-parent-guardian-details/constants/fines-mac-parent-guardian-details-field-errors.constant';
import { FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS } from '../fines-mac/fines-mac-personal-details/constants/fines-mac-personal-details-field-errors.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS } from '../fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-companies/constants/fines-sa-search-account-form-companies-field-errors.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS } from '../fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-field-errors.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_FIELD_ERRORS } from '../fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/constants/fines-sa-search-account-form-minor-creditors-field-errors.constant';

type FieldErrors = Record<string, Record<string, { message?: string }>>;

const addressLineMessage = (addressLine: number): string =>
  'Address line ' +
  addressLine +
  ' must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)';

const getAddressLineMessages = (fieldErrors: unknown): string[] =>
  Object.values(fieldErrors as FieldErrors)
    .flatMap((fieldError) => Object.values(fieldError))
    .flatMap(({ message }) =>
      message?.startsWith('Address line') && message.includes('must only include') ? [message] : [],
    );

const fieldErrorCases: ReadonlyArray<[string, unknown, readonly number[]]> = [
  ['personal details', FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS, [1, 2, 3]],
  ['employer details', FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS, [1, 2, 3, 4, 5]],
  ['company details', FINES_MAC_COMPANY_DETAILS_FIELD_ERRORS, [1, 2, 3]],
  ['parent or guardian details', FINES_MAC_PARENT_GUARDIAN_DETAILS_FIELD_ERRORS, [1, 2, 3]],
  ['minor creditor details', FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FIELD_ERRORS, [1, 2, 3]],
  ['company account search', FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS, [1]],
  ['individual account search', FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS, [1]],
  ['minor creditor account search', FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_FIELD_ERRORS, [1, 1]],
];

describe('address line field errors', () => {
  it.each(fieldErrorCases)('uses the updated copy for %s', (_name, fieldErrors, addressLines) => {
    expect(getAddressLineMessages(fieldErrors)).toEqual(addressLines.map(addressLineMessage));
  });
});
