import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaComponent } from './fines-sa.component';
import { FinesSaStoreType } from './stores/types/fines-sa.type';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { FinesSaStore } from './stores/fines-sa.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from './fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';

describe('FinesSaComponent', () => {
  let component: FinesSaComponent;
  let fixture: ComponentFixture<FinesSaComponent>;
  let finesSaStore: FinesSaStoreType;
  let globalStore: GlobalStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaComponent);
    component = fixture.componentInstance;

    globalStore = TestBed.inject(GlobalStore);
    finesSaStore = TestBed.inject(FinesSaStore);

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
    expect(finesSaStore.searchAccount()).toEqual(FINES_SA_SEARCH_ACCOUNT_STATE);
    expect(globalStore.error()).toEqual({ ...GLOBAL_ERROR_STATE });
  });

  it('should call handleBeforeUnload ', () => {
    finesSaStore.setStateChanges(true);
    finesSaStore.setUnsavedChanges(false);
    expect(component.handleBeforeUnload()).toBeFalsy();

    finesSaStore.setStateChanges(false);
    finesSaStore.setUnsavedChanges(true);
    expect(component.handleBeforeUnload()).toBeFalsy();

    finesSaStore.setStateChanges(false);
    finesSaStore.setUnsavedChanges(false);
    expect(component.handleBeforeUnload()).toBeTruthy();
  });
});
