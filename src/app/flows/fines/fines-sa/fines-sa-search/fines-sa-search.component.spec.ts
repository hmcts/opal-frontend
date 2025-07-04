import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaSearchComponent } from './fines-sa-search.component';
import { FinesSaStoreType } from '../stores/types/fines-sa.type';
import { FinesSaStore } from '../stores/fines-sa.store';
import { FINES_SA_SEARCH_ACCOUNT_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/mocks/fines-sa-search-account-state.mock';

describe('FinesSaSearchComponent', () => {
  let component: FinesSaSearchComponent;
  let fixture: ComponentFixture<FinesSaSearchComponent>;
  let finesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchComponent);
    component = fixture.componentInstance;

    finesSaStore = TestBed.inject(FinesSaStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call canDeactivate', () => {
    finesSaStore.setSearchAccountTemporary(FINES_SA_SEARCH_ACCOUNT_STATE_MOCK);
    expect(component.canDeactivate()).toBeFalsy();

    finesSaStore.setSearchAccount(FINES_SA_SEARCH_ACCOUNT_STATE_MOCK);
    finesSaStore.setUnsavedChanges(true);
    expect(component.canDeactivate()).toBeFalsy();

    finesSaStore.setUnsavedChanges(false);
    expect(component.canDeactivate()).toBeTruthy();
  });
});
