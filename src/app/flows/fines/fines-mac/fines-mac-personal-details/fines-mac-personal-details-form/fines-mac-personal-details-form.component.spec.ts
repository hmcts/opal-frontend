import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';
import { FinesMacPersonalDetailsFormComponent } from './fines-mac-personal-details-form.component';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { IFinesMacPersonalDetailsForm } from '../interfaces/fines-mac-personal-details-form.interface';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS } from '../constants/fines-mac-personal-details-alias';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../mocks/fines-mac-personal-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS as FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS } from '../constants/fines-mac-personal-details-vehicle-details-fields';
import { of } from 'rxjs';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('FinesMacPersonalDetailsFormComponent', () => {
  let component: FinesMacPersonalDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacPersonalDetailsFormComponent>;
  let globalStore: InstanceType<typeof GlobalStore>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;

  let formSubmit: IFinesMacPersonalDetailsForm;
  let finesMacStore: FinesMacStoreType;
  let originalConfigureDatePicker: () => void;

  beforeAll(() => {
    originalConfigureDatePicker = MojDatePickerComponent.prototype.configureDatePicker;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(MojDatePickerComponent.prototype, 'configureDatePicker').mockImplementation(() => {});
  });

  afterAll(() => {
    MojDatePickerComponent.prototype.configureDatePicker = originalConfigureDatePicker;
  });

  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
  });

  beforeEach(async () => {
    mockDateService = createSpyObj(DateService, ['isValidDate', 'calculateAge', 'getPreviousDate']);

    formSubmit = structuredClone(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacPersonalDetailsFormComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacPersonalDetailsFormComponent);
    component = fixture.componentInstance;
    globalStore = TestBed.inject(GlobalStore);

    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: false,
    });

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.form.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Remove alias buttons when release-1a-1-2 is enabled', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_personal_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 2) {
      component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');
    }

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_personal_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons.length).toBe(2);
    expect(removeButtons[0].textContent?.trim()).toBe('Remove alias 1');
    expect(removeButtons[1].textContent?.trim()).toBe('Remove alias 2');

    removeButtons.forEach((button) => {
      expect(button.type).toBe('button');
      expect(button.classList.contains('govuk-button--secondary')).toBe(true);
    });

    const aliasHeadings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    expect(Array.from(aliasHeadings, (heading) => heading.textContent?.trim())).toEqual([
      'Alias 1 of 2',
      'Alias 2 of 2',
    ]);

    expect(aliasContainer.querySelector('a.govuk-link')).toBeNull();
  });

  it('should display Alias 1 without a Remove button when release-1a-1-2 is enabled', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_personal_details_add_alias')?.setValue(true);
    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_personal_details_aliases"]',
    ) as HTMLElement;

    const aliasHeading = aliasContainer.querySelector(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as HTMLHeadingElement | null;

    const removeButtons = aliasContainer.querySelectorAll('button.moj-add-another__remove-button');

    expect(component.aliasControls.length).toBe(1);
    expect(aliasHeading?.textContent?.trim()).toBe('Alias 1');
    expect(removeButtons.length).toBe(0);
    expect(aliasContainer.querySelector('#addAlias')).not.toBeNull();
  });

  it('should remove the first personal alias and preserve both remaining names', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_personal_details_add_alias')?.setValue(true);
    component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');

    const aliases = component.form.get('fm_personal_details_aliases') as FormArray;

    aliases.at(1).get('fm_personal_details_alias_forenames_1')?.setValue('DAVID');
    aliases.at(1).get('fm_personal_details_alias_surname_1')?.setValue('JONES');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_personal_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons.length).toBe(2);

    removeButtons[0].click();
    fixture.detectChanges();

    const heading = aliasContainer.querySelector(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as HTMLHeadingElement | null;

    expect(component.aliasControls.length).toBe(1);
    expect(heading?.textContent?.trim()).toBe('Alias 1');
    expect(aliasContainer.querySelectorAll('button.moj-add-another__remove-button').length).toBe(0);

    expect(aliases.at(0).get('fm_personal_details_alias_forenames_0')?.value).toBe('DAVID');
    expect(aliases.at(0).get('fm_personal_details_alias_surname_0')?.value).toBe('JONES');
    expect(aliasContainer.querySelector('#addAlias')).not.toBeNull();
  });

  it('should remove the middle personal alias and preserve remaining names', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_personal_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');
    }

    const aliases = component.form.get('fm_personal_details_aliases') as FormArray;

    aliases.at(0).get('fm_personal_details_alias_forenames_0')?.setValue('JOHN');
    aliases.at(0).get('fm_personal_details_alias_surname_0')?.setValue('SMITH');

    aliases.at(1).get('fm_personal_details_alias_forenames_1')?.setValue('DAVID');
    aliases.at(1).get('fm_personal_details_alias_surname_1')?.setValue('JONES');

    aliases.at(2).get('fm_personal_details_alias_forenames_2')?.setValue('PETER');
    aliases.at(2).get('fm_personal_details_alias_surname_2')?.setValue('BROWN');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_personal_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons.length).toBe(3);

    removeButtons[1].click();
    fixture.detectChanges();

    const headings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual(['Alias 1 of 2', 'Alias 2 of 2']);

    expect(aliases.length).toBe(2);

    expect(aliases.at(0).get('fm_personal_details_alias_forenames_0')?.value).toBe('JOHN');
    expect(aliases.at(0).get('fm_personal_details_alias_surname_0')?.value).toBe('SMITH');

    expect(aliases.at(1).get('fm_personal_details_alias_forenames_1')?.value).toBe('PETER');
    expect(aliases.at(1).get('fm_personal_details_alias_surname_1')?.value).toBe('BROWN');

    const remainingButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(Array.from(remainingButtons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
    ]);
  });

  it('should remove the final personal alias and hide Remove buttons when one remains', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_personal_details_add_alias')?.setValue(true);
    component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');

    const aliases = component.form.get('fm_personal_details_aliases') as FormArray;

    aliases.at(0).get('fm_personal_details_alias_forenames_0')?.setValue('JOHN');
    aliases.at(0).get('fm_personal_details_alias_surname_0')?.setValue('SMITH');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_personal_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons.length).toBe(2);

    // Remove the final alias.
    removeButtons[1].click();
    fixture.detectChanges();

    const heading = aliasContainer.querySelector(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as HTMLHeadingElement | null;

    expect(aliases.length).toBe(1);
    expect(heading?.textContent?.trim()).toBe('Alias 1');
    expect(aliasContainer.querySelectorAll('button.moj-add-another__remove-button').length).toBe(0);

    expect(aliases.at(0).get('fm_personal_details_alias_forenames_0')?.value).toBe('JOHN');
    expect(aliases.at(0).get('fm_personal_details_alias_surname_0')?.value).toBe('SMITH');

    expect(aliasContainer.querySelector('#addAlias')).not.toBeNull();
  });

  it('should renumber remaining personal aliases when removing the first of three', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_personal_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');
    }

    const aliases = component.form.get('fm_personal_details_aliases') as FormArray;

    aliases.at(1).get('fm_personal_details_alias_forenames_1')?.setValue('DAVID');
    aliases.at(1).get('fm_personal_details_alias_surname_1')?.setValue('JONES');
    aliases.at(2).get('fm_personal_details_alias_forenames_2')?.setValue('PETER');
    aliases.at(2).get('fm_personal_details_alias_surname_2')?.setValue('BROWN');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_personal_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons.length).toBe(3);

    removeButtons[0].click();
    fixture.detectChanges();

    const headings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual(['Alias 1 of 2', 'Alias 2 of 2']);

    expect(aliases.length).toBe(2);

    expect(aliases.at(0).get('fm_personal_details_alias_forenames_0')?.value).toBe('DAVID');
    expect(aliases.at(0).get('fm_personal_details_alias_surname_0')?.value).toBe('JONES');

    expect(aliases.at(1).get('fm_personal_details_alias_forenames_1')?.value).toBe('PETER');
    expect(aliases.at(1).get('fm_personal_details_alias_surname_1')?.value).toBe('BROWN');

    const remainingButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(Array.from(remainingButtons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
    ]);
  });

  it('should remove the final personal alias and preserve both remaining aliases', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_personal_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');
    }

    const aliases = component.form.get('fm_personal_details_aliases') as FormArray;

    aliases.at(0).get('fm_personal_details_alias_forenames_0')?.setValue('JOHN');
    aliases.at(0).get('fm_personal_details_alias_surname_0')?.setValue('SMITH');

    aliases.at(1).get('fm_personal_details_alias_forenames_1')?.setValue('DAVID');
    aliases.at(1).get('fm_personal_details_alias_surname_1')?.setValue('JONES');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_personal_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons.length).toBe(3);

    // Remove Alias 3.
    removeButtons[2].click();
    fixture.detectChanges();

    const headings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual(['Alias 1 of 2', 'Alias 2 of 2']);

    expect(aliases.length).toBe(2);

    expect(aliases.at(0).get('fm_personal_details_alias_forenames_0')?.value).toBe('JOHN');
    expect(aliases.at(0).get('fm_personal_details_alias_surname_0')?.value).toBe('SMITH');

    expect(aliases.at(1).get('fm_personal_details_alias_forenames_1')?.value).toBe('DAVID');
    expect(aliases.at(1).get('fm_personal_details_alias_surname_1')?.value).toBe('JONES');

    const remainingButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(Array.from(remainingButtons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
    ]);

    expect(aliasContainer.querySelector('#addAlias')).not.toBeNull();
  });

  it('should renumber both personal alias fields and preserve values after removing the first alias', () => {
    component.form.get('fm_personal_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');
    }

    const aliases = component.form.get('fm_personal_details_aliases') as FormArray;

    aliases.at(0).get('fm_personal_details_alias_forenames_0')?.setValue('JOHN');
    aliases.at(0).get('fm_personal_details_alias_surname_0')?.setValue('SMITH');

    aliases.at(1).get('fm_personal_details_alias_forenames_1')?.setValue('DAVID');
    aliases.at(1).get('fm_personal_details_alias_surname_1')?.setValue('JONES');

    aliases.at(2).get('fm_personal_details_alias_forenames_2')?.setValue('PETER');
    aliases.at(2).get('fm_personal_details_alias_surname_2')?.setValue('BROWN');

    const secondForenames = aliases.at(1).get('fm_personal_details_alias_forenames_1');
    const secondSurname = aliases.at(1).get('fm_personal_details_alias_surname_1');

    component.removeAndRenumberAlias(0);
    fixture.detectChanges();

    expect(aliases.length).toBe(2);

    expect(aliases.at(0).get('fm_personal_details_alias_forenames_0')).toBe(secondForenames);
    expect(aliases.at(0).get('fm_personal_details_alias_surname_0')).toBe(secondSurname);

    expect(aliases.at(0).get('fm_personal_details_alias_forenames_0')?.value).toBe('DAVID');
    expect(aliases.at(0).get('fm_personal_details_alias_surname_0')?.value).toBe('JONES');

    expect(aliases.at(1).get('fm_personal_details_alias_forenames_1')?.value).toBe('PETER');
    expect(aliases.at(1).get('fm_personal_details_alias_surname_1')?.value).toBe('BROWN');

    component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');
    fixture.detectChanges();

    const aliasInputs = fixture.nativeElement.querySelectorAll(
      'input[id^="fm_personal_details_alias_"]',
    ) as NodeListOf<HTMLInputElement>;

    const inputIds = Array.from(aliasInputs, (input) => input.id);

    expect(aliasInputs.length).toBe(6);
    expect(new Set(inputIds).size).toBe(inputIds.length);
  });

  it('should enforce remove alias link template semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesMacPersonalDetailsFormComponent as any).ɵcmp?.consts ?? []).filter((entry: unknown) =>
      Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesMacPersonalDetailsFormComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
    const removeLinkConsts = templateConsts.filter(
      (entry) =>
        entry.includes('govuk-link') &&
        entry.includes('govuk-link--no-visited-state') &&
        entry.includes('href') &&
        entry.includes('click'),
    );

    expect(removeLinkConsts.length).toBeGreaterThanOrEqual(1);
    removeLinkConsts.forEach((entry) => {
      expect(entry).toContain('href');
      expect(entry).toContain('');
      expect(entry).not.toContain('tabindex');
    });
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should render remove alias link with href and call removeAlias', () => {
    component.form.get('fm_personal_details_add_alias')?.setValue(true);
    while (component.aliasControls.length < 2) {
      component.addAlias(component.aliasControls.length, 'fm_personal_details_aliases');
    }
    fixture.detectChanges();

    const link =
      (Array.from(
        fixture.nativeElement.querySelectorAll(
          'a.govuk-link.govuk-link--no-visited-state',
        ) as NodeListOf<HTMLAnchorElement>,
      ).find((anchor) => anchor.textContent?.trim().startsWith('Remove')) as HTMLAnchorElement | undefined) ?? null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Personal details remove alias link not found');

    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const expectedIndex = component.aliasControls.length - 1;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeAliasSpy = vi.spyOn<any, any>(component, 'removeAlias');

    link.dispatchEvent(event);

    expect(removeAliasSpy).toHaveBeenCalledWith(expectedIndex, 'fm_personal_details_aliases', event);
  });

  it('should emit nested flow form submit event with form value', () => {
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

  it('should emit standard flow form submit event with form value', () => {
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

  it('should set up the personal details form', () => {
    component['setupPersonalDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('fm_personal_details_title')).toBeTruthy();
    expect(component.form.get('fm_personal_details_forenames')).toBeTruthy();
    expect(component.form.get('fm_personal_details_surname')).toBeTruthy();
    expect(component.form.get('fm_personal_details_add_alias')).toBeTruthy();
    expect(component.form.get('fm_personal_details_aliases')).toBeTruthy();
    expect(component.form.get('fm_personal_details_dob')).toBeTruthy();
    expect(component.form.get('fm_personal_details_national_insurance_number')).toBeTruthy();
    expect(component.form.get('fm_personal_details_address_line_1')).toBeTruthy();
    expect(component.form.get('fm_personal_details_address_line_2')).toBeTruthy();
    expect(component.form.get('fm_personal_details_address_line_3')).toBeTruthy();
    expect(component.form.get('fm_personal_details_post_code')).toBeTruthy();
  });

  it('should set up the alias configuration for the personal details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(FINES_MAC_PERSONAL_DETAILS_ALIAS.map((item) => item.controlName));
    expect(component.aliasControlsValidation).toEqual(FINES_MAC_PERSONAL_DETAILS_ALIAS);
  });

  it('should allow supported address punctuation in personal details address lines', () => {
    component.form.controls['fm_personal_details_address_line_1'].setValue(`Flat 3, 10-12 O'Leary Street`);
    component.form.controls['fm_personal_details_address_line_2'].setValue('Unit_4 (Rear Block)*.');
    component.form.controls['fm_personal_details_address_line_3'].setValue('Area 51');

    expect(component.form.controls['fm_personal_details_address_line_1'].errors).toBeNull();
    expect(component.form.controls['fm_personal_details_address_line_2'].errors).toBeNull();
    expect(component.form.controls['fm_personal_details_address_line_3'].errors).toBeNull();
  });

  it('should reject unsupported characters in personal details address lines', () => {
    component.form.controls['fm_personal_details_address_line_1'].setValue('Café Street');

    expect(component.form.controls['fm_personal_details_address_line_1'].errors).toEqual({
      singleAsciiCharacters: true,
    });
  });

  it('should call dateOfBirthListener on DOB value changes for an adult form update', () => {
    const dateOfBirth = '01/01/1990';
    mockDateService.isValidDate.mockReturnValue(true);
    mockDateService.calculateAge.mockReturnValue(34);

    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);

    expect(mockDateService.isValidDate).toHaveBeenCalledWith(dateOfBirth);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
    const { formData: paymentTermsFormData } = finesMacStore.paymentTerms();
    expect(paymentTermsFormData.fm_payment_terms_has_days_in_default).toBeFalsy();
    expect(paymentTermsFormData.fm_payment_terms_default_days_in_jail).toBeNull();
    expect(paymentTermsFormData.fm_payment_terms_suspended_committal_date).toBeNull();
  });

  it('should call dateOfBirthListener on DOB value changes Youth', () => {
    const dateOfBirth = '01/01/2014';
    mockDateService.isValidDate.mockReturnValue(true);
    mockDateService.calculateAge.mockReturnValue(10);

    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);

    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(10);
    expect(component.ageLabel).toEqual('Youth');
    const { formData: paymentTermsFormData } = finesMacStore.paymentTerms();
    expect(paymentTermsFormData.fm_payment_terms_has_days_in_default).toBeFalsy();
    expect(paymentTermsFormData.fm_payment_terms_default_days_in_jail).toBeNull();
    expect(paymentTermsFormData.fm_payment_terms_suspended_committal_date).toBeNull();
  });

  it('should call dateOfBirthListener on DOB value changes for an adult explicit listener run', () => {
    const dateOfBirth = '01/01/1990';
    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);
    mockDateService.isValidDate.mockReturnValue(true);
    mockDateService.calculateAge.mockReturnValue(34);

    component['dateOfBirthListener']();

    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
    const { formData: paymentTermsFormData } = finesMacStore.paymentTerms();
    expect(paymentTermsFormData.fm_payment_terms_has_days_in_default).toBeFalsy();
    expect(paymentTermsFormData.fm_payment_terms_default_days_in_jail).toBeNull();
    expect(paymentTermsFormData.fm_payment_terms_suspended_committal_date).toBeNull();
  });

  it('should call the necessary setup methods', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'addVehicleDetailsControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setUpAliasCheckboxListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'dateOfBirthListener');
    mockDateService.getPreviousDate.mockReturnValue('19/08/2024');

    component['initialPersonalDetailsSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(finesMacStore.personalDetails().formData.fm_personal_details_aliases.length).keys()],
      'fm_personal_details_aliases',
    );
    expect(component['addVehicleDetailsControls']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.personalDetails().formData);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith(
      'fm_personal_details_add_alias',
      'fm_personal_details_aliases',
    );
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should call the necessary setup methods - parent/guardian', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'addVehicleDetailsControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setUpAliasCheckboxListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'dateOfBirthListener');
    mockDateService.getPreviousDate.mockReturnValue('19/08/2024');

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay;
    component['initialPersonalDetailsSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(finesMacStore.personalDetails().formData.fm_personal_details_aliases.length).keys()],
      'fm_personal_details_aliases',
    );
    expect(component['addVehicleDetailsControls']).not.toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.personalDetails().formData);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith(
      'fm_personal_details_add_alias',
      'fm_personal_details_aliases',
    );
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should add vehicle details controls', () => {
    component['addVehicleDetailsControls']();

    FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS.forEach((control) => {
      expect(component.form.get(control.controlName)).toBeTruthy();
    });
  });

  it('should validate postcode format using alphanumericTextPattern', () => {
    const postcodeControl = component.form.get('fm_personal_details_post_code');

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(false);

    postcodeControl?.setValue('SW1A-1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(true);
  });

  it('should validate postcode max length', () => {
    const postcodeControl = component.form.get('fm_personal_details_post_code');

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);

    postcodeControl?.setValue('SW1A 1AAA');
    expect(postcodeControl?.hasError('maxlength')).toBe(true);
  });

  it('should trim surrounding whitespace from the postcode input on focusout', () => {
    const postcodeInput = fixture.nativeElement.querySelector(
      'input[name="fm_personal_details_post_code"]',
    ) as HTMLInputElement | null;
    if (!postcodeInput) throw new Error('Postcode input not found');

    const postcodeControl = component.form.get('fm_personal_details_post_code');

    postcodeControl?.setValue('  AB1  3CD ');
    postcodeInput.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();

    expect(postcodeControl?.value).toBe('AB1  3CD');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);
  });
});
