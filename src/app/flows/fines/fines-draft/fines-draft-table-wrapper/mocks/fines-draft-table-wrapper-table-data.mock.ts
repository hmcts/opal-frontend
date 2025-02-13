import { IFinesDraftTableWrapperTableData } from '../interfaces/fines-draft-table-wrapper-table-data.interface';

export const FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK: IFinesDraftTableWrapperTableData[] = [
  {
    account: 'ACC1234567890',
    defendantId: 101,
    defendant: 'John Doe',
    dob: '1985-06-15',
    created: '2023-10-12T08:30:00Z',
    createdString: 'Today',
    accountType: 'Individual',
    businessUnit: 'Finance',
  },
  {
    account: 'ACC0987654321',
    defendantId: 202,
    defendant: 'Jane Smith',
    dob: '1990-09-25',
    created: '2023-10-13T09:45:00Z',
    createdString: 'Yesterday',
    accountType: 'Corporate',
    businessUnit: 'Marketing',
  },
];
