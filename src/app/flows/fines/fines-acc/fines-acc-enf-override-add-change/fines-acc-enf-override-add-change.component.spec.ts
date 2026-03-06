import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FinesAccEnfOverrideAddChangeComponent } from './fines-acc-enf-override-add-change.component';
import { FinesAccountStore } from '@app/flows/fines/fines-acc/stores/fines-acc.store';
import { FinesAccPayloadService } from '@app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { OpalFines } from '@app/flows/fines/services/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '@app/flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { FinesAccountStoreType } from '../types/fines-account-store.type';
import { signal } from '@angular/core';

describe('FinesAccEnfOverrideAddChangeComponent', () => {
  let component: FinesAccEnfOverrideAddChangeComponent;
  let fixture: ComponentFixture<FinesAccEnfOverrideAddChangeComponent>;
  let mockRoute: ActivatedRoute;
  let mockAccountStore: Pick<
    FinesAccountStoreType,
    'getAccountNumber' | 'party_name' | 'account_id' | 'base_version' | 'business_unit_id' | 'setSuccessMessage'
  >;
  let mockPayloadService: Pick<FinesAccPayloadService, 'buildEnforcementOverrideFormPayload'>;
  let mockOpalFinesService: Pick<
    OpalFines,
    'patchDefendantAccount' | 'getEnforcerPrettyName' | 'getLocalJusticeAreaPrettyName' | 'getResultPrettyName'
  >;
  let mockUtilsService: Pick<UtilsService, 'scrollToTop'>;

  beforeEach(async () => {
    mockRoute = {
      snapshot: {
        data: {
          pageHeading: 'Add enforcement override',
          enforcersRefData: {
            refData: [
              { enforcer_id: 'E1', enforcer_code: 'EC1', name: 'Enforcer One' },
              { enforcer_id: 'E2', enforcer_code: 'EC2', name: 'Enforcer Two' },
            ],
          },
          localJusticeAreasRefData: {
            refData: [
              { local_justice_area_id: 'L1', name: 'LJA One' },
              { local_justice_area_id: 'L2', name: 'LJA Two' },
            ],
          },
          resultsRefData: {
            refData: [
              { result_id: 'R1', result_title: 'Result One' },
              { result_id: 'R2', result_title: 'Result Two' },
            ],
          },
        },
      },
    } as unknown as ActivatedRoute;

    mockAccountStore = {
      getAccountNumber: signal('123456'),
      party_name: signal('Test Person'),
      account_id: signal(1001),
      base_version: signal('1'),
      business_unit_id: signal('2002'),
      setSuccessMessage: vi.fn(),
    };

    mockPayloadService = {
      buildEnforcementOverrideFormPayload: vi.fn().mockReturnValue({ enforcement_override: {} }),
    };

    mockOpalFinesService = {
      patchDefendantAccount: vi.fn().mockReturnValue(of({})),
      getEnforcerPrettyName: vi.fn(
        (enforcer: { name: string; enforcer_code: string | number }) => `${enforcer.name} (${enforcer.enforcer_code})`,
      ),
      getLocalJusticeAreaPrettyName: vi.fn(
        (lja: { name: string; local_justice_area_id: string | number }) => `${lja.name} (${lja.local_justice_area_id})`,
      ),
      getResultPrettyName: vi.fn(
        (result: { result_title: string; result_id: string | number }) =>
          `${result.result_title} (${result.result_id})`,
      ),
    };

    mockUtilsService = {
      scrollToTop: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfOverrideAddChangeComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfOverrideAddChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map route data into option lists', () => {
    expect(component.pageTitle).toBe('Add enforcement override');
    expect(component.enforcerOptions).toEqual([
      { value: 'E1', name: 'Enforcer One (EC1)' },
      { value: 'E2', name: 'Enforcer Two (EC2)' },
    ]);
    expect(component.localJusticeAreaOptions).toEqual([
      { value: 'L1', name: 'LJA One (L1)' },
      { value: 'L2', name: 'LJA Two (L2)' },
    ]);
    expect(component.enforcementActionOptions).toEqual([
      { value: 'R1', name: 'Result One (R1)' },
      { value: 'R2', name: 'Result Two (R2)' },
    ]);
  });

  it('should submit form and navigate on success', () => {
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');
    const form = {
      formData: {
        fenf_account_enforcement_action: 'R1',
        fenf_account_enforcement_enforcer: 'E1',
        fenf_account_enforcement_lja: 'L1',
      },
      nestedFlow: false,
    };

    component.handleFinesEnfOverrideAddChangeSubmit(form);

    expect(mockPayloadService.buildEnforcementOverrideFormPayload).toHaveBeenCalledWith(form.formData);
    expect(mockOpalFinesService.patchDefendantAccount).toHaveBeenCalledWith(
      1001,
      { enforcement_override: {} },
      '1',
      '2002',
    );
    expect(routerNavigateSpy).toHaveBeenCalledWith(FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details);
  });

  it('should scroll to top on submit error', () => {
    mockOpalFinesService.patchDefendantAccount = vi.fn().mockReturnValue(throwError(() => new Error('fail')));
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');
    const form = {
      formData: {
        fenf_account_enforcement_action: 'R1',
        fenf_account_enforcement_enforcer: 'E1',
        fenf_account_enforcement_lja: 'L1',
      },
      nestedFlow: false,
    };

    component.handleFinesEnfOverrideAddChangeSubmit(form);

    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('should update stateUnsavedChanges when handleUnsavedChanges is called', () => {
    component.handleUnsavedChanges(true);
    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(true);
  });

  it('should complete ngUnsubscribe on destroy', () => {
    const subject = (component as unknown as { ngUnsubscribe: { isStopped: boolean } }).ngUnsubscribe;
    component.ngOnDestroy();
    expect(subject.isStopped).toBe(true);
  });
});
