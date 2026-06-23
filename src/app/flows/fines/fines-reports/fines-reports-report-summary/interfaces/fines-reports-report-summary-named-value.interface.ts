export interface IFinesReportsReportSummaryNamedValue {
  name: string;
  value: boolean | number | string | (number | string)[] | null | undefined;
  optional?: boolean;
}
