export interface IOpalFinesOffences {
  business_unit_id: number;
  date_used_from: string;
  date_used_to: string | null;
  get_cjs_code: string;
  offence_id: number;
  offence_oas: string;
  offence_oas_cy: string | null;
  offence_title: string;
  offence_title_cy: string | null;
}

export interface IOpalFinesOffencesRefData {
  count: number;
  refData: IOpalFinesOffences[];
}

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
