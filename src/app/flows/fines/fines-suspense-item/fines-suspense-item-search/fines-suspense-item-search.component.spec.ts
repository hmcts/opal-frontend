import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK } from './mocks/fines-suspense-item-search-business-units.mock';
import { FinesSuspenseItemSearchFormComponent } from './fines-suspense-item-search-form/fines-suspense-item-search-form.component';
import { FinesSuspenseItemSearchComponent } from './fines-suspense-item-search.component';

describe('FinesSuspenseItemSearchComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemSearchComponent>;
  let component: FinesSuspenseItemSearchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSuspenseItemSearchComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesSuspenseItemSearchComponent);
    component = fixture.componentInstance;
  });

  it('supplies the available BUs and initial selection to the form', () => {
    component.businessUnitAutoCompleteItems = FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK;
    component.initialBusinessUnitId = 22;
    fixture.detectChanges();
    const form: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;

    expect(form.autoCompleteItems).toEqual(FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK);
    expect(form.initialBusinessUnitId).toBe(22);
    expect(form.form.get('fsis_business_unit_id')?.value).toBe(22);
  });

  it('does not populate the live page with test business units before BU loading is connected', () => {
    fixture.detectChanges();
    const form: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;

    expect(form.autoCompleteItems).toEqual([]);
    expect(form.form.get('fsis_business_unit_id')?.value).toBeNull();
  });

  it('returns to Finance when the child Cancel link is clicked', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;

    page.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();

    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/', 'fines', 'dashboard', 'finance']);
  });
});
