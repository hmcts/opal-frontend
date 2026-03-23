import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FinesConSearchAccountFormComponent } from './fines-con-search-account-form.component';
import { FinesConStore } from '../../../stores/fines-con.store';
import { FinesConStoreType } from '../../../stores/types/fines-con-store.type';
import { FINES_CON_ROUTING_PATHS } from '../../../routing/constants/fines-con-routing-paths.constant';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';

describe('FinesConSearchAccountFormComponent', () => {
  let component: FinesConSearchAccountFormComponent;
  let fixture: ComponentFixture<FinesConSearchAccountFormComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    const activatedRouteSpy = {
      params: { subscribe: () => {} },
      queryParams: { subscribe: () => {} },
      parent: {},
    };
    const routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesConSearchAccountFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchAccountFormComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);
    component.defendantType = 'individual';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept defendantType input', () => {
    expect(component.defendantType).toBe('individual');

    component.defendantType = 'company';
    fixture.detectChanges();
    expect(component.defendantType).toBe('company');
  });

  it('should have all quick search form controls', () => {
    expect(component.form.get('fcon_search_account_number')).toBeTruthy();
  });

  it('should have individuals nested search group when defendantType is individual', () => {
    component.defendantType = 'individual';
    expect(component.form.get('fcon_search_account_individuals_search_criteria')).toBeTruthy();
  });

  it('should have company search form controls when defendantType is company', () => {
    component.defendantType = 'company';
    // Verify that the component has the basic controls created by setupSearchAccountForm
    expect(component.form.get('fcon_search_account_number')).toBeTruthy();
    expect(component.form.get('fcon_search_account_national_insurance_number')).toBeTruthy();
  });

  it('should call store.updateSearchAccountFormTemporary with form value when setSearchAccountTemporary is called', () => {
    const updateSpy = vi.spyOn(finesConStore, 'updateSearchAccountFormTemporary');
    const formValue = { fcon_search_account_number: '12345678' };
    component.form.patchValue(formValue);

    component.setSearchAccountTemporary();

    expect(updateSpy).toHaveBeenCalledWith(component.form.value);
  });

  it('should persist form state to store on ngOnDestroy', () => {
    const updateSpy = vi.spyOn(finesConStore, 'updateSearchAccountFormTemporary');
    component.form.patchValue({ fcon_search_account_number: '12345678' });

    component.ngOnDestroy();

    expect(updateSpy).toHaveBeenCalledWith(component.form.value);
  });

  it('should reset form when clearSearchForm is called', () => {
    const formValue = { fcon_search_account_number: '12345678' };
    component.form.patchValue(formValue);
    expect(component.form.get('fcon_search_account_number')?.value).toBe('12345678');

    component.clearSearchForm(new Event('click'));

    expect(component.form.get('fcon_search_account_number')?.value).toBeNull();
  });

  it('should persist form and navigate to search error page when conflicting criteria are submitted', () => {
    const router = TestBed.inject(Router);
    const updateTemporarySpy = vi.spyOn(finesConStore, 'updateSearchAccountFormTemporary');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitEmitSpy = vi.spyOn<any, any>(component['formSubmit'], 'emit');

    component.form.patchValue({
      fcon_search_account_number: '12345678',
      fcon_search_account_national_insurance_number: 'AB123456C',
    });

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(updateTemporarySpy).toHaveBeenCalledWith(component.form.value);
    expect(router.navigate).toHaveBeenCalledWith([FINES_CON_ROUTING_PATHS.children.searchError], {
      relativeTo: component['activatedRoute'].parent,
    });
    expect(submitEmitSpy).not.toHaveBeenCalled();
  });

  it('should not call super.handleFormSubmit when form is empty (formEmpty)', () => {
    const superSubmitSpy = vi.spyOn(AbstractFormBaseComponent.prototype, 'handleFormSubmit');

    component.form.reset();
    component.form.updateValueAndValidity({ emitEvent: false });
    expect(component.form.errors?.['formEmpty']).toBe(true);

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(superSubmitSpy).not.toHaveBeenCalled();
  });

  it('should call super.handleFormSubmit when form submission is valid', () => {
    const superSubmitSpy = vi.spyOn(AbstractFormBaseComponent.prototype, 'handleFormSubmit');
    const router = TestBed.inject(Router);

    component.form.patchValue({
      fcon_search_account_number: '12345678',
    });
    component.form.updateValueAndValidity({ emitEvent: false });
    expect(component.form.errors).toBeNull();

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(superSubmitSpy).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalledWith([FINES_CON_ROUTING_PATHS.children.searchError], {
      relativeTo: component['activatedRoute'].parent,
    });
  });
});
