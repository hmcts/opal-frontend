import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillPaymentCategoryFormComponent } from './fines-mci-create-till-payment-category-form.component';

describe('FinesMciCreateTillPaymentCategoryFormComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillPaymentCategoryFormComponent>;
  let component: FinesMciCreateTillPaymentCategoryFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillPaymentCategoryFormComponent],
      providers: [provideRouter([]), { provide: UtilsService, useValue: { scrollToTop: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateTillPaymentCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initialises an unselected payment category form', () => {
    expect(component.form.controls['paymentCategory'].value).toBeNull();
  });

  it('shows the required error in the summary and beside the radio group', () => {
    component.handleFormSubmit(new SubmitEvent('submit'));
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-form-group.govuk-form-group--error')).not.toBeNull();
    expect(element.querySelector('.govuk-error-message')?.textContent).toContain('Select payment category');
    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain('Select payment category');
  });

  it('focuses the first radio when the error summary link is selected', () => {
    component.handleFormSubmit(new SubmitEvent('submit'));
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const firstRadioLabel = element.querySelector<HTMLLabelElement>('label[for="paymentCategory"]');
    if (firstRadioLabel) {
      Object.defineProperty(firstRadioLabel, 'scrollIntoView', { value: vi.fn() });
    }
    element.querySelector<HTMLAnchorElement>('.govuk-error-summary__list a')?.click();

    expect(document.activeElement?.id).toBe('paymentCategory');
  });

  it('clears validation feedback when a category is selected', () => {
    component.handleFormSubmit(new SubmitEvent('submit'));
    component.form.controls['paymentCategory'].setValue('criminal');

    expect(component.formErrorSummaryMessage).toEqual([]);
    expect(component.formControlErrorMessages['paymentCategory']).toBeUndefined();
  });

  it('emits the selected category when the form is valid', () => {
    const formSubmitSpy = vi.spyOn(component['formSubmit'], 'emit');
    component.form.controls['paymentCategory'].setValue('courtFee');

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(formSubmitSpy).toHaveBeenCalledWith({
      formData: { paymentCategory: 'courtFee' },
      nestedFlow: false,
    });
  });

  it('emits Cancel without navigating from the form component', () => {
    const cancelSpy = vi.spyOn(component['cancelRequested'], 'emit');
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector<HTMLAnchorElement>('.button-link')?.click();

    expect(cancelSpy).toHaveBeenCalledWith();
  });
});
