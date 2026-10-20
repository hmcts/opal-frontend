export interface IOpalFinesTill {
  till_id: number;
  till_number: number | string;
  payments_count: number | null;
  amount: number | null;
  business_unit_name: string;
  processed_by: string | null;
  date_processed: string | null;
}
