import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { FinesFpuPayloadService } from './fines-fpu-payload.service';
import {
  FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK,
  FINES_FPU_PAYLOAD_USER_STATE_MOCK,
} from './mocks/fines-fpu-payload.mock';

describe('FinesFpuPayloadService', () => {
  let service: FinesFpuPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinesFpuPayloadService);
  });

  it('builds the entitled submitted VPFPO draft account query', () => {
    expect(service.buildDraftAccountParams(FINES_FPU_PAYLOAD_USER_STATE_MOCK)).toEqual({
      source: 'VPFPO',
      businessUnitIds: [78, 12, 90],
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted],
    });
  });

  it('returns only business unit summary fields for the To publish table', () => {
    const response = { count: 1, summaries: [FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK] };

    expect(service.mapDraftAccountsToBusinessUnits(response, FINES_FPU_PAYLOAD_USER_STATE_MOCK)).toEqual([
      { business_unit_id: 78, business_unit_name: 'Zedford', ticket_count: 1 },
    ]);
  });
});
