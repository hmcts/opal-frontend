import { Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAecComponent } from '../fines-aec/fines-aec.component';
import { FinesDraftCheckAndValidateComponent } from '../fines-draft/fines-draft-check-and-validate/fines-draft-check-and-validate.component';
import { FinesDraftCreateAndManageComponent } from '../fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage.component';
import { FinesDraftComponent } from '../fines-draft/fines-draft.component';
import { FinesFinanceComponent } from '../fines-finance/fines-finance.component';
import { FinesReportsSummaryListStore } from '../fines-reports/fines-reports-summary-list/stores/fines-reports-summary-list.store';
import { FinesReportsComponent } from '../fines-reports/fines-reports.component';

@Component({ selector: 'app-test-flow-form-page', template: '' })
class TestFormPage extends AbstractFormParentBaseComponent {}

@Component({ selector: 'app-test-flow-list-page', template: '' })
class TestListPage {}

interface UnloadProtectedFlow {
  handleBeforeUnload(): boolean;
}

const flowWrappers: { name: string; component: Type<UnloadProtectedFlow> }[] = [
  { name: 'Draft Accounts', component: FinesDraftComponent },
  { name: 'Reports', component: FinesReportsComponent },
  { name: 'Auto-enforcement', component: FinesAecComponent },
  { name: 'Finance', component: FinesFinanceComponent },
];

describe.each(flowWrappers)('$name unload protection', ({ component: flowComponent }) => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'flow',
            component: flowComponent,
            children: [
              { path: 'list', component: TestListPage },
              { path: 'form', component: TestFormPage },
            ],
          },
        ]),
        { provide: OpalFines, useValue: { clearDraftAccountsCache: vi.fn() } },
        { provide: FinesReportsSummaryListStore, useValue: { resetFilters: vi.fn() } },
      ],
    }).compileComponents();
  });

  it('allows unload on a page without unsaved form changes', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/flow/list');
    harness.detectChanges();

    const wrapper = harness.routeDebugElement!.componentInstance as UnloadProtectedFlow;
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(wrapper.handleBeforeUnload()).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });

  it('prevents unload when its routed form has unsaved changes', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/flow/form');
    harness.detectChanges();

    const routeElement = harness.routeDebugElement!;
    const wrapper = routeElement.componentInstance as UnloadProtectedFlow;
    const outlet = routeElement.query(By.directive(RouterOutlet)).injector.get(RouterOutlet);
    const activePage = outlet.component as TestFormPage;

    expect(wrapper.handleBeforeUnload()).toBe(true);

    activePage.stateUnsavedChanges = true;
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(wrapper.handleBeforeUnload()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('Flow wrapper with no active child route', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'finance',
            component: FinesFinanceComponent,
            children: [{ path: 'form', component: TestFormPage }],
          },
        ]),
      ],
    }).compileComponents();
  });

  it('allows unload when the router outlet is inactive', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/finance');
    harness.detectChanges();

    const routeElement = harness.routeDebugElement!;
    const wrapper = routeElement.componentInstance as FinesFinanceComponent;
    const outlet = routeElement.query(By.directive(RouterOutlet)).injector.get(RouterOutlet);
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(outlet.isActivated).toBe(false);
    expect(wrapper.handleBeforeUnload()).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });
});

describe.each([
  { name: 'Create and manage', component: FinesDraftCreateAndManageComponent },
  { name: 'Check and validate', component: FinesDraftCheckAndValidateComponent },
])('Draft Accounts $name nested wrapper', ({ component: nestedComponent }) => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'draft',
            component: FinesDraftComponent,
            children: [
              {
                path: 'section',
                component: nestedComponent,
                children: [{ path: 'form', component: TestFormPage }],
              },
            ],
          },
        ]),
        { provide: OpalFines, useValue: { clearDraftAccountsCache: vi.fn() } },
      ],
    }).compileComponents();
  });

  it('prevents unload for an unsaved form beneath the nested outlet', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/draft/section/form');
    harness.detectChanges();

    const routeElement = harness.routeDebugElement!;
    const wrapper = routeElement.componentInstance as FinesDraftComponent;
    const nestedWrapper = routeElement.query(By.directive(nestedComponent)).componentInstance as UnloadProtectedFlow;
    const outlets = routeElement.queryAll(By.directive(RouterOutlet));
    const activePage = outlets[1].injector.get(RouterOutlet).component as TestFormPage;

    expect(wrapper.handleBeforeUnload()).toBe(true);
    expect(nestedWrapper.handleBeforeUnload()).toBe(true);

    activePage.stateUnsavedChanges = true;
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(nestedWrapper.handleBeforeUnload()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});
