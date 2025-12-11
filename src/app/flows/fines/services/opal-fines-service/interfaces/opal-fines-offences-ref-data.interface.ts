import { OffenceReferenceCommon } from './generated/opal-fines-offence-reference-common.interface';

export interface IOpalFinesOffences extends OffenceReferenceCommon {
  business_unit_id?: number | null;
  date_used_from?: string | null;
  date_used_to?: string | null;
  get_cjs_code?: string | null;
  offence_id?: number | null;
  offence_oas?: string | null;
  offence_oas_cy?: string | null;
  offence_title?: string | null;
  offence_title_cy?: string | null;
}

export interface IOpalFinesOffencesRefData {
  count: number;
  refData: IOpalFinesOffences[];
}

export interface IOpalFinesOffencesNonSnakeCase extends OffenceReferenceCommon {
  businessUnitId?: number | null;
  dateUsedFrom?: string | null;
  dateUsedTo?: string | null;
  cjsCode?: string | null;
  offenceId?: number | null;
  offenceOas?: string | null;
  offenceOasCy?: string | null;
  offenceTitle?: string | null;
  offenceTitleCy?: string | null;
}
