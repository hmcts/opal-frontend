import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinesConSearchAccountFormComponent } from './fines-con-search-account-form.component';
import { FinesConStore } from '../../../stores/fines-con.store';
import { FinesConStoreType } from '../../../stores/types/fines-con-store.type';

describe('FinesConSearchAccountFormComponent', () => {
  let component: FinesConSearchAccountFormComponent;
  let fixture: ComponentFixture<FinesConSearchAccountFormComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    const activatedRouteSpy = {
      params: { subscribe: () => {} },
      queryParams: { subscribe: () => {} },
    };

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

  it('should have individuals nested search group when defendantType is individual', () => {
    component.defendantType = 'individual';
    expect(component.form.get('fcon_search_account_individuals_search_criteria')).toBeTruthy();
  });

  it('should have company search form controls when defendantType is company', () => {
    component.defendantType = 'company';
    // Verify that the component has the basic controls created by setupSearchAccountForm
    expect(component.form.get('fcon_search_account_number')).toBeTruthy();
    expect(component.form.get('fcon_search_account_national_insurance_number')).toBeTruthy();
  });

  it('should call store.updateSearchAccountFormTemporary with form value when setSearchAccountTemporary is called', () => {
    const updateSpy = vi.spyOn(finesConStore, 'updateSearchAccountFormTemporary');
    const formValue = { fcon_search_account_number: '12345678' };
    component.form.patchValue(formValue);

    component.setSearchAccountTemporary();

    expect(updateSpy).toHaveBeenCalledWith(component.form.value);
  });

  it('should persist form state to store on ngOnDestroy', () => {
    const updateSpy = vi.spyOn(finesConStore, 'updateSearchAccountFormTemporary');
    component.form.patchValue({ fcon_search_account_number: '12345678' });

    component.ngOnDestroy();

    expect(updateSpy).toHaveBeenCalledWith(component.form.value);
  });

  it('should reset form when clearSearchForm is called', () => {
    const formValue = { fcon_search_account_number: '12345678' };
    component.form.patchValue(formValue);
    expect(component.form.get('fcon_search_account_number')?.value).toBe('12345678');

    component.clearSearchForm(new Event('click'));

    expect(component.form.get('fcon_search_account_number')?.value).toBeNull();
  });
});
