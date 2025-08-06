export type IOpalFinesAccountDetailsTabRefData =
  | IOpalFinesAccountDetailsAtAGlanceTabRefData
  | IOpalFinesAccountDetailsDefendantTabRefData;

export interface IOpalFinesAccountDetailsAtAGlanceTabRefData {
  firstname: string;
}

export interface IOpalFinesAccountDetailsDefendantTabRefData {
  surname: string;
}
