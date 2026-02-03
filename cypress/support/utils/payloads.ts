/**
 * @file payloads.ts
 * @description Fixture payload helpers for draft account stubs.
 */
export type DraftPayloadType =
  | 'company'
  | 'adultOrYouthOnly'
  | 'pgToPay'
  | 'failedAdultOrYouthOnly'
  | 'failedCompany'
  | 'fixedPenalty'
  | 'fixedPenaltyCompany'
  | 'opalE2EAdultEn'
  | 'opalE2EAdultCy'
  | 'opalE2EAdultPgMajor'
  | 'opalE2EAdultPgMinor'
  | 'opalE2EYouthPgPay'
  | 'opalE2EYouthOnly'
  | 'opalE2ECompany'
  | 'opalE2EFixedPenaltyAdult'
  | 'opalE2EFixedPenaltyYouth'
  | 'opalE2EFixedPenaltyCompany';

/** Defendant type options used by account creation/setup steps. */
export type DefendantTypes = 'company' | 'adultOrYouthOnly' | 'pgToPay';

export type AccountType = 'Fine' | 'Fixed penalty' | 'Fixed Penalty' | 'Conditional caution' | 'Conditional Caution';
export type ApprovedAccountType = DefendantTypes | 'fixedPenalty' | 'fixedPenaltyCompany';

/**
 * Resolve draft fixture file name for POST /draft-accounts. Adjust names if yours differ.
 * @param type Draft account payload type.
 * @returns Fixture filename for the requested draft type.
 */
export function getDraftPayloadFile(type: DraftPayloadType): string {
  const map: Record<DraftPayloadType, string> = {
    company: 'companyPayload.json',
    adultOrYouthOnly: 'adultOrYouthOnlyPayload.json',
    pgToPay: 'parentOrGuardianPayload.json',
    failedAdultOrYouthOnly: 'failedAdultOrYouthOnlyPayload.json',
    failedCompany: 'failedCompanyPayload.json',
    fixedPenalty: 'fixedPenaltyPayload.json',
    fixedPenaltyCompany: 'fixedPenaltyCompanyPayload.json',
    opalE2EAdultEn: 'opalE2EAdultEnPayload.json',
    opalE2EAdultCy: 'opalE2EAdultCyPayload.json',
    opalE2EAdultPgMajor: 'opalE2EAdultPgMajorPayload.json',
    opalE2EAdultPgMinor: 'opalE2EAdultPgMinorPayload.json',
    opalE2EYouthPgPay: 'opalE2EYouthPgPayPayload.json',
    opalE2EYouthOnly: 'opalE2EYouthOnlyPayload.json',
    opalE2ECompany: 'opalE2ECompanyPayload.json',
    opalE2EFixedPenaltyAdult: 'opalE2EFixedPenaltyAdultPayload.json',
    opalE2EFixedPenaltyYouth: 'opalE2EFixedPenaltyYouthPayload.json',
    opalE2EFixedPenaltyCompany: 'opalE2EFixedPenaltyCompanyPayload.json',
  };
  return map[type];
}

/**
 * Resolve approved fixture file name for stubbed Approved listings.
 * @param type Draft account payload type.
 * @returns Fixture filename for the approved listing stub.
 */
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
