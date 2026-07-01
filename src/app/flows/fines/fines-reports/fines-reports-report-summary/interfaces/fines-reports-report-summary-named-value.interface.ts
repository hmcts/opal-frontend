export interface IFinesReportsReportSummaryNamedValue {
  name: string;
  value: boolean | number | string | unknown[] | Record<string, unknown> | null | undefined;
  optional?: boolean;
}
