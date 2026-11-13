export interface IOpalFinesCourtFee {
  court_fee_id: number;
  court_fee_code: string;
  description: string;
  amount: number;
}

export interface IOpalFinesCourtFeesResponse {
  court_fees: IOpalFinesCourtFee[];
}
