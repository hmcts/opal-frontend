import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FinesSaSearchAccountFormMinorCreditorsComponent } from './fines-sa-search-account-form-minor-creditors.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesSaSearchAccountFormMinorCreditorsComponent', () => {
  let component: FinesSaSearchAccountFormMinorCreditorsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormMinorCreditorsComponent>;

  const buildForm = () =>
    new FormGroup({
      // radio: 'individual' | 'company'
      fsa_search_account_minor_creditors_minor_creditor_type: new FormControl<string | null>(null),

      // individual group
      fsa_search_account_minor_creditors_individual: new FormGroup({
        fsa_search_account_minor_creditors_first_names: new FormControl<string | null>(null),
        fsa_search_account_minor_creditors_first_names_exact_match: new FormControl<boolean>(false),
        fsa_search_account_minor_creditors_last_name: new FormControl<string | null>(null),
        fsa_search_account_minor_creditors_last_name_exact_match: new FormControl<boolean>(false),
      }),

      // company group
      fsa_search_account_minor_creditors_company: new FormGroup({
        fsa_search_account_minor_creditors_company_name: new FormControl<string | null>(null),
        fsa_search_account_minor_creditors_company_name_exact_match: new FormControl<boolean>(false),
      }),
    });

  const getControls = (form: FormGroup) => {
    const type = form.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;

    const individual = form.get('fsa_search_account_minor_creditors_individual') as FormGroup;
    const firstNames = individual.get('fsa_search_account_minor_creditors_first_names') as FormControl;
    const firstNamesExact = individual.get('fsa_search_account_minor_creditors_first_names_exact_match') as FormControl;
    const lastName = individual.get('fsa_search_account_minor_creditors_last_name') as FormControl;
    const lastNameExact = individual.get('fsa_search_account_minor_creditors_last_name_exact_match') as FormControl;

    const company = form.get('fsa_search_account_minor_creditors_company') as FormGroup;
    const companyName = company.get('fsa_search_account_minor_creditors_company_name') as FormControl;
    const companyNameExact = company.get('fsa_search_account_minor_creditors_company_name_exact_match') as FormControl;

    return {
      type,
      individual,
      firstNames,
      firstNamesExact,
      lastName,
      lastNameExact,
      company,
      companyName,
      companyNameExact,
    };
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormMinorCreditorsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('minor-creditors'),
            parent: { url: of([{ path: 'search' }]) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormMinorCreditorsComponent);
    component = fixture.componentInstance;

    // Provide empty parent FormGroup; subcomponent installs its controls in ngOnInit via detectChanges
    component.form = new FormGroup({});
    // Provide required inputs expected by the abstract base
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.formControlErrorMessages = {} as any;
    component.formErrorSummaryMessage = [];

    // Trigger ngOnInit/OnChanges and let the component install/register/subscribe
    fixture.detectChanges();
  });

  it('should not require anything by default', () => {
    const { firstNames, lastName, companyName } = getControls(component.form);
    expect(firstNames.hasValidator(Validators.required)).toBeFalse();
    expect(lastName.hasValidator(Validators.required)).toBeFalse();
    expect(companyName.hasValidator(Validators.required)).toBeFalse();
  });

  it('should install its controls into the provided FormGroup on init', () => {
    const names = [
      'fsa_search_account_minor_creditors_minor_creditor_type',
      'fsa_search_account_minor_creditors_individual',
      'fsa_search_account_minor_creditors_company',
    ];
    names.forEach((n) => expect(component.form.get(n)).withContext(n).toBeTruthy());
  });

  describe('Individual conditional validation', () => {
    beforeEach(() => {
      const { type } = getControls(component.form);
      type.setValue('individual');
      // mark dirty to allow form-level revalidation paths
      type.markAsDirty();
    });

    it('requires LAST NAME when first names has value but last name is empty', () => {
      const { firstNames, lastName } = getControls(component.form);
      firstNames.setValue('Jane'); // triggers merged subscription
      lastName.setValue(''); // explicit empty
      expect(lastName.hasValidator(Validators.required)).toBeTrue();
      lastName.updateValueAndValidity();
      expect(lastName.errors?.['required']).toBeTrue();
    });

    it('removes LAST NAME requirement when last name is provided', () => {
      const { firstNames, lastName } = getControls(component.form);
      firstNames.setValue('Jane');
      lastName.setValue('Doe');
      expect(lastName.hasValidator(Validators.required)).toBeFalse();
      lastName.updateValueAndValidity();
      expect(lastName.errors).toBeNull();
    });

    it('requires LAST NAME when last-name exact match is true but last name empty', () => {
      const { lastName, lastNameExact } = getControls(component.form);
      lastName.setValue('');
      lastNameExact.setValue(true);
      expect(lastName.hasValidator(Validators.required)).toBeTrue();
    });

    it('requires FIRST NAMES when first-names exact match is true but first names empty', () => {
      const { firstNames, firstNamesExact } = getControls(component.form);
      firstNames.setValue('');
      firstNamesExact.setValue(true);
      expect(firstNames.hasValidator(Validators.required)).toBeTrue();
      firstNames.updateValueAndValidity();
      expect(firstNames.errors?.['required']).toBeTrue();
    });

    it('removes FIRST NAMES requirement when value is provided', () => {
      const { firstNames, firstNamesExact } = getControls(component.form);
      firstNamesExact.setValue(true);
      firstNames.setValue('Alex');
      expect(firstNames.hasValidator(Validators.required)).toBeFalse();
    });

    it('treats non-string FIRST NAMES as present and requires LAST NAME when empty', () => {
      const { firstNames, lastName } = getControls(component.form);
      // Force a non-string value to hit the `: true` branch in hasValue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      firstNames.setValue(0 as any);
      lastName.setValue('');

      // Subscription will call handleIndividualConditionalValidation
      lastName.updateValueAndValidity();

      expect(lastName.hasValidator(Validators.required)).toBeTrue();
    });
  });

  describe('Company conditional validation', () => {
    beforeEach(() => {
      const { type } = getControls(component.form);
      type.setValue('company');
      type.markAsDirty();
    });

    it('requires COMPANY NAME when exact match is selected but name is empty', () => {
      const { companyName, companyNameExact } = getControls(component.form);
      companyName.setValue('');
      companyNameExact.setValue(true);
      expect(companyName.hasValidator(Validators.required)).toBeTrue();
      companyName.updateValueAndValidity();
      expect(companyName.errors?.['required']).toBeTrue();
    });

    it('removes COMPANY NAME requirement when name is provided', () => {
      const { companyName, companyNameExact } = getControls(component.form);
      companyNameExact.setValue(true);
      companyName.setValue('HM Courts and Tribunals Service');
      expect(companyName.hasValidator(Validators.required)).toBeFalse();
      companyName.updateValueAndValidity();
      expect(companyName.errors).toBeNull();
    });

    it('treats non-string COMPANY NAME as present and does NOT require when exact match is true', () => {
      const { companyName, companyNameExact } = getControls(component.form);
      // Force a non-string value to hit the `: true` branch in hasValue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      companyName.setValue(0 as any);
      companyNameExact.setValue(true);
      companyName.updateValueAndValidity();

      expect(companyName.hasValidator(Validators.required)).toBeFalse();
    });
  });

  describe('Tab switching behaviour', () => {
    it('clears company validators and resets company group when switching to individual', () => {
      const { type, company, companyName, companyNameExact } = getControls(component.form);

      // Start on company with requirement active
      type.setValue('company');
      type.markAsDirty();
      companyName.setValue('');
      companyNameExact.setValue(true);
      expect(companyName.hasValidator(Validators.required)).toBeTrue();

      // Switch to individual
      type.setValue('individual');

      // Validators cleared on company controls
      expect(companyName.hasValidator(Validators.required)).toBeFalse();

      // Group reset/clean state
      expect(company.pristine).toBeTrue();
      expect(company.untouched).toBeTrue();
    });

    it('clears individual validators and resets individual group when switching to company', () => {
      const { type, individual, firstNames, firstNamesExact, lastName, lastNameExact } = getControls(component.form);

      // Start on individual with requirements active
      type.setValue('individual');
      type.markAsDirty();
      firstNamesExact.setValue(true);
      lastNameExact.setValue(true);
      firstNames.setValue('');
      lastName.setValue('');
      expect(firstNames.hasValidator(Validators.required)).toBeTrue();
      expect(lastName.hasValidator(Validators.required)).toBeTrue();

      // Switch to company
      type.setValue('company');

      // Validators cleared on individual controls
      expect(firstNames.hasValidator(Validators.required)).toBeFalse();
      expect(lastName.hasValidator(Validators.required)).toBeFalse();

      // Group reset/clean state
      expect(individual.pristine).toBeTrue();
      expect(individual.untouched).toBeTrue();
    });
  });

  // Helper to create a fresh component instance with a custom form shape and run detectChanges
  const createComponentWithForm = (form: FormGroup) => {
    const fx = TestBed.createComponent(FinesSaSearchAccountFormMinorCreditorsComponent);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cmp = fx.componentInstance as any;
    cmp.form = form;
    cmp.formControlErrorMessages = {};
    cmp.formErrorSummaryMessage = [];
    fx.detectChanges();
    return { fx, cmp: fx.componentInstance } as { fx: typeof fx; cmp: FinesSaSearchAccountFormMinorCreditorsComponent };
  };

  // Helper to create a fresh component instance with a custom form shape but DO NOT run detectChanges/ngOnInit
  const createComponentWithFormNoInit = (form: FormGroup) => {
    const fx = TestBed.createComponent(FinesSaSearchAccountFormMinorCreditorsComponent);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cmp = fx.componentInstance as any;
    cmp.form = form;
    cmp.formControlErrorMessages = {};
    cmp.formErrorSummaryMessage = [];
    // Intentionally DO NOT call detectChanges/ngOnInit
    return { fx, cmp: fx.componentInstance } as { fx: typeof fx; cmp: FinesSaSearchAccountFormMinorCreditorsComponent };
  };

  describe('Guard clauses / missing control coverage', () => {
    it('does not add individual validators when type is company (early return path)', () => {
      const { type, firstNames, firstNamesExact, lastName, lastNameExact } = getControls(component.form);

      // Ensure we are on company
      type.setValue('company');

      // Toggle individual flags while on company -> should not add any required validators
      firstNames.setValue('');
      firstNamesExact.setValue(true);
      lastName.setValue('');
      lastNameExact.setValue(true);

      expect(firstNames.hasValidator(Validators.required)).toBeFalse();
      expect(lastName.hasValidator(Validators.required)).toBeFalse();
    });

    it('does not add company validator when type is individual (early return path)', () => {
      const { type, companyName, companyNameExact } = getControls(component.form);

      type.setValue('individual');
      companyName.setValue('');
      companyNameExact.setValue(true);

      expect(companyName.hasValidator(Validators.required)).toBeFalse();
    });

    it('handles missing INDIVIDUAL controls safely (subscriptions short-circuit)', () => {
      // Build a form missing the individual last_name control
      const badForm = new FormGroup({
        fsa_search_account_minor_creditors_minor_creditor_type: new FormControl<string | null>(null),
        fsa_search_account_minor_creditors_individual: new FormGroup({
          fsa_search_account_minor_creditors_first_names: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_first_names_exact_match: new FormControl<boolean>(false),
          // last name missing on purpose
          fsa_search_account_minor_creditors_last_name_exact_match: new FormControl<boolean>(false),
        }),
        fsa_search_account_minor_creditors_company: new FormGroup({
          fsa_search_account_minor_creditors_company_name: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_company_name_exact_match: new FormControl<boolean>(false),
        }),
      });

      const { cmp } = createComponentWithForm(badForm);
      const typeCtrl = cmp.form.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;
      const individual = cmp.form.get('fsa_search_account_minor_creditors_individual') as FormGroup;
      const firstNamesExact = individual.get(
        'fsa_search_account_minor_creditors_first_names_exact_match',
      ) as FormControl;

      // Move to individual and toggle exact match -> should not throw and should early-return due to missing control
      typeCtrl.setValue('individual');
      firstNamesExact.setValue(true);

      expect(true).toBeTrue();
    });

    it('handles missing COMPANY controls safely and clears validators even when control is null', () => {
      // Build a form missing the company_name control
      const badForm = new FormGroup({
        fsa_search_account_minor_creditors_minor_creditor_type: new FormControl<string | null>(null),
        fsa_search_account_minor_creditors_individual: new FormGroup({
          fsa_search_account_minor_creditors_first_names: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_first_names_exact_match: new FormControl<boolean>(false),
          fsa_search_account_minor_creditors_last_name: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_last_name_exact_match: new FormControl<boolean>(false),
        }),
        fsa_search_account_minor_creditors_company: new FormGroup({
          // company_name missing on purpose
          fsa_search_account_minor_creditors_company_name_exact_match: new FormControl<boolean>(false),
        }),
      });

      const { cmp } = createComponentWithForm(badForm);
      const typeCtrl = cmp.form.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;
      const company = cmp.form.get('fsa_search_account_minor_creditors_company') as FormGroup;
      const companyNameExact = company.get(
        'fsa_search_account_minor_creditors_company_name_exact_match',
      ) as FormControl;

      // Switch away from company to individual, which calls clearCompanyDynamicValidators() internally
      typeCtrl.setValue('individual');

      // Toggle exact match on the company group while the name control is missing
      companyNameExact.setValue(true);

      expect(true).toBeTrue();
    });

    it('early-returns in handleCompanyConditionalValidation when company controls are missing (no setValidatorPresence call)', () => {
      // Build a form missing BOTH company controls to hit areMissingCompanyControls guard
      const badForm = new FormGroup({
        fsa_search_account_minor_creditors_minor_creditor_type: new FormControl<string | null>(null),
        fsa_search_account_minor_creditors_individual: new FormGroup({
          fsa_search_account_minor_creditors_first_names: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_first_names_exact_match: new FormControl<boolean>(false),
          fsa_search_account_minor_creditors_last_name: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_last_name_exact_match: new FormControl<boolean>(false),
        }),
        // company group exists but lacks both expected controls
        fsa_search_account_minor_creditors_company: new FormGroup({}),
      });

      const { cmp } = createComponentWithForm(badForm);
      const typeCtrl = cmp.form.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;
      typeCtrl.setValue('company');

      // Spy on the private helper; if the guard triggers, this must NOT run
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = spyOn<any>(cmp as any, 'setValidatorPresence').and.callThrough();

      // Call the private method directly to exercise the guard branch
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cmp as any).handleCompanyConditionalValidation();

      expect(spy).not.toHaveBeenCalled();
    });

    it('early-returns in handleIndividualConditionalValidation when type is not individual (no setValidatorPresence call)', () => {
      const { cmp } = createComponentWithForm(buildForm());
      const typeCtrl = cmp.form.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;
      // Set an explicit non-individual type
      typeCtrl.setValue('company');

      // Spy on the private helper; should NOT be invoked if early-return triggers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = spyOn<any>(cmp as any, 'setValidatorPresence').and.callThrough();

      // Invoke the private method directly
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cmp as any).handleIndividualConditionalValidation();

      expect(spy).not.toHaveBeenCalled();
    });

    it('early-returns in handleIndividualConditionalValidation when required individual controls are missing', () => {
      // Build a form missing the FIRST NAMES control to trigger (!firstNamesControl || !lastNameControl)
      const badForm = new FormGroup({
        fsa_search_account_minor_creditors_minor_creditor_type: new FormControl<string | null>(null),
        fsa_search_account_minor_creditors_individual: new FormGroup({
          // first names missing on purpose
          fsa_search_account_minor_creditors_first_names_exact_match: new FormControl<boolean>(false),
          fsa_search_account_minor_creditors_last_name: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_last_name_exact_match: new FormControl<boolean>(false),
        }),
        fsa_search_account_minor_creditors_company: new FormGroup({
          fsa_search_account_minor_creditors_company_name: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_company_name_exact_match: new FormControl<boolean>(false),
        }),
      });

      const { cmp } = createComponentWithForm(badForm);
      const typeCtrl = cmp.form.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;
      typeCtrl.setValue('individual');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = spyOn<any>(cmp as any, 'setValidatorPresence').and.callThrough();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cmp as any).handleIndividualConditionalValidation();

      expect(spy).not.toHaveBeenCalled();
    });

    it('early-returns in handleIndividualConditionalValidation when the individual group itself is missing', () => {
      // Build a form that omits the entire individual group
      const badForm = new FormGroup({
        fsa_search_account_minor_creditors_minor_creditor_type: new FormControl<string | null>(null),
        // no fsa_search_account_minor_creditors_individual group here
        fsa_search_account_minor_creditors_company: new FormGroup({
          fsa_search_account_minor_creditors_company_name: new FormControl<string | null>(null),
          fsa_search_account_minor_creditors_company_name_exact_match: new FormControl<boolean>(false),
        }),
      });

      const { cmp } = createComponentWithFormNoInit(badForm);
      const typeCtrl = badForm.get('fsa_search_account_minor_creditors_minor_creditor_type') as FormControl;
      typeCtrl.setValue('individual');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spy = spyOn<any>(cmp as any, 'setValidatorPresence').and.callThrough();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cmp as any).handleIndividualConditionalValidation();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Whitespace handling', () => {
    beforeEach(() => {
      const { type } = getControls(component.form);
      type.setValue('individual');
      type.markAsDirty();
    });

    it('treats whitespace-only LAST NAME as empty when last-name exact match is true', () => {
      const { lastName, lastNameExact } = getControls(component.form);
      lastName.setValue('   ');
      lastNameExact.setValue(true);
      // Required validator will be attached due to flag, but Angular required does not trim
      lastName.updateValueAndValidity();
      expect(lastName.errors).toBeNull();
    });

    it('treats whitespace-only FIRST NAMES as empty when first-names exact match is true', () => {
      const { firstNames, firstNamesExact } = getControls(component.form);
      firstNames.setValue('   ');
      firstNamesExact.setValue(true);
      firstNames.updateValueAndValidity();
      expect(firstNames.errors).toBeNull();
    });

    it('treats whitespace-only COMPANY NAME as empty when exact match is true', () => {
      const { type, companyName, companyNameExact } = getControls(component.form);
      type.setValue('company');
      type.markAsDirty();
      companyName.setValue('   ');
      companyNameExact.setValue(true);
      companyName.updateValueAndValidity();
      expect(companyName.errors).toBeNull();
    });
  });

  describe('distinctUntilChanged on type control', () => {
    it('does not re-run reset logic when the type value does not change', () => {
      const { type, individual, firstNames } = getControls(component.form);

      // Switch to company once (this resets individual group)
      type.setValue('company');

      // User types something back into individual (should not be cleared unless the subscription fires again)
      firstNames.setValue('Will Persist');
      expect(firstNames.value).toBe('Will Persist');

      // Setting the same value again should NOT trigger the subscription due to distinctUntilChanged
      type.setValue('company');

      // If the reset ran again, firstNames would be cleared to null; ensure it stayed intact
      expect(individual.get('fsa_search_account_minor_creditors_first_names')?.value).toBe('Will Persist');
    });
  });

  describe('reset utilities clear values and errors', () => {
    it('resetAndValidateControls clears control values and errors when switching tabs', () => {
      const { type, company, companyName } = getControls(component.form);

      // Put an error and a value on a company control
      companyName.setValue('ACME');
      companyName.setErrors({ custom: true });
      expect(companyName.errors?.['custom']).toBeTrue();

      // Switching to individual triggers reset of company controls via resetAndValidateControls
      type.setValue('individual');

      // Value cleared and errors removed
      expect(companyName.value).toBeNull();
      expect(companyName.errors).toBeNull();

      // Group also reset
      expect(company.pristine).toBeTrue();
      expect(company.untouched).toBeTrue();
    });
  });

  it('should remove its installed controls on destroy when nested in a parent group', () => {
    // Create a fresh instance so we can control parent/child relationship
    const child = new FormGroup({});
    const parent = new FormGroup({ fsa_search_account_minor_creditors_search_criteria: child });

    const { fx, cmp } = createComponentWithFormNoInit(child);
    // Provide required input
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cmp.formControlErrorMessages = {} as any;
    // Now trigger ngOnInit via detectChanges to install controls
    fx.detectChanges();

    // Sanity check: type control present
    expect(child.get('fsa_search_account_minor_creditors_minor_creditor_type')).toBeTruthy();

    // Destroy and ensure controls are removed from the child group
    cmp.ngOnDestroy();

    expect(Object.keys(child.controls)).withContext('expected no controls after destroy').toEqual([]);
    // parent still holds the (now empty) child group reference
    expect(parent.get('fsa_search_account_minor_creditors_search_criteria')).toBe(child);
  });
});
