import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FinesAccComponent } from './fines-acc.component';
import { FinesAccEnfActionAddNewComponent } from './fines-acc-enf-action-add-new/fines-acc-enf-action-add-new.component';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from './fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FinesAccPayloadService } from './services/fines-acc-payload.service';

@Component({ template: '' })
class TestFormPage extends AbstractFormParentBaseComponent {}

describe('FinesAccComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'account',
            component: FinesAccComponent,
            children: [{ path: 'form', component: TestFormPage }],
          },
        ]),
        { provide: OpalFines, useValue: { clearAccountDetailsCache: vi.fn() } },
      ],
    }).compileComponents();
  });

  async function navigateToAccount(path = '/account/form') {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(path);
    harness.detectChanges();
    const routeElement = harness.routeDebugElement!;
    const component = routeElement.componentInstance as FinesAccComponent;
    const outlet = routeElement.query(By.directive(RouterOutlet)).injector.get(RouterOutlet);
    return { component, outlet };
  }

  it('creates the account flow wrapper', async () => {
    const { component } = await navigateToAccount();

    expect(component).toBeInstanceOf(FinesAccComponent);
  });

  it('allows unloading when there is no active form', async () => {
    const { component } = await navigateToAccount('/account');

    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('allows unloading when the active form has no unsaved changes', async () => {
    const { component, outlet } = await navigateToAccount();
    const activePage = outlet.component as TestFormPage;
    activePage.stateUnsavedChanges = false;

    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('prevents unloading when the active form has unsaved changes', async () => {
    const { component, outlet } = await navigateToAccount();
    const activePage = outlet.component as TestFormPage;
    activePage.stateUnsavedChanges = true;

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(component.handleBeforeUnload()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('FinesAccComponent add-new enforcement action route', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'account',
            component: FinesAccComponent,
            children: [
              {
                path: 'defendant/:accountId/enforcement/action/add-new',
                component: FinesAccEnfActionAddNewComponent,
                resolve: { defendantAccountHeadingData: () => FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK },
              },
            ],
          },
        ]),
        { provide: OpalFines, useValue: { clearAccountDetailsCache: vi.fn() } },
        {
          provide: FinesAccPayloadService,
          useValue: {
            transformDefendantAccountHeaderForStore: () => ({
              account_number: '177A',
              account_id: 12345,
              party_name: 'Ms Anna GRAHAM',
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('warns on browser unload after the user selects an add-new answer', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/account/defendant/12345/enforcement/action/add-new');
    harness.detectChanges();

    const routeElement = harness.routeDebugElement!;
    const wrapper = routeElement.componentInstance as FinesAccComponent;
    const outlet = routeElement.query(By.directive(RouterOutlet)).injector.get(RouterOutlet);
    const activePage = outlet.component as FinesAccEnfActionAddNewComponent;
    const yesRadio = harness.routeNativeElement!.querySelector<HTMLInputElement>(
      'input[name="facc_enf_action_add_new"][value="true"]',
    );

    expect(activePage).toBeInstanceOf(FinesAccEnfActionAddNewComponent);
    expect(wrapper.handleBeforeUnload()).toBe(true);
    expect(yesRadio).not.toBeNull();

    yesRadio!.click();
    harness.detectChanges();

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(activePage.stateUnsavedChanges).toBe(true);
    expect(wrapper.handleBeforeUnload()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });
});
