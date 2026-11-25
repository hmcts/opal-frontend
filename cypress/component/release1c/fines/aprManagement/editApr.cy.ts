import { mount } from 'cypress/angular';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FinesAccAprAddChangeFormComponent } from 'src/app/flows/fines/fines-acc/fines-acc-apr-add-change/fines-acc-apr-add-change-form/fines-acc-apr-add-change-form.component';

describe('Change Alternate Payment Reference', () => {
  const mountChangeAprForm = (initialValue = 'EXISTING-APR-123') =>
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
        headingText: 'Change Alternate Payment Reference',
        labelText: 'Change alternate payment reference',
        initialValue,
        savedValue: initialValue,
      },
    });

  it(
    'renders the change journey with the selected APR pre-populated',
    { tags: ['@JIRA-STORY:PO-10899', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountChangeAprForm();

      cy.get('h1').should('contain', 'Change Alternate Payment Reference');
      cy.contains('141A - APR TEST 141').should('be.visible');
      cy.get('label[for="apr_text"]').should('contain', 'Change alternate payment reference');
      cy.get('#apr_text').should('have.value', 'EXISTING-APR-123');
    },
  );

  it('does not submit an empty replacement value', { tags: ['@JIRA-STORY:PO-10899', '@JIRA-EPIC:PO-7465'] }, () => {
    mountChangeAprForm().then(({ component }) => {
      const submit = cy.stub();
      component.formSubmit.subscribe(submit);

      cy.get('#apr_text').clear();
      cy.get('#apr-save').click();

      cy.get('.govuk-error-summary').should('contain', 'Enter a payment reference');
      cy.get('#apr_text-error-message').should('be.visible');
      cy.wrap(null).then(() => expect(submit).not.to.have.been.called);
    });
  });

  it(
    'rejects a replacement value longer than 18 characters and focuses the field from the error summary',
    { tags: ['@JIRA-STORY:PO-10899', '@JIRA-STORY:PO-10906', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountChangeAprForm().then(({ component }) => {
        const submit = cy.stub();
        component.formSubmit.subscribe(submit);

        cy.get('#apr_text').clear().type('1234567890123456789');
        cy.get('#apr-save').click();

        cy.get('.govuk-error-summary')
          .should('contain', 'Payment reference must be 18 characters or fewer')
          .find('a')
          .click();
        cy.focused().should('have.attr', 'id', 'apr_text');
        cy.get('#apr_text-error-message').should('be.visible');
        cy.wrap(null).then(() => expect(submit).not.to.have.been.called);
      });
    },
  );

  it(
    'submits the amended APR when the replacement value is valid',
    { tags: ['@JIRA-STORY:PO-10899', '@JIRA-EPIC:PO-7465'] },
    () => {
      mountChangeAprForm().then(({ component }) => {
        const submit = cy.stub();
        component.formSubmit.subscribe(submit);

        cy.get('#apr_text').clear().type('UPDATED-APR-456');
        cy.get('#apr-save').click();

        cy.wrap(null).then(() => {
          expect(submit).to.have.been.calledOnce;
          expect(submit.firstCall.args[0].formData.apr_text).to.equal('UPDATED-APR-456');
        });
      });
    },
  );
});
