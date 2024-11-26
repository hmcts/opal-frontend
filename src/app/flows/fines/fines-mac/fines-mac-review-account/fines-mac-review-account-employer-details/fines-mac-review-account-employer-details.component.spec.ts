import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountEmployerDetailsComponent } from './fines-mac-review-account-employer-details.component';

describe('FinesMacReviewAccountEmployerDetailsComponent', () => {
  let component: FinesMacReviewAccountEmployerDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountEmployerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountEmployerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountEmployerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
