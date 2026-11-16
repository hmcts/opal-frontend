import { mount } from 'cypress/angular';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FinesAccAprAddChangeFormComponent } from 'src/app/flows/fines/fines-acc/fines-acc-apr-add-change/fines-acc-apr-add-change-form/fines-acc-apr-add-change-form.component';

describe('Add Alternate Payment Reference', () => {
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
        headingText: 'Add Alternate Payment Reference',
        labelText: 'Enter payment reference',
      },
    });

  it(
    'renders account details, the heading, payment reference field, and actions',
    { tags: ['@JIRA-STORY:PO-10897', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountAddAprForm();

      cy.get('h1').should('contain', 'Add Alternate Payment Reference');
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
    { tags: ['@JIRA-STORY:PO-10897', '@JIRA-EPIC:PO-7465'] },
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
});
