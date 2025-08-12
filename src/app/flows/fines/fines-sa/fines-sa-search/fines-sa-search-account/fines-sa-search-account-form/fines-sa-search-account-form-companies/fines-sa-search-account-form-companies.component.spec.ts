import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaSearchAccountFormCompaniesComponent } from './fines-sa-search-account-form-companies.component';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS } from './constants/fines-sa-search-account-form-companies-controls.constant';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesSaSearchAccountFormCompaniesComponent', () => {
  let component: FinesSaSearchAccountFormCompaniesComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormCompaniesComponent],
      providers: [{ provide: ActivatedRoute, useValue: { fragment: of('companies'), parent: 'search' } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormCompaniesComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup(FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS);
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
