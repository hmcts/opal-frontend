import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router, Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { mount } from 'cypress/angular';
import { FinesConComponent } from 'src/app/flows/fines/fines-con/fines-con.component';
import { routing } from 'src/app/flows/fines/fines-con/routing/fines-con.routes';
import { FinesConStore } from 'src/app/flows/fines/fines-con/stores/fines-con.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

export const setupConsolidationJourneyComponent = (businessUnitCount = 2) => {
  const businessUnits = {
    count: businessUnitCount,
    refData: structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData.slice(0, businessUnitCount)),
  };
  // Keep production pages, deactivation guards and the journey-state guard.
  // Access checks are outside this suite; supply reference data through its resolver boundary.
  const routes: Routes = routing.map((route) => ({
    ...route,
    canActivate: route.canActivate?.filter((guard) => guard !== authGuard && guard !== routePermissionsGuard),
    resolve: route.resolve ? { ...route.resolve, businessUnits: () => structuredClone(businessUnits) } : undefined,
  }));

  return mount(FinesConComponent, {
    providers: [
      provideHttpClient(),
      provideRouter([
        { path: 'consolidation', children: routes },
        { path: 'dashboard', children: [] },
      ]),
      { provide: GlobalStore, useFactory: () => new GlobalStore() },
    ],
  }).then(({ fixture }) => {
    const router = fixture.debugElement.injector.get(Router);
    const store = fixture.debugElement.injector.get(FinesConStore);
    cy.wrap(router).as('consolidationRouter');
    cy.wrap(store).as('finesConStore');
    return router.navigateByUrl('/consolidation/select-business-unit').then(() => fixture.detectChanges());
  });
};
