import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccEnfActionSelectFormComponent } from './fines-acc-enf-action-select-form.component';
import { FINES_ACC_ENF_ACTION_SELECT_ACTION_OPTIONS_MOCK } from '../mocks/fines-acc-enf-action-select-action-options.mock';

describe('FinesAccEnfActionSelectFormComponent', () => {
  let component: FinesAccEnfActionSelectFormComponent;
  let fixture: ComponentFixture<FinesAccEnfActionSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionSelectFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { params: {}, data: {} } } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfActionSelectFormComponent);
    component = fixture.componentInstance;
    component.accountNumber = '123456';
    component.actionOptions = FINES_ACC_ENF_ACTION_SELECT_ACTION_OPTIONS_MOCK;
    component.partyName = 'Mr Test PERSON';
    component.warningMessages = ['There is no collection order on this account'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the enforcement action control as required', () => {
    const control = component.form.get('facc_enf_action');

    expect(control).toBeTruthy();
    expect(control?.hasError('required')).toBe(true);
  });

  it('should emit cancel when handleCancel is called', () => {
    const emitSpy = vi.spyOn(component.cancelRequested, 'emit');

    component.handleCancel();

    expect(emitSpy).toHaveBeenCalled();
  });
});
