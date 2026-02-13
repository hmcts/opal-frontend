import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinesConSearchAccountComponent } from './fines-con-search-account.component';
import { IFinesConSearchAccountForm } from './interfaces/fines-con-search-account-form.interface';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConStoreType } from '../../stores/types/fines-con-store.type';

describe('FinesConSearchAccountComponent', () => {
  let component: FinesConSearchAccountComponent;
  let fixture: ComponentFixture<FinesConSearchAccountComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    const activatedRouteSpy = {
      params: { subscribe: () => {} },
      queryParams: { subscribe: () => {} },
    };

    await TestBed.configureTestingModule({
      imports: [FinesConSearchAccountComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchAccountComponent);
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

  it('should handle search account form submission', () => {
    const updateSpy = vi.spyOn(finesConStore, 'updateSearchAccountFormTemporary');
    const setSpy = vi.spyOn(finesConStore, 'setUnsavedChanges');
    const formData: IFinesConSearchAccountForm = {
      formData: {
        fcon_search_account_number: '12345678',
        fcon_search_account_individuals_last_name: null,
        fcon_search_account_individuals_last_name_exact_match: false,
        fcon_search_account_individuals_first_names: null,
        fcon_search_account_individuals_first_names_exact_match: false,
        fcon_search_account_individuals_include_aliases: false,
        fcon_search_account_individuals_date_of_birth: null,
        fcon_search_account_individuals_national_insurance_number: null,
        fcon_search_account_individuals_address_line_1: null,
        fcon_search_account_individuals_post_code: null,
        fcon_search_account_companies_name: null,
        fcon_search_account_companies_reference_number: null,
      },
      nestedFlow: false,
    };

    component.handleSearchAccountSubmit(formData);
    expect(updateSpy).toHaveBeenCalledWith(formData.formData);
    expect(setSpy).toHaveBeenCalledWith(false);
  });

  it('should call store.setUnsavedChanges with true when handling unsaved changes true', () => {
    const setSpy = vi.spyOn(finesConStore, 'setUnsavedChanges');
    component.handleUnsavedChanges(true);

    expect(setSpy).toHaveBeenCalledWith(true);
  });

  it('should call store.setUnsavedChanges with false when handling unsaved changes false', () => {
    const setSpy = vi.spyOn(finesConStore, 'setUnsavedChanges');
    component.handleUnsavedChanges(false);

    expect(setSpy).toHaveBeenCalledWith(false);
  });

  it('should have FinesConStore injected', () => {
    expect(finesConStore).toBeTruthy();
  });
});
