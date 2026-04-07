import { IFinesConSearchResultDefendantTableWrapperTableData } from '../interfaces/fines-con-search-result-defendant-table-wrapper-table-data.interface';

export const GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS = (
  count: number,
): IFinesConSearchResultDefendantTableWrapperTableData[] =>
  Array.from({ length: count }, (_, i) => ({
    'Account ID': i + 1,
    Account: `ACC${i + 1}`,
    Name: `SURNAME${i + 1}, Forename${i + 1}`,
    Aliases: `ALIAS${i + 1}, Alias Forename${i + 1}`,
    'Date of birth': '1990-01-01',
    'Address line 1': `Street ${i + 1}`,
    Postcode: `AB${i + 1} CD`,
    CO: i % 2 === 0 ? 'Y' : '-',
    ENF: `Enforcement ${i + 1}`,
    Balance: i * 10,
    'P/G': i % 2 === 0 ? 'Y' : '-',
    'NI number': `AA12345${i + 1}A`,
    Ref: `PCR${i + 1}`,
  }));
