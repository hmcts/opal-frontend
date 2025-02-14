import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AbstractAccountCommentsAndNotesComponent } from './abstract-account-comments-and-notes';

class TestAbstractAccountCommentsAndNotesComponent extends AbstractAccountCommentsAndNotesComponent {
  constructor() {
    super();
  }
}

describe('AbstractAccountCommentsAndNotes', () => {
  let component: TestAbstractAccountCommentsAndNotesComponent | null;
  let fixture: ComponentFixture<TestAbstractAccountCommentsAndNotesComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractAccountCommentsAndNotesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractAccountCommentsAndNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup form with given prefix', () => {
    const prefix = 'test';
    component!['setupForm'](prefix);
    expect(component!.form.contains(`${prefix}_account_comments_notes_comments`)).toBeTrue();
    expect(component!.form.contains(`${prefix}_account_comments_notes_notes`)).toBeTrue();
  });
});
