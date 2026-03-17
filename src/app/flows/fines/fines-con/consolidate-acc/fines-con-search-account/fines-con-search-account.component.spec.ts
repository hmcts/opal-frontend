import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinesConSearchAccountComponent } from './fines-con-search-account.component';
import { FinesConStore } from '../../stores/fines-con.store';
import { FinesConStoreType } from '../../stores/types/fines-con-store.type';
import { FINES_CON_SEARCH_ACCOUNT_FORM_ACCOUNT_NUMBER_MOCK } from './mocks/fines-con-search-account-form-account-number.mock';
import { FinesConPayloadService } from '../../services/fines-con-payload.service';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';

describe('FinesConSearchAccountComponent', () => {
  let component: FinesConSearchAccountComponent;
  let fixture: ComponentFixture<FinesConSearchAccountComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;
  let finesConPayloadService: FinesConPayloadService;

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
    finesConPayloadService = TestBed.inject(FinesConPayloadService);
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
    const activeTabSpy = vi.spyOn(finesConStore, 'setActiveTab');
    const payloadSpy = vi.spyOn(finesConPayloadService, 'buildDefendantAccountsSearchPayload').mockReturnValue({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
      consolidation_search: true,
    });
    const emitSpy = vi.spyOn(component.searchPayload, 'emit');

    component.handleSearchAccountSubmit(FINES_CON_SEARCH_ACCOUNT_FORM_ACCOUNT_NUMBER_MOCK);
    expect(updateSpy).toHaveBeenCalledWith(FINES_CON_SEARCH_ACCOUNT_FORM_ACCOUNT_NUMBER_MOCK.formData);
    expect(setSpy).toHaveBeenCalledWith(false);
    expect(activeTabSpy).toHaveBeenCalledWith('results');
    expect(payloadSpy).toHaveBeenCalledWith(
      FINES_CON_SEARCH_ACCOUNT_FORM_ACCOUNT_NUMBER_MOCK.formData,
      finesConStore.getBusinessUnitId(),
      'individual',
    );
    expect(emitSpy).toHaveBeenCalled();
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
