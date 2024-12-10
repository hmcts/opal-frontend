import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountNotProvidedComponent } from './fines-mac-review-account-not-provided.component';

describe('FinesMacReviewAccountNotProvidedComponent', () => {
  let component: FinesMacReviewAccountNotProvidedComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountNotProvidedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountNotProvidedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountNotProvidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
