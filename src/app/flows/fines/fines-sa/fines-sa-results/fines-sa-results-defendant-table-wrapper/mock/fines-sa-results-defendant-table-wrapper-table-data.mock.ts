import { IFinesSaResultsDefendantTableWrapperTableData } from '../interfaces/fines-sa-results-defendant-table-wrapper-table-data.interface';

export const GENERATE_FINES_SA_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS = (
  count: number,
): IFinesSaResultsDefendantTableWrapperTableData[] =>
  Array.from({ length: count }, (_, i) => ({
    'Account ID': i + 1,
    Account: `ACC${i + 1}`,
    Name: `Surname${i + 1}, Forename${i + 1}`,
    Aliases: `Alias Surname${i + 1}, Alias Forename${i + 1}`,
    'Date of birth': '1990-01-01',
    'Address line 1': `Street ${i + 1}`,
    Postcode: `AB${i + 1} CD`,
    'NI number': `AA12345${i + 1}A`,
    'Parent or guardian': `Parent ${i + 1}`,
    'Business unit': `Unit ${i + 1}`,
    Ref: `PCR${i + 1}`,
    Enf: `Enforcement ${i + 1}`,
    Balance: i * 10,
  }));
