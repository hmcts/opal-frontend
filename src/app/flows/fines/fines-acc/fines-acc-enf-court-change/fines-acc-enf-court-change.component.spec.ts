import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { FinesAccEnfCourtChangeComponent } from './fines-acc-enf-court-change.component';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_COURT_CHANGE_SUCCESS_MESSAGE } from './constants/fines-acc-enf-court-change-success-message.constant';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';

describe('FinesAccEnfCourtChangeComponent', () => {
  let component: FinesAccEnfCourtChangeComponent;
  let fixture: ComponentFixture<FinesAccEnfCourtChangeComponent>;
  let mockCurrentNavigation: WritableSignal<Navigation | null>;
  const mockCourtRefData = structuredClone(OPAL_FINES_COURT_REF_DATA_MOCK);
  const selectedCourt = mockCourtRefData.refData[1];
  const currentCourt = mockCourtRefData.refData[0];

  const mockAccountStore = {
    getAccountNumber: signal('123456'),
    party_name: signal('Mr Test PERSON'),
    account_id: signal(1001),
    base_version: signal('1'),
    business_unit_id: signal('2002'),
    setSuccessMessage: vi.fn(),
  };

  const mockPayloadService = {
    buildEnforcementCourtFormPayload: vi
      .fn()
      .mockReturnValue({ enforcement_court: { court_id: selectedCourt.court_id } }),
  };

  const mockOpalFinesService = {
    patchDefendantAccount: vi.fn().mockReturnValue(of({})),
    getCourtPrettyName: vi.fn(
      (court: { name: string; court_code: string | number }) => `${court.name} (${court.court_code})`,
    ),
  };

  const mockUtilsService = {
    scrollToTop: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockCurrentNavigation = signal({
      extras: {
        state: {},
      },
    } as unknown as Navigation);

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfCourtChangeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                title: 'Change enforcement court',
                courtsRefData: mockCourtRefData,
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            currentNavigation: mockCurrentNavigation,
            navigate: vi.fn(),
          },
        },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfCourtChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map route data into autocomplete options', () => {
    expect(component.courtOptions).toEqual(
      mockCourtRefData.refData.map((court) => ({
        value: court.court_id,
        name: `${court.name} (${court.court_code})`,
      })),
    );
  });

  it('should patch and navigate on success when the selected court changes', () => {
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_court: selectedCourt.court_id,
      },
      nestedFlow: false,
    });

    expect(mockPayloadService.buildEnforcementCourtFormPayload).toHaveBeenCalledWith({
      facc_enf_court: selectedCourt.court_id,
    });
    expect(mockOpalFinesService.patchDefendantAccount).toHaveBeenCalledWith(
      1001,
      { enforcement_court: { court_id: selectedCourt.court_id } },
      '1',
      '2002',
    );
    expect(mockAccountStore.setSuccessMessage).toHaveBeenCalledWith(FINES_ACC_ENF_COURT_CHANGE_SUCCESS_MESSAGE);
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      'enforcement',
    );
  });

  it('should navigate back without patching when the selected court matches the current court', () => {
    mockCurrentNavigation.set({
      extras: {
        state: {
          currentEnforcementCourtId: currentCourt.court_id,
        },
      },
    } as unknown as Navigation);

    fixture = TestBed.createComponent(FinesAccEnfCourtChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_court: currentCourt.court_id,
      },
      nestedFlow: false,
    });

    expect(mockPayloadService.buildEnforcementCourtFormPayload).not.toHaveBeenCalled();
    expect(mockOpalFinesService.patchDefendantAccount).not.toHaveBeenCalled();
    expect(mockAccountStore.setSuccessMessage).not.toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      'enforcement',
    );
  });

  it('should scroll to top on submit error', () => {
    mockOpalFinesService.patchDefendantAccount = vi.fn().mockReturnValue(throwError(() => new Error('fail')));
    fixture = TestBed.createComponent(FinesAccEnfCourtChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_court: selectedCourt.court_id,
      },
      nestedFlow: false,
    });

    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('should update stateUnsavedChanges when handleUnsavedChanges is called', () => {
    component.handleUnsavedChanges(true);

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(true);
  });

  it('should navigate back to the enforcement tab when cancel is triggered', () => {
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleCancel();

    expect(mockAccountStore.setSuccessMessage).not.toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      'enforcement',
    );
  });
});
