import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should enforce remove alias link template semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesMacCompanyDetailsFormComponent as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
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

  it('should render remove alias link with href and pass $event into removeAlias', () => {
    component.form.get('fm_company_details_add_alias')?.setValue(true);
    while (component.aliasControls.length < 2) {
      component.addAlias(component.aliasControls.length, 'fm_company_details_aliases');
    }
    fixture.detectChanges();

    const link =
      (Array.from(
        fixture.nativeElement.querySelectorAll('a.govuk-link.govuk-link--no-visited-state') as NodeListOf<HTMLAnchorElement>,
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
    expect(event.defaultPrevented).toBe(true);
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
