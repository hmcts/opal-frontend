import { Observable } from 'rxjs';
import { IOpalFinesAccountDefendantAtAGlance } from './opal-fines-account-defendant-at-a-glance.interface';
import { IOpalFinesAccountDefendantAccountParty } from './opal-fines-account-defendant-account-party.interface';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from './opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from './opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from './opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsTabRefData } from './opal-fines-account-defendant-details-payment-terms-tab-ref-data.interface';

export interface IOpalFinesAccountDefendantDetailsTabsCache {
  'at-a-glance': Observable<IOpalFinesAccountDefendantAtAGlance>;
  defendant: Observable<IOpalFinesAccountDefendantAccountParty>;
  'payment-terms': Observable<IOpalFinesAccountDefendantDetailsPaymentTermsTabRefData>;
  enforcement: Observable<IOpalFinesAccountDefendantDetailsEnforcementTabRefData>;
  impositions: Observable<IOpalFinesAccountDefendantDetailsImpositionsTabRefData>;
  'history-and-notes': Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData>;
}
