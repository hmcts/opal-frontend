import { Observable } from 'rxjs';
import { IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData } from './opal-fines-account-defendant-details-at-a-glance-tab-ref-data.interface';
import { IOpalFinesAccountDefendantAccountParty } from './opal-fines-account-defendant-account-party.interface';
import { IOpalFinesAccountDefendantDetailsEnforcementTabRefData } from './opal-fines-account-defendant-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from './opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from './opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { IOpalFinesAccountDefendantDetailsPaymentTermsTabRefData } from './opal-fines-account-defendant-details-payment-terms-tab-ref-data.interface';

export interface IOpalFinesAccountDefendantDetailsTabsData {
  'at-a-glance': Observable<IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData> | null;
  defendant: Observable<IOpalFinesAccountDefendantAccountParty> | null;
  'payment-terms': Observable<IOpalFinesAccountDefendantDetailsPaymentTermsTabRefData> | null;
  enforcement: Observable<IOpalFinesAccountDefendantDetailsEnforcementTabRefData> | null;
  impositions: Observable<IOpalFinesAccountDefendantDetailsImpositionsTabRefData> | null;
  'history-and-notes': Observable<IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData> | null;
}
