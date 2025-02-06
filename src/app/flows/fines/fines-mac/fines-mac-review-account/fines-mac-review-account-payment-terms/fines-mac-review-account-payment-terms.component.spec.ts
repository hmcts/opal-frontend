import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountPaymentTermsComponent } from './fines-mac-review-account-payment-terms.component';
import { DateService } from '@services/date-service/date.service';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { FINES_MAC_PAYMENT_TERMS_STATE_MOCK } from '../../fines-mac-payment-terms/mocks/fines-mac-payment-terms-state.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IFinesMacPaymentTermsOptions } from '../../fines-mac-payment-terms/interfaces/fines-may-payment-terms-options.interface';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { GlobalStoreType } from '@stores/global/types/global-store.type';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';

describe('FinesMacReviewAccountPaymentTermsComponent', () => {
  let component: FinesMacReviewAccountPaymentTermsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountPaymentTermsComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let globalStore: GlobalStoreType;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj(DateService, ['getFromFormatToFormat']);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountPaymentTermsComponent],
      providers: [{ provide: DateService, useValue: mockDateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountPaymentTermsComponent);
    component = fixture.componentInstance;

    component.paymentTermsState = structuredClone(FINES_MAC_PAYMENT_TERMS_STATE_MOCK);
    component.businessUnit = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    component.defendantType = 'adultOrYouthOnly';

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(SESSION_USER_STATE_MOCK);

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(SESSION_USER_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get payment terms correctly', () => {
    const paymentTerms = component.paymentTermsState.fm_payment_terms_payment_terms!;

    component['getPaymentTerms']();

    expect(component.paymentTerms).toBeDefined();
    expect(component.paymentTerms).toBe(
      component['paymentTermsOptions'][paymentTerms as keyof IFinesMacPaymentTermsOptions],
    );
  });

  it('should format pay by date correctly', () => {
    const formattedDate = '01 January 2023';
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_pay_by_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.and.returnValue(formattedDate);

    component['getPayByDate']();

    expect(component.payByDate).toBe(formattedDate);
  });

  it('should format days in default date correctly', () => {
    const formattedDate = '01 January 2023';
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_suspended_committal_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.and.returnValue(formattedDate);

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
    mockDateService.getFromFormatToFormat.and.returnValue(formattedDate);

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
    mockDateService.getFromFormatToFormat.and.returnValue(formattedDate);

    component['getStartDate']();

    expect(component.startDate).toBe(formattedDate);
  });

  it('should format collection order date correctly', () => {
    const formattedDate = '01 January 2023';
    component.paymentTermsState = {
      ...component.paymentTermsState,
      fm_payment_terms_collection_order_date: '01/01/2023',
    };
    mockDateService.getFromFormatToFormat.and.returnValue(formattedDate);

    component['getCollectionOrderDate']();

    expect(component.collectionOrderDate).toBe(formattedDate);
  });

  it('should emit change payment terms event', () => {
    spyOn(component.emitChangePaymentTerms, 'emit');
    component.changePaymentTerms();
    expect(component.emitChangePaymentTerms.emit).toHaveBeenCalled();
  });

  it('should call getPaymentTermsData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getPaymentTermsData');

    component.ngOnInit();

    expect(component['getPaymentTermsData']).toHaveBeenCalled();
  });

  it('should setup permissions', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'hasPermissionAccess');
    globalStore.setUserState({} as ISessionUserState);

    component['setupPermissions']();

    expect(component['hasPermissionAccess']).not.toHaveBeenCalled();
    expect(component['userStateRoles']).toEqual([]);
  });
});
