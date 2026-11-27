import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_FINES_PATHS } from '@services/fines/opal-fines-service/constants/opal-fines-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offence-data-non-snake-case.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { afterEach, expect, it, vi } from 'vitest';
import { FINES_ACCOUNT_TYPES } from '../constants/fines-account-types.constant';
import { FinesDraftStore } from '../fines-draft/stores/fines-draft.store';
import { FinesMacPaymentTermsComponent } from './fines-mac-payment-terms/fines-mac-payment-terms.component';
import { FinesMacReviewAccountComponent } from './fines-mac-review-account/fines-mac-review-account.component';
import { FinesMacPayloadService } from './services/fines-mac-payload/fines-mac-payload.service';
import { IFinesMacReplaceAccountRequestPayload } from './services/fines-mac-payload/interfaces/fines-mac-payload-replace-account-request.interface';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from './services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { FinesMacStore } from './stores/fines-mac.store';

afterEach(() => vi.restoreAllMocks());

it('should resubmit a rejected Fine with both custody details after changing a saved hold', async () => {
  vi.spyOn(MojDatePickerComponent.prototype, 'configureDatePicker').mockImplementation(() => {});
  vi.spyOn(
    GovukRadioComponent.prototype as unknown as { initOuterRadios(): void },
    'initOuterRadios',
  ).mockImplementation(() => {});

  const draft = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
  draft.draft_account_id = 42;
  draft.account_status = 'Rejected';
  draft.account_type = FINES_ACCOUNT_TYPES.Fine;
  draft.account.account_type = FINES_ACCOUNT_TYPES.Fine;
  const sendingCourt = OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK.refData[0];
  draft.account.originator_id = String(sendingCourt.local_justice_area_id);
  draft.account.originator_name = sendingCourt.name;
  draft.account.enforcement_court_id = String(OPAL_FINES_COURT_REF_DATA_MOCK.refData[0].court_id);
  const offence = OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK;
  draft.account.offences![0].offence_id = offence.offenceId;
  draft.account.collection_order_made = false;
  draft.account.collection_order_date = null;
  draft.account.suspended_committal_date = null;
  draft.account.payment_terms.default_days_in_jail = null;
  draft.account.payment_terms.enforcements = [
    { result_id: 'NOENF', enforcement_result_responses: [{ parameter_name: 'reason', response: 'Review pending' }] },
  ];

  await TestBed.configureTestingModule({
    imports: [FinesMacPaymentTermsComponent, FinesMacReviewAccountComponent],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: { get: () => String(draft.draft_account_id) },
            data: {
              courts: OPAL_FINES_COURT_REF_DATA_MOCK,
              localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
              majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
              results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
            },
          },
        },
      },
    ],
  }).compileComponents();

  TestBed.inject(GlobalStore).setUserState(OPAL_USER_STATE_MOCK);
  vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  const draftStore = TestBed.inject(FinesDraftStore);
  draftStore.setFinesDraftState(draft);
  draftStore.setAmend(true);
  const mappedState = TestBed.inject(FinesMacPayloadService).mapAccountPayload(
    draft,
    OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK,
    [offence],
  );
  TestBed.inject(FinesMacStore).setFinesMacStore(mappedState);

  const paymentTerms = TestBed.createComponent(FinesMacPaymentTermsComponent);
  paymentTerms.detectChanges();
  const paymentTermsPage: HTMLElement = paymentTerms.nativeElement;
  expect(paymentTermsPage.querySelector<HTMLInputElement>('input[value="NOENF"]')?.checked).toBe(true);
  paymentTermsPage.querySelector<HTMLInputElement>('input[value="PRIS"]')!.click();
  paymentTerms.detectChanges();

  const releaseDate = paymentTermsPage.querySelector<HTMLInputElement>('#fm_payment_terms_earliest_release_date')!;
  releaseDate.value = '12/10/2024';
  releaseDate.dispatchEvent(new Event('change', { bubbles: true }));
  const prison = paymentTermsPage.querySelector<HTMLTextAreaElement>('#fm_payment_terms_prison_and_prison_number')!;
  prison.value = 'HMP Example A1234BC';
  prison.dispatchEvent(new Event('input', { bubbles: true }));
  paymentTermsPage.querySelector<HTMLButtonElement>('#submitForm')!.click();
  paymentTerms.destroy();

  const review = TestBed.createComponent(FinesMacReviewAccountComponent);
  review.detectChanges();
  const http = TestBed.inject(HttpTestingController);
  http
    .expectOne({ method: 'GET', url: `${OPAL_FINES_PATHS.offencesRefData}?q=${offence.cjsCode}` })
    .flush(OPAL_FINES_OFFENCES_REF_DATA_MOCK);
  const reviewPage: HTMLElement = review.nativeElement;
  reviewPage.querySelector<HTMLButtonElement>('#submitAccountButton')!.click();

  const put = http.expectOne({
    method: 'PUT',
    url: `${OPAL_FINES_PATHS.draftAccounts}/${draft.draft_account_id}`,
  });
  const body: IFinesMacReplaceAccountRequestPayload = put.request.body;
  expect(put.request.headers.get('If-Match')).toBe(draft.version);
  expect(body.account_type).toBe(FINES_ACCOUNT_TYPES.Fine);
  expect(body.account_status).toBe('Resubmitted');
  expect(body.account.payment_terms.enforcements).toEqual([
    {
      result_id: 'PRIS',
      enforcement_result_responses: [
        { parameter_name: 'earliestreleasedate', response: '2024-10-12' },
        { parameter_name: 'prisonandprisonnumber', response: 'HMP Example A1234BC' },
      ],
    },
  ]);
  put.flush({ ...draft, ...body });
  http.verify();
});
