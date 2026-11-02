import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Settings } from 'luxon';
import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FinesAccPayloadService } from './fines-acc-payload.service';

const reference: IOpalFinesApr = {
  alternate_payment_reference_id: 11,
  defendant_account_id: 141,
  relationship: 'APR',
  category: 'APR',
  business_unit_id: 77,
  apr_text: ' MiXeD-123 ',
  created_at: '2026-06-01T12:00:00Z',
  updated_at: null,
};

describe('FinesAccPayloadService APR payloads', () => {
  const originalZone = Settings.defaultZone;
  let service: FinesAccPayloadService;

  beforeEach(() => {
    Settings.defaultZone = 'UTC';
    TestBed.configureTestingModule({ providers: [FinesAccPayloadService] });
    service = TestBed.inject(FinesAccPayloadService);
  });

  afterEach(() => {
    Settings.defaultZone = originalZone;
  });

  it('transforms the API list into eligible current and inherited APR sections with display dates', () => {
    const result = service.transformAprsPayload({
      references: [
        reference,
        { ...reference, alternate_payment_reference_id: 12, relationship: 'CONSOLIDATED' },
        { ...reference, alternate_payment_reference_id: 13, category: 'ACC', relationship: 'AMALGAMATED' },
      ],
      version: '"7"',
    });

    expect(result.version).toBe('"7"');
    expect(result.currentReferences).toHaveLength(1);
    expect(result.currentReferences[0]).toMatchObject({
      apr_text: ' MiXeD-123 ',
      canChange: true,
      canRemove: true,
      createdDate: '01 June 2026',
      updatedDate: '—',
    });
    expect(result.consolidatedReferences).toHaveLength(1);
    expect(result.consolidatedReferences[0]).toMatchObject({
      alternate_payment_reference_id: 12,
      canChange: false,
      canRemove: true,
    });
    expect(result.canAdd).toBe(false);
  });
});
