import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-at-a-glance-tab-ref-data.interface';
import { IOpalFinesAccountDetailsDefendantTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-defendant-tab-ref-data.interface';
import { IOpalFinesAccountDetailsEnforcementTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-enforcement-tab-ref-data.interface';
import { IOpalFinesAccountDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-history-and-notes-tab-ref-data.interface';
import { IOpalFinesAccountDetailsImpositionsTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-impositions-tab-ref-data.interface';
import { IOpalFinesAccountDetailsPaymentTermsTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-payment-terms-tab-ref-data.interface';
import { Observable } from 'rxjs';

export interface IFinesAccountDetailsTab<T> {
  title: string;
  data: Observable<T> | null;
}

export interface IFinesAccountDetailsTabs {
  'at-a-glance': IFinesAccountDetailsTab<IOpalFinesAccountDetailsAtAGlanceTabRefData>;
  defendant: IFinesAccountDetailsTab<IOpalFinesAccountDetailsDefendantTabRefData>;
  'payment-terms': IFinesAccountDetailsTab<IOpalFinesAccountDetailsPaymentTermsTabRefData>;
  enforcement: IFinesAccountDetailsTab<IOpalFinesAccountDetailsEnforcementTabRefData>;
  impositions: IFinesAccountDetailsTab<IOpalFinesAccountDetailsImpositionsTabRefData>;
  'history-and-notes': IFinesAccountDetailsTab<IOpalFinesAccountDetailsHistoryAndNotesTabRefData>;
}
