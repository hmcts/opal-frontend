export interface IOpalFinesTillSummary {
  till_id: number | string;
  till_number: number;
  errors?: number | null;
  file_name?: string | null;
  source?: string | null;
  amount: number | string;
  business_unit_name: string;
  processed_by: string;
  date_processed?: string | null;
}
