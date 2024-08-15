export interface IOpalFinesDefendantAccount {
  defendantAccountId: number | null;
  businessUnitId: number | null;
  accountNumber: string | null;
  imposedHearingDate: string | null;
  imposingCourtId: number | null;
  amountImposed: number | null;
  amountPaid: number | null;
  accountBalance: number | null;
  accountStatus: string | null;
  completedDate: string | null;
  enforcingCourtId: number | null;
  lastHearingCourtId: number | null;
  lastHearingDate: string | null;
  lastMovementDate: string | null;
  lastEnforcement: string | null;
  lastChangedDate: string | null;
  originatorName: string | null;
  originatorReference: string | null;
  originatorType: string | null;
  allowWriteoffs: boolean | null;
  allowCheques: boolean | null;
  chequeClearancePeriod: number | null;
  creditTransferClearancePeriod: number | null;
  enforcementOverrideResultId: string | null;
  enforcementOverrideEnforcerId: string | null;
  enforcementOverrideTfoLjaId: number | null;
  unitFineDetail: number | null;
  unitFineValue: number | null;
  collectionOrder: boolean | null;
  collectionOrderEffectiveDate: string | null;
  furtherStepsNoticeDate: string | null;
  confiscationOrderDate: string | null;
  fineRegistrationDate: string | null;
  suspendedCommittalEnforcementId: number | null;
  consolidatedAccountType: string | null;
  paymentCardRequested: boolean | null;
  paymentCardRequestedDate: string | null;
  paymentCardRequestedBy: string | null;
  prosecutorCaseReference: string | null;
  enforcementCaseStatus: string | null;
}