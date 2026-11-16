import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { FinesDraftCheckAndValidateTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-validate/fines-draft-check-and-validate-tabs/fines-draft-check-and-validate-tabs.component';
import { FinesDraftCreateAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

export type DraftAccountsJourney = 'create-and-manage' | 'check-and-validate';

export const setupDraftAccountsSourceComponent = (journey: DraftAccountsJourney, bankingInterfacesEnabled: boolean) => {
  const component =
    journey === 'create-and-manage' ? FinesDraftCreateAndManageTabsComponent : FinesDraftCheckAndValidateTabsComponent;

  return cy.then(() =>
    mount<FinesDraftCreateAndManageTabsComponent | FinesDraftCheckAndValidateTabsComponent>(component, {
      componentProperties: { activeTab: journey === 'create-and-manage' ? 'review' : 'to-review' },
      providers: [
        provideHttpClient(),
        provideRouter([]),
        OpalFines,
        DateService,
        FinesDraftStore,
        FinesMacPayloadService,
        {
          provide: GlobalStore,
          useFactory: () => {
            const store = new GlobalStore();
            store.setUserState(structuredClone(OPAL_USER_STATE_MOCK));
            store.setFeatureFlags({ 'release-1c-banking-interfaces': bankingInterfacesEnabled });
            return store;
          },
        },
      ],
    }),
  );
};
