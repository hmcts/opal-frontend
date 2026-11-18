import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillCourtFeeCheckFormComponent } from './fines-mci-create-till-court-fee-check-form.component';

describe('FinesMciCreateTillCourtFeeCheckFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeeCheckFormComponent],
      providers: [provideRouter([])],
    });
    vi.spyOn(TestBed.inject(UtilsService), 'scrollToTop').mockImplementation(() => {});
  });

  it.each(['save-and-review-till', 'save-and-add-payment'])('requires a note for %s', (buttonId) => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckFormComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>(`#${buttonId}`)!.click();
    fixture.detectChanges();
    expect(element.querySelector('.govuk-error-summary')?.textContent).toContain('Enter a suspense note');
    expect(element.querySelector('#suspenseNote-error-message')?.textContent).toContain('Enter a suspense note');
    expect(document.activeElement).toBe(element.querySelector('.govuk-error-summary'));
  });

  it('shows a character count, retains the initial value and emits edits', () => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckFormComponent);
    fixture.componentRef.setInput('initialNote', 'Initial note');
    const changes = vi.fn();
    fixture.componentInstance.noteChanged.subscribe(changes);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector<HTMLTextAreaElement>('#suspenseNote')!;
    expect(input.value).toBe('Initial note');
    expect(input.maxLength).toBe(1000);
    input.value = 'Updated note';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(changes).toHaveBeenCalledWith('Updated note');
    expect(element.querySelector('.govuk-character-count__status')?.textContent).toContain('988 characters remaining');
  });

  it.each(['   ', 'x'.repeat(1001)])('rejects invalid notes', (value) => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckFormComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.controls['suspenseNote'].setValue(value);
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#save-and-review-till')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.form.invalid).toBe(true);
    expect((fixture.nativeElement as HTMLElement).querySelector('.govuk-error-summary')).not.toBeNull();
  });

  it('accepts a valid note without claiming the payment was saved', () => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckFormComponent);
    fixture.componentRef.setInput('initialNote', 'A valid note');
    const submitted = vi.fn();
    fixture.componentInstance['formSubmit'].subscribe(submitted);
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#save-and-review-till')!.click();
    expect(submitted).toHaveBeenCalledOnce();
  });
});
