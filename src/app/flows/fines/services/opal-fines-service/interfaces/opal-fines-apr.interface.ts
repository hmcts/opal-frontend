export interface IOpalFinesApr {
  alternate_payment_reference_id: number;
  defendant_account_id: number;
  relationship: 'APR' | 'CONSOLIDATED' | 'AMALGAMATED';
  category: 'APR' | 'ACC';
  business_unit_id: number;
  apr_text: string;
  created_at: string;
  updated_at: string | null;
}

export interface IOpalFinesAprsResponse {
  references: IOpalFinesApr[];
  version: string | null;
}

export interface IOpalFinesAprResponse {
  reference: IOpalFinesApr;
  version: string | null;
}
