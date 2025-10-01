import { mount } from 'cypress/angular';
import { ActivatedRoute } from '@angular/router';
import { DOM_ELEMENTS } from '../../manualAccountCreation/FinesMacAccountCommentsAndNotes/constants/fines-mac-account-notes-and-comments-elements';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccNoteAddComponent } from 'src/app/flows/fines/fines-acc/fines-acc-note-add/fines-acc-note-add.component';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { IFinesAccountState } from 'src/app/flows/fines/fines-acc/interfaces/fines-acc-state-interface';

describe('FinesAccNoteAddFormComponent', () => {
  let mockFinesAccountStore: IFinesAccountState = {
    party_type: 'PERSON',
    party_id: '12345',
    account_number: '123456789A',
    party_name: 'Mr John, Peter DOE',
    base_version: '1',
    account_id: 12345,
    business_unit_id: '77',
    business_unit_user_id: 'test.user',
  };

  const setupComponent = (formSubmit: any) => {
    mount(FinesAccNoteAddComponent, {
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('details'),
          },
        },
        {
          provide: OpalFines,
        },
        {
          provide: FinesAccPayloadService,
        },
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            store.setAccountState(mockFinesAccountStore);
            return store;
          },
        },
      ],
      // componentProperties: {
      //   handleAddNoteSubmit: formSubmit,
      // },
    });
  };

  it('should render the component', () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addNoteApp).should('exist');
  });

  it('(AC.2) should load all elements on the screen correctly', { tags: ['@PO-771'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.pageTitle).should('contain', 'Add account note');
    cy.get(DOM_ELEMENTS.addAccountNoteLabel).should('contain', '123456789A - Mr John, Peter DOE');
    cy.get(DOM_ELEMENTS.addNoteTextBox).should('exist');
    cy.get(DOM_ELEMENTS.addNoteTextBox).should('have.attr', 'maxlength', '1000');
    cy.get(DOM_ELEMENTS.saveNoteButton).should('contain', 'Save note');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it('(AC2a,2b) should have character limits for account notes', { tags: ['@PO-771'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.addNoteTextBox).should('have.attr', 'maxlength', '1000');
    cy.get(DOM_ELEMENTS.addNoteTextBox).clear().type('a'.repeat(1000), { delay: 0 });
    cy.get(DOM_ELEMENTS.addNoteTextBox).should('have.value', 'a'.repeat(1000));
    cy.get(DOM_ELEMENTS.characterHint).should('contain', 'You have 0 characters remaining');

    cy.get(DOM_ELEMENTS.addNoteTextBox).clear().type('a'.repeat(10), { delay: 0 });
    cy.get(DOM_ELEMENTS.addNoteTextBox).should('have.value', 'a'.repeat(10));
    cy.get(DOM_ELEMENTS.characterHint).should('contain', 'You have 990 characters remaining');
  });

  //Note: For AC3a, AC3ai, AC3aii the maximum character limit is 1000. So, entering 1000 characters should show 0 characters remaining.more than 1000 characters doesn't allow to type.

  it('(AC.3a, 3ai, 3aii, 3d) click submit button after reaching character limit', { tags: ['@PO-771'] }, () => {
    setupComponent(null);
    cy.get(DOM_ELEMENTS.addNoteTextBox).clear().type('a'.repeat(1001), { delay: 0 });
    cy.get(DOM_ELEMENTS.addNoteTextBox).should('have.value', 'a'.repeat(1000));
    cy.get(DOM_ELEMENTS.characterHint).should('contain', 'You have 0 characters remaining');
    cy.get(DOM_ELEMENTS.saveNoteButton).click();
  });

  it(
    '(AC.3b, 3bi, 3bii) click submit button after entering non-alphanumeric characters shows an error',
    { tags: ['@PO-771'] },
    () => {
      setupComponent(null);
      cy.get(DOM_ELEMENTS.addNoteTextBox).clear().type('Test @#$%^&*()');
      cy.get(DOM_ELEMENTS.saveNoteButton).click();
      cy.get(DOM_ELEMENTS.errorSummary).should(
        'contain',
        'Account note must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      );
      cy.get(DOM_ELEMENTS.errorMessage)
        .find('a')
        .should(
          'contain',
          'Account note must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
        );
    },
  );

  it('(AC.3c, 3ci, 3cii)click submit without entering data shows an error', { tags: ['@PO-771'] }, () => {
    setupComponent(null);
    cy.get(DOM_ELEMENTS.addNoteTextBox).clear();
    cy.get(DOM_ELEMENTS.saveNoteButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Add account note or click cancel to return');
    cy.get(DOM_ELEMENTS.errorMessage).find('a').should('contain', 'Add account note or click cancel to return');
  });

  it.only('(AC.4c, 4ci, 4cii)click submit button after entering valid data', { tags: ['@PO-771'] }, () => {
    const formSubmit = cy.spy().as('formSubmitSpy');
    setupComponent(null);
    cy.get(DOM_ELEMENTS.addNoteTextBox).clear().type('a'.repeat(10), { delay: 0 });

    //cy.get(DOM_ELEMENTS.errorSummary).should('not.exist');
    cy.intercept('POST', 'http://localhost:8090/opal-fines-service/notes/add', {
      statusCode: 404,
      body: {},
    }).as('addNote');
    cy.get(DOM_ELEMENTS.saveNoteButton).click();
    // cy.get('@formSubmitSpy').should('have.been.calledOnce');
    cy.wait('@addNote').then((interception) => {
      expect(interception.response?.statusCode).to.eq(404);
      expect(interception.request.body).to.have.nested.property('activity_note.note_text', 'aaaaaaaaaa');
      expect(interception.request.body).to.have.nested.property('activity_note.note_type', 'AA');
      expect(interception.request.body).to.have.nested.property('activity_note.record_id', '12345');
      expect(interception.request.body).to.have.nested.property('activity_note.record_type', 'DEFENDANT_ACCOUNTS');
    });
  });
});
