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

  it('should initialize form controls and disable dependent fields', () => {
    const enforcerControl = component.form.get('fenf_account_enforcement_enforcer');
    const ljaControl = component.form.get('fenf_account_enforcement_lja');

    expect(enforcerControl?.disabled).toBe(true);
    expect(ljaControl?.disabled).toBe(true);
  });

  it('should call handleChangeEnforcementAction on enforcement action change', () => {
    const spy = vi.spyOn(component, 'handleChangeEnforcementAction');
    component.form.get('fenf_account_enforcement_action')?.setValue('R1');
    expect(spy).toHaveBeenCalledWith('R1');
  });

  it('should call getResult when handleChangeEnforcementAction receives a result id', () => {
    component.handleChangeEnforcementAction('R1');

    expect(mockOpalFines.getResult).toHaveBeenCalledWith('R1');
  });

  it('should disable enforcer and lja controls when handleChangeEnforcementAction receives an empty id', () => {
    const enforcerControl = component.form.get('fenf_account_enforcement_enforcer');
    const ljaControl = component.form.get('fenf_account_enforcement_lja');

    enforcerControl?.enable();
    ljaControl?.enable();

    component.handleChangeEnforcementAction('');

    expect(mockOpalFines.getResult).not.toHaveBeenCalled();
    expect(enforcerControl?.disabled).toBe(true);
    expect(ljaControl?.disabled).toBe(true);
  });

  it('should enable only enforcer control when result requires enforcer', () => {
    mockOpalFines.getResult = vi.fn().mockReturnValue(of({ requires_enforcer: true, requires_lja: false }));
    component.handleChangeEnforcementAction('R1');

    const enforcerControl = component.form.get('fenf_account_enforcement_enforcer');
    const ljaControl = component.form.get('fenf_account_enforcement_lja');

    expect(enforcerControl?.enabled).toBe(true);
    expect(ljaControl?.disabled).toBe(true);
  });

  it('should enable only LJA control when result requires LJA', () => {
    mockOpalFines.getResult = vi.fn().mockReturnValue(of({ requires_enforcer: false, requires_lja: true }));
    component.handleChangeEnforcementAction('R1');

    const enforcerControl = component.form.get('fenf_account_enforcement_enforcer');
    const ljaControl = component.form.get('fenf_account_enforcement_lja');

    expect(enforcerControl?.disabled).toBe(true);
    expect(ljaControl?.enabled).toBe(true);
  });

  it('should enable both controls when result requires enforcer and LJA', () => {
    mockOpalFines.getResult = vi.fn().mockReturnValue(of({ requires_enforcer: true, requires_lja: true }));
    component.handleChangeEnforcementAction('R1');

    const enforcerControl = component.form.get('fenf_account_enforcement_enforcer');
    const ljaControl = component.form.get('fenf_account_enforcement_lja');

    expect(enforcerControl?.enabled).toBe(true);
    expect(ljaControl?.enabled).toBe(true);
  });
});
