import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountAccountCommentsAndNotesComponent } from './fines-mac-review-account-account-comments-and-notes.component';

xdescribe('FinesMacReviewAccountAccountCommentsAndNotesComponent', () => {
  let component: FinesMacReviewAccountAccountCommentsAndNotesComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountAccountCommentsAndNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountAccountCommentsAndNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountAccountCommentsAndNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
