import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountAccountCommentsAndNotesComponent } from './fines-mac-review-account-account-comments-and-notes.component';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK } from '../../fines-mac-account-comments-notes/mocks/fines-mac-account-comments-notes-state.mock';

describe('FinesMacReviewAccountAccountCommentsAndNotesComponent', () => {
  let component: FinesMacReviewAccountAccountCommentsAndNotesComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountAccountCommentsAndNotesComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountAccountCommentsAndNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountAccountCommentsAndNotesComponent);
    component = fixture.componentInstance;

    component.accountCommentsAndNotes = structuredClone(FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK);

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change account comments and notes event', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChangeAccountCommentsAndNotesDetails, 'emit');

    component.changeAccountCommentsAndNotesDetails();

    expect(component.emitChangeAccountCommentsAndNotesDetails.emit).toHaveBeenCalled();
  });
});
