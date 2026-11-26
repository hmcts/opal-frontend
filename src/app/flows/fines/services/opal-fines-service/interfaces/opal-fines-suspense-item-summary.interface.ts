export interface IOpalFinesSuspenseItemSummary {
  suspense_item_id: number | null;
  suspense_item_number: string | null;
  business_unit_details: {
    business_unit_id: number;
    business_unit_name: string;
  } | null;
  created_date: string | null;
  suspense_item_type: {
    item_type: string;
    item_type_display_name: string;
  } | null;
  balance: string | null;
}
