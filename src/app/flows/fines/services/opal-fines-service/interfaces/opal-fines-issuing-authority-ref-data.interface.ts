export interface IOpalFinesIssuingAuthority {
  authority_id: number;
  authority_code: number;
  name: string;
  name_cy: string | null;
  national_authority_code: string | null;
  business_unit_id: number;
}

export interface IOpalFinesIssuingAuthorityRefData {
  count: number;
  refData: IOpalFinesIssuingAuthority[];
}
