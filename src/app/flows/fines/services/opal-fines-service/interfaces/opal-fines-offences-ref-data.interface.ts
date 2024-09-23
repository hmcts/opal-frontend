export interface IOpalFinesOffences {
  business_unit_id: number;
  date_used_from: string;
  date_used_to: string;
  get_cjs_code: string;
  offence_id: number;
  offence_oas: string;
  offence_oas_cy: string;
  offence_title: string;
  offence_title_cy: string;
}

export interface IOpalFinesOffencesRefData {
  count: number;
  refData: IOpalFinesOffences[];
}
