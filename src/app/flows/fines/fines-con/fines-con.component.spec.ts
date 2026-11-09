import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesConComponent } from './fines-con.component';
import { FinesConStore } from './stores/fines-con.store';
import { FinesConStoreType } from './stores/types/fines-con-store.type';
import { FINES_CON_SELECT_BU_FORM } from './select-business-unit/fines-con-select-bu/constants/fines-con-select-bu-form.constant';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from './select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-company.mock';

@Component({ selector: 'app-test-consolidation-form-page', template: '' })
class TestFormPage extends AbstractFormParentBaseComponent {}

@Component({ selector: 'app-test-consolidation-search-page', template: '' })
class TestSearchPage {}

describe('FinesConComponent', () => {
  let component: FinesConComponent;
  let fixture: ComponentFixture<FinesConComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesConComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allows unload before the routed outlet is initialised', () => {
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('should reset consolidation state on destroy', () => {
    finesConStore.updateSelectBuFormComplete(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK);
    finesConStore.setStateChanges(true);
    finesConStore.setUnsavedChanges(true);

    const destroySpy = vi.spyOn(component, 'ngOnDestroy');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(finesConStore.selectBuForm()).toEqual(FINES_CON_SELECT_BU_FORM);
    expect(finesConStore.stateChanges()).toBe(false);
    expect(finesConStore.unsavedChanges()).toBe(false);
  });
});

describe('FinesConComponent browser unload protection', () => {
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'consolidation',
            component: FinesConComponent,
            children: [
              { path: 'select-business-unit', component: TestFormPage },
              { path: 'consolidate-accounts', component: TestSearchPage },
            ],
          },
        ]),
      ],
    }).compileComponents();

    finesConStore = TestBed.inject(FinesConStore);
  });

  async function navigateToConsolidation(path = '/consolidation/select-business-unit') {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(path);
    harness.detectChanges();
    const routeElement = harness.routeDebugElement!;
    const component = routeElement.componentInstance as FinesConComponent;
    const outlet = routeElement.query(By.directive(RouterOutlet)).injector.get(RouterOutlet);
    return { component, outlet };
  }

  it('allows unload when the journey has no changes', async () => {
    const { component } = await navigateToConsolidation();

    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('allows unload when the outlet has no active child page', async () => {
    const { component, outlet } = await navigateToConsolidation('/consolidation');

    expect(outlet.isActivated).toBe(false);
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('prevents unload when the business unit form has unsaved changes', async () => {
    const { component, outlet } = await navigateToConsolidation();
    const activePage = outlet.component as TestFormPage;
    activePage.stateUnsavedChanges = true;

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(component.handleBeforeUnload()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });

  it('prevents unload when the account search has unsaved changes', async () => {
    const { component } = await navigateToConsolidation('/consolidation/consolidate-accounts');
    finesConStore.setUnsavedChanges(true);

    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('prevents unload after the user continues into the journey', async () => {
    const { component } = await navigateToConsolidation('/consolidation/consolidate-accounts');
    finesConStore.updateSelectBuForm(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData);

    expect(component.handleBeforeUnload()).toBe(false);
  });
});
