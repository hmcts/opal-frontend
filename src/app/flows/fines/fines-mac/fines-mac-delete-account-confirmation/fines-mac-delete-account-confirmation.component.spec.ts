import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacDeleteAccountConfirmationComponent } from './fines-mac-delete-account-confirmation.component';
import { FinesMacDeleteAccountConfirmationFormComponent } from './fines-mac-delete-account-confirmation-form/fines-mac-delete-account-confirmation-form.component';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FinesDraftStore } from '../../fines-draft/stores/fines-draft.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesDraftStoreType } from '../../fines-draft/stores/types/fines-draft.type';
import { DateTime } from 'luxon';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_DRAFT_STATE } from '../../fines-draft/constants/fines-draft-state.constant';
import { FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FORM } from './constants/fines-mac-delete-account-confirmation-form';
import { OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-patch-delete-account-payload.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacDeleteAccountConfirmationComponent', () => {
  let component: FinesMacDeleteAccountConfirmationComponent;
  let fixture: ComponentFixture<FinesMacDeleteAccountConfirmationComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUtilsService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  let finesMacStore: FinesMacStoreType;
  let finesDraftStore: FinesDraftStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      patchDraftAccountPayload: vi.fn().mockName('OpalFines.patchDraftAccountPayload'),
    };
    mockUtilsService = {
      scrollToTop: vi.fn().mockName('UtilsService.scrollToTop'),
    };
    mockDateService = {
      toFormat: vi.fn().mockName('DateService.toFormat'),
      getDateNow: vi.fn().mockName('DateService.getDateNow'),
    };
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    mockDateService.getDateNow.mockReturnValue(DateTime.fromISO('2024-01-01'));
    mockDateService.toFormat.mockReturnValue('2024-01-01');

    await TestBed.configureTestingModule({
      imports: [FinesMacDeleteAccountConfirmationComponent, FinesMacDeleteAccountConfirmationFormComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'draftAccountId' ? '42' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationComponent);
    component = fixture.componentInstance;
    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE_MOCK));
    finesDraftStore = TestBed.inject(FinesDraftStore);
    finesDraftStore.setFinesDraftState(FINES_DRAFT_STATE);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call setDeleteAccountConfirmation and patchDraftAccountPayload on form submit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesMacStore, 'setDeleteAccountConfirmation');
    const form = {
      ...FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FORM,
    };
    const patchResponse = of(FINES_DRAFT_STATE);
    mockOpalFinesService.patchDraftAccountPayload.mockReturnValue(patchResponse);

    component['processPatchResponse'] = vi.fn();

    component.handleDeleteAccountConfirmationSubmit(form);

    expect(finesMacStore.setDeleteAccountConfirmation).toHaveBeenCalledWith(form);
    expect(mockOpalFinesService.patchDraftAccountPayload).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        account_status: 'Deleted',
        timeline_data: expect.any(Array),
      }),
    );
  });

  it('should handle patch response and navigate', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesMacStore, 'resetStateChangesUnsavedChanges');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesDraftStore, 'setBannerMessage');
    const response = FINES_DRAFT_STATE;
    component['processPatchResponse'](response);

    expect(finesDraftStore.setBannerMessage).toHaveBeenCalled();
    expect(finesMacStore.resetStateChangesUnsavedChanges).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([expect.any(String)], { fragment: '' });
  });

  it('should handle request error by scrolling to top', () => {
    const result = component['handleRequestError']();
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should set unsaved changes state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesMacStore, 'setUnsavedChanges');
    component.handleUnsavedChanges(true);
    expect(finesMacStore.setUnsavedChanges).toHaveBeenCalledWith(true);
    expect(component.stateUnsavedChanges).toBe(true);
  });

  it('should call setDeleteFromCheckAccount(false) on destroy', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesMacStore, 'setDeleteFromCheckAccount');
    component.ngOnDestroy();
    expect(finesMacStore.setDeleteFromCheckAccount).toHaveBeenCalledWith(false);
  });

  it('should log an error when accountId is null during handlePatchRequest', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(console, 'error');
    component['accountId'] = null;
    component['handlePatchRequest'](OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK);
    expect(console.error).toHaveBeenCalledWith('Account ID is not defined');
  });

  it('should handle error from patchDraftAccountPayload observable and call handleRequestError', () => {
    const form = {
      ...FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FORM,
    };
    // Simulate error from patchDraftAccountPayload using throwError
    mockOpalFinesService.patchDraftAccountPayload.mockReturnValue(throwError(() => new Error('Simulated error')));

    component['handleRequestError'] = vi.fn();

    component.handleDeleteAccountConfirmationSubmit(form);

    expect(component['handleRequestError']).toHaveBeenCalled();
  });

  it('should set referrer to reviewAccountRoute when deleteFromCheckAccount is true', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesMacStore, 'deleteFromCheckAccount').mockReturnValue(true);

    // Need to destroy and recreate the component to re-run constructor logic
    fixture.destroy();
    fixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // The referrer should now be set to reviewAccountRoute
    expect(component.referrer).toBe(component['reviewAccountRoute']);
  });

  it('should set referrer to accountDetailsRoute when deleteFromCheckAccount is false', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesMacStore, 'deleteFromCheckAccount').mockReturnValue(false);
    expect(component.referrer).toBe(component['accountDetailsRoute']);
  });

  it('should create a patch payload', () => {
    component['userState'].name = 'Test User';
    const form = {
      ...FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FORM,
    };
    form.formData = { fm_delete_account_confirmation_reason: 'Test reason' };
    const payload = component['createPatchPayload'](form);
    expect(payload).toEqual({
      validated_by: null,
      account_status: 'Deleted',
      validated_by_name: null,
      business_unit_id: finesMacStore.getBusinessUnitId(),
      version: finesDraftStore.getFinesDraftState().version || '0',
      timeline_data: [
        {
          username: 'Test User',
          status: 'Deleted',
          status_date: '2024-01-01',
          reason_text: 'Test reason',
        },
      ],
      reason_text: 'Test reason',
    });
  });

  it('should setReferrer to reviewAccountRoute when deleteFromCheckAccount is true', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesDraftStore, 'checker').mockReturnValue(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesMacStore, 'deleteFromCheckAccount').mockReturnValue(true);
    component.referrer = component['setReferrer']();
    expect(component.referrer).toBe(component['reviewAccountRoute']);
  });

  it('should setReferrer to accountDetailsRoute when deleteFromCheckAccount is false', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesDraftStore, 'checker').mockReturnValue(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesMacStore, 'deleteFromCheckAccount').mockReturnValue(false);
    component.referrer = component['setReferrer']();
    expect(component.referrer).toBe(component['accountDetailsRoute']);
  });

  it('should setReferrer to reviewAccountRoute when user is a checker', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(finesDraftStore, 'checker').mockReturnValue(true);
    component.referrer = component['setReferrer']();
    expect(component.referrer).toBe(component['reviewAccountRoute']);
  });
});
