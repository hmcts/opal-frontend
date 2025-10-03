import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccNoteAddComponent } from './fines-acc-note-add.component';

describe('FinesAccNoteAddComponent', () => {
  let component: FinesAccNoteAddComponent;
  let fixture: ComponentFixture<FinesAccNoteAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccNoteAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccNoteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
