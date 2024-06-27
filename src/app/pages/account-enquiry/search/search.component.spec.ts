import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { CourtService } from '@services';
import { SEARCH_COURT_MOCK, SEARCH_COURT_SELECT_OPTIONS_MOCK, SEARCH_STATE_MOCK } from '@mocks';
import { AccountEnquiryRoutes } from '@enums';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH } from '@constants';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { IGovUkSelectOptions, ISearchCourt } from '@interfaces';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockCourtService: Partial<CourtService>;

  beforeEach(async () => {
    mockCourtService = {
      searchCourt: jasmine.createSpy('searchCourt').and.returnValue(of(SEARCH_COURT_MOCK)),
    };

    await TestBed.configureTestingModule({
    imports: [SearchComponent],
    providers: [{ provide: CourtService, useValue: mockCourtService }, provideRouter([]), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component.data$).not.toBeUndefined();
  });

  it('should submit the form', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');

    component['aeStateService'].accountEnquiry = { search: ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH };
    expect(component['aeStateService'].accountEnquiry.search).toEqual(ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH);

    component.handleFormSubmit({
      ...SEARCH_STATE_MOCK,
    });

    expect(component['aeStateService'].accountEnquiry.search?.court).toBe('Bath');

    expect(navigateSpy).toHaveBeenCalledWith([AccountEnquiryRoutes.matches]);
  });

  it('should map search court to select options', () => {
    const response: ISearchCourt[] = SEARCH_COURT_MOCK;
    const expectedOptions: IGovUkSelectOptions[] = SEARCH_COURT_SELECT_OPTIONS_MOCK;
    const result = component['mapSearchCourtToSelectOptions'](response);

    expect(result).toEqual(expectedOptions);
  });

  it('should transform court search results into select options', () => {
    component.data$.subscribe((result) => {
      expect(result).toEqual(SEARCH_COURT_SELECT_OPTIONS_MOCK);
      expect(mockCourtService.searchCourt).toHaveBeenCalled();
    });
  });
});
