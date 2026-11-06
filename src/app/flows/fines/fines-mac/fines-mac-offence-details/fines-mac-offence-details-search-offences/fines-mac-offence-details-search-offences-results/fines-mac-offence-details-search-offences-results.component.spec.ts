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
import { FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent } from './fines-mac-offence-details-search-offences-results-table-wrapper/fines-mac-offence-details-search-offences-results-table-wrapper.component';

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

  const noSearchResults = {
    ...OPAL_FINES_SEARCH_OFFENCES_MOCK,
    searchData: [],
  };

  const createComponent = (searchResults = OPAL_FINES_SEARCH_OFFENCES_MOCK): void => {
    activatedRoute.snapshot.data.searchResults = searchResults;

    fixture = TestBed.createComponent(FinesMacOffenceDetailsSearchOffencesResultsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  };

  const getDeferredLiveRegionAnnouncement = () =>
    fixture.debugElement.query(By.directive(CustomDeferredLiveRegionAnnouncement));

  beforeEach(async () => {
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

    finesMacOffenceDetailsSearchOffencesStore = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
    finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();
  });

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should provide the page title for pagination announcements', () => {
    createComponent();

    const tableWrapper = fixture.debugElement.query(
      By.directive(FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent),
    ).componentInstance as FinesMacOffenceDetailsSearchOffencesResultsTableWrapperComponent;

    expect(tableWrapper.paginationPageTitle).toBe('Search results');
  });

  it('should return false from canDeactivate if there are unsaved changes', () => {
    createComponent();
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(true);
    expect(component.canDeactivate()).toBe(false);
  });

  it('should return true from canDeactivate if there are no unsaved changes', () => {
    createComponent();
    finesMacOffenceDetailsSearchOffencesStore.setUnsavedChanges(false);
    expect(component.canDeactivate()).toBe(true);
  });

  it('should navigate back one level up on navigateBack', () => {
    createComponent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    component.navigateBack();
    expect(routerSpy).toHaveBeenCalledWith(['..'], { relativeTo: component['activatedRoute'] });
  });

  it('should display the deferred live region announcement when there are no search results', () => {
    createComponent(noSearchResults);
    expect(getDeferredLiveRegionAnnouncement()).toBeTruthy();
  });

  it('should pass the no results announcement message to the deferred live region announcement', () => {
    createComponent(noSearchResults);

    const announcement = getDeferredLiveRegionAnnouncement();
    const announcementComponent = announcement.componentInstance as CustomDeferredLiveRegionAnnouncement;

    expect(announcementComponent.message).toBe(component.noResultsAnnouncement);
    expect(announcementComponent.role).toBe('status');
  });

  it('should not display the deferred live region announcement when there are search results', () => {
    createComponent();
    expect(getDeferredLiveRegionAnnouncement()).toBeNull();
  });
});
