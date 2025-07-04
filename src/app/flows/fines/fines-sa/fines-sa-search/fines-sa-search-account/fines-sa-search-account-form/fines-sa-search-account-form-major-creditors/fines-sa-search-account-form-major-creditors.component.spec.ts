import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaSearchAccountFormMajorCreditorsComponent } from './fines-sa-search-account-form-major-creditors.component';

describe('FinesSaSearchAccountFormMajorCreditorsComponent', () => {
  let component: FinesSaSearchAccountFormMajorCreditorsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormMajorCreditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormMajorCreditorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormMajorCreditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
