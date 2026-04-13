import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSaPayloadService } from './fines-sa-payload.service';
import { TestBed } from '@angular/core/testing';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/mocks/fines-sa-search-account-form-individuals-state.mock';
import { FINES_SA_BUILD_TRANSFORM_ITEMS_CONFIG } from './constants/fines-sa-transform-items-config.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

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
});
