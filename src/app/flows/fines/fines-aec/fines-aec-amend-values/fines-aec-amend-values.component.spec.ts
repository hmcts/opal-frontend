import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesEnforcementAccountTypesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-types-response.interface';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IFinesAecAccountTypeRow } from '../interfaces/fines-aec-account-type-row.interface';
import { FinesAecStore } from '../stores/fines-aec.store';
import { FinesAecAmendValuesComponent } from './fines-aec-amend-values.component';

@Component({ selector: 'app-test-aec-account-types', template: '<p>Account types destination</p>' })
class AccountTypesPageComponent {}

@Component({ selector: 'app-test-aec-error', template: '<p>Error destination</p>' })
class ErrorPageComponent {}

describe('FinesAecAmendValuesComponent', () => {
  let api: { updateEnforcementAccountTypes: ReturnType<typeof vi.fn> };
  let utils: { scrollToTop: ReturnType<typeof vi.fn> };
  let store: InstanceType<typeof FinesAecStore>;
  let rows: Map<number, IFinesAecAccountTypeRow>;
  const amendUrl = '/fines/auto-enforcement/amend-values?enforcementAccountTypeId=101';
  const configUrl = '/fines/auto-enforcement/config#account-types';

  /** Renders the routed parent with its real nested form after the API and resolved rows are arranged. */
  const render = async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(amendUrl, FinesAecAmendValuesComponent);
    const input = (field: 'minimum_balance' | 'high_value') =>
      harness.routeNativeElement!.querySelector<HTMLInputElement>(`#${field}`)!;
    const enter = (field: 'minimum_balance' | 'high_value', value: string) => {
      input(field).value = value;
      input(field).dispatchEvent(new Event('input', { bubbles: true }));
    };
    const submit = () =>
      harness
        .routeNativeElement!.querySelector('form')!
        .dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    const cancel = () =>
      harness.routeNativeElement!.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
    const saveButton = () => harness.routeNativeElement!.querySelector<HTMLButtonElement>('#aec-amend-save')!;
    return { harness, component, input, enter, submit, cancel, saveButton };
  };

  beforeEach(async () => {
    const firstRow: IFinesAecAccountTypeRow = {
      id: 101,
      version: 7,
      accountType: 'COL',
      accountTypeName: 'Adult - Collection order',
      minimumBalance: 100,
      highValue: 1000,
      lowValueAccountType: {
        id: 101,
        version: 7,
        account_type: 'COL',
        enforcement_account_type: 'COLL',
        path: 'L',
        minimum_balance: 100,
      },
      highValueAccountType: {
        id: 102,
        version: 9,
        account_type: 'COL',
        enforcement_account_type: 'COLH',
        path: 'H',
        minimum_balance: 1000,
      },
    };
    rows = new Map([
      [101, firstRow],
      [
        201,
        {
          ...firstRow,
          id: 201,
          version: 17,
          accountType: 'Y',
          accountTypeName: 'Youth',
          lowValueAccountType: {
            ...firstRow.lowValueAccountType,
            id: 201,
            version: 17,
            account_type: 'Y',
            enforcement_account_type: 'YL',
          },
          highValueAccountType: {
            ...firstRow.highValueAccountType!,
            id: 202,
            version: 19,
            account_type: 'Y',
            enforcement_account_type: 'YH',
          },
        },
      ],
    ]);
    api = { updateEnforcementAccountTypes: vi.fn().mockReturnValue(of(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK)) };
    utils = { scrollToTop: vi.fn() };
    await TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: api },
        { provide: UtilsService, useValue: utils },
        provideRouter([
          {
            path: 'fines/auto-enforcement',
            children: [
              { path: 'config', component: AccountTypesPageComponent },
              {
                path: 'amend-values',
                component: FinesAecAmendValuesComponent,
                runGuardsAndResolvers: 'paramsOrQueryParamsChange',
                resolve: {
                  enforcementAccountType: (route: ActivatedRouteSnapshot) =>
                    rows.get(Number(route.queryParamMap.get('enforcementAccountTypeId'))),
                },
              },
            ],
          },
          { path: 'error', component: ErrorPageComponent },
        ]),
      ],
    }).compileComponents();
    store = TestBed.inject(FinesAecStore);
  });

  afterEach(() => vi.restoreAllMocks());

  it('shows the resolved account type and prefilled values, clearing an earlier success message', async () => {
    store.setSuccessMessage('Earlier confirmation');
    const { harness, component, input } = await render();

    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toContain('Adult - Collection order');
    expect(input('minimum_balance').value).toBe('100.00');
    expect(input('high_value').value).toBe('1000.00');
    expect(component.accountType()?.id).toBe(101);
    expect(component.stateUnsavedChanges).toBe(false);
    expect(store.successMessage()).toBeNull();
  });

  it('saves both original path versions, clears a blank high value and returns with success feedback', async () => {
    const { harness, component, enter, submit } = await render();
    enter('minimum_balance', '150');
    enter('high_value', '');
    expect(component.stateUnsavedChanges).toBe(true);

    submit();
    await harness.fixture.whenStable();

    expect(api.updateEnforcementAccountTypes).toHaveBeenCalledExactlyOnceWith([
      { id: 101, minimum_balance: 150, version: 7 },
      { id: 102, minimum_balance: null, version: 9 },
    ]);
    expect(store.successMessage()).toBe('Enforcement values updated.');
    expect(component.stateUnsavedChanges).toBe(false);
    expect(TestBed.inject(Router).url).toBe(configUrl);
    expect(harness.routeNativeElement!.textContent).toContain('Account types destination');
  });

  it('allows only one save while a request is pending and disables Save', async () => {
    const result = new Subject<IOpalFinesEnforcementAccountTypesResponse>();
    api.updateEnforcementAccountTypes.mockReturnValue(result);
    const { harness, component, enter, submit, saveButton } = await render();
    enter('minimum_balance', '150');

    submit();
    submit();
    harness.detectChanges();

    expect(component.pending()).toBe(true);
    expect(api.updateEnforcementAccountTypes).toHaveBeenCalledOnce();
    expect(saveButton().disabled).toBe(true);
    expect(harness.routeNativeElement!.querySelector('form')!.getAttribute('aria-busy')).toBe('true');
  });

  it('returns without PATCH or success feedback when the numeric balances have not changed', async () => {
    const { harness, component, enter, submit } = await render();
    enter('minimum_balance', '100');
    enter('high_value', '1000.0');

    submit();
    await harness.fixture.whenStable();

    expect(api.updateEnforcementAccountTypes).not.toHaveBeenCalled();
    expect(store.successMessage()).toBeNull();
    expect(component.stateUnsavedChanges).toBe(false);
    expect(TestBed.inject(Router).url).toBe(configUrl);
  });

  it('retains edits and dirty state after a retryable error and permits a successful manual retry', async () => {
    const result = new Subject<IOpalFinesEnforcementAccountTypesResponse>();
    api.updateEnforcementAccountTypes.mockReturnValue(result);
    const { harness, component, input, enter, submit, saveButton } = await render();
    enter('minimum_balance', '150.00');
    enter('high_value', '1200.00');
    submit();
    harness.detectChanges();
    expect(saveButton().disabled).toBe(true);

    result.error(new HttpErrorResponse({ status: 503, error: { retriable: true } }));
    harness.detectChanges();

    expect(input('minimum_balance').value).toBe('150.00');
    expect(input('high_value').value).toBe('1200.00');
    expect(component.stateUnsavedChanges).toBe(true);
    expect(component.pending()).toBe(false);
    expect(saveButton().disabled).toBe(false);
    expect(store.successMessage()).toBeNull();
    expect(utils.scrollToTop).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(amendUrl);

    api.updateEnforcementAccountTypes.mockReturnValue(of(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK));
    submit();
    await harness.fixture.whenStable();

    expect(api.updateEnforcementAccountTypes).toHaveBeenCalledTimes(2);
    expect(api.updateEnforcementAccountTypes).toHaveBeenLastCalledWith([
      { id: 101, minimum_balance: 150, version: 7 },
      { id: 102, minimum_balance: 1200, version: 9 },
    ]);
    expect(store.successMessage()).toBe('Enforcement values updated.');
    expect(TestBed.inject(Router).url).toBe(configUrl);
  });

  it('releases the unsaved state after a non-retryable error so an error redirect can proceed', async () => {
    const result = new Subject<IOpalFinesEnforcementAccountTypesResponse>();
    api.updateEnforcementAccountTypes.mockReturnValue(result);
    const { harness, component, input, enter, submit } = await render();
    enter('minimum_balance', '150');
    submit();

    result.error(new HttpErrorResponse({ status: 409, error: { retriable: false } }));
    harness.detectChanges();

    expect(input('minimum_balance').value).toBe('150');
    expect(component.pending()).toBe(false);
    expect(component.stateUnsavedChanges).toBe(false);
    expect(component['canDeactivate']()).toBe(true);
    expect(store.successMessage()).toBeNull();

    await harness.navigateByUrl('/error', ErrorPageComponent);
    expect(TestBed.inject(Router).url).toBe('/error');
  });

  it('cancels the previous save and resets the real form when the resolved account context changes', async () => {
    const result = new Subject<IOpalFinesEnforcementAccountTypesResponse>();
    api.updateEnforcementAccountTypes.mockReturnValue(result);
    const { harness, component, input, enter, submit, saveButton } = await render();
    enter('minimum_balance', '150');
    submit();
    expect(result.observed).toBe(true);

    const nextUrl = '/fines/auto-enforcement/amend-values?enforcementAccountTypeId=201';
    const reusedComponent = await harness.navigateByUrl(nextUrl, FinesAecAmendValuesComponent);

    expect(reusedComponent).toBe(component);
    expect(result.observed).toBe(false);
    expect(harness.routeNativeElement!.querySelector('h1')?.textContent).toContain('Youth');
    expect(input('minimum_balance').value).toBe('100.00');
    expect(input('high_value').value).toBe('1000.00');
    expect(component.stateUnsavedChanges).toBe(false);
    expect(component.pending()).toBe(false);
    expect(saveButton().disabled).toBe(false);

    result.next(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    result.complete();
    await harness.fixture.whenStable();

    expect(store.successMessage()).toBeNull();
    expect(TestBed.inject(Router).url).toBe(nextUrl);
  });

  it('unsubscribes on destruction so a late save cannot create a message or navigation', async () => {
    const result = new Subject<IOpalFinesEnforcementAccountTypesResponse>();
    api.updateEnforcementAccountTypes.mockReturnValue(result);
    const { harness, enter, submit } = await render();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    enter('minimum_balance', '150');
    submit();
    expect(result.observed).toBe(true);

    harness.fixture.destroy();
    result.next(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    result.complete();

    expect(result.observed).toBe(false);
    expect(store.successMessage()).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('cancels through the return route without saving or setting a success message', async () => {
    const { harness, cancel } = await render();

    cancel();
    await harness.fixture.whenStable();

    expect(api.updateEnforcementAccountTypes).not.toHaveBeenCalled();
    expect(store.successMessage()).toBeNull();
    expect(TestBed.inject(Router).url).toBe(configUrl);
  });
});
