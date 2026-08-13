import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsSearchOffencesResultsComponent } from './fines-mac-offence-details-search-offences-results.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from '../stores/types/fines-mac-offence-details-search-offences-store.type';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OPAL_FINES_SEARCH_OFFENCES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-search-offences.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IOpalFinesSearchOffencesData } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';

const createComponent = async (searchResults: IOpalFinesSearchOffencesData) => {
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
              searchResults,
            },
          },
        },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsComponent);
  const component = fixture.componentInstance;
  const finesMacOffenceDetailsSearchOffencesStore = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);

  finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();
  fixture.detectChanges();

  return {
    component,
    finesMacOffenceDetailsSearchOffencesStore,
    fixture,
  };
};

describe('FinesMacOffenceDetailsSearchOffencesResultsComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesResultsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesResultsComponent>;
  let finesMacOffenceDetailsSearchOffencesStore: FinesMacOffenceDetailsSearchOffencesStoreType;

  beforeEach(async () => {
    ({ component, finesMacOffenceDetailsSearchOffencesStore, fixture } = await createComponent(
      OPAL_FINES_SEARCH_OFFENCES_MOCK,
    ));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false from canDeactivate if there are unsaved changes', () => {
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(true);
    expect(component.canDeactivate()).toBe(false);
  });

  it('should return true from canDeactivate if there are no unsaved changes', () => {
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(false);
    expect(component.canDeactivate()).toBe(true);
  });

  it('should navigate back one level up on navigateBack', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    component.navigateBack();
    expect(routerSpy).toHaveBeenCalledWith(['..'], { relativeTo: component['activatedRoute'] });
  });
});

describe('FinesMacOffenceDetailsSearchOffencesResultsComponent when there are search results', () => {
  it('should not add the no results live region after view init', async () => {
    const { fixture: resultsFixture } = await createComponent(OPAL_FINES_SEARCH_OFFENCES_MOCK);
    vi.useFakeTimers();
    try {
      const liveRegionSelector = '.govuk-visually-hidden[role="status"]';
      const resultsTable = resultsFixture.nativeElement.querySelector(
        'app-fines-mac-offence-details-search-offences-results-table-wrapper',
      );

      expect(resultsTable).toBeTruthy();
      expect(resultsFixture.nativeElement.querySelector(liveRegionSelector)).toBeNull();

      vi.runOnlyPendingTimers();

      expect(resultsFixture.nativeElement.querySelector(liveRegionSelector)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('FinesMacOffenceDetailsSearchOffencesResultsComponent when there are no search results', () => {
  it('should add the no results live region after view init', async () => {
    vi.useFakeTimers();
    try {
      const { fixture: emptyFixture } = await createComponent({
        ...OPAL_FINES_SEARCH_OFFENCES_MOCK,
        searchData: [],
      });
      const liveRegionSelector = '.govuk-visually-hidden[role="status"]';
      const liveRegion = emptyFixture.nativeElement.querySelector(liveRegionSelector);

      expect(liveRegion).toBeTruthy();
      expect(liveRegion?.textContent?.trim()).toBe('');

      vi.runOnlyPendingTimers();

      expect(emptyFixture.nativeElement.querySelector(liveRegionSelector)?.textContent?.trim()).toBe(
        'No results found',
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
