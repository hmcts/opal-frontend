import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccAprAddFormComponent } from './fines-acc-apr-add-form.component';

describe('FinesAccAprAddFormComponent', () => {
  let fixture: ComponentFixture<FinesAccAprAddFormComponent>;
  let component: FinesAccAprAddFormComponent;

  const enter = (value: string) => {
    const input = fixture.nativeElement.querySelector('#apr_text') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const submit = () =>
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccAprAddFormComponent],
      providers: [provideRouter([]), { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesAccAprAddFormComponent);
    component = fixture.componentInstance;
  });

  it('renders the labelled common input with browser autocomplete disabled', () => {
    fixture.componentRef.setInput('accountCaption', '177A - APR TEST');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('177A - APR TEST');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Add Alternate Payment Reference');
    expect(fixture.nativeElement.querySelector('label').getAttribute('for')).toBe('apr_text');
    expect(fixture.nativeElement.querySelector('label').textContent.trim()).toBe('Enter payment reference');
    expect(fixture.nativeElement.querySelector('form').getAttribute('autocomplete')).toBe('off');
    expect(fixture.nativeElement.querySelector('#apr_text').getAttribute('autocomplete')).toBe('off');
  });

  it.each(['', '   ', '\t\n', '1234567890123456789'])(
    'rejects invalid reference %j and associates the field and error summary',
    (value) => {
      const saved = vi.spyOn(component.formSubmit, 'emit');
      fixture.detectChanges();
      enter(value);
      submit();

      const message = value.trim() ? 'Payment reference must be 18 characters or fewer' : 'Enter a payment reference';
      expect(saved).not.toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector('.govuk-error-summary').textContent).toContain(message);
      expect(fixture.nativeElement.querySelector('#apr_text-error-message').textContent).toContain(message);
      expect(fixture.nativeElement.querySelector('#apr_text').getAttribute('aria-describedby')).toBe(
        'apr_text-error-message',
      );
    },
  );

  it('focuses the input when its error summary link is selected', () => {
    fixture.detectChanges();
    submit();
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    label.scrollIntoView = vi.fn();

    (fixture.nativeElement.querySelector('.govuk-error-summary a') as HTMLAnchorElement).click();

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#apr_text'));
    expect(label.scrollIntoView).toHaveBeenCalled();
  });

  it('submits a corrected reference and clears its previous validation errors', () => {
    const saved = vi.spyOn(component.formSubmit, 'emit');
    fixture.detectChanges();
    submit();

    enter('Corrected');
    submit();
    fixture.detectChanges();

    expect(saved).toHaveBeenCalledWith({ formData: { apr_text: 'Corrected' }, nestedFlow: false });
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    expect(fixture.nativeElement.querySelector('#apr_text-error-message')).toBeNull();
  });

  it.each(['A', '123456789012345678', ' AbC-123 '])(
    'submits valid reference %j without changing its case or whitespace',
    (value) => {
      const saved = vi.spyOn(component.formSubmit, 'emit');
      const unsaved = vi.spyOn(component['unsavedChanges'], 'emit');
      fixture.detectChanges();
      enter(value);
      submit();

      expect(saved).toHaveBeenCalledWith({ formData: { apr_text: value }, nestedFlow: false });
      expect(unsaved).toHaveBeenLastCalledWith(true);
    },
  );

  it('prepopulates change mode and considers a value restored to the initial reference saved', () => {
    fixture.componentRef.setInput('initialValue', 'Original');
    fixture.componentRef.setInput('headingText', 'Change Alternate Payment Reference');
    fixture.componentRef.setInput('labelText', 'Change alternate payment reference');
    const unsaved = vi.spyOn(component['unsavedChanges'], 'emit');
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('#apr_text') as HTMLInputElement).value).toBe('Original');
    enter('Changed');
    expect(unsaved).toHaveBeenLastCalledWith(true);
    enter('Original');
    expect(unsaved).toHaveBeenLastCalledWith(false);
  });

  it('keeps a restored Add draft unsaved until the value matches the empty saved baseline', () => {
    fixture.componentRef.setInput('initialValue', 'Retry-Reference');
    fixture.componentRef.setInput('savedValue', '');
    const unsaved = vi.spyOn(component['unsavedChanges'], 'emit');
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('#apr_text') as HTMLInputElement).value).toBe('Retry-Reference');
    expect(unsaved).toHaveBeenLastCalledWith(true);
    enter('');
    expect(unsaved).toHaveBeenLastCalledWith(false);
    enter('Retry-Reference');
    expect(unsaved).toHaveBeenLastCalledWith(true);
  });

  it('compares a restored edit draft with the saved reference rather than the rejected value', () => {
    fixture.componentRef.setInput('initialValue', 'Rejected-Value');
    fixture.componentRef.setInput('savedValue', 'Original');
    const unsaved = vi.spyOn(component['unsavedChanges'], 'emit');
    fixture.detectChanges();

    expect(unsaved).toHaveBeenLastCalledWith(true);
    enter('Original');
    expect(unsaved).toHaveBeenLastCalledWith(false);
    enter('Rejected-Value');
    expect(unsaved).toHaveBeenLastCalledWith(true);
  });

  it('clears entered values and validation errors when the resolved account context changes', () => {
    fixture.componentRef.setInput('contextKey', {});
    fixture.detectChanges();
    enter('1234567890123456789');
    submit();
    const unsaved = vi.spyOn(component['unsavedChanges'], 'emit');

    fixture.componentRef.setInput('contextKey', {});
    fixture.detectChanges();

    expect(component.form.controls.apr_text.value).toBe('');
    expect(component.form.pristine).toBe(true);
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    expect(unsaved).toHaveBeenLastCalledWith(false);
  });

  it('disables Save and suppresses repeated submissions while pending, while retaining Cancel', () => {
    fixture.componentRef.setInput('pending', true);
    const saved = vi.spyOn(component.formSubmit, 'emit');
    const cancelled = vi.spyOn(component.cancelRequested, 'emit');
    fixture.detectChanges();
    component.form.controls.apr_text.setValue('Valid');
    submit();

    expect((fixture.nativeElement.querySelector('#apr-save') as HTMLButtonElement).matches(':disabled')).toBe(true);
    expect(saved).not.toHaveBeenCalled();
    (fixture.nativeElement.querySelector('opal-lib-govuk-cancel-link a') as HTMLAnchorElement).click();
    expect(cancelled).toHaveBeenCalledOnce();
  });
});
