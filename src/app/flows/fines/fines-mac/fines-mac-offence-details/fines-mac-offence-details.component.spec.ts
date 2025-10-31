import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsComponent } from './fines-mac-offence-details.component';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FinesMacOffenceDetailsStoreType } from './stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from './stores/fines-mac-offence-details.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';

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
    expect(globalStore.error()).toEqual({ ...GLOBAL_ERROR_STATE });
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
