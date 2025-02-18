import { IFinesDraftTableWrapperTableData } from '../interfaces/fines-draft-table-wrapper-table-data.interface';

export const FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK: IFinesDraftTableWrapperTableData[] = [
  {
    Account: 'ACC1234567890',
    'Defendant id': 101,
    Defendant: 'John Doe',
    'Date of birth': '1985-06-15',
    Created: '2023-10-12T08:30:00Z',
    CreatedString: 'Today',
    'Account type': 'Individual',
    'Business unit': 'Finance',
  },
  {
    Account: 'ACC0987654321',
    'Defendant id': 202,
    Defendant: 'Jane Smith',
    'Date of birth': '1990-09-25',
    Created: '2023-10-13T09:45:00Z',
    CreatedString: 'Yesterday',
    'Account type': 'Corporate',
    'Business unit': 'Marketing',
  },
];
