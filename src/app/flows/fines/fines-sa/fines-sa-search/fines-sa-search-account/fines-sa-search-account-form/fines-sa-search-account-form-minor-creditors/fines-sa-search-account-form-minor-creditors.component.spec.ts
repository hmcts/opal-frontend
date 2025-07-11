import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaSearchAccountFormMinorCreditorsComponent } from './fines-sa-search-account-form-minor-creditors.component';

describe('FinesSaSearchAccountFormMinorCreditorsComponent', () => {
  let component: FinesSaSearchAccountFormMinorCreditorsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormMinorCreditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormMinorCreditorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormMinorCreditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
