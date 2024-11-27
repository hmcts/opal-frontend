import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountCourtDetailsComponent } from './fines-mac-review-account-court-details.component';

xdescribe('FinesMacReviewAccountCourtDetailsComponent', () => {
  let component: FinesMacReviewAccountCourtDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountCourtDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountCourtDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountCourtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
