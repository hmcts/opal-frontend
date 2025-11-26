// cypress/support/utils/payloads.ts
export type DefendantType = 'company' | 'adultOrYouthOnly' | 'pgToPay' | 'failedAdultOrYouthOnly' | 'failedCompany';

/** Resolve DRAFT fixture file name for POST /draft-accounts. Adjust names if yours differ. */
export function getDraftPayloadFileForAccountType(type: DefendantType): string {
  const map: Record<DefendantType, string> = {
    company: 'companyPayload.json',
    adultOrYouthOnly: 'adultOrYouthOnlyPayload.json',
    pgToPay: 'parentOrGuardianPayload.json',
    failedAdultOrYouthOnly: 'failedAdultOrYouthOnlyPayload.json',
    failedCompany: 'failedCompanyPayload.json',
  };
  return map[type];
}
