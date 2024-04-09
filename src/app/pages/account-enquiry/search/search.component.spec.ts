import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SearchComponent } from './search.component';
import { StateService } from '@services';
import { SEARCH_COURT_MOCK, SEARCH_COURT_SELECT_OPTIONS_MOCK, SEARCH_STATE_MOCK } from '@mocks';
import { AccountEnquiryRoutes } from '@enums';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH } from '@constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IGovUkSelectOptions, ISearchCourt } from '@interfaces';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let stateService: StateService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    stateService = TestBed.inject(StateService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component.data$).not.toBeUndefined();
  });

  it('should submit the form', () => {
    const navigateSpy = spyOn(router, 'navigate');

    stateService.accountEnquiry = { search: ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH };
    expect(stateService.accountEnquiry.search).toEqual(ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH);

    component.handleFormSubmit({
      ...SEARCH_STATE_MOCK,
    });

    expect(stateService.accountEnquiry.search?.court).toBe('Bath');

    expect(navigateSpy).toHaveBeenCalledWith([AccountEnquiryRoutes.matches]);
  });

  it('should map search court to select options', () => {
    const response: ISearchCourt[] = SEARCH_COURT_MOCK;
    const expectedOptions: IGovUkSelectOptions[] = SEARCH_COURT_SELECT_OPTIONS_MOCK;
    const result = component['mapSearchCourtToSelectOptions'](response);

    expect(result).toEqual(expectedOptions);
  });
});
