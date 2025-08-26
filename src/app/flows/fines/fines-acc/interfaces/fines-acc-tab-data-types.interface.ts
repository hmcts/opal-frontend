import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-details-tab-ref-data.interface';
import { Observable } from 'rxjs';

export interface IFinesAccountDetailsTab<T> {
  title: string;
  data: Observable<T> | null;
}

export interface IFinesAccountDetailsTabs {
  'at-a-glance': IFinesAccountDetailsTab<IOpalFinesAccountDetailsAtAGlanceTabRefData>;
  'defendant': IFinesAccountDetailsTab<any>;
  'payment-terms': IFinesAccountDetailsTab<any>;
  'enforcement': IFinesAccountDetailsTab<any>;
  'impositions': IFinesAccountDetailsTab<any>;
  'history-and-notes': IFinesAccountDetailsTab<any>;
}
