export interface IDefendantAccountDetails {
  defendantAccountId: number;
  accountNumber: string;
  fullName: string;
  accountCT: string;
  businessUnitId: number;
  address: string;
  postCode: string;
  dob: string | null;
  detailsChanged: string;
  lastCourtAppAndCourtCode: string;
  lastMovement: string;
  commentField: string[] | null;
  pcr: string;
  paymentDetails: string | null;
  lumpSum: null | number;
  commencing: string | null;
  daysInDefault: number | null;
  sentencedDate: string | null;
  lastEnforcement: string;
  override: string;
  enforcer: number;
  enforcementCourt: number;
  imposed: number;
  amountPaid: number;
  balance: number;
}
