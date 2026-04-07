export type FinesConSearchResultAccountCheckSeverity = 'error' | 'warning';

export interface IFinesConSearchResultAccountCheck {
  reference: string;
  severity: FinesConSearchResultAccountCheckSeverity;
  message: string;
}
