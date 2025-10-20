import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsSearchOffencesComponent } from './fines-mac-offence-details-search-offences.component';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from './stores/types/fines-mac-offence-details-search-offences-store.type';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesMacOffenceDetailsSearchOffencesStore } from './stores/fines-mac-offence-details-search-offences.store';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM } from './constants/fines-mac-offence-details-search-offences-form.constant';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK } from './mocks/fines-mac-offence-details-search-offences-form.mock';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constant';

describe('FinesMacOffenceDetailsSearchOffencesComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesComponent>;
  let globalStore: GlobalStoreType;
  let finesMacOffenceDetailsSearchOffencesStore: FinesMacOffenceDetailsSearchOffencesStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesComponent);
    component = fixture.componentInstance;

    globalStore = TestBed.inject(GlobalStore);

    finesMacOffenceDetailsSearchOffencesStore = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
    finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();

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
    expect(finesMacOffenceDetailsSearchOffencesStore.searchOffences()).toEqual(
      FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM,
    );
    expect(finesMacOffenceDetailsSearchOffencesStore.unsavedChanges()).toBe(false);
    expect(finesMacOffenceDetailsSearchOffencesStore.stateChanges()).toBe(false);
    expect(globalStore.error()).toEqual({ ...GLOBAL_ERROR_STATE });
  });

  it('should call handleBeforeUnload ', () => {
    finesMacOffenceDetailsSearchOffencesStore.setStateChanges(true);
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(false);
    expect(component.handleBeforeUnload()).toBeFalsy();

    finesMacOffenceDetailsSearchOffencesStore.setStateChanges(false);
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(true);
    expect(component.handleBeforeUnload()).toBeFalsy();

    finesMacOffenceDetailsSearchOffencesStore.setStateChanges(false);
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(false);
    expect(component.handleBeforeUnload()).toBeTruthy();
  });

  it('should call canDeactivate ', () => {
    finesMacOffenceDetailsSearchOffencesStore.setSearchOffences(
      structuredClone(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK),
    );
    expect(component.canDeactivate()).toBeTruthy();

    finesMacOffenceDetailsSearchOffencesStore.setStateChanges(true);
    expect(component.canDeactivate()).toBeFalsy();

    finesMacOffenceDetailsSearchOffencesStore.setStateChanges(false);
    expect(component.canDeactivate()).toBeTruthy();
  });
});
