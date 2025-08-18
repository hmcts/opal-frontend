import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccNoteAddFormComponent } from './fines-acc-note-add-form';
import { FINES_ACC_ADD_NOTE_FORM_MOCK } from '../mocks/fines-acc-add-note-form-mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IFinesAccAddNoteForm } from '../interfaces/fines-acc-note-add-form.interface';

describe('FinesAccNoteAddFormComponent', () => {
  let component: FinesAccNoteAddFormComponent;
  let fixture: ComponentFixture<FinesAccNoteAddFormComponent>;
  let formSubmit: IFinesAccAddNoteForm;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_ACC_ADD_NOTE_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesAccNoteAddFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccNoteAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
