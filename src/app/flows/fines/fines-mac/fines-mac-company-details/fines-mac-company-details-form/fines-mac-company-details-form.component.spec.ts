import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';
import { FinesMacCompanyDetailsFormComponent } from './fines-mac-company-details-form.component';
import { IFinesMacCompanyDetailsForm } from '../interfaces/fines-mac-company-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_COMPANY_DETAILS_ALIAS } from '../constants/fines-mac-company-details-alias';
import { FINES_MAC_COMPANY_DETAILS_FORM_MOCK } from '../mocks/fines-mac-company-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { of } from 'rxjs';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacCompanyDetailsFormComponent', () => {
  let component: FinesMacCompanyDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacCompanyDetailsFormComponent>;
  let formSubmit: IFinesMacCompanyDetailsForm;
  let finesMacStore: FinesMacStoreType;
  let globalStore: InstanceType<typeof GlobalStore>;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_COMPANY_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCompanyDetailsFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCompanyDetailsFormComponent);
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

    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 2) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    fixture.detectChanges();

    const removeButtons = fixture.nativeElement.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons).toHaveLength(2);
    expect(removeButtons[0].textContent?.trim()).toBe('Remove alias 1');
    expect(removeButtons[1].textContent?.trim()).toBe('Remove alias 2');

    const aliasHeadings = fixture.nativeElement.querySelectorAll(
      '[formArrayName="fm_company_details_aliases"] legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    expect(aliasHeadings).toHaveLength(2);
    expect(aliasHeadings[0].textContent?.trim()).toBe('Alias 1 of 2');
    expect(aliasHeadings[1].textContent?.trim()).toBe('Alias 2 of 2');

    removeButtons.forEach((button) => {
      expect(button.type).toBe('button');
      expect(button.classList.contains('govuk-button--secondary')).toBe(true);
    });
  });

  it('should display Alias 1 without a Remove button when release-1a-1-2 is enabled', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);
    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const aliasHeading = aliasContainer.querySelector(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as HTMLHeadingElement | null;

    const removeButtons = aliasContainer.querySelectorAll('button.moj-add-another__remove-button');

    const addButton = aliasContainer.querySelector('#addAlias');

    expect(component.aliasControls).toHaveLength(1);
    expect(aliasHeading?.textContent?.trim()).toBe('Alias 1');
    expect(removeButtons).toHaveLength(0);
    expect(addButton).not.toBeNull();
  });

  it('should display correctly numbered headings and Remove buttons for multiple aliases', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const headings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(component.aliasControls).toHaveLength(3);

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual([
      'Alias 1 of 3',
      'Alias 2 of 3',
      'Alias 3 of 3',
    ]);

    expect(Array.from(removeButtons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
      'Remove alias 3',
    ]);
  });

  it.each([
    'fm_company_details_address_line_1',
    'fm_company_details_address_line_2',
    'fm_company_details_address_line_3',
  ])('should validate %s with the single ASCII characters pattern', (controlName) => {
    const control = component.form.get(controlName);

    control?.setValue('Flat @ 2');
    expect(control?.hasError('singleAsciiCharacters')).toBe(false);

    control?.setValue('Café');
    expect(control?.hasError('singleAsciiCharacters')).toBe(true);
  });

  it('should enforce remove alias link template semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesMacCompanyDetailsFormComponent as any).ɵcmp?.consts ?? []).filter((entry: unknown) =>
      Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesMacCompanyDetailsFormComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
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
    component.form.get('fm_company_details_add_alias')?.setValue(true);
    while (component.aliasControls.length < 2) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }
    fixture.detectChanges();

    const link =
      (Array.from(
        fixture.nativeElement.querySelectorAll(
          'a.govuk-link.govuk-link--no-visited-state',
        ) as NodeListOf<HTMLAnchorElement>,
      ).find((anchor) => anchor.textContent?.trim().startsWith('Remove')) as HTMLAnchorElement | undefined) ?? null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Company remove alias link not found');

    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const expectedIndex = component.aliasControls.length - 1;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeAliasSpy = vi.spyOn<any, any>(component, 'removeAlias');

    link.dispatchEvent(event);

    expect(removeAliasSpy).toHaveBeenCalledWith(expectedIndex, 'fm_company_details_aliases', event);
  });

  it('should maintain unique alias input IDs after removing and adding an alias', () => {
    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    const aliases = component.form.get('fm_company_details_aliases') as FormArray;

    aliases.at(0).get('fm_company_details_alias_company_name_0')?.setValue('FIRST COMPANY');
    aliases.at(1).get('fm_company_details_alias_company_name_1')?.setValue('SECOND COMPANY');
    aliases.at(2).get('fm_company_details_alias_company_name_2')?.setValue('THIRD COMPANY');

    const secondAliasControl = aliases.at(1).get('fm_company_details_alias_company_name_1');
    const thirdAliasControl = aliases.at(2).get('fm_company_details_alias_company_name_2');

    component.removeAndRenumberAlias(0);

    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')).toBe(secondAliasControl);
    expect(aliases.at(1).get('fm_company_details_alias_company_name_1')).toBe(thirdAliasControl);
    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')?.value).toBe('SECOND COMPANY');
    expect(aliases.at(1).get('fm_company_details_alias_company_name_1')?.value).toBe('THIRD COMPANY');

    component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');

    fixture.detectChanges();

    const aliasInputs = fixture.nativeElement.querySelectorAll(
      'input[id^="fm_company_details_alias_company_name_"]',
    ) as NodeListOf<HTMLInputElement>;

    const inputIds = Array.from(aliasInputs, (input) => input.id);

    expect(aliasInputs).toHaveLength(3);
    expect(new Set(inputIds).size).toBe(inputIds.length);
  });

  it('should renumber aliases and preserve values when removing the middle alias', () => {
    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    const aliases = component.form.get('fm_company_details_aliases') as FormArray;

    aliases.at(0).get('fm_company_details_alias_company_name_0')?.setValue('FIRST COMPANY');
    aliases.at(1).get('fm_company_details_alias_company_name_1')?.setValue('SECOND COMPANY');
    aliases.at(2).get('fm_company_details_alias_company_name_2')?.setValue('THIRD COMPANY');

    const firstControl = aliases.at(0).get('fm_company_details_alias_company_name_0');
    const thirdControl = aliases.at(2).get('fm_company_details_alias_company_name_2');

    component.removeAndRenumberAlias(1);
    fixture.detectChanges();

    expect(aliases).toHaveLength(2);

    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')).toBe(firstControl);
    expect(aliases.at(1).get('fm_company_details_alias_company_name_1')).toBe(thirdControl);

    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')?.value).toBe('FIRST COMPANY');
    expect(aliases.at(1).get('fm_company_details_alias_company_name_1')?.value).toBe('THIRD COMPANY');

    const inputIds = Array.from(
      fixture.nativeElement.querySelectorAll('input[id^="fm_company_details_alias_company_name_"]'),
      (input) => (input as HTMLInputElement).id,
    );

    expect(inputIds).toEqual(['fm_company_details_alias_company_name_0', 'fm_company_details_alias_company_name_1']);

    const secondAlias = aliases.at(1).get('fm_company_details_alias_company_name_1');

    secondAlias?.setValue('');
    secondAlias?.markAsTouched();
    secondAlias?.updateValueAndValidity();

    const submitEvent = {
      submitter: { className: '' },
    } as SubmitEvent;

    component.handleFormSubmit(submitEvent);

    expect(component.formErrorSummaryMessage).toContainEqual({
      fieldId: 'fm_company_details_alias_company_name_1',
      message: 'Enter alias 2 company name',
    });
  });

  it('should remove the final alias and hide Remove buttons when one alias remains', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);
    component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons).toHaveLength(2);

    removeButtons[1].click();
    fixture.detectChanges();

    const headings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    expect(component.aliasControls).toHaveLength(1);
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent?.trim()).toBe('Alias 1');

    expect(aliasContainer.querySelectorAll('button.moj-add-another__remove-button')).toHaveLength(0);
    expect(aliasContainer.querySelector('#addAlias')).not.toBeNull();
  });

  it('should remove the first alias and hide Remove buttons when one alias remains', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);
    component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');

    const aliases = component.form.get('fm_company_details_aliases') as FormArray;
    aliases.at(1).get('fm_company_details_alias_company_name_1')?.setValue('SECOND COMPANY');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons).toHaveLength(2);

    removeButtons[0].click();
    fixture.detectChanges();

    const heading = aliasContainer.querySelector(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as HTMLHeadingElement | null;

    expect(component.aliasControls).toHaveLength(1);
    expect(heading?.textContent?.trim()).toBe('Alias 1');
    expect(aliasContainer.querySelectorAll('button.moj-add-another__remove-button')).toHaveLength(0);
    expect(aliasContainer.querySelector('#addAlias')).not.toBeNull();

    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')?.value).toBe('SECOND COMPANY');
  });

  it('should renumber remaining aliases when removing the first of three aliases', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    const aliases = component.form.get('fm_company_details_aliases') as FormArray;
    aliases.at(1).get('fm_company_details_alias_company_name_1')?.setValue('SECOND COMPANY');
    aliases.at(2).get('fm_company_details_alias_company_name_2')?.setValue('THIRD COMPANY');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons).toHaveLength(3);

    removeButtons[0].click();
    fixture.detectChanges();

    const headings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    const remainingButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual(['Alias 1 of 2', 'Alias 2 of 2']);

    expect(Array.from(remainingButtons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
    ]);

    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')?.value).toBe('SECOND COMPANY');
    expect(aliases.at(1).get('fm_company_details_alias_company_name_1')?.value).toBe('THIRD COMPANY');

    // Editing the surviving first alias must not overwrite the second alias.
    const firstInput = aliasContainer.querySelector('#fm_company_details_alias_company_name_0') as HTMLInputElement;

    const secondInput = aliasContainer.querySelector('#fm_company_details_alias_company_name_1') as HTMLInputElement;

    expect(firstInput).not.toBeNull();
    expect(secondInput).not.toBeNull();

    firstInput.value = 'edited';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')?.value).toBe('EDITED');
    expect(aliases.at(1).get('fm_company_details_alias_company_name_1')?.value).toBe('THIRD COMPANY');
    expect(secondInput.value).toBe('THIRD COMPANY');
  });

  it('should update displayed validation errors after removing the first alias', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    const aliases = component.form.get('fm_company_details_aliases') as FormArray;

    aliases.at(0).get('fm_company_details_alias_company_name_0')?.setValue('FIRST');
    aliases.at(1).get('fm_company_details_alias_company_name_1')?.setValue('');
    aliases.at(2).get('fm_company_details_alias_company_name_2')?.setValue('');

    component.handleFormSubmit({ submitter: { className: '' } } as SubmitEvent);
    fixture.detectChanges();

    expect(component.formErrorSummaryMessage).toContainEqual({
      fieldId: 'fm_company_details_alias_company_name_1',
      message: 'Enter alias 2 company name',
    });

    expect(component.formErrorSummaryMessage).toContainEqual({
      fieldId: 'fm_company_details_alias_company_name_2',
      message: 'Enter alias 3 company name',
    });

    const container = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = container.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    removeButtons[0].click();
    fixture.detectChanges();

    expect(aliases).toHaveLength(2);

    expect(component.formErrorSummaryMessage).toEqual(
      expect.arrayContaining([
        {
          fieldId: 'fm_company_details_alias_company_name_0',
          message: 'Enter alias 1 company name',
        },
        {
          fieldId: 'fm_company_details_alias_company_name_1',
          message: 'Enter alias 2 company name',
        },
      ]),
    );

    expect(
      component.formErrorSummaryMessage.some((error) => error.fieldId === 'fm_company_details_alias_company_name_2'),
    ).toBe(false);

    expect(component.formControlErrorMessages['fm_company_details_alias_company_name_0']).toBe(
      'Enter alias 1 company name',
    );
    expect(component.formControlErrorMessages['fm_company_details_alias_company_name_1']).toBe(
      'Enter alias 2 company name',
    );
  });

  it('should not display validation errors when removing an alias before submission', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 2) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    fixture.detectChanges();

    expect(component.formErrorSummaryMessage).toHaveLength(0);

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll<HTMLButtonElement>('button.moj-add-another__remove-button');

    expect(removeButtons).toHaveLength(2);

    removeButtons[1].click();
    fixture.detectChanges();

    expect(component.aliasControls).toHaveLength(1);
    expect(component.formErrorSummaryMessage).toHaveLength(0);

    expect(Object.values(component.formControlErrorMessages).filter((message) => message != null)).toHaveLength(0);

    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
  });

  it('should renumber remaining aliases when removing the final alias from three', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    const aliases = component.form.get('fm_company_details_aliases') as FormArray;
    aliases.at(0).get('fm_company_details_alias_company_name_0')?.setValue('FIRST COMPANY');
    aliases.at(1).get('fm_company_details_alias_company_name_1')?.setValue('SECOND COMPANY');
    aliases.at(2).get('fm_company_details_alias_company_name_2')?.setValue('THIRD COMPANY');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons).toHaveLength(3);

    removeButtons[2].click();
    fixture.detectChanges();

    const headings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    const remainingButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(component.aliasControls).toHaveLength(2);

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual(['Alias 1 of 2', 'Alias 2 of 2']);

    expect(Array.from(remainingButtons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
    ]);

    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')?.value).toBe('FIRST COMPANY');
    expect(aliases.at(1).get('fm_company_details_alias_company_name_1')?.value).toBe('SECOND COMPANY');

    expect(aliasContainer.querySelector('#addAlias')).not.toBeNull();
  });

  it('should renumber remaining aliases when removing the middle alias through the UI', () => {
    globalStore.setFeatureFlags({
      [RELEASE_1A_1_2_FEATURE_FLAG]: true,
    });

    component.form.get('fm_company_details_add_alias')?.setValue(true);

    while (component.aliasControls.length < 3) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }

    const aliases = component.form.get('fm_company_details_aliases') as FormArray;

    aliases.at(0).get('fm_company_details_alias_company_name_0')?.setValue('FIRST COMPANY');
    aliases.at(1).get('fm_company_details_alias_company_name_1')?.setValue('SECOND COMPANY');
    aliases.at(2).get('fm_company_details_alias_company_name_2')?.setValue('THIRD COMPANY');

    fixture.detectChanges();

    const aliasContainer = fixture.nativeElement.querySelector(
      '[formArrayName="fm_company_details_aliases"]',
    ) as HTMLElement;

    const removeButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(removeButtons).toHaveLength(3);

    // Remove Alias 2 (the middle alias).
    removeButtons[1].click();
    fixture.detectChanges();

    const headings = aliasContainer.querySelectorAll(
      'legend.govuk-fieldset__legend h2.govuk-heading-m',
    ) as NodeListOf<HTMLHeadingElement>;

    const remainingButtons = aliasContainer.querySelectorAll(
      'button.moj-add-another__remove-button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(component.aliasControls).toHaveLength(2);

    expect(Array.from(headings, (heading) => heading.textContent?.trim())).toEqual(['Alias 1 of 2', 'Alias 2 of 2']);

    expect(Array.from(remainingButtons, (button) => button.textContent?.trim())).toEqual([
      'Remove alias 1',
      'Remove alias 2',
    ]);

    expect(aliases.at(0).get('fm_company_details_alias_company_name_0')?.value).toBe('FIRST COMPANY');
    expect(aliases.at(1).get('fm_company_details_alias_company_name_1')?.value).toBe('THIRD COMPANY');

    expect(aliasContainer.querySelector('#addAlias')).not.toBeNull();
  });

  it('should emit form submit event with form value - nestedFlow true', () => {
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

  it('should emit form submit event with form value - nestedFlow false', () => {
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

  it('should set up the company details form', () => {
    component['setupCompanyDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('fm_company_details_company_name')).toBeTruthy();
    expect(component.form.get('fm_company_details_add_alias')).toBeTruthy();
    expect(component.form.get('fm_company_details_aliases')).toBeTruthy();
    expect(component.form.get('fm_company_details_address_line_1')).toBeTruthy();
    expect(component.form.get('fm_company_details_address_line_2')).toBeTruthy();
    expect(component.form.get('fm_company_details_address_line_3')).toBeTruthy();
    expect(component.form.get('fm_company_details_postcode')).toBeTruthy();
  });

  it('should validate postcode format using alphanumericTextPattern', () => {
    const postcodeControl = component.form.get('fm_company_details_postcode');

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(false);

    postcodeControl?.setValue('SW1A-1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(true);
  });

  it('should validate postcode max length', () => {
    const postcodeControl = component.form.get('fm_company_details_postcode');

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);

    postcodeControl?.setValue('SW1A 1AAA');
    expect(postcodeControl?.hasError('maxlength')).toBe(true);
  });

  it('should trim only surrounding whitespace from the postcode input on focusout', () => {
    const postcodeInput = fixture.nativeElement.querySelector(
      'input[name="fm_company_details_postcode"]',
    ) as HTMLInputElement | null;
    if (!postcodeInput) throw new Error('Postcode input not found');

    const postcodeControl = component.form.get('fm_company_details_postcode');

    postcodeControl?.setValue('  AB1  3CD ');
    postcodeInput.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();

    expect(postcodeControl?.value).toBe('AB1  3CD');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);
  });

  it('should set up the alias configuration for the company details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(FINES_MAC_COMPANY_DETAILS_ALIAS.map((item) => item.controlName));
    expect(component.aliasControlsValidation).toEqual(FINES_MAC_COMPANY_DETAILS_ALIAS);
  });

  it('should call the necessary setup methods', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupCompanyDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setUpAliasCheckboxListener');

    component['initialCompanyDetailsSetup']();

    expect(component['setupCompanyDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(finesMacStore.companyDetails().formData['fm_company_details_aliases'].length).keys()],
      'fm_company_details_aliases',
    );
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.companyDetails().formData);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith(
      'fm_company_details_add_alias',
      'fm_company_details_aliases',
    );
  });
});
