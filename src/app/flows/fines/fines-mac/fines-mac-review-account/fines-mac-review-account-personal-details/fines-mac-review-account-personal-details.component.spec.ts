import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountPersonalDetailsComponent } from './fines-mac-review-account-personal-details.component';

describe('FinesMacReviewAccountPersonalDetailsComponent', () => {
  let component: FinesMacReviewAccountPersonalDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountPersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountPersonalDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
