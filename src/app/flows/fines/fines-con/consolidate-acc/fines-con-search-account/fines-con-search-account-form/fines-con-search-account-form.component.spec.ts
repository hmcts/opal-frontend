import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FinesConSearchAccountFormComponent } from './fines-con-search-account-form.component';
import { FinesConStore } from '../../../stores/fines-con.store';
import { FinesConStoreType } from '../../../stores/types/fines-con-store.type';

describe('FinesConSearchAccountFormComponent', () => {
  let component: FinesConSearchAccountFormComponent;
  let fixture: ComponentFixture<FinesConSearchAccountFormComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: { subscribe: () => {} },
      queryParams: { subscribe: () => {} },
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesConSearchAccountFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchAccountFormComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);
    component.defendantType = 'individual';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept defendantType input', () => {
    expect(component.defendantType).toBe('individual');

    component.defendantType = 'company';
    fixture.detectChanges();
    expect(component.defendantType).toBe('company');
  });

  it('should have all quick search form controls', () => {
    expect(component.form.get('fcon_search_account_number')).toBeTruthy();
  });

  it('should have individual search form controls when defendantType is individual', () => {
    component.defendantType = 'individual';
    expect(component.form.get('fcon_search_account_individuals_last_name')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_first_names')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_date_of_birth')).toBeTruthy();
  });

  it('should have company search form controls when defendantType is company', () => {
    component.defendantType = 'company';
    // Verify that the component has the basic controls created by setupSearchAccountForm
    expect(component.form.get('fcon_search_account_number')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_national_insurance_number')).toBeTruthy();
  });

  it('should call store.updateSearchAccountFormTemporary with form value when setSearchAccountTemporary is called', () => {
    spyOn(finesConStore, 'updateSearchAccountFormTemporary');
    const formValue = { fcon_search_account_number: '12345678' };
    component.form.patchValue(formValue);

    component.setSearchAccountTemporary();

    expect(finesConStore.updateSearchAccountFormTemporary).toHaveBeenCalledWith(component.form.value);
  });

  it('should reset form when clearSearchForm is called', () => {
    const formValue = { fcon_search_account_number: '12345678' };
    component.form.patchValue(formValue);
    expect(component.form.get('fcon_search_account_number')?.value).toBe('12345678');

    component.clearSearchForm();

    expect(component.form.get('fcon_search_account_number')?.value).toBeNull();
  });
});
