import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSaPayloadService } from './fines-sa-payload.service';
import { TestBed } from '@angular/core/testing';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/mocks/fines-sa-search-account-form-individuals-state.mock';
import { FINES_SA_BUILD_TRANSFORM_ITEMS_CONFIG } from './constants/fines-sa-transform-items-config.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-central-funds-response.mock';

describe('FinesSaPayloadService', () => {
  let service: FinesSaPayloadService;
  let dateService: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinesSaPayloadService],
    });
    service = TestBed.inject(FinesSaPayloadService);
    dateService = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform payload using the transformation service', () => {
    const dateOfBirth =
      FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK.fsa_search_account_individuals_date_of_birth;

    if (dateOfBirth === null) {
      throw new Error('Expected date of birth in individuals state mock');
    }

    const transformedDateOfBirth = dateService.getFromFormatToFormat(dateOfBirth, 'dd/MM/yyyy', 'yyyy-MM-dd');
    const result = service.transformPayload(
      FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
      FINES_SA_BUILD_TRANSFORM_ITEMS_CONFIG,
    );
    expect(result.fsa_search_account_individuals_date_of_birth).toBe(transformedDateOfBirth);
  });

  it('should map central fund response to a major creditor item', () => {
    const businessUnitId = 77;

    const result = service.mapCentralFundToMajorCreditor(OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK, businessUnitId);

    expect(result).toEqual({
      account_number: OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK.major_creditor.account_number,
      business_unit_id: businessUnitId,
      creditor_account_id: OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK.major_creditor.creditor_account_id,
      creditor_account_type: 'CF',
      from_suspense: null,
      hold_payout: null,
      last_changed_date: null,
      major_creditor_code: null,
      major_creditor_id: OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK.major_creditor.creditor_account_id,
      major_creditor_party_id: null,
      name: OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK.major_creditor.name,
      postcode: null,
      prosecution_service: false,
    });
  });

  it('should use a default central fund name when the response has no major creditor name', () => {
    const response = structuredClone(OPAL_FINES_CENTRAL_FUND_RESPONSE_MOCK);
    response.major_creditor.name = null;

    const result = service.mapCentralFundToMajorCreditor(response, 77);

    expect(result.name).toBe('Central Fund');
  });
});
