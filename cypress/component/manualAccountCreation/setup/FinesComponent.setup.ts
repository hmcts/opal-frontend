import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { mount } from 'cypress/angular';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FinesMacComponent } from 'src/app/flows/fines/fines-mac/fines-mac.component';
import { routing } from 'src/app/flows/fines/fines-mac/routing/fines-mac.routes';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { IFinesComponentProperties } from './FinesComponent.interface';

export const setupFinesMacComponent = (finesComponentProperties: IFinesComponentProperties) => {
  cy.then(() => {
    mount(FinesMacComponent, {
      providers: [
        provideHttpClient(),
        provideRouter([...routing]),
        OpalFines,
        UtilsService,
        FinesMacPayloadService,
        GlobalStore,
        FinesMacStore,
        {
          provide: FinesDraftStore,
          useFactory: () => {
            let store = new FinesDraftStore();
            store.setChecker(finesComponentProperties.isCheckerUser);
            return store;
          },
        },
      ],
    }).then(({ fixture }) => {
      const router = fixture.debugElement.injector.get(Router);

      const originalNavigate = router.navigate.bind(router);

      cy.stub(router, 'navigate')
        .as('routerNavigate')
        .callsFake((commands, extras) => {
          if (Array.isArray(commands) && commands[0] === '/access-denied') {
            return Promise.resolve(true);
          }
          return originalNavigate(commands, extras);
        });

      return router.navigate([`${finesComponentProperties.componentUrl}`]).then((success) => {
        expect(success).to.be.true;
        fixture.detectChanges();
      });
    });
  });
};
