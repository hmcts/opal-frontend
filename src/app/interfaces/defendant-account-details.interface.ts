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
  lumpSum: null | number;
  commencing: null | string;
  daysInDefault: number;
  lastEnforcement: string;
  override: string;
  enforcer: number;
  enforcementCourt: number;
  imposed: number;
  amountPaid: number;
  balance: number;
}
