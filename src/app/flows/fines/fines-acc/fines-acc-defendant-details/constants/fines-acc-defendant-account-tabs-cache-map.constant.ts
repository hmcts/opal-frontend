import { IFinesAccDefendantAccountTabsCacheMap } from '../interfaces/fines-acc-defendant-account-tabs-cache-map.interface';

export const FINES_ACC_DEFENDANT_ACCOUNT_TABS_CACHE_MAP: IFinesAccDefendantAccountTabsCacheMap = {
  'at-a-glance': 'defendantAccountAtAGlanceCache$',
  defendant: 'defendantAccountPartyCache$',
  'parent-or-guardian': 'defendantAccountparentOrGuardianAccountPartyCache$',
  'payment-terms': 'defendantAccountPaymentTermsLatestCache$',
  enforcement: 'defendantAccountEnforcementCache$',
  impositions: 'defendantAccountImpositionsCache$',
  'history-and-notes': 'defendantAccountHistoryAndNotesCache$',
};
