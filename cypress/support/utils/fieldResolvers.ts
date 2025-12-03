import { ManualCourtFieldKey } from '../../e2e/functional/opal/actions/manual-account-creation/court-details.actions';
import { ManualEmployerFieldKey } from '../../e2e/functional/opal/actions/manual-account-creation/employer-details.actions';
import { ManualContactFieldKey } from '../../e2e/functional/opal/actions/manual-account-creation/contact-details.actions';

export type LanguagePreferenceLabel = 'Document language' | 'Hearing language';
export type OffenceFieldKey = 'Offence code' | 'Date of sentence';
export type ImpositionFieldKey = 'Result code' | 'Amount imposed' | 'Amount paid';
export type MinorCreditorFieldKey =
  | 'title'
  | 'firstNames'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'address3'
  | 'postcode'
  | 'accountName'
  | 'sortCode'
  | 'accountNumber'
  | 'paymentReference';
export type SearchFieldKey = 'Offence code' | 'Short title' | 'Act and section';
export type SearchResultColumn = 'Code' | 'Short title' | 'Act and section' | 'Used from' | 'Used to';

/**
 * Maps a section label to its logical Language preferences section.
 */
export const resolveLanguageSection = (section: string): 'Documents' | 'Court hearings' => {
  const normalized = section.toLowerCase();
  return normalized.includes('court') ? 'Court hearings' : 'Documents';
};

/**
 * Normalises a section label to the Account details language row label.
 */
export const resolveLanguageLabel = (section: string): LanguagePreferenceLabel => {
  return resolveLanguageSection(section) === 'Court hearings' ? 'Hearing language' : 'Document language';
};

/**
 * Normalises a company details label to its logical field key.
 */
export const resolveCompanyFieldKey = (field: string): 'company' | 'address1' | 'address2' | 'address3' | 'postcode' => {
  const normalized = field.toLowerCase();
  if (normalized.includes('company name')) return 'company';
  if (normalized.includes('address line 1')) return 'address1';
  if (normalized.includes('address line 2')) return 'address2';
  if (normalized.includes('address line 3')) return 'address3';
  if (normalized.includes('postcode')) return 'postcode';
  throw new Error(`Unknown company details field: ${field}`);
};

/**
 * Normalises a contact details label to its logical field key.
 */
export const resolveContactFieldKey = (field: string): ManualContactFieldKey => {
  const normalized = field.toLowerCase();

  if (normalized.includes('primary email')) return 'primaryEmail';
  if (normalized.includes('secondary email')) return 'secondaryEmail';
  if (normalized.includes('mobile')) return 'mobileNumber';
  if (normalized.includes('home')) return 'homeNumber';
  if (normalized.includes('work')) return 'workNumber';

  throw new Error(`Unknown contact details field: ${field}`);
};

/**
 * Normalises a court details label to its logical field key.
 */
export const resolveCourtFieldKey = (field: string): ManualCourtFieldKey => {
  const normalized = field.toLowerCase();

  if (normalized.includes('local justice area') || normalized.includes('sending area')) return 'lja';
  if (normalized.includes('prosecutor case reference') || normalized.includes('pcr')) return 'pcr';
  if (normalized.includes('enforcement court')) return 'enforcementCourt';

  throw new Error(`Unknown court details field: ${field}`);
};

/**
 * Normalises an employer details label to its logical field key.
 */
export const resolveEmployerFieldKey = (field: string): ManualEmployerFieldKey => {
  const normalized = field.toLowerCase();

  if (normalized.includes('employer name')) return 'employerName';
  if (normalized.includes('employee reference')) return 'employeeReference';
  if (normalized.includes('email')) return 'employerEmail';
  if (normalized.includes('telephone') || normalized.includes('phone')) return 'employerTelephone';
  if (normalized.includes('address line 1')) return 'addressLine1';
  if (normalized.includes('address line 2')) return 'addressLine2';
  if (normalized.includes('address line 3')) return 'addressLine3';
  if (normalized.includes('address line 4')) return 'addressLine4';
  if (normalized.includes('address line 5')) return 'addressLine5';
  if (normalized.includes('postcode')) return 'postcode';

  throw new Error(`Unknown employer details field: ${field}`);
};

/**
 * Resolves an offence field label to its key.
 */
export const resolveOffenceFieldKey = (label: string): OffenceFieldKey => {
  const normalized = label.toLowerCase();
  if (normalized.includes('offence code')) return 'Offence code';
  if (normalized.includes('date of sentence')) return 'Date of sentence';
  throw new Error(`Unknown offence field: ${label}`);
};

/**
 * Resolves an imposition field label to its key.
 */
export const resolveImpositionFieldKey = (label: string): ImpositionFieldKey => {
  const normalized = label.toLowerCase();
  if (normalized.includes('result code')) return 'Result code';
  if (normalized.includes('amount imposed')) return 'Amount imposed';
  if (normalized.includes('amount paid')) return 'Amount paid';
  throw new Error(`Unknown imposition field: ${label}`);
};

/**
 * Resolves a minor creditor field label to its key.
 */
export const resolveMinorCreditorFieldKey = (label: string): MinorCreditorFieldKey => {
  const normalized = label.toLowerCase();

  if (normalized.includes('title')) return 'title';
  if (normalized.includes('first name')) return 'firstNames';
  if (normalized.includes('last name')) return 'lastName';
  if (normalized.includes('company')) return 'company';
  if (normalized.includes('address line 1')) return 'address1';
  if (normalized.includes('address line 2')) return 'address2';
  if (normalized.includes('address line 3')) return 'address3';
  if (normalized.includes('postcode')) return 'postcode';
  if (normalized.includes('name on the account')) return 'accountName';
  if (normalized.includes('sort code')) return 'sortCode';
  if (normalized.includes('account number')) return 'accountNumber';
  if (normalized.includes('payment reference')) return 'paymentReference';

  throw new Error(`Unknown minor creditor field: ${label}`);
};

/**
 * Resolves an offence search field label to its key.
 */
export const resolveSearchFieldKey = (label: string): SearchFieldKey => {
  const normalized = label.toLowerCase();
  if (normalized.includes('offence code')) return 'Offence code';
  if (normalized.includes('short title')) return 'Short title';
  if (normalized.includes('act and section')) return 'Act and section';
  throw new Error(`Unknown offence search field: ${label}`);
};
