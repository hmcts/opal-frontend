export interface IOpalFinesAlternatePaymentReference {
  alternate_payment_reference_id: number;
  defendant_account_id: number;
  relationship: 'APR' | 'CONSOLIDATED' | 'AMALGAMATED';
  category: 'APR' | 'ACC';
  business_unit_id: number;
  apr_text: string;
  created_at: string;
  updated_at: string | null;
}

export interface IOpalFinesAlternatePaymentReferencesResponse {
  references: IOpalFinesAlternatePaymentReference[];
  version: string | null;
}

export interface IOpalFinesAlternatePaymentReferenceResponse {
  reference: IOpalFinesAlternatePaymentReference;
  version: string | null;
}
