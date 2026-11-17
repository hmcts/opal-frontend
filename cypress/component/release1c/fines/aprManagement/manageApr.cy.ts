import { Component } from '@angular/core';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { mount } from 'cypress/angular';
import { of } from 'rxjs';
import { FinesAccAprManageComponent } from 'src/app/flows/fines/fines-acc/fines-acc-apr-manage/fines-acc-apr-manage.component';
import { IOpalFinesApr } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-apr.interface';
import { IOpalFinesAprsResponse } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-aprs-response.interface';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { transformAprsPayload } from 'src/app/flows/fines/fines-acc/services/utils/fines-acc-payload-transform-apr-data.utils';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';

@Component({ template: '<h1>Add alternate payment reference</h1>' })
class AddAprDestinationComponent {}

@Component({ template: '<h1>Change alternate payment reference</h1>' })
class ChangeAprDestinationComponent {}

@Component({ template: '<h1>Remove alternate payment reference</h1>' })
class RemoveAprDestinationComponent {}

@Component({ imports: [RouterOutlet], template: '<router-outlet />' })
class AprManageTestHostComponent {}

describe('Manage Alternate Payment References', () => {
  const manageUrl = '/fines/account/defendant/141/alternate/payment/reference/manage';
  const reference: IOpalFinesApr = {
    alternate_payment_reference_id: 11,
    defendant_account_id: 141,
    business_unit_id: 77,
    relationship: 'APR',
    category: 'APR',
    apr_text: 'CURRENT-REFERENCE',
    created_at: '2026-06-01T12:00:00Z',
    updated_at: '2026-06-02T12:00:00Z',
  };

  const mountManageApr = (references: IOpalFinesApr[], successMessage: string | null = null) => {
    const response: IOpalFinesAprsResponse = { references, version: '"7"' };
    const opalFines = { getAprs: cy.stub().returns(of(response)) };
    let message = successMessage;
    const accountStore = {
      getAccountNumber: () => '141A',
      party_name: () => 'APR TEST ACCOUNT',
      account_id: () => 141,
      aprManageReturnUrl: () => null,
      setAprManageReturnUrl: cy.stub(),
      successMessage: () => message,
      clearSuccessMessage: () => {
        message = null;
      },
    };

    return mount(AprManageTestHostComponent, {
      providers: [
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference/manage',
            component: FinesAccAprManageComponent,
            resolve: {
              aprs: (route) => opalFines.getAprs(Number(route.paramMap.get('accountId'))),
            },
          },
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference/add',
            component: AddAprDestinationComponent,
          },
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference/change',
            component: ChangeAprDestinationComponent,
          },
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference/delete',
            component: RemoveAprDestinationComponent,
          },
        ]),
        { provide: OpalFines, useValue: opalFines },
        { provide: FinesAccountStore, useValue: accountStore },
        { provide: FinesAccPayloadService, useValue: { transformAprsPayload } },
      ],
    }).then(({ fixture }) => {
      const router = fixture.debugElement.injector.get(Router);
      return router.navigateByUrl(manageUrl).then((success) => {
        expect(success).to.equal(true);
        fixture.detectChanges();
        return { fixture, opalFines, router };
      });
    });
  };

  it(
    'loads APRs for the selected account and displays current and consolidated references with their dates',
    { tags: ['@JIRA-STORY:PO-10896', '@JIRA-EPIC:PO-7465'] },
    () => {
      const consolidatedReference: IOpalFinesApr = {
        ...reference,
        alternate_payment_reference_id: 12,
        relationship: 'CONSOLIDATED',
        apr_text: 'CONSOLIDATED-REFERENCE',
      };
      mountManageApr([reference, consolidatedReference]).then(({ opalFines }) => {
        cy.wrap(opalFines.getAprs).should('have.been.calledOnceWith', 141);
        cy.get('h1').should('contain', 'Manage alternate payment references');
        cy.contains('141A - APR TEST ACCOUNT').should('be.visible');
        cy.get('#apr-current-table [data-reference-id="11"]').should('contain', 'CURRENT-REFERENCE');
        cy.get('#apr-current-table #apr-created-11').should('contain', '01 June 2026');
        cy.get('#apr-current-table #apr-updated-11').should('contain', '02 June 2026');
        cy.get('#apr-consolidated-table [data-reference-id="12"]').should('contain', 'CONSOLIDATED-REFERENCE');
      });
    },
  );

  it(
    'shows the empty states when there are no current or consolidated APRs',
    { tags: ['@JIRA-STORY:PO-10896', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountManageApr([]);

      cy.get('#apr-current-empty').should('be.visible');
      cy.get('#apr-consolidated-empty').should('be.visible');
      cy.get('#apr-current-table, #apr-consolidated-table').should('not.exist');
    },
  );

  it(
    'provides Add and Change navigation with the selected account and APR context',
    { tags: ['@JIRA-STORY:PO-10896', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountManageApr([{ ...reference, relationship: 'CONSOLIDATED' }]).then(({ router }) => {
        const navigate = cy.stub(router, 'navigate');

        cy.get('#apr-add').should('be.visible').click();
        cy.wrap(navigate).should((navigation) => {
          expect(navigation).to.have.been.calledOnce;
          const [commands, options] = navigation.firstCall.args;
          const destination = router.serializeUrl(router.createUrlTree(commands, options));
          expect(destination).to.equal('/fines/account/defendant/141/alternate/payment/reference/add');
        });
        cy.get('#apr-change-11').should(
          'have.attr',
          'href',
          '/fines/account/defendant/141/alternate/payment/reference/change?alternatePaymentReferenceId=11',
        );
        cy.get('#apr-change-11').should('contain', 'CURRENT-REFERENCE');
        cy.get('#apr-remove-11').should('not.exist');
      });
    },
  );

  it(
    'shows returned success feedback and keeps Add available for read-only consolidated account references',
    { tags: ['@JIRA-STORY:PO-10896', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountManageApr(
        [{ ...reference, category: 'ACC', relationship: 'CONSOLIDATED' }],
        'Alternate payment reference removed',
      );

      cy.get('#apr-banners-success').should('contain', 'Alternate payment reference removed');
      cy.get('#apr-add').should('be.visible');
      cy.get('#apr-current-empty').should('be.visible');
      cy.get('#apr-consolidated-empty').should('be.visible');
    },
  );
});
