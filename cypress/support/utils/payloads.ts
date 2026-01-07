// cypress/support/utils/payloads.ts
export type DraftPayloadType =
  | 'company'
  | 'adultOrYouthOnly'
  | 'pgToPay'
  | 'failedAdultOrYouthOnly'
  | 'failedCompany'
  | 'fixedPenalty'
  | 'fixedPenaltyCompany';

/** Defendant type options used by account creation/setup steps. */
export type DefendantTypes = 'company' | 'adultOrYouthOnly' | 'pgToPay';

export type AccountType = 'Fine' | 'Fixed penalty' | 'Fixed Penalty' | 'Conditional caution' | 'Conditional Caution';
export type ApprovedAccountType = DefendantTypes | 'fixedPenalty' | 'fixedPenaltyCompany';

/** Resolve draft fixture file name for POST /draft-accounts. Adjust names if yours differ. */
export function getDraftPayloadFile(type: DraftPayloadType): string {
  const map: Record<DraftPayloadType, string> = {
    company: 'companyPayload.json',
    adultOrYouthOnly: 'adultOrYouthOnlyPayload.json',
    pgToPay: 'parentOrGuardianPayload.json',
    failedAdultOrYouthOnly: 'failedAdultOrYouthOnlyPayload.json',
    failedCompany: 'failedCompanyPayload.json',
    fixedPenalty: 'fixedPenaltyPayload.json',
    fixedPenaltyCompany: 'fixedPenaltyCompanyPayload.json',
  };
  return map[type];
}

/** Resolve approved fixture file name for stubbed Approved listings. */
export function getApprovedPayloadFile(type: DraftPayloadType): string {
  switch (type) {
    case 'company':
    case 'fixedPenaltyCompany':
      return 'approvedCompanyPayload.json';
    case 'adultOrYouthOnly':
    case 'fixedPenalty':
      return 'approvedAccountPayload.json';
    case 'pgToPay':
      return 'approvedParentOrGuardianPayload.json';
    default:
      throw new Error(`Unsupported account type for approved stub: ${type}`);
  }
}

export { getApprovedPayloadFile as resolveApprovedPayloadFile };
