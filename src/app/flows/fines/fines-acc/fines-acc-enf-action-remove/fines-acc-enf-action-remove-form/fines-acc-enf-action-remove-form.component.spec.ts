import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FINES_ACC_ENF_ACTION_REMOVE_FIELD_ERRORS } from '../constants/fines-acc-enf-action-remove-field-errors.constant';
import { FinesAccEnfActionRemoveFormComponent } from './fines-acc-enf-action-remove-form.component';

describe('FinesAccEnfActionRemoveFormComponent', () => {
  let component: FinesAccEnfActionRemoveFormComponent;
  let fixture: ComponentFixture<FinesAccEnfActionRemoveFormComponent>;

  const createComponent = () => {
    fixture = TestBed.createComponent(FinesAccEnfActionRemoveFormComponent);
    component = fixture.componentInstance;
    component.accountNumber = '177A';
    component.pageTitle = 'Remove enforcement hold';
    component.partyName = 'Mr Robert THOMSON';
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionRemoveFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { params: {}, data: {} } } }],
    }).compileComponents();
  });

  it('renders the remove enforcement hold shell', () => {
    createComponent();

    expect(fixture.nativeElement.textContent).toContain('Remove enforcement hold');
    expect(fixture.nativeElement.textContent).toContain('177A – Mr Robert THOMSON');
    expect(fixture.nativeElement.textContent).toContain('Reason');
    expect(fixture.nativeElement.textContent).toContain('Remove');
  });

  it('exposes the reason input and validates max length and allowed characters', () => {
    createComponent();

    const control = component.form.get('facc_enf_action_remove_reason');

    expect(fixture.nativeElement.querySelector('#facc_enf_action_remove_reason')).toBeTruthy();

    control?.setValue('1234567890123456789012345');
    expect(control?.hasError('maxlength')).toBe(true);
    expect(control?.errors?.['maxlength']).toBeTruthy();

    control?.setValue('bad@reason');
    expect(control?.hasError('alphanumericWithHyphensSpacesApostrophesPattern')).toBe(true);
    expect(control?.errors?.['alphanumericWithHyphensSpacesApostrophesPattern']).toBeTruthy();
  });

  it('maps validation errors to the expected user-facing messages', () => {
    expect(FINES_ACC_ENF_ACTION_REMOVE_FIELD_ERRORS['facc_enf_action_remove_reason']['maxlength'].message).toBe(
      'Reason must be 24 characters or fewer',
    );
    expect(
      FINES_ACC_ENF_ACTION_REMOVE_FIELD_ERRORS['facc_enf_action_remove_reason'][
        'alphanumericWithHyphensSpacesApostrophesPattern'
      ].message,
    ).toBe('Reason must only include letters a to z, numbers, hyphens, spaces and apostrophes');
  });

  it('emits cancelRequested when cancel is clicked', () => {
    createComponent();
    const cancelSpy = vi.spyOn(component.cancelRequested, 'emit');

    component.handleCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('marks the form dirty when a reason has been entered', () => {
    createComponent();
    const input = fixture.nativeElement.querySelector('#facc_enf_action_remove_reason') as HTMLInputElement;

    input.value = 'Removed for review';
    input.dispatchEvent(new Event('input'));

    expect(component.form.get('facc_enf_action_remove_reason')?.dirty).toBe(true);
  });
});
