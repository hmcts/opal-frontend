import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { run } from 'axe-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAecAmendValuesFormComponent } from './fines-aec-amend-values-form.component';

describe('FinesAecAmendValuesFormComponent', () => {
  let fixture: ComponentFixture<FinesAecAmendValuesFormComponent>;
  let component: FinesAecAmendValuesFormComponent;

  /** Updates an amount through the real input to exercise the shared form controls. */
  const enter = (field: 'minimum_balance' | 'high_value', value: string): void => {
    const input = fixture.nativeElement.querySelector(`#${field}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  /** Submits the actual form to exercise its validation and output bindings. */
  const submit = (): void => {
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
  };

  /** Checks that the common summary lists the same error described by its field. */
  const expectError = (field: string, message: string): void => {
    const summary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;
    expect(summary.querySelector('h2')?.textContent?.trim()).toBe('There is a problem');
    expect(summary.textContent).toContain(message);
    expect([...summary.querySelectorAll('a')].map((link) => link.textContent)).toContain(message);
    expect(fixture.nativeElement.querySelector(`#${field}-error-message`).textContent).toContain(message);
    expect(fixture.nativeElement.querySelector(`#${field}`).getAttribute('aria-describedby')).toBe(
      `${field}-error-message`,
    );
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAecAmendValuesFormComponent],
      providers: [provideRouter([]), { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesAecAmendValuesFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('accountTypeName', 'Adult - Collection order');
  });

  it('shows the read-only account type, initial amounts, associated labels and pound prefixes', () => {
    fixture.componentRef.setInput('initialValues', { minimum_balance: '10.00', high_value: '100.00' });
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('h1')?.textContent).toContain('Adult - Collection order');
    expect(page.textContent).toContain('Account types');
    expect(page.querySelector('label[for="minimum_balance"]')?.textContent?.trim()).toBe('Minimum enforcement value');
    expect(page.querySelector('label[for="high_value"]')?.textContent?.trim()).toBe('High value (optional)');
    expect(page.querySelector<HTMLInputElement>('#minimum_balance')?.value).toBe('10.00');
    expect(page.querySelector<HTMLInputElement>('#high_value')?.value).toBe('100.00');
    expect([...page.querySelectorAll('.govuk-input__prefix')].map((prefix) => prefix.textContent)).toEqual(['£', '£']);
    expect(page.querySelectorAll('input')).toHaveLength(2);
    expect(page.querySelector('form')?.getAttribute('autocomplete')).toBe('off');
    expect(page.querySelector('#aec-amend-save')?.textContent?.trim()).toBe('Save');
  });

  it('shows a required field error and summary for an empty minimum', () => {
    const saved = vi.spyOn(component.formSubmit, 'emit');
    fixture.detectChanges();
    enter('minimum_balance', '');

    submit();

    expectError('minimum_balance', 'Enter a minimum enforcement value');
    expect(saved).not.toHaveBeenCalled();
  });

  it.each(['   ', '-0.01', '10000.00', '1e2', '12.345', 'invalid'])(
    'shows the minimum range error in both locations for %j',
    (value) => {
      const saved = vi.spyOn(component.formSubmit, 'emit');
      fixture.detectChanges();
      enter('minimum_balance', value);

      submit();

      expectError('minimum_balance', 'Enter a minimum enforcement value in numbers between 0 and 9999.99');
      expect(saved).not.toHaveBeenCalled();
    },
  );

  it.each(['   ', '-0.01', '10000000', '1e3', '12.345', 'invalid'])(
    'shows the high value range error in both locations for %j',
    (value) => {
      const saved = vi.spyOn(component.formSubmit, 'emit');
      fixture.detectChanges();
      enter('minimum_balance', '0');
      enter('high_value', value);

      submit();

      expectError('high_value', 'Enter a high enforcement value in numbers between 0 and 9999999.99');
      expect(saved).not.toHaveBeenCalled();
    },
  );

  it('rejects a minimum above high and accepts a correction making both values equal', () => {
    const saved = vi.spyOn(component.formSubmit, 'emit');
    fixture.detectChanges();
    enter('minimum_balance', '20.00');
    enter('high_value', '10.00');

    submit();

    expectError('minimum_balance', 'Minimum value cannot be higher than high value.');
    expect(saved).not.toHaveBeenCalled();

    enter('high_value', '20.00');
    submit();
    fixture.detectChanges();

    expect(saved).toHaveBeenCalledExactlyOnceWith({
      formData: { minimum_balance: '20.00', high_value: '20.00' },
      nestedFlow: false,
    });
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    expect(fixture.nativeElement.querySelector('#minimum_balance-error-message')).toBeNull();
  });

  it('includes both invalid amounts in the summary and alongside their own fields', () => {
    fixture.detectChanges();
    enter('minimum_balance', '');
    enter('high_value', 'invalid');

    submit();

    expectError('minimum_balance', 'Enter a minimum enforcement value');
    expectError('high_value', 'Enter a high enforcement value in numbers between 0 and 9999999.99');
    expect(fixture.nativeElement.querySelectorAll('.govuk-error-summary a')).toHaveLength(2);
  });

  it.each([
    ['0', ''],
    ['0.00', '0.00'],
    ['9999.99', '9999999.99'],
    ['0.50', '1.00'],
  ])('emits valid entered amounts %j and %j without losing optional blank or zero values', (minimum, high) => {
    const saved = vi.spyOn(component.formSubmit, 'emit');
    fixture.detectChanges();
    enter('minimum_balance', minimum);
    enter('high_value', high);

    submit();

    expect(saved).toHaveBeenCalledExactlyOnceWith({
      formData: { minimum_balance: minimum, high_value: high },
      nestedFlow: false,
    });
  });

  it('tracks changes against the initial values even after submission and becomes saved when restored', () => {
    fixture.componentRef.setInput('initialValues', { minimum_balance: '10.00', high_value: '100.00' });
    const unsaved = vi.spyOn(component['unsavedChanges'], 'emit');
    fixture.detectChanges();
    expect(unsaved).toHaveBeenLastCalledWith(false);

    enter('minimum_balance', '20.00');
    submit();

    expect(unsaved).toHaveBeenLastCalledWith(true);

    enter('minimum_balance', '10.00');
    expect(unsaved).toHaveBeenLastCalledWith(false);
    enter('high_value', '200.00');
    expect(unsaved).toHaveBeenLastCalledWith(true);
    enter('high_value', '100.00');
    expect(unsaved).toHaveBeenLastCalledWith(false);
  });

  it('resets entered values, errors and pristine state when its account context changes', () => {
    fixture.componentRef.setInput('initialValues', { minimum_balance: '10.00', high_value: '100.00' });
    fixture.componentRef.setInput('contextKey', 1);
    const unsaved = vi.spyOn(component['unsavedChanges'], 'emit');
    fixture.detectChanges();
    enter('minimum_balance', '');
    submit();
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).not.toBeNull();

    fixture.componentRef.setInput('initialValues', { minimum_balance: '25.00', high_value: '' });
    fixture.componentRef.setInput('contextKey', 2);
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual({ minimum_balance: '25.00', high_value: '' });
    expect(component.form.pristine).toBe(true);
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    expect(unsaved).toHaveBeenLastCalledWith(false);
  });

  it('disables both amounts and Save while pending, suppresses submissions and retains Cancel', () => {
    fixture.componentRef.setInput('initialValues', { minimum_balance: '10.00', high_value: '' });
    fixture.componentRef.setInput('pending', true);
    const saved = vi.spyOn(component.formSubmit, 'emit');
    const cancelled = vi.spyOn(component.cancelRequested, 'emit');
    fixture.detectChanges();

    submit();
    submit();

    expect(fixture.nativeElement.querySelector('#minimum_balance').matches(':disabled')).toBe(true);
    expect(fixture.nativeElement.querySelector('#high_value').matches(':disabled')).toBe(true);
    expect(fixture.nativeElement.querySelector('#aec-amend-save').matches(':disabled')).toBe(true);
    expect(fixture.nativeElement.querySelector('form').getAttribute('aria-busy')).toBe('true');
    expect(saved).not.toHaveBeenCalled();

    fixture.nativeElement.querySelector('opal-lib-govuk-cancel-link a').click();

    expect(cancelled).toHaveBeenCalledOnce();
    expect(saved).not.toHaveBeenCalled();
  });

  it('focuses the labelled amount when its error summary link is selected', () => {
    fixture.detectChanges();
    submit();
    const label = fixture.nativeElement.querySelector('label[for="minimum_balance"]') as HTMLLabelElement;
    label.scrollIntoView = vi.fn();

    fixture.nativeElement.querySelector('.govuk-error-summary a').click();

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#minimum_balance'));
    expect(label.scrollIntoView).toHaveBeenCalledOnce();
  });

  it.each([false, true])('has no Axe Core WCAG A or AA violations with errors displayed: %j', async (withErrors) => {
    fixture.componentRef.setInput('initialValues', { minimum_balance: withErrors ? '' : '10.00', high_value: '' });
    fixture.detectChanges();
    if (withErrors) submit();

    const results = await run(fixture.nativeElement, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      // JSDOM does not calculate layout or colour contrast.
      rules: { 'color-contrast': { enabled: false } },
    });

    expect(results.violations).toEqual([]);
  });
});
