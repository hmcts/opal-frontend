import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { mount } from 'cypress/angular';
import { FinesAccComponent } from 'src/app/flows/fines/fines-acc/fines-acc.component';
import { routing } from 'src/app/flows/fines/fines-acc/routing/fines-acc.routes';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { interceptAuthenticatedUser, interceptUserState } from './intercept/interceptUserState';
import { DEFENDANT_HEADER_MOCK, USER_STATE_MOCK_PERMISSION_BU77 } from './mocks/defendant_details_mock';
import { REDIRECT_TO_SSO } from '@hmcts/opal-frontend-common/guards/auth';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { interceptDefendantHeader } from './intercept/interceptDefendantHeader';
import { interceptAtAGlance } from './intercept/interceptAtAGlance';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-account-party.mock';
import { interceptDefendantDetails } from './intercept/interceptDefendantDetails';
import { interceptAddNotes } from './intercept/interceptAddNotes';

/**
 * Sets up and mounts the `FinesAccComponent` for Cypress component testing.
 *
 * This function configures the necessary Angular providers, stubs out authentication redirects,
 * and overrides router navigation to prevent hard redirects during tests. It then navigates to
 * the defendant details route for the specified account ID and ensures the fixture is updated.
 *
 * @param accountId - The account ID to use for navigation. Defaults to `'77'` if not provided.
 * @returns A Cypress chainable that completes after the component is mounted and navigation is performed.
 */
const setupComponent = (accountId: string | null = '77') => {
  cy.then(() => {
    mount(FinesAccComponent, {
      providers: [
        provideHttpClient(),
        // Provides the Angular Router with the application's routing configuration.
        provideRouter([...routing]),
        FinesAccPayloadService,
        OpalFines,
        PermissionsService,
        UtilsService,
        GlobalStore,
        FinesAccountStore,
        // {
        //   // prevents the auth guard from hard-redirecting the test runner
        //   provide: REDIRECT_TO_SSO,
        //   useValue: cy.stub().as('redirectToSso'),
        // },
      ],
    }).then(({ fixture }) => {
      // Get the Angular Router instance from the test fixture's injector.
      // This allows us to control and observe navigation during the test.
      const router = fixture.debugElement.injector.get(Router);

      // Save the original navigate method so we can call it for non-intercepted routes.
      const originalNavigate = router.navigate.bind(router);

      // Use Cypress to stub the router's navigate method.
      // This lets us intercept navigation attempts and control their behavior in the test.
      cy.stub(router, 'navigate')
        .as('routerNavigate') // Give the stub a name for easier reference in assertions.
        .callsFake((commands, extras) => {
          // If the navigation is trying to go to '/access-denied', intercept and resolve immediately.
          // This prevents the actual redirect during the test, allowing us to test other logic.
          const interceptedRoutes = [
            '/access-denied',
            '../note/add',
            '../debtor/individual/amend',
            '../debtor/parentGuardian/amend',
            // Add more routes here as needed
          ];
          if (Array.isArray(commands) && interceptedRoutes.includes(commands[0])) {
            return Promise.resolve(true); // Swallow the redirect, simulating a successful navigation.
          }
          // For all other routes, call the original navigate method to allow normal navigation.
          return originalNavigate(commands, extras);
        });

      // Attempt to navigate to the defendant details page using the router.
      // This triggers the stub above, which will allow this navigation to proceed normally.
      return router.navigate(['defendant', accountId, 'details']).then((success) => {
        // Assert that navigation was successful.
        expect(success).to.be.true;
        // Trigger Angular change detection to update the component state after navigation.
        fixture.detectChanges();
      });
    });
  });
};

//Needs deleting this was just an example file

// describe('Account Enquiry Component', () => {
//   it('should mount the component', { tags: ['@PO-784'] }, () => {
//     let headerMock = structuredClone(DEFENDANT_HEADER_MOCK);

//     let defendantDetailsMock = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_MOCK);
//     defendantDetailsMock.defendant_account_party.is_debtor = false;

//     interceptAddNotes();

//     interceptAuthenticatedUser();
//     interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
//     interceptDefendantHeader(1, DEFENDANT_HEADER_MOCK, '1');
//     interceptAtAGlance(1, OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, '1');
//     interceptDefendantDetails(1, defendantDetailsMock, '1');

//     setupComponent('1');
//     cy.get('router-outlet').should('exist');
//     cy.get('a').contains('Defendant').click();
//     //cy.get('a').contains('Convert to an individual account').click();

//     //cy.get('@routerNavigate').should('have.been.calledWith', ['/access-denied']);
//   });
// });
