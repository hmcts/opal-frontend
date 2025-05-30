import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IFinesMacReviewAccountDecisionForm } from './interfaces/fines-mac-review-account-decision-form.interface';
import { FINES_MAC_REVIEW_ACCOUNT_DECISION_FORM_MOCK } from './mocks/fines-mac-review-account-decision-form.mock';
import { FinesMacReviewAccountDecisionComponent } from './fines-mac-review-account-decision.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FinesDraftStoreType } from '../../../fines-draft/stores/types/fines-draft.type';
import { FinesDraftStore } from '../../../fines-draft/stores/fines-draft.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from '../../services/fines-mac-payload/fines-mac-payload.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { OPAL_FINES_DRAFT_ACCOUNTS_PATCH_PAYLOAD } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts-patch-payload.mock';
import { FinesMacStore } from '../../stores/fines-mac.store';

describe('FinesMacReviewAccountDecisionComponent', () => {
  let component: FinesMacReviewAccountDecisionComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountDecisionComponent>;
  let formSubmit: IFinesMacReviewAccountDecisionForm;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let finesMacStore: FinesMacStoreType;
  let finesDraftStore: FinesDraftStoreType;

  beforeEach(async () => {
    formSubmit = structuredClone(FINES_MAC_REVIEW_ACCOUNT_DECISION_FORM_MOCK);

    mockOpalFinesService = {
      patchDraftAccountPayload: jasmine
        .createSpy('patchDraftAccountPayload')
        .and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK))),
    };

    mockUtilsService = jasmine.createSpyObj(UtilsService, ['scrollToTop']);

    mockFinesMacPayloadService = jasmine.createSpyObj(FinesMacPayloadService, ['buildPatchAccountPayload']);
    mockFinesMacPayloadService.buildPatchAccountPayload.and.returnValue(
      structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_PATCH_PAYLOAD),
    );

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountDecisionComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        { provide: UtilsService, useValue: mockUtilsService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('draft'),
            fragment: 'to-review',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountDecisionComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);

    finesDraftStore = TestBed.inject(FinesDraftStore);
    finesDraftStore.setChecker(true);
    finesDraftStore.setFragment('to-review');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to check and validate tabs', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleFormSubmit(formSubmit);

    expect(routerSpy).toHaveBeenCalledWith([component['checkAndValidateTabs']], {
      fragment: component['finesDraftStore'].fragment(),
    });
  });

  it('should set banner message to approved and reset unsaved changes when decision is approve', () => {
    const response = {
      account: { defendant: { company_name: 'Testing Co Ltd' } },
      account_status: 'Publishing Pending',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const routerSpy = spyOn(component['router'], 'navigate');

    component['successfulSubmission'](response);

    expect(finesDraftStore.bannerMessage()).toEqual(`You have approved Testing Co Ltd's account`);
    expect(finesMacStore.stateChanges()).toBeFalsy();
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(routerSpy).toHaveBeenCalledWith([component['checkAndValidateTabs']], {
      fragment: component['finesDraftStore'].fragment(),
    });
  });

  it('should set banner message to rejected and reset unsaved changes when decision is reject', () => {
    const response = {
      account: { defendant: { forenames: 'Jane', surname: 'Doe' } },
      account_status: 'Rejected',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const routerSpy = spyOn(component['router'], 'navigate');

    component['successfulSubmission'](response);

    expect(finesDraftStore.bannerMessage()).toEqual(`You have rejected Jane Doe's account`);
    expect(finesMacStore.stateChanges()).toBeFalsy();
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(routerSpy).toHaveBeenCalledWith([component['checkAndValidateTabs']], {
      fragment: component['finesDraftStore'].fragment(),
    });
  });

  it('should call scrollToTop on error in submitDecision', () => {
    // Patch the service to throw error
    (mockOpalFinesService.patchDraftAccountPayload as jasmine.Spy).and.returnValue(
      throwError(() => new Error('Something went wrong')),
    );
    mockUtilsService.scrollToTop.calls.reset();

    component['submitDecision'](formSubmit);

    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  });

  it('should call successfulSubmission on submitDecision with reject', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const successfulSubmissionSpy = spyOn<any>(component, 'successfulSubmission');

    component['submitDecision'](formSubmit);

    expect(mockUtilsService.scrollToTop).not.toHaveBeenCalled();
    expect(successfulSubmissionSpy).toHaveBeenCalled();
  });

  it('should call successfulSubmission on submitDecision with approve', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const successfulSubmissionSpy = spyOn<any>(component, 'successfulSubmission');

    const data = structuredClone(formSubmit);
    data.formData.fm_review_account_decision = 'approve';
    data.formData.fm_review_account_decision_reason = null;

    component['submitDecision'](data);

    expect(mockUtilsService.scrollToTop).not.toHaveBeenCalled();
    expect(successfulSubmissionSpy).toHaveBeenCalled();
  });

  it('should clean up subscriptions and reset error on ngOnDestroy', () => {
    const globalStore = component['globalStore'];
    const setErrorSpy = spyOn(globalStore, 'setError');

    component.ngOnDestroy();

    expect(setErrorSpy).toHaveBeenCalledWith({ error: false, message: '' });
  });
});
