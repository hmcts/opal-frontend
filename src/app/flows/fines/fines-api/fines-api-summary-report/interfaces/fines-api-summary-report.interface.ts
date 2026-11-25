import { IFinesApiSummaryField } from './fines-api-summary-field.interface';
import { IFinesApiSummarySection } from './fines-api-summary-section.interface';

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
