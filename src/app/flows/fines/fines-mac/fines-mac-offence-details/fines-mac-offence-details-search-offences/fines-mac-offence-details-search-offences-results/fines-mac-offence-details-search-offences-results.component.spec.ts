import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsSearchOffencesResultsComponent } from './fines-mac-offence-details-search-offences-results.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from '../stores/types/fines-mac-offence-details-search-offences-store.type';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../fines-mac-offence-details-search-offences-results/fines-mac-offence-details-search-offences-results-table-wrapper/mocks/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.mock';

describe('FinesMacOffenceDetailsSearchOffencesResultsComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesResultsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesResultsComponent>;
  let finesMacOffenceDetailsSearchOffencesStore: FinesMacOffenceDetailsSearchOffencesStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesResultsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('search-offences'),
            snapshot: {
              data: {
                searchResults: [FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_RESULTS_TABLE_WRAPPER_TABLE_DATA_MOCK],
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsComponent);
    component = fixture.componentInstance;

    finesMacOffenceDetailsSearchOffencesStore = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
    finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false from canDeactivate if there are unsaved changes', () => {
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(true);
    expect(component.canDeactivate()).toBeFalse();
  });

  it('should return true from canDeactivate if there are no unsaved changes', () => {
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(false);
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should navigate back one level up on navigateBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.navigateBack();
    expect(routerSpy).toHaveBeenCalledWith(['..'], { relativeTo: component['activatedRoute'] });
  });
});
