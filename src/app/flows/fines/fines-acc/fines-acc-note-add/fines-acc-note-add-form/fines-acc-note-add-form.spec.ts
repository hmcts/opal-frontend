import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccNoteAddFormComponent } from './fines-acc-note-add-form';

describe('FinesAccNoteAddFormComponent', () => {
  let component: FinesAccNoteAddFormComponent;
  let fixture: ComponentFixture<FinesAccNoteAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccNoteAddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesAccNoteAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
