import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsComponent } from './fines-mac-offence-details.component';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FinesMacOffenceDetailsService } from './services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from './constants/fines-mac-offence-details-draft-state.constant';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { GlobalStoreType } from '@stores/global/types/global-store.type';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';

describe('FinesMacOffenceDetailsComponent', () => {
  let component: FinesMacOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsComponent>;
  let mockFinesMacOffenceDetailsService: FinesMacOffenceDetailsService;
  let globalStore: GlobalStoreType;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsComponent);
    component = fixture.componentInstance;

    mockFinesMacOffenceDetailsService = TestBed.inject(FinesMacOffenceDetailsService);

    globalStore = TestBed.inject(GlobalStore);

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

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
    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState).toEqual(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE,
    );
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
