export interface IOpalFinesResultRefData {
  resultId: string;
  resultTitle: string;
  resultTitleCy: string;
  resultType: string;
  active: boolean;
  impositionAllocationPriority: number | null;
  impositionCreditor: string | null;
  imposition: boolean;
  impositionCategory: string | null;
  impositionAccruing: boolean;
  enforcement: boolean;
  enforcementOverride: boolean;
  furtherEnforcementWarn: boolean;
  furtherEnforcementDisallow: boolean;
  enforcementHold: boolean;
  requiresEnforcer: boolean;
  generatesHearing: boolean;
  collectionOrder: boolean;
  extendTtpDisallow: boolean;
  extendTtpPreserveLastEnf: boolean;
  preventPaymentCard: boolean;
  listsMonies: boolean;
  resultParameters: string;
}
