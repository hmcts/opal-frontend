export interface IFinesApiSummaryField {
  label: string;
  value: string;
}

export interface IFinesApiSummarySection {
  id: string;
  heading: string;
  columns: string[];
  rows: string[][];
  total: string;
}

export interface IFinesApiSummaryReport {
  isTill: boolean;
  title: string;
  fileDetails: IFinesApiSummaryField[];
  records: IFinesApiSummaryField[];
  breakdown: { label: string; number: number; value: string }[];
  sections: IFinesApiSummarySection[];
  errors: { court: IFinesApiSummaryField[]; defendant: IFinesApiSummaryField[] }[];
  errorSuspenseTotal: string;
  ignoredTotal: string;
}
