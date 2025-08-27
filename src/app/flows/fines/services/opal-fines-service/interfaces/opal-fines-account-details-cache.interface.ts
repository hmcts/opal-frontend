import { Observable } from 'rxjs';
import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from './opal-fines-account-details-at-a-glance-tab-ref-data.interface';
import { IOpalFinesAccountDetailsDefendantTabRefData } from './opal-fines-account-details-defendant-tab-ref-data.interface';
import { IOpalFinesAccountDetailsEnforcementTabRefData } from './opal-fines-account-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDetailsHistoryAndNotesTabRefData } from './opal-fines-account-details-history-and-notes-tab-ref-data.interface';
import { IOpalFinesAccountDetailsImpositionsTabRefData } from './opal-fines-account-details-impositions-tab-ref-data.interface';
import { IOpalFinesAccountDetailsPaymentTermsTabRefData } from './opal-fines-account-details-payment-terms-tab-ref-data.interface';

export interface IOpalFinesAccountDetailsTabsData {
  'at-a-glance': Observable<IOpalFinesAccountDetailsAtAGlanceTabRefData> | null;
  defendant: Observable<IOpalFinesAccountDetailsDefendantTabRefData> | null;
  'payment-terms': Observable<IOpalFinesAccountDetailsPaymentTermsTabRefData> | null;
  enforcement: Observable<IOpalFinesAccountDetailsEnforcementTabRefData> | null;
  impositions: Observable<IOpalFinesAccountDetailsImpositionsTabRefData> | null;
  'history-and-notes': Observable<IOpalFinesAccountDetailsHistoryAndNotesTabRefData> | null;
}
