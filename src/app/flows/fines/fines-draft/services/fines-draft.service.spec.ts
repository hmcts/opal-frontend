import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { FinesDraftService } from './fines-draft.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { FINES_DRAFT_MAX_REJECTED } from '../constants/fines-draft-max-rejected.constant';

describe('FinesDraftService', () => {
  let service: FinesDraftService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getDraftAccounts']);
    mockOpalFinesService.getDraftAccounts.and.returnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { snapshot: { url: ['create-and-manage'] } },
          },
        },
        { provide: OpalFines, useValue: mockOpalFinesService },
      ],
    });
    service = TestBed.inject(FinesDraftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle defendant click', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(service, 'navigateToReviewAccount');

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

  it('should handle tab switch', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(service as any, 'handleTabSwitch').and.callThrough();

    service.handleTabSwitch('review');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((service as any).handleTabSwitch).toHaveBeenCalledWith('review');
  });

  it('should format count correctly when below max', () => {
    const result = service['formatCount'](2);

    expect(result).toBe('2');
  });

  it('should format count correctly when above max', () => {
    const result = service['formatCount'](9999);

    expect(result).toBe(`${FINES_DRAFT_MAX_REJECTED}+`);
  });

  it('should create tab data stream and emit initial data for initial tab', (done) => {
    const initialData = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
    const initialTab = 'review';
    const fragment$ = of('review');
    const getParams = jasmine.createSpy('getParams');

    service.createTabDataStream(initialData, initialTab, fragment$, getParams).subscribe((data) => {
      expect(data.length).toBe(initialData.summaries.length);
      done();
    });
  });

  it('should create tab data stream and fetch data for non-initial tab', (done) => {
    const initialData = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
    const initialTab = 'review';
    const fragment$ = of('rejected');
    const getParams = jasmine.createSpy('getParams').and.returnValue({ statuses: ['review'] });

    service.createTabDataStream(initialData, initialTab, fragment$, getParams).subscribe((data) => {
      expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({ statuses: ['review'] });
      expect(data.length).toBe(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries.length);
      done();
    });
  });

  it('should create rejected count stream and emit formatted count for initial tab', (done) => {
    const initialTab = 'review';
    const resolverRejectedCount = 5;
    const fragment$ = of('review');
    const getParams = jasmine.createSpy('getParams');

    service.createRejectedCountStream(initialTab, resolverRejectedCount, fragment$, getParams).subscribe((count) => {
      expect(count).toBe(service['formatCount'](resolverRejectedCount));
      done();
    });
  });

  it('should create rejected count stream and fetch count for non-initial tab', (done) => {
    const initialTab = 'review';
    const resolverRejectedCount = 5;
    const fragment$ = of('rejected');
    const getParams = jasmine.createSpy('getParams').and.returnValue({ statuses: ['review'] });
    mockOpalFinesService.getDraftAccounts.and.returnValue(of({ ...OPAL_FINES_DRAFT_ACCOUNTS_MOCK, count: 42 }));

    service.createRejectedCountStream(initialTab, resolverRejectedCount, fragment$, getParams).subscribe((count) => {
      expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({ statuses: ['review'] });
      expect(count).toBe(service['formatCount'](42));
      done();
    });
  });
});
