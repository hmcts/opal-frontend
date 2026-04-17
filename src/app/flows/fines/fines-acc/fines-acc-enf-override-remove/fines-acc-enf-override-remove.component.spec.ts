import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesAccEnfOverrideRemoveComponent } from './fines-acc-enf-override-remove.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccountStoreType } from '../types/fines-account-store.type';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT } from '../fines-acc-enf-override-add-change/constants/fines-acc-enf-override-add-change-form-default.constant';
import { FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_SUCCESS_MESSAGES } from '../fines-acc-enf-override-add-change/constants/fines-acc-enf-override-add-change-success-messages.constant';

describe('FinesAccEnfOverrideRemoveComponent', () => {
  let component: FinesAccEnfOverrideRemoveComponent;
  let fixture: ComponentFixture<FinesAccEnfOverrideRemoveComponent>;
  let mockRoute: ActivatedRoute;
  let mockRouter: Pick<Router, 'navigate'>;
  let mockAccountStore: Pick<
    FinesAccountStoreType,
    'getAccountNumber' | 'party_name' | 'account_id' | 'base_version' | 'business_unit_id' | 'setSuccessMessage'
  >;
  let mockPayloadService: Pick<FinesAccPayloadService, 'buildEnforcementOverrideFormPayload'>;
  let mockOpalFinesService: Pick<OpalFines, 'patchDefendantAccount'>;

  beforeEach(async () => {
    mockRoute = {
      snapshot: {
        data: {
          title: 'Remove enforcement override',
          enforcementStatus: {
            enforcement_override: {
              enforcement_override_result: {
                enforcement_override_result_id: 'R1',
                enforcement_override_result_name: 'Result One',
              },
            },
          },
        },
      },
    } as unknown as ActivatedRoute;

    mockRouter = {
      navigate: vi.fn(),
    };

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
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfOverrideRemoveComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: OpalFines, useValue: mockOpalFinesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfOverrideRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise page header values from route and store', () => {
    expect(component.pageTitle).toBe('Remove enforcement override');
    expect(component.accountNumber).toBe('123456');
    expect(component.partyName).toBe('Test Person');
  });

  it('should default page header values to empty strings when route/store values are nullish', () => {
    (mockRoute.snapshot.data as { title?: string | null }).title = null;
    mockAccountStore.getAccountNumber = signal(null) as unknown as (typeof mockAccountStore)['getAccountNumber'];
    mockAccountStore.party_name = signal(null) as unknown as (typeof mockAccountStore)['party_name'];

    const altFixture = TestBed.createComponent(FinesAccEnfOverrideRemoveComponent);
    const altComponent = altFixture.componentInstance;
    altFixture.detectChanges();

    expect(altComponent.pageTitle).toBe('');
    expect(altComponent.accountNumber).toBe('');
    expect(altComponent.partyName).toBe('');
  });

  it('should return enforcement override result from route data', () => {
    expect(component.enforcementOverride).toEqual({
      enforcement_override_result_id: 'R1',
      enforcement_override_result_name: 'Result One',
    });
  });

  it('should return undefined enforcement override when route data does not contain it', () => {
    (mockRoute.snapshot.data as { enforcementStatus?: { enforcement_override?: null } }).enforcementStatus = {
      enforcement_override: null,
    };

    const altFixture = TestBed.createComponent(FinesAccEnfOverrideRemoveComponent);
    const altComponent = altFixture.componentInstance;
    altFixture.detectChanges();

    expect(altComponent.enforcementOverride).toBeUndefined();
  });

  it('should navigate to defendant details enforcement section', () => {
    component.navigateToDefendantDetailsPage();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [`../../../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`],
      {
        relativeTo: mockRoute,
        fragment: 'enforcement',
      },
    );
  });

  it('should remove enforcement override and navigate on success', () => {
    const navigateToDetailsSpy = vi.spyOn(component, 'navigateToDefendantDetailsPage');

    component.handleFinesEnfOverrideRemove();

    expect(mockPayloadService.buildEnforcementOverrideFormPayload).toHaveBeenCalledWith(
      FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT,
    );
    expect(mockOpalFinesService.patchDefendantAccount).toHaveBeenCalledWith(
      1001,
      { enforcement_override: {} },
      '1',
      '2002',
    );
    expect(mockAccountStore.setSuccessMessage).toHaveBeenCalledWith(
      FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_SUCCESS_MESSAGES.remove,
    );
    expect(navigateToDetailsSpy).toHaveBeenCalled();
  });

  it('should not set success message or navigate when remove enforcement override fails', () => {
    mockOpalFinesService.patchDefendantAccount = vi.fn().mockReturnValue(throwError(() => new Error('fail')));
    const navigateToDetailsSpy = vi.spyOn(component, 'navigateToDefendantDetailsPage');

    component.handleFinesEnfOverrideRemove();

    expect(mockPayloadService.buildEnforcementOverrideFormPayload).toHaveBeenCalledWith(
      FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FORM_DEFAULT,
    );
    expect(mockAccountStore.setSuccessMessage).not.toHaveBeenCalled();
    expect(navigateToDetailsSpy).not.toHaveBeenCalled();
  });
});
