import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK } from '../mocks/fines-suspense-item-search-business-units.mock';
import { FinesSuspenseItemSearchFormComponent } from './fines-suspense-item-search-form.component';

describe('FinesSuspenseItemSearchFormComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemSearchFormComponent>;
  let component: FinesSuspenseItemSearchFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSuspenseItemSearchFormComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSuspenseItemSearchFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('autoCompleteItems', FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK);
    fixture.componentRef.setInput('initialBusinessUnitId', null);
  });

  it('renders the design heading, reference field and adjacent Continue and Cancel actions', () => {
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const reference = page.querySelector<HTMLInputElement>('#fsis_suspense_reference_number')!;

    expect(page.querySelector('h1')?.textContent).toBe('Search for suspense item');
    expect(page.querySelector('label[for="fsis_suspense_reference_number"]')?.textContent?.trim()).toBe(
      'Suspense reference number',
    );
    expect(reference.type).toBe('text');
    expect(reference.value).toBe('');
    expect(reference.classList).toContain('govuk-input--width-5');
    expect(reference.hasAttribute('maxlength')).toBe(false);
    expect(page.querySelector('.govuk-button-group button')?.textContent?.trim()).toBe('Continue');
    expect(page.querySelector('.govuk-button-group a')?.textContent?.trim()).toBe('Cancel');
  });

  it('displays the single business unit as a summary row with its supplied ID as the form value', () => {
    const businessUnit = FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK[0];
    fixture.componentRef.setInput('autoCompleteItems', [businessUnit]);
    fixture.componentRef.setInput('initialBusinessUnitId', businessUnit.value);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('.govuk-summary-list__key')?.textContent?.trim()).toBe('Business unit');
    expect(page.querySelector('.govuk-summary-list__value')?.textContent?.trim()).toBe(businessUnit.name);
    expect(page.querySelector('opal-lib-alphagov-accessible-autocomplete')).toBeNull();
    expect(component.form.get('fsis_business_unit_id')?.value).toBe(businessUnit.value);
  });

  it('binds the supplied multiple business units and form control to the shared autocomplete', () => {
    fixture.detectChanges();
    const autocomplete: AlphagovAccessibleAutocompleteComponent = fixture.debugElement.query(
      By.directive(AlphagovAccessibleAutocompleteComponent),
    ).componentInstance;

    expect(autocomplete.labelText).toBe('Select a business unit');
    expect(autocomplete.autoCompleteItems).toEqual(FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK);
    expect(autocomplete.getControl).toBe(component.form.get('fsis_business_unit_id'));
    expect(fixture.nativeElement.querySelector('opal-lib-govuk-summary-list')).toBeNull();
  });

  it('emits the selected BU and the entered reference without removing leading zeroes', () => {
    const submitted = vi.fn();
    component['formSubmit'].subscribe(submitted);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const reference = page.querySelector<HTMLInputElement>('#fsis_suspense_reference_number')!;
    const autocomplete: AlphagovAccessibleAutocompleteComponent = fixture.debugElement.query(
      By.directive(AlphagovAccessibleAutocompleteComponent),
    ).componentInstance;

    autocomplete.getControl.setValue(FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK[1].value);
    reference.value = '001234';
    reference.dispatchEvent(new Event('input', { bubbles: true }));
    page.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(submitted).toHaveBeenCalledExactlyOnceWith({
      formData: {
        fsis_business_unit_id: FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK[1].value,
        fsis_suspense_reference_number: '001234',
      },
      nestedFlow: false,
    });
  });

  it('submits the supplied single BU without requiring an autocomplete selection', () => {
    const businessUnit = FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK[0];
    fixture.componentRef.setInput('autoCompleteItems', [businessUnit]);
    fixture.componentRef.setInput('initialBusinessUnitId', businessUnit.value);
    const submitted = vi.fn();
    component['formSubmit'].subscribe(submitted);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const reference = page.querySelector<HTMLInputElement>('#fsis_suspense_reference_number')!;

    reference.value = '1234';
    reference.dispatchEvent(new Event('input', { bubbles: true }));
    page.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(submitted).toHaveBeenCalledExactlyOnceWith({
      formData: { fsis_business_unit_id: businessUnit.value, fsis_suspense_reference_number: '1234' },
      nestedFlow: false,
    });
  });

  it('prevents an empty submission and displays linked summary and inline errors', () => {
    const submitted = vi.fn();
    component['formSubmit'].subscribe(submitted);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    page.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(submitted).not.toHaveBeenCalled();
    expect(page.querySelector('.govuk-error-summary')?.textContent).toContain('There is a problem');
    const summaryLinks = page.querySelectorAll<HTMLAnchorElement>('.govuk-error-summary a');
    expect(Array.from(summaryLinks, (link) => link.textContent)).toEqual([
      'Select a business unit',
      'Enter a suspense reference number',
    ]);
    const scrollTo = vi.spyOn(component, 'scrollTo').mockImplementation(() => undefined);
    summaryLinks[0].click();
    expect(scrollTo).toHaveBeenLastCalledWith('fsis_business_unit_id');
    summaryLinks[1].click();
    expect(scrollTo).toHaveBeenLastCalledWith('fsis_suspense_reference_number');
    const inlineErrors = Array.from(page.querySelectorAll('.govuk-error-message'), (error) => error.textContent);
    expect(inlineErrors.some((message) => message?.includes('Select a business unit'))).toBe(true);
    expect(inlineErrors.some((message) => message?.includes('Enter a suspense reference number'))).toBe(true);
  });

  it('prevents submission without a reference when the sole BU is supplied', () => {
    fixture.componentRef.setInput('autoCompleteItems', [FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK[0]]);
    fixture.componentRef.setInput('initialBusinessUnitId', 11);
    const submitted = vi.fn();
    component['formSubmit'].subscribe(submitted);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(submitted).not.toHaveBeenCalled();
    expect(component.form.get('fsis_business_unit_id')?.valid).toBe(true);
    expect(component.form.get('fsis_suspense_reference_number')?.hasError('required')).toBe(true);
  });

  it('emits Cancel without submitting the form', () => {
    const cancelled = vi.fn();
    const submitted = vi.fn();
    component.cancelSearch.subscribe(cancelled);
    component['formSubmit'].subscribe(submitted);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;

    page.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();

    expect(cancelled).toHaveBeenCalledOnce();
    expect(submitted).not.toHaveBeenCalled();
  });
});
