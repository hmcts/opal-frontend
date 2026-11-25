import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountPaymentTermsComponent } from './fines-mac-review-account-payment-terms.component';
import { FINES_MAC_PAYMENT_TERMS_STATE_MOCK } from '../../fines-mac-payment-terms/mocks/fines-mac-payment-terms-state.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IFinesPaymentTermsOptions } from '../../../interfaces/fines-payment-terms-options.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('FinesMacReviewAccountPaymentTermsComponent', () => {
  let component: FinesMacReviewAccountPaymentTermsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountPaymentTermsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;
  let hasBusinessUnitPermissionAccess: ReturnType<typeof vi.fn>;
  let globalStore: GlobalStoreType;

  beforeEach(async () => {
    mockDateService = createSpyObj(DateService, ['getFromFormatToFormat']);
    hasBusinessUnitPermissionAccess = vi.fn().mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountPaymentTermsComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: PermissionsService, useValue: { hasBusinessUnitPermissionAccess } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountPaymentTermsComponent);
    component = fixture.componentInstance;

    component.paymentTermsState = structuredClone(FINES_MAC_PAYMENT_TERMS_STATE_MOCK);
    component.businessUnit = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(OPAL_USER_STATE_MOCK);
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: true });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each(
    [true, false].flatMap((isReadOnly) =>
      [true, false].flatMap((hasPermission) =>
        [true, false].flatMap((made) =>
          [true, false, null].map((madeToday) => ({ isReadOnly, hasPermission, made, madeToday })),
        ),
      ),
    ),
  )('preserves the original summary with the flag disabled: %j', ({ isReadOnly, hasPermission, made, madeToday }) => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: false });
    hasBusinessUnitPermissionAccess.mockReturnValue(hasPermission);
    component.isReadOnly = isReadOnly;
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_collection_order_made: made,
      fm_payment_terms_collection_order_made_today: madeToday,
      fm_payment_terms_collection_order_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue('01 January 2023');

    fixture.detectChanges();

    const summary = fixture.nativeElement as HTMLElement;
    expect(summary.querySelector('[summaryListRowId="hasCollectionOrder"]')?.textContent).toContain(
      made ? 'Yes' : 'No',
    );
    const dateRow = summary.querySelector('[summaryListRowId="collectionOrderDate"]');
    if (made) {
      expect(dateRow?.textContent).toContain('01 January 2023');
    } else {
      expect(dateRow).toBeNull();
    }
    const madeTodayRow = summary.querySelector('[summaryListRowId="makeCollectionOrderToday"]');
    if (!made && hasPermission) {
      expect(madeTodayRow?.textContent).toContain(madeToday ? 'Yes' : 'No');
    } else {
      expect(madeTodayRow).toBeNull();
    }
  });

  it('shows the overall order status, date and made-today answer in read-only review without collection-order permission', () => {
    component.isReadOnly = true;
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_collection_order_made: false,
      fm_payment_terms_collection_order_made_today: true,
      fm_payment_terms_collection_order_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue('01 January 2023');

    fixture.detectChanges();

    const summary = fixture.nativeElement as HTMLElement;
    expect(summary.querySelector('[summaryListRowId="hasCollectionOrder"]')?.textContent).toContain('Yes');
    expect(summary.querySelector('[summaryListRowId="collectionOrderDate"]')?.textContent).toContain('01 January 2023');
    expect(summary.querySelector('[summaryListRowId="makeCollectionOrderToday"]')?.textContent).toContain('Yes');
    expect(hasBusinessUnitPermissionAccess).toHaveBeenCalled();
  });

  it('shows saved collection-order details in read-only review when the viewer has collection-order permission', () => {
    hasBusinessUnitPermissionAccess.mockReturnValue(true);
    component.isReadOnly = true;
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_collection_order_made: false,
      fm_payment_terms_collection_order_made_today: true,
      fm_payment_terms_collection_order_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue('01 January 2023');

    fixture.detectChanges();

    const summary = fixture.nativeElement as HTMLElement;
    expect(summary.querySelector('[summaryListRowId="hasCollectionOrder"]')?.textContent).toContain('Yes');
    expect(summary.querySelector('[summaryListRowId="collectionOrderDate"]')?.textContent).toContain('01 January 2023');
    expect(summary.querySelector('[summaryListRowId="makeCollectionOrderToday"]')?.textContent).toContain('Yes');
  });

  it.each([false, null])('shows a historical order without a made-today row when the saved flag is %s', (madeToday) => {
    component.isReadOnly = true;
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_collection_order_made: true,
      fm_payment_terms_collection_order_made_today: madeToday,
      fm_payment_terms_collection_order_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue('01 January 2023');

    fixture.detectChanges();

    const summary = fixture.nativeElement as HTMLElement;
    expect(summary.querySelector('[summaryListRowId="hasCollectionOrder"]')?.textContent).toContain('Yes');
    expect(summary.querySelector('[summaryListRowId="collectionOrderDate"]')?.textContent).toContain('01 January 2023');
    expect(summary.querySelector('[summaryListRowId="makeCollectionOrderToday"]')).toBeNull();
  });

  it('shows No without a collection-order date when no order was made', () => {
    component.isReadOnly = true;
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_collection_order_made: false,
      fm_payment_terms_collection_order_made_today: false,
      fm_payment_terms_collection_order_date: '01/01/2023',
    };

    fixture.detectChanges();

    const summary = fixture.nativeElement as HTMLElement;
    expect(summary.querySelector('[summaryListRowId="hasCollectionOrder"]')?.textContent).toContain('No');
    expect(summary.querySelector('[summaryListRowId="collectionOrderDate"]')).toBeNull();
    expect(summary.querySelector('[summaryListRowId="makeCollectionOrderToday"]')).toBeNull();
  });

  it('keeps the No and made-today answers in the editable summary', () => {
    hasBusinessUnitPermissionAccess.mockReturnValue(true);
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_collection_order_made: false,
      fm_payment_terms_collection_order_made_today: true,
      fm_payment_terms_collection_order_date: '01/01/2023',
    };

    fixture.detectChanges();

    const summary = fixture.nativeElement as HTMLElement;
    expect(summary.querySelector('[summaryListRowId="hasCollectionOrder"]')?.textContent).toContain('No');
    expect(summary.querySelector('[summaryListRowId="collectionOrderDate"]')).toBeNull();
    expect(summary.querySelector('[summaryListRowId="makeCollectionOrderToday"]')?.textContent).toContain('Yes');
  });

  it('should get payment terms correctly', () => {
    const paymentTerms = component.paymentTermsState.fm_payment_terms_payment_terms!;

    component['getPaymentTerms']();

    expect(component.paymentTerms).toBeDefined();
    expect(component.paymentTerms).toBe(
      component['paymentTermsOptions'][paymentTerms as keyof IFinesPaymentTermsOptions],
    );
  });

  it('should format pay by date correctly', () => {
    const formattedDate = '01 January 2023';
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_pay_by_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue(formattedDate);

    component['getPayByDate']();

    expect(component.payByDate).toBe(formattedDate);
  });

  it('should format days in default date correctly', () => {
    const formattedDate = '01 January 2023';
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_suspended_committal_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue(formattedDate);

    component['getDaysInDefaultDate']();

    expect(component.daysInDefaultDate).toBe(formattedDate);
  });

  it('should get enforcement action correctly', () => {
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_enforcement_action: 'PRIS',
    };

    component['getEnforcementAction']();

    expect(component.enforcementAction).toBeDefined();
    expect(component.enforcementAction).toBe(component['enforcementActions']['PRIS']);
  });

  it('should format earliest release date correctly', () => {
    const formattedDate = '01 January 2023';
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_earliest_release_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue(formattedDate);

    component['getEarliestReleaseDate']();

    expect(component.earliestReleaseDate).toBe(formattedDate);
  });

  it('should get frequency correctly', () => {
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_instalment_period: 'W',
    };

    component['getFrequency']();

    expect(component.frequency).toBeDefined();
    expect(component.frequency).toBe(component['frequencyOptions']['W']);
  });

  it('should format start date correctly', () => {
    const formattedDate = '01 January 2023';
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_start_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue(formattedDate);

    component['getStartDate']();

    expect(component.startDate).toBe(formattedDate);
  });

  it('should format collection order date correctly', () => {
    const formattedDate = '01 January 2023';
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_collection_order_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.mockReturnValue(formattedDate);

    component['getCollectionOrderDate']();

    expect(component.collectionOrderDate).toBe(formattedDate);
  });

  it('should emit change payment terms event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.emitChangePaymentTerms, 'emit');
    component.changePaymentTerms();
    expect(component.emitChangePaymentTerms.emit).toHaveBeenCalled();
  });

  it('should call getPaymentTermsData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getPaymentTermsData');

    component.ngOnInit();

    expect(component['getPaymentTermsData']).toHaveBeenCalled();
  });

  it('should setup permissions', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'hasBusinessUnitPermissionAccess');
    globalStore.setUserState({} as IOpalUserState);

    component['setupPermissions']();

    expect(component['hasBusinessUnitPermissionAccess']).not.toHaveBeenCalled();
    expect(component['userState']).toEqual({} as IOpalUserState);
  });
});
