import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinesConSearchAccountComponent } from './fines-con-search-account.component';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConStoreType } from '../../stores/types/fines-con-store.type';
import { FINES_CON_SEARCH_ACCOUNT_FORM_ACCOUNT_NUMBER_MOCK } from './mocks/fines-con-search-account-form-account-number.mock';

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

    component.handleSearchAccountSubmit(FINES_CON_SEARCH_ACCOUNT_FORM_ACCOUNT_NUMBER_MOCK);
    expect(updateSpy).toHaveBeenCalledWith(FINES_CON_SEARCH_ACCOUNT_FORM_ACCOUNT_NUMBER_MOCK.formData);
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
