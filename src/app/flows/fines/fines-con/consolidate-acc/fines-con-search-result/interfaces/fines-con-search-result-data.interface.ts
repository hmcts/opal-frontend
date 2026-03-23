import { IFinesConSearchResultDefendantTableWrapperTableData } from '../fines-con-search-result-defendant-table-wrapper/interfaces/fines-con-search-result-defendant-table-wrapper-table-data.interface';
import { IFinesConSearchResultAccountCheck } from './fines-con-search-result-account-check.interface';

export interface IFinesConSearchResultData {
  tableData: IFinesConSearchResultDefendantTableWrapperTableData[];
  checksByAccountId: Record<number, IFinesConSearchResultAccountCheck[]>;
}
