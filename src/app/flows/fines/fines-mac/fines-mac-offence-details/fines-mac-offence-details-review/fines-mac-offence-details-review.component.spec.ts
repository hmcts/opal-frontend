import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewComponent } from './fines-mac-offence-details-review.component';

describe('FinesMacOffenceDetailsReviewComponent', () => {
  let component: FinesMacOffenceDetailsReviewComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
