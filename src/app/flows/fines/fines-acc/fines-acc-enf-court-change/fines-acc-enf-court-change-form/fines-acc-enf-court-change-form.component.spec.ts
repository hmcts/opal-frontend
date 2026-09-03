import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccEnfCourtChangeFormComponent } from './fines-acc-enf-court-change-form.component';

describe('FinesAccEnfCourtChangeFormComponent', () => {
  let component: FinesAccEnfCourtChangeFormComponent;
  let fixture: ComponentFixture<FinesAccEnfCourtChangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccEnfCourtChangeFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { params: {}, data: {} } } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfCourtChangeFormComponent);
    component = fixture.componentInstance;
    component.accountNumber = '123456';
    component.courtOptions = [{ value: 101, name: 'Test Court (101)' }];
    component.partyName = 'Mr Test PERSON';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the enforcement court control as required', () => {
    const control = component.form.get('facc_enf_court');

    expect(control).toBeTruthy();
    expect(control?.hasError('required')).toBe(true);
  });

  it('should emit cancel when handleCancel is called', () => {
    const emitSpy = vi.spyOn(component.cancelRequested, 'emit');

    component.handleCancel();

    expect(emitSpy).toHaveBeenCalled();
  });
});
