import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormComponent } from './search-form.component';
import { AUTO_COMPLETE_ITEMS_MOCK, SEARCH_STATE_MOCK } from '@mocks';
import { MacStateService } from '@services';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent],
      providers: [MacStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    component.selectOptions = AUTO_COMPLETE_ITEMS_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup the search form', () => {
    expect(component.form).not.toBeNull();
  });

  it('should repopulate if there are any initials values', () => {
    expect(component.form.value.court).toBeNull();
  });

  it('should emit form submit event with form value', () => {
    const formValue = SEARCH_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component.form.patchValue(formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });

  it('should setup the search form on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupSearchForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');

    component.ngOnInit();

    expect(component['setupSearchForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(component.state);
  });
});
