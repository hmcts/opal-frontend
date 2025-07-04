import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaSearchAccountComponent } from './fines-sa-search-account.component';
import { FinesSaStore } from '../../stores/fines-sa.store';
import { FINES_SA_ROUTING_PATHS } from '../../routing/constants/fines-sa-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FinesSaStoreType } from '../../stores/types/fines-sa.type';
import { ActivatedRoute } from '@angular/router';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MOCK } from './mocks/fines-sa-search-account-form.mock';
import { of } from 'rxjs';

describe('FinesSaSearchAccountComponent', () => {
  let component: FinesSaSearchAccountComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountComponent>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountComponent],
      providers: [{ provide: ActivatedRoute, useValue: { parent: 'search', fragment: of('individuals') } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountComponent);
    component = fixture.componentInstance;

    mockFinesSaStore = TestBed.inject(FinesSaStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submit', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const mockForm = FINES_SA_SEARCH_ACCOUNT_FORM_MOCK;

    component.handleSearchAccountSubmit(mockForm);
    expect(mockFinesSaStore.searchAccount()).toEqual(mockForm.formData);
    expect(routerSpy).toHaveBeenCalledWith(
      [`${FINES_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.root}/${FINES_SA_ROUTING_PATHS.children.results}`],
      {},
    );
  });

  it('should handle unsaved changes flag', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesSaStore.unsavedChanges()).toEqual(true);
    expect(component.stateUnsavedChanges).toBeTrue();
  });
});
