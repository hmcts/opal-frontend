import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { StateService } from '@services';
import { SEARCH_STATE_MOCK } from '@mocks';

fdescribe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup the search form', () => {
    expect(component.searchForm).not.toBeNull();
  });

  it('should repopulate if there are any initials values', () => {
    expect(component.searchForm.value.court).toBeNull();
  });

  it('should repopulate if there are values', () => {
    stateService.accountEnquiry.set({
      search: SEARCH_STATE_MOCK,
    });
    component['rePopulateSearchForm']();
    expect(component.searchForm.value.court).toBe('Bath');
  });

  it('should clear the form', () => {
    stateService.accountEnquiry.set({
      search: SEARCH_STATE_MOCK,
    });
    component['rePopulateSearchForm']();
    expect(component.searchForm.value.court).toBe('Bath');

    component.handleClearForm();
    expect(component.searchForm.value.court).toBeNull();
  });
});
