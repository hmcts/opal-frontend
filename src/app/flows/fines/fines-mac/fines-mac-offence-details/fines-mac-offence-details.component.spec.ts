import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsComponent } from './fines-mac-offence-details.component';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FinesMacOffenceDetailsStoreType } from './stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from './stores/fines-mac-offence-details.store';
import { GlobalStore, GlobalStoreType } from 'opal-frontend-common';

describe('FinesMacOffenceDetailsComponent', () => {
  let component: FinesMacOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsComponent>;
  let globalStore: GlobalStoreType;
  let finesMacStore: FinesMacStoreType;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsComponent);
    component = fixture.componentInstance;

    globalStore = TestBed.inject(GlobalStore);

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);

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
    expect(finesMacOffenceDetailsStore.offenceDetailsDraft()).toEqual([]);
    expect(globalStore.error()).toEqual({ error: false, message: '' });
  });

  it('should call canDeactivate ', () => {
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE_MOCK));
    expect(component.canDeactivate()).toBeTruthy();

    finesMacStore.setUnsavedChanges(true);
    expect(component.canDeactivate()).toBeFalsy();

    finesMacStore.setUnsavedChanges(false);
    expect(component.canDeactivate()).toBeTruthy();
  });
});
