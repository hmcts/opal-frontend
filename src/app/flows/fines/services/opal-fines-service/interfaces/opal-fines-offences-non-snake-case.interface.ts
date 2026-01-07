export interface IOpalFinesOffencesNonSnakeCase {
  businessUnitId: number;
  dateUsedFrom: string;
  dateUsedTo: string | null;
  cjsCode: string;
  offenceId: number;
  offenceOas: string;
  offenceOasCy: string | null;
  offenceTitle: string;
  offenceTitleCy: string | null;
}
