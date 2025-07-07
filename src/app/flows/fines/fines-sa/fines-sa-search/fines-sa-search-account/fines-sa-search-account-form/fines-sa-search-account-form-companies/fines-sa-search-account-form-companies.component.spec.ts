import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaSearchAccountFormCompaniesComponent } from './fines-sa-search-account-form-companies.component';

describe('FinesSaSearchAccountFormCompaniesComponent', () => {
  let component: FinesSaSearchAccountFormCompaniesComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormCompaniesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
