import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SearchComponent } from './search.component';
import { StateService } from '@services';
import { SEARCH_STATE_MOCK } from '@mocks';
import { AccountEnquiryRoutes } from '@enums';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH } from '@constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

  // it('should setup the search form', () => {
  //   expect(component.searchForm).not.toBeNull();
  // });

  // it('should repopulate if there are any initials values', () => {
  //   expect(component.searchForm.value.court).toBeNull();
  // });

  // it('should repopulate if there are values', () => {
  //   stateService.accountEnquiry.set({
  //     search: SEARCH_STATE_MOCK,
  //   });
  //   component['rePopulateSearchForm']();
  //   expect(component.searchForm.value.court).toBe('Bath');
  // });

  // it('should clear the form', () => {
  //   stateService.accountEnquiry.set({
  //     search: SEARCH_STATE_MOCK,
  //   });
  //   component['rePopulateSearchForm']();
  //   expect(component.searchForm.value.court).toBe('Bath');

  //   component.handleClearForm();
  //   expect(component.searchForm.value.court).toBeNull();
  // });

  it('should submit the form', () => {
    const navigateSpy = spyOn(router, 'navigate');

    stateService.accountEnquiry.set({ search: ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH });
    expect(stateService.accountEnquiry().search).toEqual(ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH);

    component.handleFormSubmit({
      ...SEARCH_STATE_MOCK,
    });

    expect(stateService.accountEnquiry().search?.court).toBe('Bath');

    expect(navigateSpy).toHaveBeenCalledWith([AccountEnquiryRoutes.matches]);
  });
});
