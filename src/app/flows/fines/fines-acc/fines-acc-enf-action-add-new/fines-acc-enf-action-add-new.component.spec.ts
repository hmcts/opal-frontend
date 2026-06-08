import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ENF_ACTION_ROUTING_PATHS } from '../fines-acc-enf-action-select/constants/fines-acc-enf-action-select-routing-paths.constant';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccEnfActionAddNewComponent } from './fines-acc-enf-action-add-new.component';

describe('FinesAccEnfActionAddNewComponent', () => {
  let component: FinesAccEnfActionAddNewComponent;
  let fixture: ComponentFixture<FinesAccEnfActionAddNewComponent>;

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
        title: 'Do you want to add a new enforcement action?',
        defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
      },
    },
  };

  const mockFinesAccStore = {
    successMessage: signal<string | null>('Enforcement action added'),
    setAccountState: vi.fn(),
    clearSuccessMessage: vi.fn(),
  };

  const mockPayloadService = {
    transformDefendantAccountHeaderForStore: vi.fn().mockReturnValue(accountStateMock),
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(FinesAccEnfActionAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockFinesAccStore.successMessage.set('Enforcement action added');
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue(accountStateMock);

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfActionAddNewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: FinesAccountStore, useValue: mockFinesAccStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
      ],
    }).compileComponents();
  });

  it('should create and seed account state from resolved heading data', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.accountNumber).toBe(accountStateMock.account_number);
    expect(component.partyName).toBe(accountStateMock.party_name);
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

  it('should clear the success message and navigate to select enforcement action when yes is selected', () => {
    createComponent();
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_action_add_new: true,
      },
      nestedFlow: false,
    });

    expect(mockFinesAccStore.clearSuccessMessage).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.root}/${FINES_ACC_ENF_ACTION_ROUTING_PATHS.children.select}`,
    );
  });

  it('should clear the success message and navigate to enforcement FAE when no is selected', () => {
    createComponent();
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_action_add_new: false,
      },
      nestedFlow: false,
    });

    expect(mockFinesAccStore.clearSuccessMessage).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      false,
      undefined,
      null,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.enforcement,
    );
  });
});
