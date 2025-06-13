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

describe('FinesMacDeleteAccountConfirmationComponent', () => {
  let component: FinesMacDeleteAccountConfirmationComponent;
  let fixture: ComponentFixture<FinesMacDeleteAccountConfirmationComponent>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  let finesMacStore: FinesMacStoreType;
  let finesDraftStore: FinesDraftStoreType;

  beforeEach(async () => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['patchDraftAccountPayload']);
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['scrollToTop']);
    mockDateService = jasmine.createSpyObj('DateService', ['toFormat', 'getDateNow']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockDateService.getDateNow.and.returnValue(DateTime.fromISO('2024-01-01'));
    mockDateService.toFormat.and.returnValue('2024-01-01');

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
    spyOn(finesMacStore, 'setDeleteAccountConfirmation');
    const form = {
      ...FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FORM,
    };
    const patchResponse = of(FINES_DRAFT_STATE);
    mockOpalFinesService.patchDraftAccountPayload.and.returnValue(patchResponse);

    component['processPatchResponse'] = jasmine.createSpy('processPatchResponse').and.callThrough();

    component.handleDeleteAccountConfirmationSubmit(form);

    expect(finesMacStore.setDeleteAccountConfirmation).toHaveBeenCalledWith(form);
    expect(mockOpalFinesService.patchDraftAccountPayload).toHaveBeenCalledWith(
      42,
      jasmine.objectContaining({
        account_status: 'Deleted',
        timeline_data: jasmine.any(Array),
      }),
    );
  });

  it('should handle patch response and navigate', () => {
    spyOn(finesMacStore, 'resetStateChangesUnsavedChanges');
    spyOn(finesDraftStore, 'setBannerMessage');
    const response = FINES_DRAFT_STATE;
    component['processPatchResponse'](response);

    expect(finesDraftStore.setBannerMessage).toHaveBeenCalled();
    expect(finesMacStore.resetStateChangesUnsavedChanges).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([jasmine.any(String)], { fragment: '' });
  });

  it('should handle request error by scrolling to top', () => {
    const result = component['handleRequestError']();
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should set unsaved changes state', () => {
    spyOn(finesMacStore, 'setUnsavedChanges');
    component.handleUnsavedChanges(true);
    expect(finesMacStore.setUnsavedChanges).toHaveBeenCalledWith(true);
    expect(component.stateUnsavedChanges).toBeTrue();
  });

  it('should call setDeleteFromCheckAccount(false) on destroy', () => {
    spyOn(finesMacStore, 'setDeleteFromCheckAccount');
    component.ngOnDestroy();
    expect(finesMacStore.setDeleteFromCheckAccount).toHaveBeenCalledWith(false);
  });

  it('should log an error when accountId is null during handlePatchRequest', () => {
    spyOn(console, 'error');
    component['accountId'] = null;
    component['handlePatchRequest'](OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK);
    expect(console.error).toHaveBeenCalledWith('Account ID is not defined');
  });

  it('should handle error from patchDraftAccountPayload observable and call handleRequestError', () => {
    const form = {
      ...FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FORM,
    };
    // Simulate error from patchDraftAccountPayload using throwError
    mockOpalFinesService.patchDraftAccountPayload.and.returnValue(throwError(() => new Error('Simulated error')));

    component['handleRequestError'] = jasmine.createSpy('handleRequestError').and.callThrough();

    component.handleDeleteAccountConfirmationSubmit(form);

    expect(component['handleRequestError']).toHaveBeenCalled();
  });

  it('should set referrer to reviewAccountRoute when deleteFromCheckAccount is true', () => {
    spyOn(finesMacStore, 'deleteFromCheckAccount').and.returnValue(true);

    // Need to destroy and recreate the component to re-run constructor logic
    fixture.destroy();
    fixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // The referrer should now be set to reviewAccountRoute
    expect(component.referrer).toBe(component['reviewAccountRoute']);
  });

  it('should set referrer to accountDetailsRoute when deleteFromCheckAccount is false', () => {
    spyOn(finesMacStore, 'deleteFromCheckAccount').and.returnValue(false);
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
      version: finesDraftStore.getFinesDraftState().version || 0,
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
    spyOn(finesDraftStore, 'checker').and.returnValue(false);
    spyOn(finesMacStore, 'deleteFromCheckAccount').and.returnValue(true);
    component.referrer = component['setReferrer']();
    expect(component.referrer).toBe(component['reviewAccountRoute']);
  });

  it('should setReferrer to accountDetailsRoute when deleteFromCheckAccount is false', () => {
    spyOn(finesDraftStore, 'checker').and.returnValue(false);
    spyOn(finesMacStore, 'deleteFromCheckAccount').and.returnValue(false);
    component.referrer = component['setReferrer']();
    expect(component.referrer).toBe(component['accountDetailsRoute']);
  });

  it('should setReferrer to reviewAccountRoute when user is a checker', () => {
    spyOn(finesDraftStore, 'checker').and.returnValue(true);
    component.referrer = component['setReferrer']();
    expect(component.referrer).toBe(component['reviewAccountRoute']);
  });
});
