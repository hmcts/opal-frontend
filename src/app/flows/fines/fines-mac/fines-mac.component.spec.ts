import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacComponent } from './fines-mac.component';
import { FINES_MAC_STATE_MOCK } from './mocks/fines-mac-state.mock';
import { FINES_MAC_STATE } from './constants/fines-mac-state';
import { FinesMacStoreType } from './stores/types/fines-mac-store.type';
import { FinesMacStore } from './stores/fines-mac.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacComponent', () => {
  let component: FinesMacComponent;
  let fixture: ComponentFixture<FinesMacComponent>;
  let finesMacStore: FinesMacStoreType;
  let globalStore: GlobalStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(async () => {
    mockOpalFinesService = {
      clearDraftAccountsCache: vi.fn().mockName('OpalFines.clearDraftAccountsCache'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacComponent],
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacComponent);
    component = fixture.componentInstance;

    globalStore = TestBed.inject(GlobalStore);
    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE_MOCK));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on destroy and clear state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const destroy = vi.spyOn<any, any>(component, 'ngOnDestroy');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(destroy).toHaveBeenCalled();
    expect(finesMacStore.getFinesMacStore()).toEqual(FINES_MAC_STATE);
    expect(globalStore.bannerError()).toEqual({ ...GLOBAL_ERROR_STATE });
  });

  it('should call handleBeforeUnload ', () => {
    finesMacStore.setStateChanges(true);
    finesMacStore.setUnsavedChanges(false);
    expect(component.handleBeforeUnload()).toBeFalsy();

    finesMacStore.setStateChanges(false);
    finesMacStore.setUnsavedChanges(true);
    expect(component.handleBeforeUnload()).toBeFalsy();

    finesMacStore.setStateChanges(false);
    finesMacStore.setUnsavedChanges(false);
    expect(component.handleBeforeUnload()).toBeTruthy();
  });

  it('should call canDeactivate ', () => {
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE_MOCK));
    expect(component.canDeactivate()).toBeTruthy();

    finesMacStore.setStateChanges(true);
    expect(component.canDeactivate()).toBeFalsy();

    finesMacStore.setStateChanges(false);
    expect(component.canDeactivate()).toBeTruthy();
  });
});
