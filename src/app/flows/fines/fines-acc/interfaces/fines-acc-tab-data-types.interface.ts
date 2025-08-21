import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from "@services/fines/opal-fines-service/interfaces/opal-fines-account-details-tab-ref-data.interface";
import { Observable } from "rxjs";

export interface IFinesAccountDetailsTabsData{
    'at-a-glance': Observable<IOpalFinesAccountDetailsAtAGlanceTabRefData> | null;
  }