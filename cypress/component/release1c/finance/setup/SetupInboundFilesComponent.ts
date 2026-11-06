import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { FinesFinanceInboundFilesComponent } from 'src/app/flows/fines/fines-finance/fines-finance-inbound-files/fines-finance-inbound-files.component';
import { FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/fines-finance/mocks/fines-finance-business-unit-ref-data.mock';

/** Mounts the inbound-file page with permission-scoped reference data and live HTTP behavior. */
export const setupInboundFilesComponent = () => {
  const globalStore = {
    userState: () => ({
      business_unit_users: [
        {
          business_unit_id: 77,
          permissions: [{ permission_id: FINES_PERMISSIONS['view-interface-files'] }],
        },
      ],
    }),
    resetBannerError: () => undefined,
    setBannerError: () => undefined,
  };

  return mount(FinesFinanceInboundFilesComponent, {
    providers: [
      provideHttpClient(withInterceptors([httpErrorInterceptor, contentDigestInterceptor])),
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { data: { businessUnits: FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } } },
      },
      { provide: GlobalStore, useValue: globalStore },
      { provide: AppInsightsService, useValue: { logException: () => undefined } },
    ],
  });
};
