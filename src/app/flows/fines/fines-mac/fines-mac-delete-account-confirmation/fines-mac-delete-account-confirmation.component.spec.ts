import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacDeleteAccountConfirmationComponent } from './fines-mac-delete-account-confirmation.component';
import { FinesMacDeleteAccountConfirmationFormComponent } from './fines-mac-delete-account-confirmation-form/fines-mac-delete-account-confirmation-form.component';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FinesDraftStore } from '../../fines-draft/stores/fines-draft.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesDraftStoreType } from '../../fines-draft/stores/types/fines-draft.type';
import { DateTime } from 'luxon';

describe('FinesMacDeleteAccountConfirmationComponent', () => {
  let component: FinesMacDeleteAccountConfirmationComponent;
  let fixture: ComponentFixture<FinesMacDeleteAccountConfirmationComponent>;
  let mockFinesMacStore: jasmine.SpyObj<FinesMacStoreType>;
  let mockFinesDraftStore: jasmine.SpyObj<FinesDraftStoreType>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockGlobalStore: any;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockFinesMacStore = jasmine.createSpyObj('FinesMacStore', [
      'setDeleteAccountConfirmation',
      'getBusinessUnitId',
      'deleteFromCheckAccount',
      'setDeleteFromCheckAccount',
      'resetStateChangesUnsavedChanges',
      'setUnsavedChanges',
      'deleteAccountConfirmation',
    ]);
    mockFinesDraftStore = jasmine.createSpyObj('FinesDraftStore', [
      'getFinesDraftState',
      'setBannerMessage',
      'fragment'
    ]);
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['patchDraftAccountPayload']);
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['scrollToTop']);
    mockDateService = jasmine.createSpyObj('DateService', ['toFormat', 'getDateNow']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockGlobalStore = {
      userState: () => ({ name: 'Test User' })
    };

    mockFinesMacStore.deleteFromCheckAccount.and.returnValue(false);
    mockFinesMacStore.deleteAccountConfirmation.and.returnValue({
      formData: { fm_delete_account_confirmation_reason: 'Delete reason' }
    } as any);
    mockFinesMacStore.getBusinessUnitId.and.returnValue(123);
    mockFinesDraftStore.getFinesDraftState.and.returnValue({
        version: 1,
        timeline_data: []
    } as any);
    mockFinesDraftStore.fragment.and.returnValue('fragment');
    mockDateService.getDateNow.and.returnValue(DateTime.fromISO('2024-01-01'));
    mockDateService.toFormat.and.returnValue('2024-01-01');

    await TestBed.configureTestingModule({
      imports: [FinesMacDeleteAccountConfirmationComponent, FinesMacDeleteAccountConfirmationFormComponent],
      providers: [
        { provide: FinesMacStore, useValue: mockFinesMacStore },
        { provide: FinesDraftStore, useValue: mockFinesDraftStore },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        { provide: GlobalStore, useValue: mockGlobalStore },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'draftAccountId' ? '42' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationComponent);
    component = fixture.componentInstance;
    // Patch router for processPatchResponse
    (component as any)['router'] = mockRouter;
    spyOn(console, 'error');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call setDeleteAccountConfirmation and patchDraftAccountPayload on form submit', () => {
    const form = {
      formData: { fm_delete_account_confirmation_reason: 'Test reason' }
    } as any;
    const patchResponse = of({ account_snapshot: { defendant_name: 'John Doe' } } as any);
    mockOpalFinesService.patchDraftAccountPayload.and.returnValue(patchResponse);

    spyOn<any>(component, 'processPatchResponse').and.callThrough();

    component.handleDeleteAccountConfirmationSubmit(form);

    expect(mockFinesMacStore.setDeleteAccountConfirmation).toHaveBeenCalledWith(form);
    expect(mockOpalFinesService.patchDraftAccountPayload).toHaveBeenCalledWith(
      '42',
      jasmine.objectContaining({
        account_status: 'Deleted',
        timeline_data: jasmine.any(Array)
      })
    );
  });

  it('should handle patch response and navigate', () => {
    const response = { account_snapshot: { defendant_name: 'Jane Doe' } } as any;
    component['processPatchResponse'](response);

    expect(mockFinesDraftStore.setBannerMessage).toHaveBeenCalledWith("You have deleted Jane Doe's account");
    expect(mockFinesMacStore.resetStateChangesUnsavedChanges).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [jasmine.any(String)],
      { fragment: 'fragment' }
    );
  });

  it('should handle request error by scrolling to top', () => {
    const result = (component as any)['handleRequestError']();
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should set unsaved changes state', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesMacStore.setUnsavedChanges).toHaveBeenCalledWith(true);
    expect((component as any).stateUnsavedChanges).toBeTrue();
  });

  it('should call setDeleteFromCheckAccount(false) on destroy', () => {
    component.ngOnDestroy();
    expect(mockFinesMacStore.setDeleteFromCheckAccount).toHaveBeenCalledWith(false);
  });

  it('should log an error when accountId is null during handlePatchRequest', () => {
    component['accountId'] = null;
    component['handlePatchRequest']({
      validated_by: null,
      account_status: 'Deleted',
      validated_by_name: null,
      business_unit_id: 123,
      version: 1,
      timeline_data: [{ username: 'Test User', status: 'Deleted', status_date: '2024-01-01', reason_text: 'Delete reason' }]
    } as any);
    expect(console.error).toHaveBeenCalledWith('Account ID is not defined');
  });

  it('should handle error from patchDraftAccountPayload observable and call handleRequestError', () => {
    const form = {
        formData: { fm_delete_account_confirmation_reason: 'Test reason' }
    } as any;
    // Simulate error from patchDraftAccountPayload using throwError
    mockOpalFinesService.patchDraftAccountPayload.and.returnValue(
        // Use throwError from rxjs to simulate an error
        // Import throwError at the top if not already imported
        // import { throwError } from 'rxjs';
        throwError(() => new Error('Simulated error'))
    );

    spyOn<any>(component, 'handleRequestError').and.callThrough();

    component.handleDeleteAccountConfirmationSubmit(form);

    expect((component as any).handleRequestError).toHaveBeenCalled();
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  });

  it('should set referer to reviewAccountRoute when deleteFromCheckAccount is true', () => {
    // Recreate the component with deleteFromCheckAccount returning true
    mockFinesMacStore.deleteFromCheckAccount.and.returnValue(true);

    // Need to destroy and recreate the component to re-run constructor logic
    fixture.destroy();
    fixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationComponent);
    component = fixture.componentInstance;
    (component as any)['router'] = mockRouter;
    fixture.detectChanges();

    // The referer should now be set to reviewAccountRoute
    expect(component.referer).toBe((component as any).reviewAccountRoute);
  });

  it('should set referer to accountDetailsRoute when deleteFromCheckAccount is false', () => {
    // Already set in beforeEach, but test explicitly
    expect(component.referer).toBe((component as any).accountDetailsRoute);
  });
});