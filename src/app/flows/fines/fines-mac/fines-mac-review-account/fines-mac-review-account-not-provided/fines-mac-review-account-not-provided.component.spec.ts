import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountNotProvidedComponent } from './fines-mac-review-account-not-provided.component';

describe('FinesMacReviewAccountNotProvidedComponent', () => {
  let component: FinesMacReviewAccountNotProvidedComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountNotProvidedComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountNotProvidedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountNotProvidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
