export interface IFinesApiAllocateTillRow {
  tillId: string;
  tillNumber: string;
  errorsDisplay: string;
  fileName: string;
  sourceLabel: string;
  amount: number | string;
  businessUnitName: string;
  processedByDisplay: string;
  dateProcessedDisplay: string;
}
