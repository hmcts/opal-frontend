import { IOpalFinesCache } from '../interfaces/opal-fines-cache.interface';

export const OPAL_FINES_CACHE_DEFAULTS: IOpalFinesCache = {
  courtRefDataCache$: {},
  courtDataCache$: {},
  businessUnitsCache$: null,
  businessUnitsPermissionCache$: {},
  localJusticeAreasCache$: null,
  resultsCache$: null,
  resultCache$: {},
  offenceCodesCache$: {},
  majorCreditorsCache$: {},
  draftAccountsCache$: {},
  prosecutorDataCache$: {},
  defendantAccountAtAGlanceCache$: null,
  defendantAccountPartyCache$: null,
  defendantAccountparentOrGuardianAccountPartyCache$: null,
  defendantAccountEnforcementCache$: null,
  defendantAccountImpositionsCache$: null,
  defendantAccountHistoryAndNotesCache$: null,
  defendantAccountPaymentTermsLatestCache$: null,
  defendantAccountFixedPenaltyCache$: null,
};
