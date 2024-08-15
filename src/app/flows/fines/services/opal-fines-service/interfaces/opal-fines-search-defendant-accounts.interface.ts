export interface IOpalFinesSearchDefendantAccount {
  accountNo: string;
  name: string;
  dateOfBirth: string;
  addressLine1: string;
  balance: number;
  court: string;
  defendantAccountId: number;
}
export interface IOpalFinesSearchDefendantAccounts {
  count: number;
  totalCount: number;
  cursor: number;
  pageSize: number;
  searchResults: IOpalFinesSearchDefendantAccount[];
}
