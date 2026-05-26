import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { FinesAccMinorCreditorAddAmendConvertComponent } from './fines-acc-minor-creditor-add-amend-convert.component';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';
import { OPAL_FINES_MINOR_CREDITOR_UPDATE_PAYLOAD_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-minor-creditor-update-payload.mock';
import { IFinesAccMinorCreditorAddAmendConvertState } from './interfaces/fines-acc-minor-creditor-add-amend-convert-state.interface';
import { IFinesAccMinorCreditorAddAmendConvertForm } from './interfaces/fines-acc-minor-creditor-add-amend-convert-form.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccMinorCreditorAddAmendConvertComponent', () => {
  let component: FinesAccMinorCreditorAddAmendConvertComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorAddAmendConvertComponent>;
  let routeMock: {
    parent: object;
    snapshot: {
      data: {
        minorCreditorAccountCreditor: typeof OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK;
      };
    };
  };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let payloadServiceMock: {
    mapMinorCreditorAccountPayload: ReturnType<typeof vi.fn>;
    buildMinorCreditorAccountAmendPayload: ReturnType<typeof vi.fn>;
  };
  let opalFinesServiceMock: {
    updateMinorCreditorAccount: ReturnType<typeof vi.fn>;
    clearCache: ReturnType<typeof vi.fn>;
  };
  let finesAccountStoreMock: {
    account_id: ReturnType<typeof vi.fn>;
    base_version: ReturnType<typeof vi.fn>;
    business_unit_id: ReturnType<typeof vi.fn>;
  };
  let utilsServiceMock: { scrollToTop: ReturnType<typeof vi.fn> };
  let formState: IFinesAccMinorCreditorAddAmendConvertState;
  let formData: IFinesAccMinorCreditorAddAmendConvertForm;

  beforeEach(async () => {
    formState = {
      facc_minor_creditor_creditor_type: 'company',
      facc_minor_creditor_title: null,
      facc_minor_creditor_forenames: null,
      facc_minor_creditor_surname: null,
      facc_minor_creditor_company_name: 'Test Organisation',
      facc_minor_creditor_address_line_1: '123 Main Street',
      facc_minor_creditor_address_line_2: 'Apt 4',
      facc_minor_creditor_address_line_3: null,
      facc_minor_creditor_post_code: 'AB12 3CD',
      facc_minor_creditor_pay_by_bacs: true,
      facc_minor_creditor_bank_account_name: 'Test Account',
      facc_minor_creditor_bank_sort_code: '123456',
      facc_minor_creditor_bank_account_number: '12345678',
      facc_minor_creditor_bank_account_reference: 'REF-001',
    };
    formData = {
      formData: formState,
      nestedFlow: false,
    };
    routeMock = {
      parent: {},
      snapshot: {
        data: {
          minorCreditorAccountCreditor: structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK),
        },
      },
    };
    routerMock = {
      navigate: vi.fn(),
    };
    payloadServiceMock = {
      mapMinorCreditorAccountPayload: vi.fn().mockReturnValue(formState),
      buildMinorCreditorAccountAmendPayload: vi
        .fn()
        .mockReturnValue(structuredClone(OPAL_FINES_MINOR_CREDITOR_UPDATE_PAYLOAD_MOCK)),
    };
    opalFinesServiceMock = {
      updateMinorCreditorAccount: vi.fn().mockReturnValue(of(OPAL_FINES_MINOR_CREDITOR_UPDATE_PAYLOAD_MOCK)),
      clearCache: vi.fn(),
    };
    finesAccountStoreMock = {
      account_id: vi.fn().mockReturnValue(99000000000800),
      base_version: vi.fn().mockReturnValue('v1'),
      business_unit_id: vi.fn().mockReturnValue('77'),
    };
    utilsServiceMock = {
      scrollToTop: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorAddAmendConvertComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: Router, useValue: routerMock },
        { provide: FinesAccPayloadService, useValue: payloadServiceMock },
        { provide: OpalFines, useValue: opalFinesServiceMock },
        { provide: FinesAccountStore, useValue: finesAccountStoreMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMinorCreditorAddAmendConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map resolved creditor data into prefilled form data', () => {
    expect(payloadServiceMock.mapMinorCreditorAccountPayload).toHaveBeenCalledWith(
      routeMock.snapshot.data.minorCreditorAccountCreditor,
    );
    expect(component['prefilledFormData']).toEqual({
      formData: formState,
      nestedFlow: false,
    });
  });

  it('should render the child form shell', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Change creditor details');
    expect(element.querySelector('app-fines-acc-minor-creditor-add-amend-convert-form')).toBeTruthy();
  });

  it('should submit minor creditor changes and navigate back to the creditor tab', () => {
    component.handleFormSubmit(formData);

    expect(payloadServiceMock.buildMinorCreditorAccountAmendPayload).toHaveBeenCalledWith(
      routeMock.snapshot.data.minorCreditorAccountCreditor,
      formState,
    );
    expect(opalFinesServiceMock.updateMinorCreditorAccount).toHaveBeenCalledWith(
      99000000000800,
      OPAL_FINES_MINOR_CREDITOR_UPDATE_PAYLOAD_MOCK,
      'v1',
      '77',
    );
    expect(opalFinesServiceMock.clearCache).toHaveBeenCalledWith('minorCreditorAccountCreditorCache$');
    expect(opalFinesServiceMock.clearCache).toHaveBeenCalledWith('minorCreditorAccountAtAGlanceCache$');
    expect(routerMock.navigate).toHaveBeenCalledWith(['details'], {
      relativeTo: routeMock.parent,
      fragment: 'creditor',
    });
  });

  it('should remain on the page and keep unsaved state when submit fails', () => {
    opalFinesServiceMock.updateMinorCreditorAccount.mockReturnValue(throwError(() => new Error('request failed')));

    component.handleFormSubmit(formData);

    expect(utilsServiceMock.scrollToTop).toHaveBeenCalled();
    expect(component.stateUnsavedChanges).toBe(true);
    expect(opalFinesServiceMock.clearCache).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should update unsaved changes state from the child form', () => {
    component.handleUnsavedChanges(true);

    expect(component.stateUnsavedChanges).toBe(true);

    component.handleUnsavedChanges(false);

    expect(component.stateUnsavedChanges).toBe(false);
  });
});
