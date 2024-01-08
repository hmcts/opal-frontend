export interface ISearchDefendantAccount {
  accountNo: string;
  name: string;
  dateOfBirth: string;
  addressLine1: string;
  balance: number;
  court: string;
}
export interface ISearchDefendantAccounts {
  count: number;
  totalCount: number;
  cursor: number;
  pageSize: number;
  searchResults: ISearchDefendantAccount[];
}
