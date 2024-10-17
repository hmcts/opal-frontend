export interface IFinesMacInitialPayload {
  account_type: string | null;
  defendant_type: string | null;
  originator_name: string | null;
  originator_id: string | null;
  prosecutor_case_reference: string | null;
  enforcement_court_id: string | null;
  collection_order_made: boolean | null;
  collection_order_made_today: boolean | null;
  collection_order_date: string | null;
  suspended_committal_date: string | null;
  payment_card_request: boolean | null;
  account_sentence_date: string | null; // Assuming it can be null or a string
}
