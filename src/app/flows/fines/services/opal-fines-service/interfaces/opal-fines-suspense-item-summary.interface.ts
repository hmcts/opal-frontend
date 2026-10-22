// TODO(PO-9796): Replace provisional types with the agreed API contract; field names come from the TDIA.
export interface IOpalFinesSuspenseItemSummary {
  suspense_item_id: number;
  suspense_item_number: string;
  created_date: string;
  suspense_item_type: string;
  balance: number;
}
