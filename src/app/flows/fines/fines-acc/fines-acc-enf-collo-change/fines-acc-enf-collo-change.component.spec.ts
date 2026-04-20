import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { signal, type WritableSignal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { FinesAccEnfColloChangeComponent } from './fines-acc-enf-collo-change.component';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccountStoreType } from '../types/fines-account-store.type';
import { FINES_ACC_ENF_COLLO_CHANGE_SUCCESS_MESSAGE } from './constants/fines-acc-enf-collo-change-success-message.constant';

describe('FinesAccEnfColloChangeComponent', () => {
  let component: FinesAccEnfColloChangeComponent;
  let fixture: ComponentFixture<FinesAccEnfColloChangeComponent>;
  let mockRoute: ActivatedRoute;
  let mockRouter: Pick<Router, 'currentNavigation' | 'navigate'>;
  let mockCurrentNavigation: WritableSignal<Navigation | null>;
  let mockAccountStore: Pick<
    FinesAccountStoreType,
    'getAccountNumber' | 'party_name' | 'account_id' | 'base_version' | 'business_unit_id' | 'setSuccessMessage'
  >;
  let mockPayloadService: Pick<FinesAccPayloadService, 'buildCollectionOrderPayload'>;
  let mockOpalFinesService: Pick<OpalFines, 'patchDefendantAccount' | 'clearCache'>;
  let mockUtilsService: Pick<UtilsService, 'scrollToTop'>;

  beforeEach(async () => {
    mockRoute = {
      snapshot: {
        data: {},
      },
    } as ActivatedRoute;

    mockCurrentNavigation = signal<Navigation | null>({
      extras: {
        state: {},
      },
    } as unknown as Navigation);

    mockRouter = {
      currentNavigation: mockCurrentNavigation,
      navigate: vi.fn(),
    };

    mockAccountStore = {
      getAccountNumber: signal('177A'),
      party_name: signal('Mr Robert THOMSON'),
      account_id: signal(1001),
      base_version: signal('1'),
      business_unit_id: signal('2002'),
      setSuccessMessage: vi.fn(),
    };

    mockPayloadService = {
      buildCollectionOrderPayload: vi.fn().mockImplementation((form) => ({
        collection_order: {
          collection_order_date: null,
          collection_order_flag: form.formData.facc_enf_collection_order_made,
        },
      })),
    };

    mockOpalFinesService = {
      patchDefendantAccount: vi.fn().mockReturnValue(of({})),
      clearCache: vi.fn(),
    };

    mockUtilsService = {
      scrollToTop: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccEnfColloChangeComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccEnfColloChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose page data from the route and store', () => {
    expect(component.accountNumber).toBe('177A');
    expect(component.partyName).toBe('Mr Robert THOMSON');
  });

  it('should fall back to empty strings when store page data is missing', async () => {
    mockAccountStore = {
      ...mockAccountStore,
      getAccountNumber: signal(null) as unknown as typeof mockAccountStore.getAccountNumber,
      party_name: signal(null) as unknown as typeof mockAccountStore.party_name,
    };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [FinesAccEnfColloChangeComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    const emptyFixture = TestBed.createComponent(FinesAccEnfColloChangeComponent);
    const emptyComponent = emptyFixture.componentInstance;

    expect(emptyComponent.accountNumber).toBe('');
    expect(emptyComponent.partyName).toBe('');
  });

  it('should patch and navigate on success when the selection changes', () => {
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_collection_order_made: true,
      },
      nestedFlow: false,
    });

    expect(mockPayloadService.buildCollectionOrderPayload).toHaveBeenCalledWith({
      formData: {
        facc_enf_collection_order_made: true,
      },
      nestedFlow: false,
    });
    expect(mockOpalFinesService.patchDefendantAccount).toHaveBeenCalledWith(
      1001,
      {
        collection_order: {
          collection_order_date: null,
          collection_order_flag: true,
        },
      },
      '1',
      '2002',
    );
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('defendantAccountEnforcementCache$');
    expect(mockAccountStore.setSuccessMessage).toHaveBeenCalledWith(FINES_ACC_ENF_COLLO_CHANGE_SUCCESS_MESSAGE);
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
    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_collection_order_made: true,
      },
      nestedFlow: false,
    });

    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate back without patching when the selected value matches the current collection order flag', () => {
    mockCurrentNavigation.set({
      extras: {
        state: {
          currentCollectionOrderFlag: false,
        },
      },
    } as unknown as Navigation);

    fixture = TestBed.createComponent(FinesAccEnfColloChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const routerNavigateSpy = vi.spyOn(component as never, 'routerNavigate');

    component.handleSubmit({
      formData: {
        facc_enf_collection_order_made: false,
      },
      nestedFlow: false,
    });

    expect(mockPayloadService.buildCollectionOrderPayload).not.toHaveBeenCalled();
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

  it('should send an empty collection order date when selecting yes', () => {
    component.handleSubmit({
      formData: {
        facc_enf_collection_order_made: true,
      },
      nestedFlow: false,
    });

    expect(mockPayloadService.buildCollectionOrderPayload).toHaveBeenCalledWith({
      formData: {
        facc_enf_collection_order_made: true,
      },
      nestedFlow: false,
    });
  });

  it('should send an empty collection order date when selecting no', () => {
    component.handleSubmit({
      formData: {
        facc_enf_collection_order_made: false,
      },
      nestedFlow: false,
    });

    expect(mockPayloadService.buildCollectionOrderPayload).toHaveBeenCalledWith({
      formData: {
        facc_enf_collection_order_made: false,
      },
      nestedFlow: false,
    });
  });

  it('should update unsaved changes state', () => {
    component.handleUnsavedChanges(true);
    expect(component.stateUnsavedChanges).toBe(true);

    component.handleUnsavedChanges(false);
    expect(component.stateUnsavedChanges).toBe(false);
  });
});
