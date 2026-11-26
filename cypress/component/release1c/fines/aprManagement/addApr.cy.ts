import { mount } from 'cypress/angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { NEVER, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { FinesAccAprAddChangeComponent } from 'src/app/flows/fines/fines-acc/fines-acc-apr-add-change/fines-acc-apr-add-change.component';
import { FinesAccAprAddChangeFormComponent } from 'src/app/flows/fines/fines-acc/fines-acc-apr-add-change/fines-acc-apr-add-change-form/fines-acc-apr-add-change-form.component';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';

describe('Add Alternate Payment Reference', () => {
  const addUrl = '/fines/account/defendant/141/alternate/payment/reference/add';
  const mountAddAprForm = () =>
    mount(FinesAccAprAddChangeFormComponent, {
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { parent: {}, params: of({}), queryParams: of({}), data: of({}), snapshot: { data: {} } },
        },
      ],
      componentProperties: {
        accountCaption: '141A - APR TEST 141',
        headingText: 'Add alternate payment reference',
        labelText: 'Enter payment reference',
      },
    });

  // The global error banner belongs to the app shell, outside the APR form.
  const mountAddAprPage = () =>
    mount(AppComponent, {
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference/:mode',
            component: FinesAccAprAddChangeComponent,
            resolve: { aprs: () => ({ references: [], version: '"7"' }) },
          },
        ]),
        { provide: SessionService, useValue: { getTokenExpiry: () => NEVER } },
        { provide: AppInsightsService, useValue: { logPageView: () => null, logException: () => null } },
        {
          provide: LaunchDarklyService,
          useValue: {
            initializeLaunchDarklyClient: () => null,
            initializeLaunchDarklyFlags: () => Promise.resolve(),
            initializeLaunchDarklyChangeListener: () => null,
          },
        },
        GlobalStore,
      ],
    }).then(({ fixture }) => {
      const accountStore = fixture.debugElement.injector.get(FinesAccountStore);
      accountStore.setAccountState({
        ...accountStore.getAccountState(),
        account_id: 141,
        account_number: '141A',
        party_name: 'APR TEST ACCOUNT',
        business_unit_id: '77',
        base_version: '"7"',
      });
      fixture.componentInstance.globalStore.setAuthenticated(true);
      const router = fixture.debugElement.injector.get(Router);
      cy.wrap(router).as('aprRouter');
      cy.wrap(accountStore).as('aprAccountStore');
      return router.navigateByUrl(addUrl).then((success) => {
        expect(success).to.be.true;
        fixture.detectChanges();
      });
    });

  it(
    'renders account details, the heading, payment reference field, and actions',
    { tags: ['@JIRA-STORY:PO-10897', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountAddAprForm();

      cy.get('h1').should('contain', 'Add alternate payment reference');
      cy.contains('141A - APR TEST 141').should('be.visible');
      cy.get('label[for="apr_text"]').should('contain', 'Enter payment reference');
      cy.get('#apr_text').should('be.visible');
      cy.get('#apr-save').should('be.visible').and('contain', 'Save');
      cy.get('opal-lib-govuk-cancel-link a').should('be.visible').and('contain', 'Cancel');
    },
  );

  it(
    'shows required validation in the field and error summary without submitting when blank',
    { tags: ['@JIRA-STORY:PO-10897', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountAddAprForm().then(({ component }) => {
        const submit = cy.stub();
        component.formSubmit.subscribe(submit);

        cy.get('#apr-save').click();

        cy.get('.govuk-error-summary').should('contain', 'Enter a payment reference');
        cy.get('#apr_text-error-message').should('be.visible');
        cy.wrap(null).then(() => expect(submit).not.to.have.been.called);
      });
    },
  );

  it(
    'rejects references longer than 18 characters and submits a valid 18-character value',
    { tags: ['@JIRA-STORY:PO-10897', '@JIRA-STORY:PO-10906', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountAddAprForm().then(({ component }) => {
        const submit = cy.stub();
        component.formSubmit.subscribe(submit);

        cy.get('#apr_text').type('1234567890123456789');
        cy.get('#apr-save').click();
        cy.get('.govuk-error-summary').should('be.visible');
        cy.get('#apr_text-error-message').should('contain', 'Payment reference must be 18 characters or fewer');
        cy.wrap(null).then(() => expect(submit).not.to.have.been.called);

        cy.get('#apr_text').clear().type('123456789012345678');
        cy.get('#apr-save').click();
        cy.wrap(null).then(() => {
          expect(submit).to.have.been.calledOnce;
          expect(submit.firstCall.args[0].formData.apr_text).to.equal('123456789012345678');
        });
      });
    },
  );

  it(
    'displays the backend duplicate reference error and retains the form without reporting success',
    { tags: ['@JIRA-STORY:PO-10898', '@JIRA-EPIC:PO-7465'] },
    () => {
      const title = 'Alternate Payment Reference text already exists in business unit';
      const detail = 'Alternate Payment Reference text: 141 already exists in business unit: 77';
      const operationId = 'APR-DUPLICATE-TEST';
      const errorBanner = 'div[opal-lib-moj-alert][type="error"]';

      cy.intercept('POST', '/opal-fines-service/defendant-accounts/141/alternate-payment-references', {
        statusCode: 422,
        headers: { 'Content-Type': 'application/problem+json' },
        body: { retriable: true, title, detail, operation_id: operationId },
      }).as('duplicateApr');
      mountAddAprPage();

      cy.get(errorBanner).should('not.exist');
      cy.get('#apr_text').type('141');
      cy.get('#apr-save').click();

      cy.wait('@duplicateApr').then(({ request, response }) => {
        expect(request.body).to.deep.equal({ apr_text: '141' });
        expect(request.headers['if-match']).to.equal('"7"');
        expect(response?.statusCode).to.equal(422);
      });
      cy.get(`${errorBanner} opal-lib-moj-alert-content-heading`).should('have.text', title);
      cy.get(errorBanner)
        .should('be.visible')
        .and('contain.text', detail)
        .and('contain.text', `Error code: ${operationId}`);
      cy.get('@aprRouter').its('url').should('equal', addUrl);
      cy.get('#apr_text').should('have.value', '141').and('be.enabled');
      cy.get('#apr-save').should('be.enabled');
      cy.get('@aprAccountStore').invoke('successMessage').should('be.null');
      cy.get('@aprAccountStore').invoke('base_version').should('equal', '"7"');
      cy.contains('Alternate payment reference added').should('not.exist');
    },
  );
});
