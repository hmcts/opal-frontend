import { mount } from 'cypress/angular';
import { ActivatedRoute } from '@angular/router';
import { AccountDetailsNotesLocators as L } from '../../../shared/selectors/account-details/account.notes.details.locators';
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
    party_id: '67890',
    pg_party_id: '12345',
    account_number: '123456789A',
    party_name: 'Mr John, Peter DOE',
    base_version: '1',
    account_id: 12345,
    business_unit_id: '77',
    business_unit_user_id: 'test.user',
    welsh_speaking: null,
  };

  const setupComponent = () => {
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
    });
  };

  it('should render the component', () => {
    setupComponent();

    cy.get(L.componentRoot).should('exist');
  });

  it('(AC.2) should load all elements on the screen correctly', { tags: ['@PO-771', '@807', '@809'] }, () => {
    setupComponent();

    cy.get(L.header).should('contain', 'Add account note');
    cy.get(L.headerCaption).should('contain', '123456789A - Mr John, Peter DOE');
    cy.get(L.fields.noteTextArea).should('exist');
    cy.get(L.fields.noteTextArea).should('have.attr', 'maxlength', '1000');
    cy.get(L.fields.noteTextArea).should('be.enabled');
    cy.get(L.actions.saveNoteButton).should('contain', 'Save note');
    cy.get(L.actions.cancelLink).should('exist');
  });

  it('(AC2a,2b) should have character limits for account notes', { tags: ['@PO-771', '@807', '@809'] }, () => {
    setupComponent();

    cy.get(L.fields.noteTextArea).should('have.attr', 'maxlength', '1000');
    cy.get(L.fields.noteTextArea).clear().type('a'.repeat(1000), { delay: 0 });
    cy.get(L.fields.noteTextArea).should('have.value', 'a'.repeat(1000));
    cy.get(L.fields.noteCharCountMessage).should('contain', 'You have 0 characters remaining');

    cy.get(L.fields.noteTextArea).clear().type('a'.repeat(10), { delay: 0 });
    cy.get(L.fields.noteTextArea).should('have.value', 'a'.repeat(10));
    cy.get(L.fields.noteCharCountMessage).should('contain', 'You have 990 characters remaining');
  });

  //Note: For AC3a, AC3ai, AC3aii the maximum character limit is 1000. So, entering 1000 characters should show 0 characters remaining.more than 1000 characters doesn't allow to type.

  it(
    '(AC.3a, 3ai, 3aii, 3d) click submit button after reaching character limit',
    { tags: ['@PO-771', '@807', '@809'] },
    () => {
      setupComponent();
      cy.get(L.fields.noteTextArea).clear().type('a'.repeat(1001), { delay: 0 });
      cy.get(L.fields.noteTextArea).should('have.value', 'a'.repeat(1000));
      cy.get(L.fields.noteCharCountMessage).should('contain', 'You have 0 characters remaining');
      cy.get(L.actions.saveNoteButton).click();
    },
  );

  it(
    '(AC.3b, 3bi, 3bii) click submit button after entering non-alphanumeric characters shows an error',
    { tags: ['@PO-771', '@807', '@809'] },
    () => {
      setupComponent();
      cy.get(L.fields.noteTextArea).clear().type('Test @#$%^&*()');
      cy.get(L.actions.saveNoteButton).click();
      // page header error summary
      cy.get(L.fields.noteErrorMessage).should(
        'contain',
        'Account note must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      );
      cy.get(L.errorSummaryBody)
        .find('a')
        .should(
          'contain',
          'Account note must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
        );
    },
  );

  it(
    '(AC.3c, 3ci, 3cii)click submit without entering data shows an error',
    { tags: ['@PO-771', '@807', '@809'] },
    () => {
      setupComponent();
      cy.get(L.fields.noteTextArea).clear();
      cy.get(L.actions.saveNoteButton).click();
      cy.get(L.fields.noteErrorMessage).should('contain', 'Add account note or click cancel to return');
      cy.get(L.errorSummaryBody).find('a').should('contain', 'Add account note or click cancel to return');
    },
  );

  it('(AC.4c, 4ci, 4cii)click submit button after entering valid data', { tags: ['@PO-771', '@807', '@809'] }, () => {
    setupComponent();
    cy.get(L.fields.noteTextArea).clear().type('a'.repeat(10), { delay: 0 });
    cy.intercept('POST', '**/opal-fines-service/notes/add', { statusCode: 200 }).as('addNote');
    cy.get(L.actions.saveNoteButton).click();
    cy.wait('@addNote').then((interception) => {
      expect(interception.request.body).to.have.nested.property('activity_note.note_text', 'aaaaaaaaaa');
      expect(interception.request.body).to.have.nested.property('activity_note.note_type', 'AA');
      expect(interception.request.body).to.have.nested.property(
        'activity_note.record_id',
        mockFinesAccountStore.account_id,
      );
      expect(interception.request.body).to.have.nested.property('activity_note.record_type', 'DEFENDANT_ACCOUNTS');
    });
  });
});
