export interface IOpalFinesSuspenseItemSummary {
  suspense_item_id: number;
  suspense_item_number: number;
  business_unit_details: {
    business_unit_id: number;
    business_unit_name: string;
  };
  created_date: string;
  suspense_item_type: {
    item_type: string;
    item_type_display_name: string;
  };
  balance: number;
}
