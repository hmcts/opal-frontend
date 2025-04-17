import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacComponent } from './fines-mac.component';
import { FINES_MAC_STATE_MOCK } from './mocks/fines-mac-state.mock';
import { FinesMacStoreType } from './stores/types/fines-mac-store.type';
import { FinesMacStore } from './stores/fines-mac.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';

describe('FinesMacComponent', () => {
  let component: FinesMacComponent;
  let fixture: ComponentFixture<FinesMacComponent>;
  let finesMacStore: FinesMacStoreType;
  let globalStore: GlobalStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacComponent],
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
    const destroy = spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();
    fixture.detectChanges();

    expect(destroy).toHaveBeenCalled();
    expect(finesMacStore.getFinesMacStore()).toEqual(FINES_MAC_STATE_MOCK);
    expect(globalStore.error()).toEqual({ error: false, message: '' });
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
