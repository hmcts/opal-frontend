import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { FinesDraftService } from './fines-draft.service';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesDraftService', () => {
  let service: FinesDraftService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
    service = TestBed.inject(FinesDraftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle defendant click', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(service, 'navigateToReviewAccount');

    service.onDefendantClick(1, 'test');

    expect(service['navigateToReviewAccount']).toHaveBeenCalledWith(1, 'test');
  });

  it('should populate table data correctly', () => {
    const response = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
    const tableData = service['populateTableData'](response);
    expect(tableData.length).toEqual(response.summaries.length);
    expect(tableData[0]['Defendant id']).toEqual(response.summaries[0].draft_account_id);
  });

  it('should navigate to review account', () => {
    const draftAccountId = 1;
    const path = 'test';
    service['navigateToReviewAccount'](draftAccountId, path);
    expect(mockRouter.navigate).toHaveBeenCalledWith([path, draftAccountId]);
  });
});
