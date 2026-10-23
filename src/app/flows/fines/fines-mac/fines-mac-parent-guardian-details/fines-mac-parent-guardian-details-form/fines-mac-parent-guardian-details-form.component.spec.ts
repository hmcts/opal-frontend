import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacParentGuardianDetailsFormComponent } from './fines-mac-parent-guardian-details-form.component';
import { FormArray } from '@angular/forms';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';
import { IFinesMacParentGuardianDetailsForm } from '../interfaces/fines-mac-parent-guardian-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK } from '../mocks/fines-mac-parent-guardian-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { of } from 'rxjs';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('FinesMacParentGuardianDetailsFormComponent', () => {
  let component: FinesMacParentGuardianDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacParentGuardianDetailsFormComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;
  let formSubmit: IFinesMacParentGuardianDetailsForm;
  let finesMacStore: FinesMacStoreType;
  let globalStore: InstanceType<typeof GlobalStore>;
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
    mockDateService = createSpyObj(DateService, ['getPreviousDate', 'getDateFromFormat']);
    mockDateService.getPreviousDate.mockReturnValue('19/08/2024');
    formSubmit = structuredClone(FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacParentGuardianDetailsFormComponent],
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

    fixture = TestBed.createComponent(FinesMacParentGuardianDetailsFormComponent);
    component = fixture.componentInstance;

    globalStore = TestBed.inject(GlobalStore);

    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: false,
    });

    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(finesMacState);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display numbered Remove buttons when release-1a-1-2 is enabled', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_parent_guardian_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_parent_guardian_details_aliases');
    }

    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      '[formArrayName="fm_parent_guardian_details_aliases"]',
    ) as HTMLElement;

    const headings = container.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    const buttons = container.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual([
      'Alias 1 of 3',
      'Alias 2 of 3',
      'Alias 3 of 3',
    ]);

    expect(Array.from(buttons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
      'Remove alias 3',
    ]);

    buttons.forEach((button) => {
      expect(button.type).toBe('button');
      expect(button.classList.contains('govuk-button--secondary')).toBe(true);
    });

    expect(container.querySelector('a.govuk-link')).toBeNull();
  });

  it('should hide Remove buttons when only one alias exists', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_parent_guardian_details_add_alias')?.setValue(true);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      '[formArrayName="fm_parent_guardian_details_aliases"]',
    ) as HTMLElement;

    const heading = container.querySelector(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as HTMLHeadingElement | null;

    expect(component.aliasControls.length).toBe(1);
    expect(heading?.textContent?.trim()).toBe('Alias 1');
    expect(container.querySelectorAll('button.moj-add-another__remove-button').length).toBe(0);
    expect(container.querySelector('#addAlias')).not.toBeNull();
  });

  it('should preserve both alias fields when removing the middle alias', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_parent_guardian_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_parent_guardian_details_aliases');
    }

    const aliases = component.form.get('fm_parent_guardian_details_aliases') as FormArray;

    aliases.at(0).get('fm_parent_guardian_details_alias_forenames_0')?.setValue('JOHN');
    aliases.at(0).get('fm_parent_guardian_details_alias_surname_0')?.setValue('SMITH');

    aliases.at(1).get('fm_parent_guardian_details_alias_forenames_1')?.setValue('DAVID');
    aliases.at(1).get('fm_parent_guardian_details_alias_surname_1')?.setValue('JONES');

    aliases.at(2).get('fm_parent_guardian_details_alias_forenames_2')?.setValue('PETER');
    aliases.at(2).get('fm_parent_guardian_details_alias_surname_2')?.setValue('BROWN');

    const thirdForenames = aliases.at(2).get('fm_parent_guardian_details_alias_forenames_2');
    const thirdSurname = aliases.at(2).get('fm_parent_guardian_details_alias_surname_2');

    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      '[formArrayName="fm_parent_guardian_details_aliases"]',
    ) as HTMLElement;

    const buttons = container.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[1].click();
    fixture.detectChanges();

    expect(aliases.length).toBe(2);

    expect(aliases.at(0).get('fm_parent_guardian_details_alias_forenames_0')?.value).toBe('JOHN');
    expect(aliases.at(0).get('fm_parent_guardian_details_alias_surname_0')?.value).toBe('SMITH');

    expect(aliases.at(1).get('fm_parent_guardian_details_alias_forenames_1')).toBe(thirdForenames);
    expect(aliases.at(1).get('fm_parent_guardian_details_alias_surname_1')).toBe(thirdSurname);

    expect(aliases.at(1).get('fm_parent_guardian_details_alias_forenames_1')?.value).toBe('PETER');
    expect(aliases.at(1).get('fm_parent_guardian_details_alias_surname_1')?.value).toBe('BROWN');

    const remainingHeadings = container.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    expect(Array.from(remainingHeadings, (heading) => heading.textContent?.trim())).toEqual([
      'Alias 1 of 2',
      'Alias 2 of 2',
    ]);

    const remainingButtons = container.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(Array.from(remainingButtons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
    ]);
  });

  it('should preserve both remaining aliases when removing the first of three', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_parent_guardian_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_parent_guardian_details_aliases');
    }

    const aliases = component.form.get('fm_parent_guardian_details_aliases') as FormArray;

    aliases.at(1).get('fm_parent_guardian_details_alias_forenames_1')?.setValue('DAVID');
    aliases.at(1).get('fm_parent_guardian_details_alias_surname_1')?.setValue('JONES');
    aliases.at(2).get('fm_parent_guardian_details_alias_forenames_2')?.setValue('PETER');
    aliases.at(2).get('fm_parent_guardian_details_alias_surname_2')?.setValue('BROWN');

    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      '[formArrayName="fm_parent_guardian_details_aliases"]',
    ) as HTMLElement;

    const buttons = container.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(3);

    buttons[0].click();
    fixture.detectChanges();

    expect(aliases.length).toBe(2);

    expect(aliases.at(0).get('fm_parent_guardian_details_alias_forenames_0')?.value).toBe('DAVID');
    expect(aliases.at(0).get('fm_parent_guardian_details_alias_surname_0')?.value).toBe('JONES');
    expect(aliases.at(1).get('fm_parent_guardian_details_alias_forenames_1')?.value).toBe('PETER');
    expect(aliases.at(1).get('fm_parent_guardian_details_alias_surname_1')?.value).toBe('BROWN');

    const headings = container.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual(['Alias 1 of 2', 'Alias 2 of 2']);
  });

  it('should hide Remove buttons when removing the final alias from two', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_parent_guardian_details_add_alias')?.setValue(true);
    component.addAlias(component.aliasControls.length, 'fm_parent_guardian_details_aliases');

    const aliases = component.form.get('fm_parent_guardian_details_aliases') as FormArray;

    aliases.at(0).get('fm_parent_guardian_details_alias_forenames_0')?.setValue('JOHN');
    aliases.at(0).get('fm_parent_guardian_details_alias_surname_0')?.setValue('SMITH');

    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      '[formArrayName="fm_parent_guardian_details_aliases"]',
    ) as HTMLElement;

    const buttons = container.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(2);

    buttons[1].click();
    fixture.detectChanges();

    const heading = container.querySelector(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as HTMLHeadingElement | null;

    expect(aliases.length).toBe(1);
    expect(heading?.textContent?.trim()).toBe('Alias 1');
    expect(container.querySelectorAll('button.moj-add-another__remove-button').length).toBe(0);

    expect(aliases.at(0).get('fm_parent_guardian_details_alias_forenames_0')?.value).toBe('JOHN');
    expect(aliases.at(0).get('fm_parent_guardian_details_alias_surname_0')?.value).toBe('SMITH');

    expect(container.querySelector('#addAlias')).not.toBeNull();
  });

  it('should maintain unique input IDs after removing and adding a parent/guardian alias', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_parent_guardian_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_parent_guardian_details_aliases');
    }

    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector(
      '[formArrayName="fm_parent_guardian_details_aliases"]',
    ) as HTMLElement;

    const buttons = container.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    buttons[1].click();
    fixture.detectChanges();

    component.addAlias(component.aliasControls.length, 'fm_parent_guardian_details_aliases');
    fixture.detectChanges();

    const inputs = container.querySelectorAll(
      'input[id^="fm_parent_guardian_details_alias_"]',
    ) as NodeListOf<HTMLInputElement>;

    const inputIds = Array.from(inputs, (input) => input.id);

    expect(component.aliasControls.length).toBe(3);
    expect(inputs.length).toBe(6);
    expect(new Set(inputIds).size).toBe(inputIds.length);
  });

  it.each([
    'fm_parent_guardian_details_address_line_1',
    'fm_parent_guardian_details_address_line_2',
    'fm_parent_guardian_details_address_line_3',
  ])('should validate %s with the single ASCII characters pattern', (controlName) => {
    const control = component.form.get(controlName);

    control?.setValue('Flat @ 2');
    expect(control?.hasError('singleAsciiCharacters')).toBe(false);

    control?.setValue('Café');
    expect(control?.hasError('singleAsciiCharacters')).toBe(true);
  });

  it('should enforce remove alias link template semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesMacParentGuardianDetailsFormComponent as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesMacParentGuardianDetailsFormComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
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
    component.form.get('fm_parent_guardian_details_add_alias')?.setValue(true);
    while (component.aliasControls.length < 2) {
      component.addAlias(component.aliasControls.length, 'fm_parent_guardian_details_aliases');
    }
    fixture.detectChanges();

    const link =
      (Array.from(
        fixture.nativeElement.querySelectorAll(
          'a.govuk-link.govuk-link--no-visited-state',
        ) as NodeListOf<HTMLAnchorElement>,
      ).find((anchor) => anchor.textContent?.trim().startsWith('Remove')) as HTMLAnchorElement | undefined) ?? null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Parent/guardian remove alias link not found');

    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const expectedIndex = component.aliasControls.length - 1;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeAliasSpy = vi.spyOn<any, any>(component, 'removeAlias');

    link.dispatchEvent(event);

    expect(removeAliasSpy).toHaveBeenCalledWith(expectedIndex, 'fm_parent_guardian_details_aliases', event);
  });

  it('should emit nested flow form submit event with form value', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;

    formSubmit.nestedFlow = true;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    formSubmit.nestedFlow = false;
    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should validate postcode format using alphanumericTextPattern', () => {
    const postcodeControl = component.form.get('fm_parent_guardian_details_post_code');

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(false);

    postcodeControl?.setValue('SW1A-1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(true);
  });

  it('should validate postcode max length', () => {
    const postcodeControl = component.form.get('fm_parent_guardian_details_post_code');

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);

    postcodeControl?.setValue('SW1A 1AAA');
    expect(postcodeControl?.hasError('maxlength')).toBe(true);
  });

  it('should trim surrounding whitespace from the postcode input on focusout', () => {
    const postcodeInput = fixture.nativeElement.querySelector(
      'input[name="fm_parent_guardian_details_post_code"]',
    ) as HTMLInputElement | null;
    if (!postcodeInput) throw new Error('Postcode input not found');

    const postcodeControl = component.form.get('fm_parent_guardian_details_post_code');

    postcodeControl?.setValue('  AB1  3CD ');
    postcodeInput.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();

    expect(postcodeControl?.value).toBe('AB1  3CD');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);
  });
});
