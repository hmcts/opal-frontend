import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccEnfOverrideAddChangeFormComponent } from './fines-acc-enf-override-add-change-form.component';
import { OpalFines } from '@app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT } from '../constants/fines-acc-enf-override-add-change-form-default.constant';

describe('FinesAccEnfOverrideAddChangeFormComponent', () => {
  let component: FinesAccEnfOverrideAddChangeFormComponent;
  let fixture: ComponentFixture<FinesAccEnfOverrideAddChangeFormComponent>;
  let mockOpalFines: Pick<OpalFines, 'getResult'>;

  beforeEach(async () => {
    mockOpalFines = {
      getResult: vi.fn().mockReturnValue(of({ requires_enforcer: false, requires_lja: false })),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfOverrideAddChangeFormComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFines },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, data: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfOverrideAddChangeFormComponent);
    component = fixture.componentInstance;
    component.enforcementActionOptions = [{ value: 'R1', name: 'Result One (R1)' }];
    component.enforcerOptions = [{ value: 'E1', name: 'Enforcer One (E1)' }];
    component.localJusticeAreaOptions = [{ value: 'L1', name: 'LJA One (L1)' }];
    component.partyName = 'John Smith';
    component.accountNumber = '12345678';
    component.pageTitle = 'Add or change an enforcement override';
    component.formValues = FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dependent fields hidden', () => {
    expect(component.showEnforcerField).toBe(false);
    expect(component.showLjaField).toBe(false);
  });

  it('should call handleChangeEnforcementAction on enforcement action change', () => {
    const spy = vi.spyOn(component, 'handleChangeEnforcementAction');
    component.form.get('fenf_account_enforcement_action')?.setValue('R1');
    expect(spy).toHaveBeenCalledWith('R1');
  });

  it('should call handleChangeEnforcementAction with empty string when enforcement action is cleared', () => {
    const spy = vi.spyOn(component, 'handleChangeEnforcementAction');
    component.form.get('fenf_account_enforcement_action')?.setValue(null);
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should call getResult when handleChangeEnforcementAction receives a result id', () => {
    component.handleChangeEnforcementAction('R1');

    expect(mockOpalFines.getResult).toHaveBeenCalledWith('R1');
  });

  it('should hide enforcer and lja fields when handleChangeEnforcementAction receives an empty id', () => {
    const enforcerControl = component.form.get('fenf_account_enforcement_enforcer');
    const ljaControl = component.form.get('fenf_account_enforcement_lja');

    component.showEnforcerField = true;
    component.showLjaField = true;
    enforcerControl?.setValue('E1');
    ljaControl?.setValue('L1');

    component.handleChangeEnforcementAction('');

    expect(mockOpalFines.getResult).not.toHaveBeenCalled();
    expect(component.showEnforcerField).toBe(false);
    expect(component.showLjaField).toBe(false);
    expect(enforcerControl?.value).toBeNull();
    expect(ljaControl?.value).toBeNull();
  });

  it('should show only enforcer field when result requires enforcer', () => {
    mockOpalFines.getResult = vi.fn().mockReturnValue(of({ requires_enforcer: true, requires_lja: false }));
    component.handleChangeEnforcementAction('R1');

    expect(component.showEnforcerField).toBe(true);
    expect(component.showLjaField).toBe(false);
  });

  it('should show only LJA field when result requires LJA', () => {
    mockOpalFines.getResult = vi.fn().mockReturnValue(of({ requires_enforcer: false, requires_lja: true }));
    component.handleChangeEnforcementAction('R1');

    expect(component.showEnforcerField).toBe(false);
    expect(component.showLjaField).toBe(true);
  });

  it('should show both fields when result requires enforcer and LJA', () => {
    mockOpalFines.getResult = vi.fn().mockReturnValue(of({ requires_enforcer: true, requires_lja: true }));
    component.handleChangeEnforcementAction('R1');

    expect(component.showEnforcerField).toBe(true);
    expect(component.showLjaField).toBe(true);
  });

  it('should make enforcer mandatory when enforcer field is shown', () => {
    mockOpalFines.getResult = vi.fn().mockReturnValue(of({ requires_enforcer: true, requires_lja: false }));
    component.handleChangeEnforcementAction('R1');

    const enforcerControl = component.form.get('fenf_account_enforcement_enforcer');
    enforcerControl?.setValue(null);
    enforcerControl?.markAsTouched();

    expect(component.showEnforcerField).toBe(true);
    expect(enforcerControl?.hasError('required')).toBe(true);
  });

  it('should remove enforcer required validation when enforcer field is hidden', () => {
    mockOpalFines.getResult = vi.fn().mockReturnValue(of({ requires_enforcer: true, requires_lja: false }));
    component.handleChangeEnforcementAction('R1');

    component.handleChangeEnforcementAction('');

    const enforcerControl = component.form.get('fenf_account_enforcement_enforcer');
    expect(component.showEnforcerField).toBe(false);
    expect(enforcerControl?.hasError('required')).toBe(false);
  });

  it('should show both fields on init when formValues contain enforcer and lja', () => {
    component.formValues = {
      fenf_account_enforcement_action: 'R1',
      fenf_account_enforcement_enforcer: 'E1',
      fenf_account_enforcement_lja: 'L1',
    };

    component.ngOnInit();

    expect(component.showEnforcerField).toBe(true);
    expect(component.showLjaField).toBe(true);
  });
});
