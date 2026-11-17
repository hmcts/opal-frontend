import { IFinesApiAllocateTillsTableWrapperTableData } from '../fines-api-allocate-tills-table-wrapper/interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';

export interface IFinesApiAllocateData {
  processingTotal: number;
  processingByBusinessUnit: { businessUnitName: string; count: number }[];
  tills: IFinesApiAllocateTillsTableWrapperTableData[];
}
