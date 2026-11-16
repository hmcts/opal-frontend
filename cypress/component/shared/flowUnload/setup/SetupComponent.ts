import { Type } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { mount } from 'cypress/angular';
import { FinesAccNoteAddComponent } from 'src/app/flows/fines/fines-acc/fines-acc-note-add/fines-acc-note-add.component';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { MOCK_FINES_ACCOUNT_STATE } from 'src/app/flows/fines/fines-acc/mocks/fines-acc-state.mock';

// Use one real form for every shell to exercise the outlet/unsaved-change contract.
// These are test routes, not the production journeys of the individual flows.
export const setupFlowUnloadComponent = (wrapper: Type<unknown>, path = '/form') =>
  mount(wrapper, {
    providers: [
      provideHttpClient(),
      provideRouter([
        { path: 'form', component: FinesAccNoteAddComponent },
        { path: 'details', children: [] },
      ]),
      FinesAccPayloadService,
      {
        provide: FinesAccountStore,
        useFactory: () => {
          const store = new FinesAccountStore();
          store.setAccountState(structuredClone(MOCK_FINES_ACCOUNT_STATE));
          return store;
        },
      },
    ],
  }).then(({ fixture }) => {
    const router = fixture.debugElement.injector.get(Router);
    cy.wrap(router).as('flowRouter');
    return router.navigateByUrl(path).then(() => fixture.detectChanges());
  });
