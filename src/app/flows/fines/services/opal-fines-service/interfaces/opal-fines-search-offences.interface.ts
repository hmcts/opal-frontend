export interface IOpalFinesSearchOffences {
  cjs_code: string;
  date_used_from: string;
  date_used_to: string | null;
  offence_id: number;
  offence_oas: string;
  offence_oas_cy: string | null;
  offence_title: string;
  offence_title_cy: string | null;
}

export interface IOpalFinesSearchOffencesData {
  count: number;
  searchData: IOpalFinesSearchOffences[];
}
