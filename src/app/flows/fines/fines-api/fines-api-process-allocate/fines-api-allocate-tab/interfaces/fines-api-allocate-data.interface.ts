import { IFinesApiAllocateTillRow } from './fines-api-allocate-till-row.interface';

export interface IFinesApiAllocateData {
  processingTotal: number;
  processingByBusinessUnit: { businessUnitName: string; count: number }[];
  tills: IFinesApiAllocateTillRow[];
}
