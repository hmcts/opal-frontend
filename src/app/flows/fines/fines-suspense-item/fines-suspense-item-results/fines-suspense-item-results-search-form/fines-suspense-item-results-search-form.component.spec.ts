import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesSuspenseItemResultsSearchFormComponent } from './fines-suspense-item-results-search-form.component';

describe('FinesSuspenseItemResultsSearchFormComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemResultsSearchFormComponent>;
  let component: FinesSuspenseItemResultsSearchFormComponent;
  let page: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSuspenseItemResultsSearchFormComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesSuspenseItemResultsSearchFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('initialReference', '001234');
    fixture.componentRef.setInput('businessUnitName', 'Avon and Somerset');
    fixture.detectChanges();
    page = fixture.nativeElement;
  });

  function enterReference(reference: string): void {
    const input = page.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!;
    input.value = reference;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function submit(): void {
    page.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('starts with the route reference, retained business unit and no errors', () => {
    expect(page.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!.value).toBe('001234');
    expect(page.querySelector('.govuk-body-s strong')?.textContent).toBe('Avon and Somerset');
    expect(page.querySelector('.govuk-error-summary')).toBeNull();
    expect(page.querySelector('.govuk-error-message')).toBeNull();
    expect(component.form.pristine).toBe(true);
  });

  it.each([
    ['001234', '1234'],
    ['100200', '100200'],
    ['987654321098765432', '987654321098765432'],
    ['0'.repeat(100) + '987654321098765432', '987654321098765432'],
  ])('normalises %s before validating and submitting the reference', (reference, normalised) => {
    const submitted = vi.fn();
    component['formSubmit'].subscribe(submitted);
    enterReference(reference);
    submit();
    expect(submitted).toHaveBeenCalledExactlyOnceWith({
      formData: { fsir_suspense_reference_number: normalised },
      nestedFlow: false,
    });
    expect(page.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!.value).toBe(normalised);
    expect(page.querySelector('.govuk-error-summary')).toBeNull();
  });

  it.each([
    ['', 'Enter suspense reference number'],
    ['0', 'Enter suspense reference number'],
    ['0000', 'Enter suspense reference number'],
    ['0'.repeat(100), 'Enter suspense reference number'],
    ['abc', 'Enter suspense reference number in the correct format'],
    ['12a3', 'Enter suspense reference number in the correct format'],
    ['12.3', 'Enter suspense reference number in the correct format'],
    ['-1', 'Enter suspense reference number in the correct format'],
    ['+1', 'Enter suspense reference number in the correct format'],
    ['1e3', 'Enter suspense reference number in the correct format'],
    ['12 34', 'Enter suspense reference number in the correct format'],
    [' 123', 'Enter suspense reference number in the correct format'],
    ['123 ', 'Enter suspense reference number in the correct format'],
    [' ', 'Enter suspense reference number in the correct format'],
    ['a'.repeat(19), 'Enter suspense reference number in the correct format'],
    ['9'.repeat(19), 'Reference number must be 18 characters or fewer'],
    ['0'.repeat(20) + '9'.repeat(19), 'Reference number must be 18 characters or fewer'],
  ])('blocks invalid reference %s with linked summary and inline errors', (reference, message) => {
    const submitted = vi.fn();
    component['formSubmit'].subscribe(submitted);
    enterReference(reference);
    submit();
    expect(submitted).not.toHaveBeenCalled();
    expect(page.querySelector('.govuk-error-summary')?.textContent).toContain(message);
    expect(page.querySelector('.govuk-error-message')?.textContent).toContain(message);
    const link = page.querySelector<HTMLAnchorElement>('.govuk-error-summary a')!;
    const scrollTo = vi.spyOn(component, 'scrollTo').mockImplementation(() => undefined);
    link.click();
    expect(scrollTo).toHaveBeenCalledWith('fsir_suspense_reference_number');
  });

  it('allows correction after an invalid search and clears the displayed errors', () => {
    const submitted = vi.fn();
    component['formSubmit'].subscribe(submitted);
    enterReference('abc');
    submit();
    enterReference('5678');
    submit();
    expect(submitted).toHaveBeenCalledExactlyOnceWith({
      formData: { fsir_suspense_reference_number: '5678' },
      nestedFlow: false,
    });
    expect(page.querySelector('.govuk-error-summary')).toBeNull();
    expect(page.querySelector('.govuk-error-message')).toBeNull();
  });

  it('reports edits again after a valid submission', () => {
    const unsaved = vi.fn();
    component['unsavedChanges'].subscribe(unsaved);
    enterReference('5678');
    expect(unsaved).toHaveBeenLastCalledWith(true);
    submit();
    expect(unsaved).toHaveBeenLastCalledWith(false);
    enterReference('9012');
    expect(unsaved).toHaveBeenLastCalledWith(true);
  });

  it('resets a reused form to the new route reference and clears stale validation and dirty state', () => {
    const unsaved = vi.fn();
    component['unsavedChanges'].subscribe(unsaved);
    enterReference('abc');
    submit();
    expect(page.querySelector('.govuk-error-summary')).not.toBeNull();

    fixture.componentRef.setInput('initialReference', '005678');
    fixture.detectChanges();

    expect(page.querySelector<HTMLInputElement>('#fsir_suspense_reference_number')!.value).toBe('005678');
    expect(component.form.pristine).toBe(true);
    expect(page.querySelector('.govuk-error-summary')).toBeNull();
    expect(page.querySelector('.govuk-error-message')).toBeNull();
    expect(unsaved).toHaveBeenLastCalledWith(false);

    enterReference('9012');
    expect(unsaved).toHaveBeenLastCalledWith(true);
  });
});
