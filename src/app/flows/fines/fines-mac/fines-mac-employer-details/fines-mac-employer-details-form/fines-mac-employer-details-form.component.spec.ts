import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacEmployerDetailsFormComponent } from './fines-mac-employer-details-form.component';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { IFinesMacEmployerDetailsForm } from '../interfaces/fines-mac-employer-details-form.interface';
import { FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK } from '../mocks/fines-mac-employer-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { of } from 'rxjs';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacEmployerDetailsFormComponent', () => {
  let component: FinesMacEmployerDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacEmployerDetailsFormComponent>;
  let formSubmit: IFinesMacEmployerDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacEmployerDetailsFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacEmployerDetailsFormComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.form.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each([
    'fm_employer_details_employer_address_line_1',
    'fm_employer_details_employer_address_line_2',
    'fm_employer_details_employer_address_line_3',
    'fm_employer_details_employer_address_line_4',
    'fm_employer_details_employer_address_line_5',
  ])('should validate %s with the single ASCII characters pattern', (controlName) => {
    const control = component.form.get(controlName);

    control?.setValue('Flat @ 2');
    expect(control?.hasError('singleAsciiCharacters')).toBe(false);

    control?.setValue('Café');
    expect(control?.hasError('singleAsciiCharacters')).toBe(true);
  });

  it('should emit form submit event with form value - continue flow', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should call initialCreateAccountSetup method', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupEmployerDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');

    component['initialEmployerDetailsSetup']();

    expect(component['setupEmployerDetailsForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.employerDetails().formData);
  });

  it('should validate postcode format using alphanumericTextPattern', () => {
    const postcodeControl = component.form.get('fm_employer_details_employer_post_code');

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(false);

    postcodeControl?.setValue('SW1A-1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(true);
  });

  it('should validate postcode max length', () => {
    const postcodeControl = component.form.get('fm_employer_details_employer_post_code');

    postcodeControl?.setValue('SW1A 1AB');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);

    postcodeControl?.setValue('SW1A 1AAA');
    expect(postcodeControl?.hasError('maxlength')).toBe(true);
  });

  it('should trim only surrounding whitespace from the postcode input on focusout', () => {
    const postcodeInput = fixture.nativeElement.querySelector(
      'input[name="fm_employer_details_employer_post_code"]',
    ) as HTMLInputElement | null;
    if (!postcodeInput) throw new Error('Postcode input not found');

    const postcodeControl = component.form.get('fm_employer_details_employer_post_code');

    postcodeControl?.setValue('  AB1  3CD ');
    postcodeInput.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();

    expect(postcodeControl?.value).toBe('AB1  3CD');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);
  });
});
