import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_ENF_ACTION_REMOVE_SUCCESS_MESSAGE } from './constants/fines-acc-enf-action-remove-success-message.constant';
import { FinesAccEnfActionRemoveComponent } from './fines-acc-enf-action-remove.component';

describe('FinesAccEnfActionRemoveComponent', () => {
  let component: FinesAccEnfActionRemoveComponent;
  let fixture: ComponentFixture<FinesAccEnfActionRemoveComponent>;
  const accountStateMock: IFinesAccountState = {
    account_number: '177A',
    account_id: 12345,
    pg_party_id: null,
    party_id: '77',
    party_type: 'Defendant',
    party_name: 'Ms Anna GRAHAM',
    base_version: '1',
    business_unit_id: '78',
    business_unit_user_id: 'user-1',
    welsh_speaking: 'Y',
  };

  const activatedRouteStub = {
    snapshot: {
      paramMap: convertToParamMap({ accountId: '12345' }),
      data: {
        title: 'Remove enforcement hold',
        defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      },
    },
  };

  const mockFinesAccStore = {
    account_id: signal<number | null>(12345),
    base_version: signal<string | null>('1'),
    business_unit_id: signal<string | null>('78'),
    setAccountState: vi.fn(),
    setSuccessMessage: vi.fn(),
  };

  const mockPayloadService = {
    transformDefendantAccountHeaderForStore: vi.fn().mockReturnValue(accountStateMock),
  };

  const mockOpalFinesService = {
    removeEnforcementHold: vi.fn().mockReturnValue(of({})),
    clearCache: vi.fn(),
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(FinesAccEnfActionRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockFinesAccStore.account_id.set(12345);
    mockFinesAccStore.base_version.set('1');
    mockFinesAccStore.business_unit_id.set('78');
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue(accountStateMock);
    mockOpalFinesService.removeEnforcementHold.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionRemoveComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: FinesAccountStore, useValue: mockFinesAccStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: OpalFines, useValue: mockOpalFinesService },
      ],
    }).compileComponents();
  });

  it('should create and seed the account state from resolved heading data', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.accountNumber).toBe(accountStateMock.account_number);
    expect(component.partyName).toBe(accountStateMock.party_name);
    expect(component.pageTitle).toBe('Remove enforcement hold');
    expect(mockPayloadService.transformDefendantAccountHeaderForStore).toHaveBeenCalledWith(
      12345,
      activatedRouteStub.snapshot.data.defendantAccountHeadingData,
    );
    expect(mockFinesAccStore.setAccountState).toHaveBeenCalledWith(accountStateMock);
  });

  it('should use empty heading text when account state names are missing', () => {
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue({
      ...accountStateMock,
      account_number: null,
      party_name: null,
    });

    createComponent();

    expect(component.accountNumber).toBe('');
    expect(component.partyName).toBe('');
  });

  it('should remove the enforcement hold and navigate to the add new action prompt', () => {
    createComponent();
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_action_remove_reason: 'Removed',
      },
      nestedFlow: false,
    });

    expect(mockOpalFinesService.removeEnforcementHold).toHaveBeenCalledWith(12345, { reason: 'Removed' }, '78', '1');
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountEnforcementCache$');
    expect(mockFinesAccStore.setSuccessMessage).toHaveBeenCalledWith(FINES_ACC_ENF_ACTION_REMOVE_SUCCESS_MESSAGE);
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children['add-new']}`,
    );
  });

  it('should submit with an empty reason and without optional base version', () => {
    createComponent();
    mockFinesAccStore.base_version.set(null);

    component.handleSubmit({
      formData: {
        facc_enf_action_remove_reason: null,
      },
      nestedFlow: false,
    });

    expect(mockOpalFinesService.removeEnforcementHold).toHaveBeenCalledWith(12345, { reason: '' }, '78', undefined);
  });

  it('should restore unsaved changes when removing the enforcement hold fails', () => {
    mockOpalFinesService.removeEnforcementHold.mockReturnValue(throwError(() => new Error('API error')));
    createComponent();
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_action_remove_reason: 'Removed',
      },
      nestedFlow: false,
    });

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(true);
    expect(mockOpalFinesService.clearCache).not.toHaveBeenCalled();
    expect(mockFinesAccStore.setSuccessMessage).not.toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('should update unsaved changes and navigate back to the enforcement tab on cancel', () => {
    createComponent();
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleUnsavedChanges(true);
    component.handleCancel();

    expect((component as unknown as { stateUnsavedChanges: boolean }).stateUnsavedChanges).toBe(true);
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement,
    );
  });

  it('should extend AbstractFormParentBaseComponent and expose inherited canDeactivate behaviour', () => {
    createComponent();

    expect(component).toBeInstanceOf(AbstractFormParentBaseComponent);
    expect(component['activatedRoute']).toBeDefined();

    component.handleUnsavedChanges(false);
    expect((component as unknown as { canDeactivate: () => boolean }).canDeactivate()).toBe(true);

    component.handleUnsavedChanges(true);
    expect((component as unknown as { canDeactivate: () => boolean }).canDeactivate()).toBe(false);
  });
});
