import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { CustomDeferredLiveRegionAnnouncement } from '@hmcts/opal-frontend-common/components/custom/custom-deferred-live-region-announcement';
import { OPAL_FINES_SEARCH_OFFENCES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-search-offences.mock';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../stores/fines-mac-offence-details-search-offences.store';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from '../stores/types/fines-mac-offence-details-search-offences-store.type';
import { FinesMacOffenceDetailsSearchOffencesResultsComponent } from './fines-mac-offence-details-search-offences-results.component';

describe('FinesMacOffenceDetailsSearchOffencesResultsComponent', () => {
  let component: FinesMacOffenceDetailsSearchOffencesResultsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsSearchOffencesResultsComponent>;
  let finesMacOffenceDetailsSearchOffencesStore: FinesMacOffenceDetailsSearchOffencesStoreType;

  const activatedRoute = {
    parent: of('search-offences'),
    snapshot: {
      data: {
        searchResults: OPAL_FINES_SEARCH_OFFENCES_MOCK,
      },
    },
  };

  beforeEach(async () => {
    activatedRoute.snapshot.data.searchResults = OPAL_FINES_SEARCH_OFFENCES_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsSearchOffencesResultsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsComponent);
    component = fixture.componentInstance;

    finesMacOffenceDetailsSearchOffencesStore = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
    finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();

    fixture.detectChanges();
  });

  const createFixtureWithNoSearchResults = (): void => {
    fixture.destroy();

    activatedRoute.snapshot.data.searchResults = {
      ...OPAL_FINES_SEARCH_OFFENCES_MOCK,
      searchData: [],
    };

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  };

  const getDeferredLiveRegionAnnouncement = () =>
    fixture.debugElement.query(By.directive(CustomDeferredLiveRegionAnnouncement));

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
  it('should display the deferred live region announcement when there are no search results', () => {
    createFixtureWithNoSearchResults();
    expect(getDeferredLiveRegionAnnouncement()).toBeTruthy();
  });

  it('should pass the no results announcement message to the deferred live region announcement', () => {
    createFixtureWithNoSearchResults();

    const announcement = getDeferredLiveRegionAnnouncement();
    const announcementComponent = announcement.componentInstance as CustomDeferredLiveRegionAnnouncement;

    expect(announcementComponent.message).toBe(component.noResultsAnnouncement);
    expect(announcementComponent.role).toBe('status');
  });

  it('should not display the deferred live region announcement when there are search results', () => {
    expect(getDeferredLiveRegionAnnouncement()).toBeNull();
  });
});
