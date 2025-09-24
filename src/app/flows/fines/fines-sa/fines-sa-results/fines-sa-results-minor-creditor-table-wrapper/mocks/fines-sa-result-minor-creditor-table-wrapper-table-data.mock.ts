import { IFinesSaResultsMinorCreditorTableWrapperTableData } from '../interfaces/fines-sa-results-minor-creditor-table-wrapper-table-data.interface';

export const GENERATE_FINES_SA_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_MOCKS = (
  count: number,
): IFinesSaResultsMinorCreditorTableWrapperTableData[] =>
  Array.from({ length: count }, (_, i) => ({
    'Creditor account id': `creditor-account-id-${i}`,
    Account: `account-${i}`,
    Name: `name-${i}`,
    'Address line 1': `address-line-1-${i}`,
    Postcode: `postcode-${i}`,
    'Business unit': `business-unit-${i}`,
    'Defendant account id': `defendant-account-id-${i}`,
    Defendant: `defendant-${i}`,
    Balance: i * 10,
  }));
