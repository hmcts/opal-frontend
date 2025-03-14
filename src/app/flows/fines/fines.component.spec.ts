import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesComponent } from './fines.component';
import { FINES_MAC_STATE_MOCK } from '../fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacStoreType } from './fines-mac/stores/types/fines-mac-store.type';
import { FinesMacStore } from './fines-mac/stores/fines-mac.store';
import { GlobalStore, GlobalStoreType } from 'opal-frontend-common';

describe('FinesComponent', () => {
  let component: FinesComponent;
  let fixture: ComponentFixture<FinesComponent>;
  let finesMacStore: FinesMacStoreType;
  let globalStore: GlobalStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE_MOCK));

    globalStore = TestBed.inject(GlobalStore);

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
});
