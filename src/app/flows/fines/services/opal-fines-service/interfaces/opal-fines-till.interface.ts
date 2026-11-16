export interface IOpalFinesTill {
  till_id: number | string;
  till_number: number;
  errors: number;
  file_name?: string;
  source?: string;
  amount: number | string;
  business_unit_name: string;
  processed_by: string;
  date_processed?: string;
  payments_count?: number;
}
