// TODO(PO-9797): Confirm the history/notes fields and bare-array response with the backend contract.
export interface IOpalFinesSuspenseItemHistoryEntry {
  posted_date: string;
  description: string;
  amount: number | null;
  balance: number | null;
  notes: string | null;
}
