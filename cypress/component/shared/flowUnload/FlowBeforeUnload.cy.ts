import { Router } from '@angular/router';
import { FinesAecComponent } from 'src/app/flows/fines/fines-aec/fines-aec.component';
import { FinesDraftComponent } from 'src/app/flows/fines/fines-draft/fines-draft.component';
import { FinesDraftCreateAndManageComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage.component';
import { FinesDraftCheckAndValidateComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-validate/fines-draft-check-and-validate.component';
import { FinesFinanceComponent } from 'src/app/flows/fines/fines-finance/fines-finance.component';
import { FinesReportsComponent } from 'src/app/flows/fines/fines-reports/fines-reports.component';
import { AccountDetailsNotesLocators as L } from '../../../shared/selectors/account-details/account.notes.details.locators';
import { setupFlowUnloadComponent } from './setup/SetupComponent';

const buildTags = (...tags: string[]): string[] => [...tags, '@JIRA-EPIC:PO-8248', '@JIRA-LABEL:flow-unload'];

const expectUnloadPrevented = (prevented: boolean) =>
  cy.window().then((window) => {
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented, 'browser unload prevented').to.equal(prevented);
  });

[
  { name: 'Automatic enforcement configuration', component: FinesAecComponent },
  { name: 'Draft accounts', component: FinesDraftComponent },
  { name: 'Create and manage draft accounts', component: FinesDraftCreateAndManageComponent },
  { name: 'Check and validate draft accounts', component: FinesDraftCheckAndValidateComponent },
  { name: 'Finance', component: FinesFinanceComponent },
  { name: 'Reports', component: FinesReportsComponent },
].forEach(({ name, component }) => {
  describe(`${name} wrapper browser unload contract`, () => {
    it('protects edits only while the form is active', { tags: buildTags('@JIRA-DEFECT:PO-11122') }, () => {
      setupFlowUnloadComponent(component, '/details');
      cy.get(L.componentRoot).should('not.exist');
      expectUnloadPrevented(false);

      cy.get<Router>('@flowRouter').then((router) => router.navigateByUrl('/form'));
      cy.get(L.fields.noteTextArea).should('have.value', '');
      expectUnloadPrevented(false);

      cy.get(L.fields.noteTextArea).type('Unsaved automation note');
      expectUnloadPrevented(true);
      cy.get(L.fields.noteTextArea).should('have.value', 'Unsaved automation note');

      // This harness deliberately has no router guard: test that the shell checks
      // its current outlet rather than retaining a reference to a previous form.
      cy.get<Router>('@flowRouter').then((router) => router.navigateByUrl('/details'));
      cy.get(L.componentRoot).should('not.exist');
      expectUnloadPrevented(false);
    });
  });
});
