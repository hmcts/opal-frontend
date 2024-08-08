export interface IFinesSearchDefendantAccount {
  accountNo: string;
  name: string;
  dateOfBirth: string;
  addressLine1: string;
  balance: number;
  court: string;
  defendantAccountId: number;
}
export interface IFinesSearchDefendantAccounts {
  count: number;
  totalCount: number;
  cursor: number;
  pageSize: number;
  searchResults: IFinesSearchDefendantAccount[];
}
