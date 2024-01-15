export interface IDefendantAccountDetails {
  defendantAccountId: number;
  accountNumber: string;
  fullName: string;
  accountCT: string;
  address: string;
  postCode: string;
  dob: string;
  detailsChanged: string;
  lastCourtAppAndCourtCode: string;
  lastMovement: string;
  commentField: string[];
  pcr: string;
  paymentDetails: string;
  lumpSum: number;
  commencing: string;
  daysInDefault: number;
  sentencedDate: string;
  lastEnforcement: string;
  override: string;
  enforcer: number;
  enforcementCourt: number;
  imposed: number;
  amountPaid: number;
  balance: number;
}
