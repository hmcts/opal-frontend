import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewOffenceComponent } from './fines-mac-offence-details-review-offence.component';

describe('FinesMacOffenceDetailsReviewOffenceComponent', () => {
  let component: FinesMacOffenceDetailsReviewOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewOffenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewOffenceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewOffenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
