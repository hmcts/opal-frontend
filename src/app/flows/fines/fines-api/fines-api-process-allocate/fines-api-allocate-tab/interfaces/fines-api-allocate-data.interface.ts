export interface IFinesApiAllocateTillRow {
  tillId: string;
  tillNumber: string;
  errorsDisplay: string;
  fileName: string;
  sourceLabel: string;
  amountDisplay: string;
  businessUnitName: string;
  processedByDisplay: string;
  dateProcessedDisplay: string;
}

export interface IFinesApiAllocateData {
  processingTotal: number;
  processingByBusinessUnit: { businessUnitName: string; count: number }[];
  tills: IFinesApiAllocateTillRow[];
}
